import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import {createNavigationApiHistory} from "./navigationApiHistory.ts";

console.log(window.navigation)

const history = window.navigation
    ? createNavigationApiHistory()
    : createWebHistory();

const router = createRouter({
    history,
    routes,
})

history.listen((to, from, info) => {
  console.log(`History: ${from} => ${to} => ${info.type}`)
})

router.afterEach((to, from) => {
    console.log(`Navigation to ${to.meta} from ${from?.fullPath}`)
})

createApp(App).use(router).mount('#app')
