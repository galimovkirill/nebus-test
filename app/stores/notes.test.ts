import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { StorageKeys } from '~/constants/storageKeys'
import { NOTES_SCHEMA_VERSION, type Note } from '~/features/notes/types'
import { useNotesStore } from './notes'

const createNote = (overrides: Partial<Note> = {}): Note => ({
  id: 'note-1',
  title: 'Title',
  tasks: [],
  ...overrides
})

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('useNotesStore', () => {
  it('starts empty when nothing is persisted', () => {
    const store = useNotesStore()

    expect(store.notes).toEqual([])
  })

  it('loads persisted notes matching the current schema version', () => {
    const note = createNote()
    localStorage.setItem(
      StorageKeys.Notes,
      JSON.stringify({ version: NOTES_SCHEMA_VERSION, data: [note] })
    )

    const store = useNotesStore()

    expect(store.notes).toEqual([note])
  })

  it('ignores persisted notes from a different schema version', () => {
    const note = createNote()
    localStorage.setItem(
      StorageKeys.Notes,
      JSON.stringify({ version: NOTES_SCHEMA_VERSION + 1, data: [note] })
    )

    const store = useNotesStore()

    expect(store.notes).toEqual([])
  })

  it('addNote prepends the new note to the list', () => {
    const store = useNotesStore()
    const first = createNote({ id: 'note-1' })
    const second = createNote({ id: 'note-2' })

    store.addNote(first)
    store.addNote(second)

    expect(store.notes.map((n) => n.id)).toEqual(['note-2', 'note-1'])
  })

  it('updateNote replaces the note with a matching id', () => {
    const store = useNotesStore()
    store.addNote(createNote({ id: 'note-1', title: 'Old' }))

    store.updateNote(createNote({ id: 'note-1', title: 'New' }))

    expect(store.notes).toEqual([createNote({ id: 'note-1', title: 'New' })])
  })

  it('updateNote is a silent no-op when the note no longer exists', () => {
    const store = useNotesStore()
    store.addNote(createNote({ id: 'note-1' }))

    expect(() => store.updateNote(createNote({ id: 'gone' }))).not.toThrow()
    expect(store.notes).toHaveLength(1)
  })

  it('removeNote removes the note with a matching id', () => {
    const store = useNotesStore()
    store.addNote(createNote({ id: 'note-1' }))
    store.addNote(createNote({ id: 'note-2' }))

    store.removeNote('note-1')

    expect(store.notes.map((n) => n.id)).toEqual(['note-2'])
  })

  it('persists changes to localStorage under the versioned envelope', async () => {
    const store = useNotesStore()
    store.addNote(createNote())
    await nextTick()

    const stored = JSON.parse(localStorage.getItem(StorageKeys.Notes) ?? '')
    expect(stored).toEqual({ version: NOTES_SCHEMA_VERSION, data: [createNote()] })
  })
})
