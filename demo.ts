import { createMetronome, syncClock } from "./src"

setTimeout(async () => {
  document.getElementById('offset')!.innerText = (await syncClock()).toString()
}, 1000)

const tempoEl = document.getElementById("tempo")! as HTMLInputElement
const visualizerEl = document.getElementById("visualizer")! as HTMLInputElement

let metronome;

function onBeat(note) {
  if (note % 4 !== 0) return // ignore non-quarter notes for now
  const quarter = note / 4

  visualizerEl.querySelector('.active')?.classList.remove('active')
  visualizerEl.children[quarter].classList.add('active')
}

document.getElementById("enabled")?.addEventListener("change", (e) => {
  if ((e.target as HTMLInputElement)?.checked) {
    metronome = createMetronome({ tempo: Number(tempoEl.value), onBeat })
    metronome.start()
  } else {
    metronome?.stop()
    onBeat(0)
    metronome = undefined
  }
})

tempoEl.addEventListener("input", () => {
  metronome?.setTempo(Number(tempoEl.value))
})
