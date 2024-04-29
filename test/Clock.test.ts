import { describe, test, expect, vi } from 'vitest'
import { WallClock, NetworkClock } from '../src'

describe('WallClock', () => {
  vi.setSystemTime(new Date())

  test('now() returns Date.now()', async () => {
    const clock = new WallClock()
    expect(Number.isInteger(clock.now())).toBe(true)

    expect(clock.now()).toBe(Date.now())
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(clock.now()).toBe(Date.now())
  })
})

describe('NetworkClock', () => {
  vi.setSystemTime(new Date())

  test('adds offset to now()', async () => {
    const clock = new NetworkClock()
    clock.offset = 1000
    expect(clock.now()).toBe(Date.now() + 1000)
  })
})
