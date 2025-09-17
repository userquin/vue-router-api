<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
watch(route, (to) => {
  console.log('Route changed to:', to.fullPath)
})
router.beforeEach((to, from, next, info) => {
  console.log('beforeEach: updating route to:', to.fullPath, 'from:', from?.fullPath, info)
  next()
})
</script>

<template>
  <div>
    <header>
      <h1>Navigation API test</h1>
      <nav>
        <RouterLink to="/">
          Go Home
        </RouterLink>
        <RouterLink to="/a">
          Go to A
        </RouterLink>
        <RouterLink to="/b">
          Go to B
        </RouterLink>
        <RouterLink to="/scroll-restoration">
          Go to Scrol restoration
        </RouterLink>
      </nav>
    </header>
    <main>
      <RouterView v-slot="{ Component, transitionMode }">
        <div class="transition-mode-display">
          Active Mode: <span>{{ transitionMode }}</span>
        </div>

        <transition
          v-if="transitionMode === 'auto'"
          name="slide-fade"
          mode="out-in"
        >
          <component :is="Component" :key="route.path" />
        </transition>

        <component :is="Component" v-else :key="route.path" />
      </RouterView>
    </main>
  </div>
</template>

<style>
/* --- 1. Animaciones para las View Transitions NATIVAS --- */

@keyframes slide-to-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-30px);
    opacity: 0;
  }
}

@keyframes slide-from-right {
  from {
    transform: translateX(30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
  }
}

/* `::view-transition-old(root)` es la captura de la página antigua.
  La animamos para que se deslice hacia la izquierda y desaparezca.
*/
::view-transition-old(root) {
  animation: 0.3s ease-out forwards slide-to-left;
}

/* `::view-transition-new(root)` es la nueva página.
  La animamos para que entre deslizándose desde la derecha.
*/
::view-transition-new(root) {
  animation: 0.3s ease-in forwards slide-from-right;
}
</style>

<style scoped>
header {
  padding: 1rem 2rem;
  border-bottom: 1px solid #333;
  margin-bottom: 2rem;
}
h1 {
  margin: 0 0 1rem;
}
nav {
  display: flex;
  gap: 1rem;
}
nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}
.router-link-active {
  color: #42b983;
}
main {
  padding: 0 2rem;
}

.transition-mode-display {
  background-color: #f0f0f0;
  border-left: 4px solid #42b983;
  padding: 8px 12px;
  margin-bottom: 2rem;
  font-family: monospace;
  font-size: 0.9rem;
}

.transition-mode-display span {
  font-weight: bold;
  color: #2c3e50;
}

/* --- 2. Animaciones para el <transition> de VUE (el fallback) --- */

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
