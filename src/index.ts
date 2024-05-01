import { setInterval, clearInterval } from "./timers"
import { NetworkClock } from "./Clock"
import { Meter } from "./Meter"
import { Beat, Conductor } from "./Conductor"
import iosunmute from 'iosunmute'

const clock = new NetworkClock()

export interface MetronomeConfig {
  tempo?: number
  meter?: [number, number]
  onBeat?: (note: number) => void
}

const defaultConfig: MetronomeConfig = {
  tempo: 120.0,
  meter: [4, 4],
}

const audioContext: AudioContext = new AudioContext()
iosunmute(audioContext)

export function createMetronome(config: MetronomeConfig = {}) {
  config = { ...defaultConfig, ...config }


  // How frequently to call scheduling function (in ms)
  const lookahead = 25;

  // How far ahead to schedule audio (ms)
  // This is calculated from lookahead, and overlaps with next interval (in case the timer is late)
  const scheduleAheadTime = 100;

  // length of "beep" (in seconds)
  const noteLength = 0.04;

  // What note was last scheduled?
  let currentBeat: number;

  // the last "box" we drew on the screen
  let lastBeatDrawn = -1;

  // the notes that have been put into the web audio, and may or may not have played yet.
  let queue: Beat[] = [];

  // The interval id for the tick loop
  let interval: number | undefined;

  let meter: Meter;
  let conductor: Conductor;

  function configure(newConfig: MetronomeConfig) {
    config = { ...config, ...newConfig }
    meter = new Meter(...config.meter!)
    conductor = new Conductor(config.tempo!, meter, clock)
  }

  function scheduleNote(beat: Beat) {
    // Push the note on the queue for the visualizer
    queue.push(beat);

    // create an oscillator
    // FIXME: make this configurable
    const osc = audioContext.createOscillator();
    const envelope = audioContext.createGain();
    let gain = 1;

    if (beat.number === 0) {
      // beat 0 == high pitch
      osc.frequency.value = 880.0;
    } else {
      // quarter notes = medium pitch
      osc.frequency.value = 660.0;
      gain = 0.5;
    }

    const time = audioContext.currentTime + (beat.time - clock.now()) / 1000

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
      const time = conductor.nextBeat(currentBeat)
      if (time > clock.now() + scheduleAheadTime) break;
      scheduleNote({ number: currentBeat, time });

      // Advance the beat number, wrap to zero
      currentBeat = (currentBeat + 1) % meter.count;
    }
  }

  function start () {
    if (interval) return // already running

    // play silent buffer to unlock the audio context
    const buffer = audioContext.createBuffer(1, 1, 22050);
    const node = audioContext.createBufferSource();
    node.buffer = buffer;
    node.start(0);

    currentBeat = 0;
    interval = setInterval(tick, lookahead)
    requestAnimationFrame(draw);
  }

  function stop() {
    clearInterval (interval)
    interval = undefined
  }

  function draw() {
    if(!interval) return // stopped

    var currentBeat = lastBeatDrawn;
    var now = clock.now();

    while (queue.length && queue[0].time <= now) {
      currentBeat = queue[0].number;
      queue.splice(0, 1); // remove note from queue
    }

    // We only need to draw if the note has moved.
    if (lastBeatDrawn != currentBeat) {
      config.onBeat?.(currentBeat)
      lastBeatDrawn = currentBeat;
    }

    // set up to draw again
    requestAnimationFrame(draw);
  }

  configure(config)

  return { start, stop, configure }
}

export { Meter, Conductor, NetworkClock, clock }
export { WallClock } from "./Clock"
export type { Clock } from "./Clock"
