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
        @remove="removeTask(task.id)"
      />
    </ul>

    <BaseButton variant="text" icon="lucide:plus" :disabled="!canAddTask" @click="addTask">
      Добавить пункт
    </BaseButton>

    <div class="note-form__actions">
      <BaseButton v-if="props.note" variant="danger" @click="isDeleteConfirmOpen = true">
        Удалить заметку
      </BaseButton>
      <BaseButton variant="text" @click="handleCancelClick">Отмена</BaseButton>
      <BaseButton type="submit" variant="primary" :disabled="!canSave">Сохранить</BaseButton>
    </div>

    <ConfirmModal
      v-if="props.note"
      v-model:open="isCancelConfirmOpen"
      title="Отменить редактирование?"
      message="Несохранённые изменения будут потеряны."
      confirm-text="Отменить редактирование"
      cancel-text="Продолжить редактирование"
      danger
      @confirm="emit('cancel')"
    />

    <ConfirmModal
      v-if="props.note"
      v-model:open="isDeleteConfirmOpen"
      title="Удалить заметку?"
      :message="`Заметка «${props.note.title}» будет удалена без возможности восстановления.`"
      confirm-text="Удалить"
      danger
      @confirm="removeNote"
    />
  </form>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import ConfirmModal from '~/components/ui/ConfirmModal.vue'
import NoteItem from '~/features/notes/components/NoteItem.vue'
import type { Note, NoteTask } from '~/features/notes/types'
import { useNotesStore } from '~/stores/notes'

const props = defineProps<{
  note?: Note
}>()

const emit = defineEmits<{
  saved: []
  cancel: []
  deleted: []
}>()

const notesStore = useNotesStore()

const isCancelConfirmOpen = ref(false)
const isDeleteConfirmOpen = ref(false)

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

const removeTask = (id: string) => {
  tasks.value = tasks.value.filter((task) => task.id !== id)
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

const handleCancelClick = () => {
  if (props.note) {
    isCancelConfirmOpen.value = true
  } else {
    emit('cancel')
  }
}

const removeNote = () => {
  if (!props.note) return

  notesStore.removeNote(props.note.id)
  emit('deleted')
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
    gap: $space-4;
    margin-top: $space-2;
  }
}
</style>
