<template>
  <article class="note-card">
    <h2 class="note-card__title">{{ note.title }}</h2>

    <ul v-if="note.tasks.length" class="note-card__tasks">
      <NoteItem v-for="task in note.tasks" :key="task.id" :text="task.text" :done="task.done" />
    </ul>

    <p v-else class="note-card__empty">Без пунктов</p>
  </article>
</template>

<script lang="ts" setup>
import NoteItem from '~/features/notes/components/NoteItem.vue'
import type { Note } from '~/features/notes/types'

defineProps<{
  note: Note
}>()
</script>

<style lang="scss" scoped>
.note-card {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  padding: $space-4;
  border: 1px solid var(--c-border);
  border-radius: $radius-lg;
  background: var(--c-surface);
  box-shadow: var(--shadow-sm);

  &__title {
    font-size: 18px;
    font-weight: 600;
  }

  &__tasks {
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__empty {
    color: var(--c-text-muted);
  }
}
</style>
