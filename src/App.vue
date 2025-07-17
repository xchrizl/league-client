<template>
  <h1>💖 Hello World!</h1>
  <span>{{ $route.fullPath }}</span>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
