<template>
  <h1 id="app-title">💖 Hello World!</h1>
  <span>{{ $route.fullPath }}</span>
  <nav class="flex space-x-4 p-5 bg-gray-400">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
  <main class="p-7">
    <RouterView />
  </main>
</template>
