<template>
  <form class="note-form" @submit.prevent="save">
    <BaseInput v-model="title" placeholder="Название заметки" />

    <ul class="note-form__tasks">
      <NoteItem
        v-for="task in tasks"
        :key="task.id"
        v-model:text="task.text"
        v-model:done="task.done"
        editable
        placeholder="Что нужно сделать?"
      />
    </ul>

    <BaseButton variant="text" icon="lucide:plus" :disabled="!canAddTask" @click="addTask">
      Добавить пункт
    </BaseButton>

    <div class="note-form__actions">
      <BaseButton @click="emit('cancel')">Отмена</BaseButton>
      <BaseButton type="submit" variant="primary" :disabled="!canSave">Сохранить</BaseButton>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import NoteItem from '~/features/notes/components/NoteItem.vue'
import type { Note, NoteTask } from '~/features/notes/types'
import { useNotesStore } from '~/stores/notes'

const props = defineProps<{
  note?: Note
}>()

const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const notesStore = useNotesStore()

const createTask = (): NoteTask => ({ id: crypto.randomUUID(), text: '', done: false })

const title = ref(props.note?.title ?? '')
const tasks = ref<NoteTask[]>(
  props.note ? props.note.tasks.map((task) => ({ ...task })) : [createTask()]
)

const filledTasks = computed(() =>
  tasks.value
    .map((task) => ({ ...task, text: task.text.trim() }))
    .filter((task) => task.text !== '')
)

const canAddTask = computed(() => filledTasks.value.length === tasks.value.length)
const canSave = computed(() => title.value.trim() !== '' && filledTasks.value.length > 0)

const addTask = () => {
  tasks.value.push(createTask())
}

const save = () => {
  const note: Note = {
    id: props.note?.id ?? crypto.randomUUID(),
    title: title.value.trim(),
    tasks: filledTasks.value
  }

  if (props.note) {
    notesStore.updateNote(note)
  } else {
    notesStore.addNote(note)
  }

  emit('saved')
}
</script>

<style lang="scss" scoped>
.note-form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-3;

  &__tasks {
    display: flex;
    flex-direction: column;
    gap: $space-2;
    width: 100%;
  }

  &__actions {
    display: flex;
    align-self: stretch;
    justify-content: flex-end;
    gap: $space-2;
    margin-top: $space-2;
  }
}
</style>
