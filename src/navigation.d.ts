// Declarations for the experimental Navigation API
// Based on the W3C draft specification

interface NavigationEventMap {
  navigate: NavigateEvent
  navigatesuccess: Event
  navigateerror: ErrorEvent
  currententrychange: Event
}

interface Navigation extends EventTarget {
  entries: () => NavigationHistoryEntry[]
  readonly currentEntry: NavigationHistoryEntry | null
  updateCurrentEntry: (options: { state: unknown }) => void
  readonly transition: NavigationTransition | null

  readonly canGoBack: boolean
  readonly canGoForward: boolean

  navigate: (url: string, options?: NavigationNavigateOptions) => NavigationResult
  reload: (options?: NavigationReloadOptions) => NavigationResult

  traverseTo: (key: string, options?: NavigationOptions) => NavigationResult
  back: (options?: NavigationOptions) => NavigationResult
  forward: (options?: NavigationOptions) => NavigationResult

  addEventListener: (<K extends keyof NavigationEventMap>(type: K, listener: (this: Navigation, ev: NavigationEventMap[K]) => any, options?: boolean | AddEventListenerOptions) => void) & ((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void)
  removeEventListener: (<K extends keyof NavigationEventMap>(type: K, listener: (this: Navigation, ev: NavigationEventMap[K]) => any, options?: boolean | EventListenerOptions) => void) & ((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void)
}

interface NavigationResult {
  committed: Promise<NavigationHistoryEntry>
  finished: Promise<NavigationHistoryEntry>
}

interface NavigationOptions {
  info?: any
}

interface NavigationNavigateOptions extends NavigationOptions {
  state?: any
  history?: 'auto' | 'push' | 'replace'
}

interface NavigationReloadOptions extends NavigationOptions {
  state?: any
}

declare class NavigateEvent extends Event {
  constructor(type: string, eventInit: NavigateEventInit)

  readonly navigationType: 'reload' | 'push' | 'replace' | 'traverse'
  readonly destination: NavigationDestination
  readonly canIntercept: boolean
  readonly userInitiated: boolean
  readonly hashChange: boolean
  readonly signal: AbortSignal
  readonly formData: FormData | null
  readonly downloadRequest: string | null
  readonly info: any

  intercept(options?: NavigationInterceptOptions): void
  scroll(): void
}

interface NavigateEventInit extends EventInit {
  navigationType?: 'reload' | 'push' | 'replace' | 'traverse'
  destination: NavigationDestination
  canIntercept?: boolean
  userInitiated?: boolean
  hashChange?: boolean
  signal: AbortSignal
  formData?: FormData | null
  downloadRequest?: string | null
  info?: any
}

interface NavigationDestination {
  readonly url: string
  readonly key: string | null
  readonly id: string | null
  readonly index: number
  readonly sameDocument: boolean
  getState: () => unknown
}

interface NavigationHistoryEntry extends EventTarget {
  readonly url: string | null
  readonly key: string
  readonly id: string
  readonly index: number
  readonly sameDocument: boolean
  getState: () => unknown
}

interface NavigationTransition {
  readonly navigationType: 'reload' | 'push' | 'replace' | 'traverse'
  readonly from: NavigationHistoryEntry
  readonly finished: Promise<void>
}

interface NavigationInterceptOptions {
  handler: () => Promise<void>
  focusReset?: 'after-transition' | 'manual'
  scroll?: 'after-transition' | 'manual'
}
