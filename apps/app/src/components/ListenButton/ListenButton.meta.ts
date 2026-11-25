import type { ComponentMeta } from '../meta';

export const listenButtonMeta = {
  name: 'ListenButton',
  category: 'molecule',
  description:
    'The one button that reads a text aloud, the same on every screen. Idle it shows a speaker and "Listen"; while the voice speaks it shows a stop square and "Stop", and pressing it stops the voice.',
  spec: 'DESIGN.md §9.3',
  props: {
    isListening: 'Whether the voice is speaking now',
    onPress: 'Called to start the voice, or to stop it while it speaks',
  },
  states: ['idle', 'listening', 'pressed', 'focused'],
  relationships: {
    composedOf: ['Button', 'Icon', 'Text'],
    usedIn: ['FlashcardsScreen', 'ReadScreen'],
    alternatives: {
      PlaybackControls:
        'Replaying a recording or a phrase with speed is playback controls',
    },
  },
  tokens: {
    color: ['secondary'],
  },
  accessibility: [
    'A real button; aria-pressed says whether the voice is speaking',
    'The label changes with the state, so the icon is never the only sign',
  ],
  aiHints: {
    useWhen: [
      'Reading a word, a sentence or a text aloud with the device voice',
    ],
    avoidWhen: [
      'Playing a recording or a phrase with speed: use PlaybackControls',
    ],
    invalid: ['A second audio button with another look on the same screen'],
  },
} satisfies ComponentMeta;
