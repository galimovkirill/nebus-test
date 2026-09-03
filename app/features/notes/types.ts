export const NOTES_SCHEMA_VERSION = 1

export interface NoteTask {
  id: string
  text: string
  done: boolean
}

export interface Note {
  id: string
  title: string
  tasks: NoteTask[]
}
