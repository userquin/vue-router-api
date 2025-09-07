<template>
  <div>
    <header>
      <h1>Navigation API test</h1>
      <nav>
        <RouterLink to="/a"> Go to A</RouterLink>
        <RouterLink to="/b"> Go to B</RouterLink>
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
