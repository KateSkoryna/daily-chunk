import type { ComponentMeta } from '../meta';

export const playbackControlsMeta = {
  name: 'PlaybackControls',
  category: 'molecule',
  description:
    'The row under an audio clip: the speed button on the left, and the round play or pause button next to it (the biggest, cyan). It owns no state: the screen says whether the clip is playing.',
  spec: 'DESIGN.md §9.3, design/screens/Listen.dc.html',
  props: {
    speedLabel: 'The speed written on the button, for example 0.75×',
    isPlaying:
      'Whether the clip is playing; the middle button shows pause, otherwise play',
    playLabel:
      'The accessible name of the middle button while paused, already translated',
    pauseLabel:
      'The accessible name of the middle button while playing, already translated',
    onSpeedPress: 'Called by the speed button',
    onTogglePlay: 'Called by the middle button',
  },
  states: ['paused', 'playing'],
  relationships: {
    composedOf: ['PressableFocus', 'Icon'],
    pairsWith: ['Waveform', 'StepIndicator'],
    usedIn: ['Listen & shadow'],
  },
  tokens: {
    color: ['input', 'ring', 'primary-foreground'],
    typography: ['ui'],
    other: ['control', 'record', 'border-3'],
    spacing: ['4'],
  },
  accessibility: [
    'The speed button is named by its text (0.75×)',
    'The middle button is named Play or Pause; the icon is decorative',
    'Every button is at least 3rem square and has the focus ring',
  ],
  aiHints: {
    useWhen: [
      'Controls for a short clip that can be played slower and repeated by voice',
    ],
    avoidWhen: ['A single play button: use a Button with the speaker icon'],
    invalid: [
      'A play button without a name',
      'Hard-coded labels: they come from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
