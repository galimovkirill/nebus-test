import { describe, expect, it } from 'vitest'
import type { Note } from '~/features/notes/types'
import { useNoteEditor } from './useNoteEditor'

const createNote = (): Note => ({
  id: 'note-1',
  title: 'Original title',
  tasks: [
    { id: 'task-1', text: 'First', done: false },
    { id: 'task-2', text: 'Second', done: false }
  ]
})

describe('useNoteEditor', () => {
  it('starts with a single empty task when creating a new note', () => {
    const editor = useNoteEditor()

    expect(editor.title.value).toBe('')
    expect(editor.tasks.value).toHaveLength(1)
    expect(editor.tasks.value[0]?.text).toBe('')
    expect(editor.canUndo.value).toBe(false)
  })

  it('initializes from an existing note without mutating it', () => {
    const note = createNote()
    const editor = useNoteEditor(note)

    expect(editor.title.value).toBe('Original title')
    expect(editor.tasks.value).toHaveLength(2)

    editor.toggleTaskDone('task-1')

    expect(note.tasks[0]?.done).toBe(false)
    expect(editor.tasks.value[0]?.done).toBe(true)
  })

  describe('toggleTaskDone', () => {
    it('flips the task and records one atomic, undoable/redoable entry', () => {
      const editor = useNoteEditor(createNote())

      editor.toggleTaskDone('task-1')
      expect(editor.tasks.value[0]?.done).toBe(true)
      expect(editor.canUndo.value).toBe(true)

      editor.undo()
      expect(editor.tasks.value[0]?.done).toBe(false)
      expect(editor.canUndo.value).toBe(false)
      expect(editor.canRedo.value).toBe(true)

      editor.redo()
      expect(editor.tasks.value[0]?.done).toBe(true)
    })

    it('is a no-op for an unknown task id', () => {
      const editor = useNoteEditor(createNote())

      editor.toggleTaskDone('missing')

      expect(editor.canUndo.value).toBe(false)
    })
  })

  describe('addTask / removeTask', () => {
    it('adds a task and undo/redo restores it', () => {
      const editor = useNoteEditor(createNote())

      editor.addTask()
      expect(editor.tasks.value).toHaveLength(3)
      const addedId = editor.tasks.value[2]?.id

      editor.undo()
      expect(editor.tasks.value).toHaveLength(2)

      editor.redo()
      expect(editor.tasks.value).toHaveLength(3)
      expect(editor.tasks.value[2]?.id).toBe(addedId)
    })

    it('removes a task and undo restores it at its original position', () => {
      const editor = useNoteEditor(createNote())

      editor.removeTask('task-1')
      expect(editor.tasks.value.map((task) => task.id)).toEqual(['task-2'])

      editor.undo()
      expect(editor.tasks.value.map((task) => task.id)).toEqual(['task-1', 'task-2'])

      editor.redo()
      expect(editor.tasks.value.map((task) => task.id)).toEqual(['task-2'])
    })

    it('removeTask is a no-op for an unknown task id', () => {
      const editor = useNoteEditor(createNote())

      editor.removeTask('missing')

      expect(editor.tasks.value).toHaveLength(2)
      expect(editor.canUndo.value).toBe(false)
    })
  })

  describe('startEdit / commitEdit (title and task text)', () => {
    it('commits a burst of title edits as a single history entry', () => {
      const editor = useNoteEditor(createNote())
      const before = editor.title.value

      editor.startEdit(before, editor.commitTitle)
      editor.title.value = 'Changed title'
      editor.commitEdit()

      expect(editor.title.value).toBe('Changed title')
      expect(editor.canUndo.value).toBe(true)

      editor.undo()
      expect(editor.title.value).toBe(before)

      editor.redo()
      expect(editor.title.value).toBe('Changed title')
    })

    it('does not record history when the value did not actually change', () => {
      const editor = useNoteEditor(createNote())
      const before = editor.title.value

      editor.startEdit(before, editor.commitTitle)
      editor.commitEdit()

      expect(editor.canUndo.value).toBe(false)
    })

    it('commitEdit without a prior startEdit is a no-op', () => {
      const editor = useNoteEditor(createNote())

      expect(() => editor.commitEdit()).not.toThrow()
      expect(editor.canUndo.value).toBe(false)
    })

    it('only commits once per startEdit even if commitEdit is called twice', () => {
      const editor = useNoteEditor(createNote())
      const before = editor.title.value

      editor.startEdit(before, editor.commitTitle)
      editor.title.value = 'Changed title'
      editor.commitEdit()
      editor.commitEdit()

      editor.undo()
      expect(editor.title.value).toBe(before)
      expect(editor.canUndo.value).toBe(false)
    })

    it('commits task text edits for the specific task by id', () => {
      const editor = useNoteEditor(createNote())
      const before = editor.tasks.value[1]?.text ?? ''

      editor.startEdit(before, (b) => editor.commitTaskText('task-2', b))
      const task = editor.tasks.value.find((t) => t.id === 'task-2')
      if (task) task.text = 'Second, edited'
      editor.commitEdit()

      expect(editor.tasks.value.find((t) => t.id === 'task-2')?.text).toBe('Second, edited')
      expect(editor.tasks.value.find((t) => t.id === 'task-1')?.text).toBe('First')

      editor.undo()
      expect(editor.tasks.value.find((t) => t.id === 'task-2')?.text).toBe('Second')
    })
  })

  describe('history integration', () => {
    it('clears the redo branch once a new action follows an undo', () => {
      const editor = useNoteEditor(createNote())

      editor.toggleTaskDone('task-1')
      editor.undo()
      expect(editor.canRedo.value).toBe(true)

      editor.toggleTaskDone('task-2')
      expect(editor.canRedo.value).toBe(false)
    })

    it('resetHistory clears both undo and redo stacks', () => {
      const editor = useNoteEditor(createNote())

      editor.toggleTaskDone('task-1')
      editor.undo()
      expect(editor.canRedo.value).toBe(true)

      editor.resetHistory()

      expect(editor.canUndo.value).toBe(false)
      expect(editor.canRedo.value).toBe(false)
    })
  })
})
