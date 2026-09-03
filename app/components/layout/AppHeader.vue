<template>
  <header class="app-header">
    <h1 class="app-header__title">Заметки</h1>

    <BaseButton variant="primary">Новая заметка</BaseButton>
  </header>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
</script>

<style lang="scss" scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;

  &__title {
    font-size: 24px;
  }
}
</style>
