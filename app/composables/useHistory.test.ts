import { describe, expect, it, vi } from 'vitest'
import { useHistory, type HistoryCommand } from './useHistory'

const createCommand = () => ({
  undo: vi.fn<() => void>(),
  redo: vi.fn<() => void>()
})

describe('useHistory', () => {
  it('starts with empty stacks', () => {
    const history = useHistory()

    expect(history.canUndo.value).toBe(false)
    expect(history.canRedo.value).toBe(false)
  })

  it('enables undo after a push and calls the command undo on undo()', () => {
    const history = useHistory()
    const command = createCommand()

    history.push(command)
    expect(history.canUndo.value).toBe(true)

    history.undo()
    expect(command.undo).toHaveBeenCalledTimes(1)
    expect(command.redo).not.toHaveBeenCalled()
    expect(history.canUndo.value).toBe(false)
    expect(history.canRedo.value).toBe(true)
  })

  it('calls the command redo on redo() after an undo', () => {
    const history = useHistory()
    const command = createCommand()

    history.push(command)
    history.undo()
    history.redo()

    expect(command.redo).toHaveBeenCalledTimes(1)
    expect(history.canUndo.value).toBe(true)
    expect(history.canRedo.value).toBe(false)
  })

  it('undo on an empty stack is a no-op', () => {
    const history = useHistory()

    expect(() => history.undo()).not.toThrow()
    expect(history.canUndo.value).toBe(false)
  })

  it('redo on an empty stack is a no-op', () => {
    const history = useHistory()

    expect(() => history.redo()).not.toThrow()
    expect(history.canRedo.value).toBe(false)
  })

  it('clears the redo branch when a new command is pushed after an undo', () => {
    const history = useHistory()
    const first = createCommand()
    const second = createCommand()

    history.push(first)
    history.undo()
    expect(history.canRedo.value).toBe(true)

    history.push(second)
    expect(history.canRedo.value).toBe(false)

    history.redo()
    expect(second.redo).not.toHaveBeenCalled()
  })

  it('undoes and redoes multiple commands in LIFO order', () => {
    const history = useHistory()
    const order: string[] = []

    const first: HistoryCommand = {
      undo: () => order.push('undo-1'),
      redo: () => order.push('redo-1')
    }
    const second: HistoryCommand = {
      undo: () => order.push('undo-2'),
      redo: () => order.push('redo-2')
    }

    history.push(first)
    history.push(second)

    history.undo()
    history.undo()
    expect(order).toEqual(['undo-2', 'undo-1'])

    history.redo()
    history.redo()
    expect(order).toEqual(['undo-2', 'undo-1', 'redo-1', 'redo-2'])
  })

  it('caps the history at the given limit without growing unbounded', () => {
    const limit = 3
    const history = useHistory(limit)
    const commands = Array.from({ length: 5 }, () => createCommand())

    commands.forEach((command) => history.push(command))

    // Only the last `limit` commands should be undoable.
    for (let i = 0; i < limit; i++) {
      history.undo()
    }
    expect(history.canUndo.value).toBe(false)

    // The two oldest commands were dropped and never get undone.
    expect(commands[0]?.undo).not.toHaveBeenCalled()
    expect(commands[1]?.undo).not.toHaveBeenCalled()
    expect(commands[2]?.undo).toHaveBeenCalledTimes(1)
    expect(commands[3]?.undo).toHaveBeenCalledTimes(1)
    expect(commands[4]?.undo).toHaveBeenCalledTimes(1)
  })

  it('defaults the limit to 50', () => {
    const history = useHistory()

    for (let i = 0; i < 51; i++) {
      history.push(createCommand())
    }

    let undoCount = 0
    while (history.canUndo.value) {
      history.undo()
      undoCount++
    }

    expect(undoCount).toBe(50)
  })

  it('reset() clears both stacks', () => {
    const history = useHistory()
    const command = createCommand()

    history.push(command)
    history.undo()
    expect(history.canRedo.value).toBe(true)

    history.reset()

    expect(history.canUndo.value).toBe(false)
    expect(history.canRedo.value).toBe(false)
  })
})
