<template>
  <div class="app">
    <div class="container">
      <AppHeader />

      <NuxtPage class="app__content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
</script>

<style lang="scss" scoped>
.app {
  min-height: 100vh;

  &__content {
    margin-top: 32px;
  }
}
</style>
