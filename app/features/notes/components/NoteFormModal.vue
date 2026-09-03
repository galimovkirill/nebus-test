<template>
  <BaseModal v-model:open="open">
    <template #title>{{ note ? 'Редактировать заметку' : 'Создать новую заметку' }}</template>

    <div class="note-form">
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
    </div>

    <template #footer>
      <BaseButton @click="open = false">Закрыть</BaseButton>
      <BaseButton variant="primary" :disabled="!canSave" @click="save">Сохранить</BaseButton>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
import NoteItem from '~/features/notes/components/NoteItem.vue'
import type { Note, NoteTask } from '~/features/notes/types'
import { useNotesStore } from '~/stores/notes'

const props = defineProps<{
  note?: Note
}>()

const open = defineModel<boolean>('open', { required: true })

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

  open.value = false
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
}
</style>
