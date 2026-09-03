import { ref, watch, type Ref } from 'vue'

export const usePersistedRef = <T>(key: string, defaultValue: T): Ref<T> => {
  let initial = defaultValue

  try {
    const stored = localStorage.getItem(key)

    if (stored !== null) {
      initial = JSON.parse(stored)
    }
  } catch {
    initial = defaultValue
  }

  const state = ref<T>(initial) as Ref<T>

  watch(
    state,
    (value) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
    { deep: true }
  )

  return state
}
