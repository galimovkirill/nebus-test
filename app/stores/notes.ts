import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Note } from '~/features/notes/types'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])

  const addNote = (note: Note) => {
    notes.value.unshift(note)
  }

  return { notes, addNote }
})
