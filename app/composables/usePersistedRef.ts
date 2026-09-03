import { ref, watch, type Ref } from 'vue'

interface PersistedWrapper<T> {
  version: number
  data: T
}

export const usePersistedRef = <T>(key: string, defaultValue: T, version: number): Ref<T> => {
  let initial = defaultValue

  try {
    const stored = localStorage.getItem(key)

    if (stored !== null) {
      const wrapper = JSON.parse(stored) as PersistedWrapper<T>

      if (wrapper.version === version) {
        initial = wrapper.data
      }
    }
  } catch {
    initial = defaultValue
  }

  const state = ref<T>(initial) as Ref<T>

  watch(
    state,
    (value) => {
      const wrapper: PersistedWrapper<T> = { version, data: value }
      localStorage.setItem(key, JSON.stringify(wrapper))
    },
    { deep: true }
  )

  return state
}
