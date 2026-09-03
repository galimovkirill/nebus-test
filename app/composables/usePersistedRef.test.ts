import { effectScope, nextTick } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePersistedRef } from './usePersistedRef'

const KEY = 'test_key'

beforeEach(() => {
  localStorage.clear()
})

describe('usePersistedRef', () => {
  it('returns the default value when nothing is stored', () => {
    const state = usePersistedRef(KEY, ['default'], 1)

    expect(state.value).toEqual(['default'])
  })

  it('returns stored data when the schema version matches', () => {
    localStorage.setItem(KEY, JSON.stringify({ version: 1, data: ['stored'] }))

    const state = usePersistedRef(KEY, ['default'], 1)

    expect(state.value).toEqual(['stored'])
  })

  it('falls back to the default value when the schema version does not match', () => {
    localStorage.setItem(KEY, JSON.stringify({ version: 1, data: ['stored'] }))

    const state = usePersistedRef(KEY, ['default'], 2)

    expect(state.value).toEqual(['default'])
  })

  it('falls back to the default value on malformed stored JSON', () => {
    localStorage.setItem(KEY, '{not json')

    const state = usePersistedRef(KEY, ['default'], 1)

    expect(state.value).toEqual(['default'])
  })

  it('persists mutations to localStorage under a versioned envelope', async () => {
    const state = usePersistedRef(KEY, [] as string[], 1)

    state.value.push('item')
    await nextTick()

    expect(JSON.parse(localStorage.getItem(KEY) ?? '')).toEqual({
      version: 1,
      data: ['item']
    })
  })

  it('does not write to localStorage before the value changes', () => {
    usePersistedRef(KEY, ['default'], 1)

    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('applies a matching-key storage event coming from another tab', () => {
    const state = usePersistedRef(KEY, ['default'], 1)

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: KEY,
        newValue: JSON.stringify({ version: 1, data: ['from-other-tab'] })
      })
    )

    expect(state.value).toEqual(['from-other-tab'])
  })

  it('ignores a storage event for an unrelated key', () => {
    const state = usePersistedRef(KEY, ['default'], 1)

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'unrelated_key',
        newValue: JSON.stringify({ version: 1, data: ['nope'] })
      })
    )

    expect(state.value).toEqual(['default'])
  })

  it('falls back to the default value when a storage event reports the key was removed', () => {
    localStorage.setItem(KEY, JSON.stringify({ version: 1, data: ['stored'] }))
    const state = usePersistedRef(KEY, ['default'], 1)
    expect(state.value).toEqual(['stored'])

    window.dispatchEvent(new StorageEvent('storage', { key: KEY, newValue: null }))

    expect(state.value).toEqual(['default'])
  })

  it('stops reacting to storage events once its effect scope is disposed', () => {
    const scope = effectScope()
    const state = scope.run(() => usePersistedRef(KEY, ['default'], 1))

    scope.stop()

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: KEY,
        newValue: JSON.stringify({ version: 1, data: ['after-dispose'] })
      })
    )

    expect(state?.value).toEqual(['default'])
  })
})
