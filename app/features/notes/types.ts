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
