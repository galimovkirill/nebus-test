<template>
  <div class="notes-page">
    <div v-if="notesStore.notes.length" class="notes-page__list">
      <NoteCard
        v-for="note in notesStore.notes"
        :key="note.id"
        :note="note"
        @edit="router.push(`/notes/${note.id}`)"
        @remove="notesStore.removeNote(note.id)"
      />
    </div>

    <EmptyState v-else>
      <template #title>Пока ни одной заметки</template>

      <template #description>
        Создайте первую — в ней можно вести список задач и отмечать выполненное.
      </template>
    </EmptyState>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import EmptyState from '~/components/ui/EmptyState.vue'
import NoteCard from '~/features/notes/components/NoteCard.vue'
import { useNotesStore } from '~/stores/notes'

const notesStore = useNotesStore()
const router = useRouter()
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
