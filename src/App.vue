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
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
header {
  display: grid;
  gap: 1rem;
  grid-template-columns: auto;
}
nav {
  display: grid;
  gap: 1rem;
  grid-template-columns: auto;
}
</style>
