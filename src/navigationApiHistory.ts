import { shallowRef } from 'vue';
import type { RouterHistory, HistoryState } from 'vue-router';

// El callback que vue-router espera para los listeners
type HistoryListener = (to: string, from: string, information: {
    to: string;
    from: string;
    state: HistoryState;
    prevState: HistoryState;
}) => void;

export function createNavigationApiHistory(base = ''): RouterHistory {
    // Comprobación de compatibilidad
    if (typeof window === 'undefined' || !window.navigation) {
        throw new Error('Navigation API is not supported in this environment.');
    }

    const location= shallowRef(window.location.pathname + window.location.search + window.location.hash);
    const state = shallowRef(window.navigation.currentEntry?.getState() || {});
    const listeners: HistoryListener[] = [];

    const handleNavigate = (event: NavigateEvent): void => {
        // No interceptamos cambios de hash, descargas o si la navegación no puede ser interceptada
        if (!event.canIntercept || event.hashChange || event.downloadRequest) {
            return;
        }

        const url = new URL(event.destination.url);
        const to = url.pathname + url.search + url.hash;
        const from = location.value;
        const fromState = state.value;

        // Interceptamos para que vue-router controle la actualización de la vista
        event.intercept({
            handler: async () => {
                location.value = to;
                state.value = event.destination.getState() as HistoryState; // Asumimos que el estado es compatible

                // Notificamos a vue-router del cambio
                listeners.forEach(listener => listener(to, from, {
                    to,
                    from,
                    state: state.value,
                    prevState: fromState
                }));
            },
        });
    };

    window.navigation.addEventListener('navigate', handleNavigate);

    const BEFORE_HASH_RE = /^[^#]+#/

    function createHref(base: string, location: string): string {
        return base.replace(BEFORE_HASH_RE, '#') + location
    }

    const history: RouterHistory = {
        // Propiedades requeridas por la interfaz
        location: '', // Hacemos un cast para que coincida con la interfaz
        state,
        base,

        createHref: createHref.bind(null, base),

        // Métodos de navegación
        push(to: string, data?: HistoryState) {
            window.navigation.navigate(to, { state: data });
        },

        replace(to: string, data?: HistoryState) {
            window.navigation.navigate(to, { state: data, history: 'replace' });
        },

        go(delta: number) {
            if (delta === -1) {
                window.navigation.back();
            } else if (delta === 1) {
                window.navigation.forward();
            } else {
                console.warn('`go(n)` con n != +/-1 no está implementado de forma simple. Se requiere `traverseTo(key)`.');
            }
        },

        // Manejo de listeners
        listen(callback: HistoryListener): () => void {
            listeners.push(callback);
            return () => {
                const index = listeners.indexOf(callback);
                if (index > -1) {
                    listeners.splice(index, 1);
                }
            };
        },

        destroy() {
            window.navigation.removeEventListener('navigate', handleNavigate);
            listeners.length = 0;
        },
    };

    return history;
}

