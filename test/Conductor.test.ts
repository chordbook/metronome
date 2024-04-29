import { describe, test, expect } from 'vitest'
import { Conductor, Meter, Clock } from '../src'

describe('nextBar', () => {
  describe('3/4', () => {
    const meter = new Meter(3, 4)

    test('with clock at 0', () => {
      const clock: Clock = { now: () => 0 }
      const conductor = new Conductor(120, meter, clock)

      expect(conductor.nextBar()).toEqual([
        { number: 0, time: 0 },
        { number: 1, time: 500 },
        { number: 2, time: 1000 },
      ])
    })

    test('with clock offset', () => {
      const clock: Clock = { now: () => 100 }
      const meter = new Meter(3, 4)
      const conductor = new Conductor(120, meter, clock)

      expect(conductor.nextBar()).toEqual([
        { number: 0, time: 1500 },
        { number: 1, time: 2000 },
        { number: 2, time: 2500 },
      ])
    })
  })

  describe('4/4', () => {
    const meter = new Meter(4, 4)

    test('with clock at 0', () => {
      const clock: Clock = { now: () => 0 }
      const conductor = new Conductor(120, meter, clock)

      expect(conductor.nextBar()).toEqual([
        { number: 0, time: 0 },
        { number: 1, time: 500 },
        { number: 2, time: 1000 },
        { number: 3, time: 1500 },
      ])
    })

    test('with clock offset', () => {
      const clock: Clock = { now: () => 100 }
      const conductor = new Conductor(120, meter, clock)

      expect(conductor.nextBar()).toEqual([
        { number: 0, time: 2000 },
        { number: 1, time: 2500 },
        { number: 2, time: 3000 },
        { number: 3, time: 3500 },
      ])
    })
  })

  describe('6/8', () => {
    const meter = new Meter(6, 8)

    test('with clock at 0', () => {
      const clock: Clock = { now: () => 0 }
      const conductor = new Conductor(120, meter, clock)

      expect(conductor.nextBar()).toEqual([
        { number: 0, time: 0 },
        { number: 1, time: 500 },
        { number: 2, time: 1000 },
        { number: 3, time: 1500 },
        { number: 4, time: 2000 },
        { number: 5, time: 2500 },
      ])
    })

    test('with clock offset', () => {
      const clock: Clock = { now: () => 100 }
      const conductor = new Conductor(120, meter, clock)

      expect(conductor.nextBar()).toEqual([
        { number: 0, time: 3000 },
        { number: 1, time: 3500 },
        { number: 2, time: 4000 },
        { number: 3, time: 4500 },
        { number: 4, time: 5000 },
        { number: 5, time: 5500 },
      ])
    })
  })
})
