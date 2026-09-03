import { onScopeDispose, ref, watch, type Ref } from 'vue'

interface PersistedWrapper<T> {
  version: number
  data: T
}

export const usePersistedRef = <T>(key: string, defaultValue: T, version: number): Ref<T> => {
  const parse = (raw: string | null): T => {
    if (raw === null) return defaultValue

    try {
      const wrapper = JSON.parse(raw) as PersistedWrapper<T>
      return wrapper.version === version ? wrapper.data : defaultValue
    } catch {
      return defaultValue
    }
  }

  const state = ref<T>(parse(localStorage.getItem(key))) as Ref<T>

  watch(
    state,
    (value) => {
      const wrapper: PersistedWrapper<T> = { version, data: value }
      localStorage.setItem(key, JSON.stringify(wrapper))
    },
    { deep: true }
  )

  const onStorage = (event: StorageEvent) => {
    if (event.key !== key) return
    state.value = parse(event.newValue)
  }

  window.addEventListener('storage', onStorage)
  onScopeDispose(() => window.removeEventListener('storage', onStorage))

  return state
}
