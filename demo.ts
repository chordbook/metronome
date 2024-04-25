import { createMetronome } from "./src"
import { sync } from "./src/clock.ts"

async function doSync() {
  const offset = await sync()
  document.getElementById('offset')!.innerText = offset.toString()
  setTimeout(doSync, 5000)
}

setTimeout(doSync(), 1000)

const tempoEl = document.getElementById("tempo")! as HTMLInputElement
const visualizerEl = document.getElementById("visualizer")! as HTMLInputElement

let metronome;

function onBeat(note) {
  if (note % 4 !== 0) return // ignore non-quarter notes for now
  const quarter = note / 4

  visualizerEl.querySelector('.active')?.classList.remove('active')
  visualizerEl.children[quarter].classList.add('active')
}

document.getElementById("start")?.addEventListener("click", () => {
  metronome = createMetronome({ tempo: Number(tempoEl.value), onBeat })
  metronome.start()
})
document.getElementById("stop")?.addEventListener("click", () => {
  metronome?.stop()
  metronome = undefined
})
