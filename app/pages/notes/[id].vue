<template>
  <div class="note-page">
    <h2 class="note-page__title">Редактировать заметку</h2>

    <NoteForm
      v-if="note"
      :note="note"
      @saved="goToNotes"
      @cancel="goToNotes"
      @deleted="goToNotes"
    />

    <EmptyState v-else>
      <template #title>Заметка не найдена</template>

      <template #description>Возможно, её удалили — вернитесь к списку заметок.</template>

      <template #actions>
        <BaseButton @click="goToNotes">К списку</BaseButton>
      </template>
    </EmptyState>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '~/components/ui/BaseButton.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import NoteForm from '~/features/notes/components/NoteForm.vue'
import { useNotesStore } from '~/stores/notes'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()

const note = computed(() => notesStore.notes.find(({ id }) => id === route.params.id))

const goToNotes = () => router.push('/')
</script>

<style lang="scss" scoped>
.note-page {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  &__title {
    font-size: 20px;
    font-weight: 600;
  }
}
</style>
