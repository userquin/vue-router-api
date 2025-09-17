<script setup lang="ts">
import { useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'

definePage({
  meta: {
    // set the focus to the h2.
    focusManagement: 'h2',
  },
})

const route = useRoute()
watch(() => route, (r) => {
  console.log('Route meta:', r.meta)
}, { immediate: true })

const h2Ref = useTemplateRef('h2Ref')
watch(h2Ref, (r) => {
  console.log('h2Ref available:', r)
})
</script>

<template>
  <div class="container">
    <h2 ref="h2Ref">
      Scroll & Focus Test Page
    </h2>

    <div class="instructions">
      <h3>Test Steps:</h3>
      <ol>
        <li>Scroll down to the bottom of this page.</li>
        <li>Navigate to another page (like Home or Page A).</li>
        <li>Use the browser's <strong>back button</strong> to return here.</li>
      </ol>

      <h3>Expected Result:</h3>
      <p>
        The page should visually restore your scroll position to the bottom.
        However, the programmatic focus will be on the `&lt;h2>` at the top.
        You can verify this in two ways:
      </p>
      <ul>
        <li>
          The `&lt;h2>` will have a pulsing border (you'll need to scroll up with the mouse to see it).
        </li>
        <li>
          If you press the `Tab` key, the focus will jump to the <strong>next</strong> focusable element, that's, the button below the list.
        </li>
      </ul>
      <button>Pressing tab should focus this button</button>
    </div>

    <div class="spacer" />

    <p>You've reached the bottom of the page.</p>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.instructions {
  background-color: #f4f4f5;
  border-left: 4px solid #42b983;
  padding: 1rem 1.5rem;
  border-radius: 4px;
}

.spacer {
  height: 200vh;
  border-top: 2px dashed #ccc;
  border-bottom: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-family: monospace;
}
.spacer::before {
  content: '... scroll down ...';
}

/* ✅ Tu animación de foco, corregida y aplicada */
h2:focus {
  /* Quitamos el outline por defecto para que solo se vea nuestra animación */
  outline: none;
  animation: pulse-border 0.8s ease-in-out alternate infinite;
}

@keyframes pulse-border {
  from {
    box-shadow: inset 0 0 0 4px #ff1e90;
    padding: 0.5rem;
  }
  to {
    box-shadow: inset 0 0 0 8px #3399ff;
    padding: 0.5rem;
  }
}
</style>
