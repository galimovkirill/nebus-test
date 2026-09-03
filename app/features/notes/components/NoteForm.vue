<template>
  <form class="note-form" @submit.prevent="save">
    <BaseInput
      v-model="title"
      placeholder="Название заметки"
      @focus="startEdit(title, commitTitle)"
      @blur="commitEdit"
    />

    <ul class="note-form__tasks">
      <NoteItem
        v-for="task in tasks"
        :key="task.id"
        v-model:text="task.text"
        :done="task.done"
        editable
        placeholder="Что нужно сделать?"
        @update:done="toggleTaskDone(task.id)"
        @remove="removeTask(task.id)"
        @text-focus="startEdit(task.text, (before) => commitTaskText(task.id, before))"
        @text-blur="commitEdit"
      />
    </ul>

    <BaseButton variant="text" icon="lucide:plus" :disabled="!canAddTask" @click="addTask">
      Добавить пункт
    </BaseButton>

    <div class="note-form__actions">
      <div v-if="props.note" class="note-form__history">
        <BaseButton
          variant="text"
          size="sm"
          icon="lucide:undo-2"
          title="Отменить изменение (Ctrl+Z)"
          :disabled="!canUndo"
          @click="undo"
        />
        <BaseButton
          variant="text"
          size="sm"
          icon="lucide:redo-2"
          title="Повторить изменение (Ctrl+Shift+Z)"
          :disabled="!canRedo"
          @click="redo"
        />
      </div>

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
      @confirm="handleCancelConfirmed"
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import ConfirmModal from '~/components/ui/ConfirmModal.vue'
import NoteItem from '~/features/notes/components/NoteItem.vue'
import { useNoteEditor } from '~/features/notes/composables/useNoteEditor'
import type { Note } from '~/features/notes/types'
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

const {
  title,
  tasks,
  commitTitle,
  commitTaskText,
  startEdit,
  commitEdit,
  toggleTaskDone,
  addTask,
  removeTask,
  undo,
  redo,
  canUndo,
  canRedo,
  resetHistory
} = useNoteEditor(props.note)

const isTextInput = (target: EventTarget | null): boolean =>
  target instanceof HTMLInputElement && target.type === 'text'

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.note) return
  if (event.code !== 'KeyZ' || !(event.ctrlKey || event.metaKey)) return
  if (isTextInput(event.target)) return

  event.preventDefault()

  if (event.shiftKey) {
    redo()
  } else {
    undo()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const filledTasks = computed(() =>
  tasks.value
    .map((task) => ({ ...task, text: task.text.trim() }))
    .filter((task) => task.text !== '')
)

const canAddTask = computed(() => filledTasks.value.length === tasks.value.length)
const canSave = computed(() => title.value.trim() !== '' && filledTasks.value.length > 0)

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

  resetHistory()
  emit('saved')
}

const handleCancelClick = () => {
  if (props.note) {
    isCancelConfirmOpen.value = true
  } else {
    emit('cancel')
  }
}

const handleCancelConfirmed = () => {
  resetHistory()
  emit('cancel')
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
    align-items: center;
    align-self: stretch;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: $space-4;
    margin-top: $space-2;

    @media (max-width: $bp-sm) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  &__history {
    display: flex;
    gap: $space-2;
    margin-right: auto;

    @media (max-width: $bp-sm) {
      margin-right: 0;
    }
  }
}
</style>
