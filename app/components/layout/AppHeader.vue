<template>
  <header class="app-header">
    <h1 class="app-header__title">Заметки</h1>

    <BaseButton variant="primary" @click="isNewNoteModalShown = true"> Новая заметка </BaseButton>
  </header>

  <NewNoteModal v-if="isNewNoteModalShown" v-model:open="isNewNoteModalShown" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import NewNoteModal from '~/features/notes/components/NewNoteModal.vue'

const isNewNoteModalShown = ref(false)
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
