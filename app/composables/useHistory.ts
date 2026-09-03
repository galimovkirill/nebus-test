import { computed, ref } from 'vue'

export interface HistoryCommand {
  undo: () => void
  redo: () => void
}

export const useHistory = (limit = 50) => {
  const past = ref<HistoryCommand[]>([])
  const future = ref<HistoryCommand[]>([])

  const canUndo = computed(() => past.value.length > 0)
  const canRedo = computed(() => future.value.length > 0)

  const push = (command: HistoryCommand) => {
    past.value.push(command)

    if (past.value.length > limit) {
      past.value.shift()
    }

    future.value = []
  }

  const undo = () => {
    const command = past.value.pop()
    if (!command) return

    command.undo()
    future.value.push(command)
  }

  const redo = () => {
    const command = future.value.pop()
    if (!command) return

    command.redo()
    past.value.push(command)
  }

  const reset = () => {
    past.value = []
    future.value = []
  }

  return { canUndo, canRedo, push, undo, redo, reset }
}
