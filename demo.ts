import { createMetronome } from "./src"

const tempoEl = document.getElementById("tempo")! as HTMLInputElement
const canvas = document.querySelector('canvas')! as HTMLCanvasElement
const ctx = canvas.getContext('2d')!
ctx.strokeStyle = "#ffffff";
ctx.lineWidth = 2;

let metronome;

function onBeat(note) {
  var x = Math.floor(canvas.width / 18);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < 16; i++) {
    ctx.fillStyle = (note == i) ?
      ((note % 4 === 0) ? "red" : "blue") : "gray";
    ctx.fillRect(x * (i + 1), x, x / 2, x / 2);
  }
}

document.getElementById("start")?.addEventListener("click", () => {
  metronome = createMetronome({ tempo: Number(tempoEl.value), onBeat })
  metronome.start()
})
document.getElementById("stop")?.addEventListener("click", () => {
  metronome?.stop()
  metronome = undefined
})
