<template>
  <header class="app-header">
    <h1 class="app-header__title">Заметки</h1>

    <BaseButton variant="primary" icon="lucide:plus" @click="isNoteFormModalShown = true">
      Новая заметка
    </BaseButton>
  </header>

  <NoteFormModal v-if="isNoteFormModalShown" v-model:open="isNoteFormModalShown" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import NoteFormModal from '~/features/notes/components/NoteFormModal.vue'

const isNoteFormModalShown = ref(false)
</script>

<style lang="scss" scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $space-3;
  padding: 12px 0;

  @media (max-width: $bp-sm) {
    flex-direction: column;
    align-items: stretch;
  }

  &__title {
    font-size: 24px;
  }
}
</style>
