<script setup lang="ts">
import { shallowRef } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const step = shallowRef<'a' | 'b'>('a')

onBeforeRouteLeave((to, _from, next, info) => {
  console.log('Leaving Page B to:', to.fullPath, info)
  if (step.value === 'b' && info?.isBackBrowserButton) {
    step.value = 'a'
    // stay on the same page
    next(false)
    return
  }
  next()
})
</script>

<template>
  <div>
    <h2>Page B</h2>
    <div v-if="step === 'a'">
      <h3>Step A</h3>
      <button @click="step = 'b'">
        Go Step B
      </button>
    </div>
    <div v-else>
      <h3>Step B</h3>
      <button @click="step = 'a'">
        Go Step A
      </button>

      <p>Press back button, should go to Step A instead previous page</p>
    </div>
  </div>
</template>
