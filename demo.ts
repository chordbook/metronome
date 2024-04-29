import { createMetronome, clock, MetronomeConfig } from "./src"

const form = document.querySelector("form")! as HTMLFormElement
const enabled = document.querySelector("input[name=enabled]")! as HTMLInputElement
const visualizer = document.getElementById("visualizer")! as HTMLInputElement

function onBeat(number: number) {
  visualizer.querySelector('.active')?.classList.remove('active')
  visualizer.children[number]?.classList.add('active')
}

function configure() {
  config.tempo = Number(form.tempo.value)
  config.meter = String(form.meter.value).split('/').map(Number)
  metronome.configure(config)

  visualizer.innerHTML = ''
  for (let i = 0; i < Number(config.meter![0]); i++) {
    const div = document.createElement('div')
    div.classList.add(i === 0 ? 'green' : 'orange')
    visualizer.appendChild(div)
  }
}

enabled.addEventListener("change", () => {
  enabled.checked ? metronome.start() : metronome.stop()
})

form.addEventListener("input", configure)

const metronome = createMetronome({ onBeat })
let config: MetronomeConfig = {}
configure()


setTimeout(async () => {
  document.getElementById('offset')!.innerText = (await clock.sync()).toString()
}, 100)
