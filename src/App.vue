<script setup>
import '../public/css/style.css'
</script>

<template>
  <nav>
    <RouterLink to="/">Config</RouterLink>
    <RouterLink to="/chat">Chat</RouterLink>
  </nav>
<main>
  <RouterView />
</main>
</template>

<style scoped></style>
