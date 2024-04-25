# @chordbook/metronome

A web-based metronome.

<h3 align="center">🎸 <a href="https://chordbook.github.io/metronome/">View Demo</a> 🪕</h3>

### Features

* [x] Consistent clock synchronization - any two devices with synchronized clocks will play in sync for a given tempo
* [ ] Customizable meter (3/4, 4/4, 6/8, etc)
* [ ] Customizable beat patterns (straight, swing, boom-chuck, etc)
* [ ] Configurable audio (volume, mute, etc) and customizable sounds
* [ ] Customizable visualizations

## Installation

```console
npm install @chordbook/metronome
```

## Usage

```js
import { createMetronome } from '@chordbook/metronome'

const metronome = createMetronome({
  tempo: 120.0,

  // Callback to visualize the beat
  onBeat: note => console.log('Beat:', note) // 0-15
})

// Request access to the web audio API and begin playing the metronome
metronome.start()

// Stop playing the metronome
metronome.stop()
```

## Contributing

Contributions are welcome!

1. Clone this repository: `git clone https://github.com/chordbook/metronome.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open [http://localhost:5173/](http://localhost:5173/) in your browser

## Acknowledgements

The code derived from @cwilso's classic [A tale of two clocks](https://web.dev/articles/audio-scheduling) ([repo](https://github.com/cwilso/metronome)). Thanks to @mattgraham for the idea to synchronize all metronomes for a given tempo using the wall clock.

## License

This project is licensed under the [GPLv3.0](./LICENSE) license.
