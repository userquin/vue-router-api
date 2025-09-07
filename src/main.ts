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

createApp(App).use(router).mount('#app')
