import { ref } from 'vue'
import { useHistory } from '~/composables/useHistory'
import type { Note, NoteTask } from '~/features/notes/types'

const createTask = (): NoteTask => ({ id: crypto.randomUUID(), text: '', done: false })

export const useNoteEditor = (note?: Note) => {
  const title = ref(note?.title ?? '')
  const tasks = ref<NoteTask[]>(note ? note.tasks.map((task) => ({ ...task })) : [createTask()])

  const history = useHistory()

  const findTask = (id: string) => tasks.value.find((task) => task.id === id)

  const commitTitle = (before: string) => {
    const after = title.value
    if (before === after) return

    history.push({
      undo: () => {
        title.value = before
      },
      redo: () => {
        title.value = after
      }
    })
  }

  const commitTaskText = (id: string, before: string) => {
    const after = findTask(id)?.text ?? before
    if (before === after) return

    history.push({
      undo: () => {
        const task = findTask(id)
        if (task) task.text = before
      },
      redo: () => {
        const task = findTask(id)
        if (task) task.text = after
      }
    })
  }

  let pendingEdit: { before: string; commit: (before: string) => void } | null = null

  const startEdit = (before: string, commit: (before: string) => void) => {
    pendingEdit = { before, commit }
  }

  const commitEdit = () => {
    if (!pendingEdit) return

    pendingEdit.commit(pendingEdit.before)
    pendingEdit = null
  }

  const toggleTaskDone = (id: string) => {
    const task = findTask(id)
    if (!task) return

    const before = task.done
    const after = !before
    task.done = after

    history.push({
      undo: () => {
        const t = findTask(id)
        if (t) t.done = before
      },
      redo: () => {
        const t = findTask(id)
        if (t) t.done = after
      }
    })
  }

  const addTask = () => {
    const task = createTask()
    tasks.value.push(task)

    history.push({
      undo: () => {
        tasks.value = tasks.value.filter((t) => t.id !== task.id)
      },
      redo: () => {
        tasks.value.push(task)
      }
    })
  }

  const removeTask = (id: string) => {
    const index = tasks.value.findIndex((task) => task.id === id)
    if (index === -1) return

    const removed = tasks.value.splice(index, 1)[0]
    if (!removed) return

    history.push({
      undo: () => {
        tasks.value.splice(index, 0, removed)
      },
      redo: () => {
        tasks.value = tasks.value.filter((t) => t.id !== removed.id)
      }
    })
  }

  return {
    title,
    tasks,
    commitTitle,
    commitTaskText,
    startEdit,
    commitEdit,
    toggleTaskDone,
    addTask,
    removeTask,
    undo: history.undo,
    redo: history.redo,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    resetHistory: history.reset
  }
}
