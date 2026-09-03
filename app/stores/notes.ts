import { defineStore } from 'pinia'
import { usePersistedRef } from '~/composables/usePersistedRef'
import { StorageKeys } from '~/constants/storageKeys'
import type { Note } from '~/features/notes/types'

export const useNotesStore = defineStore('notes', () => {
  const notes = usePersistedRef<Note[]>(StorageKeys.Notes, [])

  const addNote = (note: Note) => {
    notes.value.unshift(note)
  }

  const updateNote = (updated: Note) => {
    const index = notes.value.findIndex((note) => note.id === updated.id)

    if (index !== -1) {
      notes.value[index] = updated
    }
  }

  const removeNote = (id: string) => {
    notes.value = notes.value.filter((note) => note.id !== id)
  }

  return { notes, addNote, updateNote, removeNote }
})
