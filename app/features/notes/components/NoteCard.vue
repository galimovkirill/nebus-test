<template>
  <article class="note-card">
    <header class="note-card__header">
      <h2 class="note-card__title">{{ note.title }}</h2>

      <div class="note-card__actions">
        <BaseButton variant="text" size="sm" icon="lucide:pencil" @click="emit('edit')" />
        <BaseButton variant="danger" size="sm" icon="lucide:trash-2" @click="emit('remove')" />
      </div>
    </header>

    <ul v-if="visibleTasks.length" class="note-card__tasks">
      <NoteItem v-for="task in visibleTasks" :key="task.id" :text="task.text" :done="task.done" />
    </ul>

    <p v-else class="note-card__empty">Без пунктов</p>

    <p v-if="hiddenTasksCount > 0" class="note-card__more">Ещё {{ hiddenTasksCount }}</p>
  </article>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import NoteItem from '~/features/notes/components/NoteItem.vue'
import type { Note } from '~/features/notes/types'

const TASKS_PREVIEW_LIMIT = 4

const props = defineProps<{
  note: Note
}>()

const emit = defineEmits<{
  edit: []
  remove: []
}>()

const visibleTasks = computed(() => props.note.tasks.slice(0, TASKS_PREVIEW_LIMIT))
const hiddenTasksCount = computed(() => props.note.tasks.length - visibleTasks.value.length)
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

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-3;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
  }

  &__actions {
    display: flex;
    flex-shrink: 0;
    gap: $space-3;
  }

  &__tasks {
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__empty,
  &__more {
    color: var(--c-text-muted);
  }
}
</style>
