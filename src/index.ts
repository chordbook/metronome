import { setInterval, clearInterval } from "./timers"
import { now } from "./clock"

export { sync as syncClock } from "./clock"

export interface Beat {
  note: number
  time: number
}

enum Resolution {
  sixteenth = 0,
  eighth = 1,
  quarter = 2
}

export interface MetronomeConfig {
  tempo?: number
  meter?: [number, number]
  resolution?: Resolution
  onBeat?: (note: number) => void
}

const defaultConfig: MetronomeConfig = {
  tempo: 120.0,
  meter: [4, 4],
  resolution: Resolution.quarter
}

export function createMetronome(config: MetronomeConfig = {}) {
  config = { ...defaultConfig, ...config }

  const audioContext: AudioContext = new AudioContext()

  // How frequently to call scheduling function (in milliseconds)
  const lookahead = 25;

  // How far ahead to schedule audio (sec)
  // This is calculated from lookahead, and overlaps with next interval (in case the timer is late)
  const scheduleAheadTime = 0.1;

  // length of "beep" (in seconds)
  const noteLength = 0.04;

  // What note was last scheduled?
  let currentNote: number;

  // the last "box" we drew on the screen
  let last16thNoteDrawn = -1;

  // the notes that have been put into the web audio, and may or may not have played yet.
  let queue: Beat[] = [];

  // The interval id for the tick loop
  let interval: number | undefined;

  // Time in seconds that a bar lasts
  const secondsPerBar = 60 / config.tempo! * config.meter![0]

  // duration of 16th note in seconds
  const secondsPerNote = 60 / config.tempo! / 4

  // Returns the next time that the given not can be played. Given synchronized clocks, any metronome
  // playing the same tempo will play the same note of a measure at the same time.
  //
  // note = 0 - 15 (16th notes)
  function nextTime(note: number) {
    const offset = (now() / 1000) % secondsPerBar
    return (secondsPerBar + (note * secondsPerNote) - offset) % secondsPerBar
  }

  function scheduleNote({ note, time }: Beat) {
    // Push the note on the queue for the visualizer
    queue.push({ note, time });

    // we're not playing non-8th 16th notes
    if ((config.resolution === Resolution.eighth) && (note % 2) !== 0) return;

    // we're not playing non-quarter 8th notes
    if ((config.resolution === Resolution.quarter) && (note % 4) !== 0) return;

    // create an oscillator
    // FIXME: make this configurable
    var osc = audioContext.createOscillator();
    const envelope = audioContext.createGain();
    let gain = 1;

    if (note % 16 === 0) {
      // beat 0 == high pitch
      osc.frequency.value = 880.0;
    } else if (note % 4 === 0) {
      // quarter notes = medium pitch
      osc.frequency.value = 660.0;
      gain = 0.5;
    } else {
      // other 16th notes = low pitch
      osc.frequency.value = 440.0;
      gain = 0.1;
    }

    envelope.gain.exponentialRampToValueAtTime(gain, time + 0.001);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
    osc.start(time);
    osc.stop(time + noteLength);

    osc.connect(envelope);
    envelope.connect(audioContext.destination);
  }

  function tick() {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (true) {
      const time = audioContext.currentTime + nextTime(currentNote)
      if (time > audioContext.currentTime + scheduleAheadTime) break;

      scheduleNote({ note: currentNote, time});

      // Advance the beat number, wrap to zero
      currentNote = (currentNote + 1) % 16;
    }
  }

  function start () {
    // play silent buffer to unlock the audio context
    const buffer = audioContext.createBuffer(1, 1, 22050);
    const node = audioContext.createBufferSource();
    node.buffer = buffer;
    node.start(0);

    currentNote = 0;
    interval = setInterval(tick, lookahead)
    requestAnimationFrame(draw);
  }

  function stop() {
    clearInterval (interval)
    interval = undefined
  }

  function draw() {
    if(!interval) return // stopped

    var currentNote = last16thNoteDrawn;
    var currentTime = audioContext.currentTime;

    while (queue.length && queue[0].time < currentTime) {
      currentNote = queue[0].note;
      queue.splice(0, 1); // remove note from queue
    }

    // We only need to draw if the note has moved.
    if (last16thNoteDrawn != currentNote) {
      config.onBeat?.(currentNote)
      last16thNoteDrawn = currentNote;
    }

    // set up to draw again
    requestAnimationFrame(draw);
  }

  return { start, stop }
}
