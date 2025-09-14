import { createApp } from 'vue'
import { createNavigationApiRouter, createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'

// eslint-disable-next-line no-console
console.log(window.navigation)

const router = /* false && */window.navigation
  ? createNavigationApiRouter({
      location: '',
      routes,
    })
  : createRouter({
      history: createWebHistory(),
      routes,
    })

createApp(App).use(router).mount('#app')

router.isReady().then(() => {
  // eslint-disable-next-line no-console
  console.log('router is ready')
  /* router.beforeEach((to, from, _) => {
    // eslint-disable-next-line no-console
    console.log(`BeforeEach to ${to.fullPath} from ${from?.fullPath}`)
  })
  router.afterEach((to, from, _) => {
    // eslint-disable-next-line no-console
    console.log(`AfterEach to ${to.fullPath} from ${from?.fullPath}`)
  }) */
})
