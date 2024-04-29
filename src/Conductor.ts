import { Meter } from './Meter'
import { Clock } from './Clock'

export interface Beat {
  number: number
  time: number
}

export class Conductor {
  tempo: number
  meter: Meter
  clock: Clock

  msPerBeat: number
  msPerBar: number

  constructor(tempo: number, meter: Meter, clock: Clock) {
    this.tempo = tempo
    this.meter = meter
    this.clock = clock
    this.msPerBeat = 60 * 1000 / this.tempo
    this.msPerBar = this.msPerBeat * this.meter.count
  }

  // Returns the next time that the given beat can be played. Given synchronized clocks, any metronome
  // playing the same tempo will play the same beat of a measure at the same time.
  nextBeat(number: number): number {
    const now = this.clock.now()
    const elapsed = now % this.msPerBar
    const timeout = (this.msPerBar + (number * this.msPerBeat) - elapsed) % this.msPerBar
    return now + timeout
  }

  nextBar() {
    const time = this.nextBeat(0)
    const beats = [{ number: 0, time }]

    for (let i = 1; i < this.meter.count; i++) {
      beats.push({
        number: i,
        time: time + (i * this.msPerBeat)
      })
    }

    return beats
  }
}
