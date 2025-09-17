import { createApp } from 'vue'
import { createModernRouter, createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'

// eslint-disable-next-line no-console
console.log(window.navigation)

const router = createModernRouter({
  legacy: {
    factory(transitionMode) {
      return createRouter({
        enableScrollManagement: true,
        focusManagement: true,
        history: createWebHistory(),
        routes,
      }, transitionMode)
    },
  },
  navigationApi: {
    options: {
      location: '',
      routes,
    },
  },
  viewTransition: true,
})

router.enableViewTransition({
  onStart(transition) {
    // eslint-disable-next-line no-console
    console.log('View transition started', transition)
  },
  onFinished(transition) {
    // eslint-disable-next-line no-console
    console.log('View transition finished', transition)
  },
  onAborted(transition) {
    // eslint-disable-next-line no-console
    console.log('View transition aborted', transition)
  },
})

const app = createApp(App)
app.use(router)

router.afterEach((to, from) => {
  // eslint-disable-next-line no-console
  console.log(`AfterEach to ${to.fullPath} from ${from?.fullPath}`)
})

app.mount('#app')

/* router.beforeEach((to, from, _) => {
  // eslint-disable-next-line no-console
  console.log(`BeforeEach to ${to.fullPath} from ${from?.fullPath}`)
}) */
router.isReady().then(() => {
  // eslint-disable-next-line no-console
  console.log('router is ready')
})
