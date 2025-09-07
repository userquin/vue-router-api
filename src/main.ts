import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import { createNavigationApiHistory } from './navigationApiHistory.ts'

// eslint-disable-next-line no-console
console.log(window.navigation)

const history = window.navigation
  ? createNavigationApiHistory()
  : createWebHistory()

const router = createRouter({
  history,
  routes,
})

history.listen((to, from, info) => {
// eslint-disable-next-line no-console
  console.log(`History: ${from} => ${to} => ${info.type}`)
})

router.afterEach((to, from) => {
// eslint-disable-next-line no-console
  console.log(`Navigation to ${to.meta} from ${from?.fullPath}`)
})

createApp(App).use(router).mount('#app')
