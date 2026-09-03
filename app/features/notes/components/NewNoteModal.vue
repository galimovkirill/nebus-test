<template>
  <BaseModal v-model:open="open">
    <template #title>Создать новую заметку</template>

    <div class="new-note">
      <BaseInput v-model="title" placeholder="Название заметки" />

      <ul class="new-note__tasks">
        <NoteItem
          v-for="task in tasks"
          :key="task.id"
          v-model:text="task.text"
          v-model:done="task.done"
          editable
          placeholder="Что нужно сделать?"
        />
      </ul>

      <BaseButton variant="text" :disabled="!canAddTask" @click="addTask">
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
import type { NoteTask } from '~/features/notes/types'
import { useNotesStore } from '~/stores/notes'

const open = defineModel<boolean>('open', { required: true })

const notesStore = useNotesStore()

const title = ref('')
const tasks = ref<NoteTask[]>([createTask()])

const filledTasks = computed(() =>
  tasks.value
    .map((task) => ({ ...task, text: task.text.trim() }))
    .filter((task) => task.text !== '')
)

const canAddTask = computed(() => filledTasks.value.length === tasks.value.length)
const canSave = computed(() => title.value.trim() !== '' && filledTasks.value.length > 0)

function createTask(): NoteTask {
  return { id: crypto.randomUUID(), text: '', done: false }
}

const addTask = () => {
  tasks.value.push(createTask())
}

const save = () => {
  notesStore.addNote({
    id: crypto.randomUUID(),
    title: title.value.trim(),
    tasks: filledTasks.value
  })

  open.value = false
}
</script>

<style lang="scss" scoped>
.new-note {
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
