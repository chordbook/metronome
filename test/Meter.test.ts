import { test, expect } from 'vitest'
import { Meter } from '../src'

test('constructor', () => {
  const meter = new Meter(3, 4)
  expect(meter.count).toBe(3)
  expect(meter.quantum).toBe(4)
})
