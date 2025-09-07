import type { HistoryState, RouterHistory } from 'vue-router'
import { shallowRef } from 'vue'

type NavigationDirection = 'back' | 'forward' | ''
type NavigationType = 'pop' | 'push' | 'replace'

interface NavigationInformation {
  type: NavigationType
  direction: NavigationDirection
  delta: number
}

// vue-router doesn't export NavigationCallback, so we define our own compatible type.
type HistoryListener = (to: string, from: string, information: NavigationInformation) => void

export function createNavigationApiHistory(base = ''): RouterHistory {
  // Check for browser compatibility.
  if (typeof window === 'undefined' || !window.navigation) {
    throw new Error('Navigation API is not supported in this environment.')
  }

  const location = shallowRef(window.location.pathname + window.location.search + window.location.hash)
  const state = shallowRef(window.navigation.currentEntry?.getState() || {})
  const listeners: HistoryListener[] = []

  const handleNavigate = (event: NavigateEvent): void => {
    // We don't intercept navigations that aren't suitable for SPA routing,
    // like hash changes, downloads, or un-interceptable events.
    if (!event.canIntercept || event.hashChange || event.downloadRequest) {
      return
    }

    let info: NavigationInformation

    if (event.navigationType === 'traverse') {
      const fromIndex = window.navigation.currentEntry?.index ?? -1
      const toIndex = event.destination.index
      const delta = fromIndex === -1 ? 0 : toIndex - fromIndex

      info = {
        type: 'pop', // 'traverse' maps to 'pop' in vue-router's terminology.
        direction: delta > 0 ? 'forward' : 'back',
        delta,
      }
    }
    else if (event.navigationType === 'push' || event.navigationType === 'replace') {
      info = {
        type: event.navigationType,
        direction: '', // No specific direction for push/replace.
        delta: event.navigationType === 'push' ? 1 : 0,
      }
    }
    else {
      // For 'reload' or other types, we ignore and don't notify listeners.
      return
    }

    const url = new URL(event.destination.url)
    const to = url.pathname + url.search + url.hash
    const from = location.value

    // We intercept the navigation so vue-router can handle the view update.
    event.intercept({
      handler: async () => {
        location.value = to
        state.value = event.destination.getState() as HistoryState

        // Notify vue-router listeners with the enriched navigation info.
        listeners.forEach(listener => listener(to, from, info))
      },
    })
  }

  window.navigation.addEventListener('navigate', handleNavigate)

  const BEFORE_HASH_RE = /^[^#]+#/
  function createHref(base: string, location: string): string {
    return base.replace(BEFORE_HASH_RE, '#') + location
  }

  const history: RouterHistory = {
    // Required properties for the RouterHistory interface.
    location: location as any, // Cast to 'any' to match the interface while passing the Ref.
    state: state as any, // Pass the reactive Ref, not its value.
    base,
    createHref: createHref.bind(null, base),

    // Navigation methods.
    push(to: string, data?: HistoryState) {
      window.navigation.navigate(to, { state: data, history: 'push' })
    },

    replace(to: string, data?: HistoryState) {
      window.navigation.navigate(to, { state: data, history: 'replace' })
    },

    go(delta: number) {
      // Case 1: go(0) should trigger a reload.
      if (delta === 0) {
        window.navigation.reload()
        return
      }

      // Get the current state safely, without using non-null assertions ('!').
      const entries = window.navigation.entries()
      const currentIndex = window.navigation.currentEntry?.index

      // If we don't have a current index, we can't proceed.
      if (currentIndex === undefined) {
        return
      }

      // Calculate the target index in the history stack.
      const targetIndex = currentIndex + delta

      // Validate that the target index is within the bounds of the entries array.
      // This is the key check that prevents runtime errors.
      if (targetIndex >= 0 && targetIndex < entries.length) {
        // Each history entry has a unique 'key'. We get the key for our target entry...
        // Safely get the target entry from the array.
        const targetEntry = entries[targetIndex]

        // Add a check to ensure the entry is not undefined before accessing its key.
        // This satisfies TypeScript's strict checks.
        if (targetEntry) {
          window.navigation.traverseTo(targetEntry.key)
        }
        else {
          // This case is unlikely if the index check passed, but it adds robustness.
          console.warn(`go(${delta}) failed: No entry found at index ${targetIndex}.`)
        }
      }
      else {
        console.warn(`go(${delta}) failed: target index ${targetIndex} is out of bounds.`)
      }
    },

    // @ts-expect-error The callback type is structurally correct but nominally different
    // because vue-router does not export its internal NavigationCallback type.
    listen(callback: HistoryListener): () => void {
      listeners.push(callback)
      return () => {
        const index = listeners.indexOf(callback)
        if (index > -1) {
          listeners.splice(index, 1)
        }
      }
    },

    destroy() {
      window.navigation.removeEventListener('navigate', handleNavigate)
      listeners.length = 0
    },
  }

  return history
}
