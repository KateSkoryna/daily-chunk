import type { ComponentMeta } from '../meta';

export const recordControlsMeta = {
  name: 'RecordControls',
  category: 'molecule',
  description:
    'The row for repeating a phrase aloud. Before recording it shows one mic button; while recording, one stop button; after a recording, a green play button to hear it and a mic button to record again. It owns no state: the screen says what the recording is doing.',
  spec: 'DESIGN.md §9.3, design/screens/Listen.dc.html',
  props: {
    state: 'What the buttons show: idle, recording or done',
    recordLabel: 'The accessible name of the mic button, already translated',
    stopLabel: 'The accessible name of the stop button, already translated',
    playRecordingLabel:
      'The accessible name of the green play button when state is done',
    recordAgainLabel:
      'The accessible name of the mic button next to it when state is done',
    onRecord: 'Called by the mic and the stop buttons',
    onPlayRecording: 'Called by the green play button',
  },
  states: ['idle', 'recording', 'done'],
  relationships: {
    composedOf: ['RecordButton'],
    pairsWith: ['PlaybackControls', 'StepIndicator'],
    usedIn: ['Listen & shadow (the Repeat part)'],
  },
  tokens: {
    color: ['highlight', 'success'],
    other: ['record', 'border-3'],
    spacing: ['6'],
  },
  accessibility: [
    'Every button has an accessible name; the icons are decorative',
    'Every button is at least 3rem square and has the focus ring',
    'Playing a recording is a button, never automatic, so the text and the counter stay the alternative',
  ],
  aiHints: {
    useWhen: ['A task where the person records their voice and hears it back'],
    avoidWhen: ['Playing a clip of the target language: use PlaybackControls'],
    invalid: [
      'A done state without a recording to play',
      'Hard-coded labels: they come from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
