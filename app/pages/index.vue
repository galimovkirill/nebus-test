<template>
  <div class="notes-page">
    <div v-if="notesStore.notes.length" class="notes-page__list">
      <NoteCard
        v-for="note in notesStore.notes"
        :key="note.id"
        :note="note"
        @edit="router.push(`/notes/${note.id}`)"
        @remove="requestRemove(note)"
      />
    </div>

    <EmptyState v-else>
      <template #title>Пока ни одной заметки</template>

      <template #description>
        Создайте первую — в ней можно вести список задач и отмечать выполненное.
      </template>
    </EmptyState>

    <ConfirmModal
      v-if="noteToDelete"
      v-model:open="isDeleteConfirmOpen"
      title="Удалить заметку?"
      :message="`Заметка «${noteToDelete.title}» будет удалена без возможности восстановления.`"
      confirm-text="Удалить"
      danger
      @confirm="removeNote"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmModal from '~/components/ui/ConfirmModal.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import NoteCard from '~/features/notes/components/NoteCard.vue'
import type { Note } from '~/features/notes/types'
import { useNotesStore } from '~/stores/notes'

const notesStore = useNotesStore()
const router = useRouter()

const noteToDelete = ref<Note | null>(null)
const isDeleteConfirmOpen = ref(false)

const requestRemove = (note: Note) => {
  noteToDelete.value = note
  isDeleteConfirmOpen.value = true
}

const removeNote = () => {
  if (noteToDelete.value) {
    notesStore.removeNote(noteToDelete.value.id)
  }
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
