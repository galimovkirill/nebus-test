<template>
  <div class="notes-page">
    <div v-if="notesStore.notes.length" class="notes-page__list">
      <NoteCard
        v-for="note in notesStore.notes"
        :key="note.id"
        :note="note"
        @edit="editNote(note)"
        @remove="notesStore.removeNote(note.id)"
      />
    </div>

    <EmptyState v-else>
      <template #title>Пока ни одной заметки</template>

      <template #description>
        Создайте первую — в ней можно вести список задач и отмечать выполненное.
      </template>
    </EmptyState>

    <NoteFormModal
      v-if="isEditModalShown && editedNote"
      v-model:open="isEditModalShown"
      :note="editedNote"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import NoteCard from '~/features/notes/components/NoteCard.vue'
import NoteFormModal from '~/features/notes/components/NoteFormModal.vue'
import type { Note } from '~/features/notes/types'
import { useNotesStore } from '~/stores/notes'

const notesStore = useNotesStore()

const isEditModalShown = ref(false)
const editedNote = ref<Note | null>(null)

const editNote = (note: Note) => {
  editedNote.value = note
  isEditModalShown.value = true
}
</script>

<style lang="scss" scoped>
.notes-page {
  &__list {
    display: grid;
    gap: $space-4;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}
</style>
