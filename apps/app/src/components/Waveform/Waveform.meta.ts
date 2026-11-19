import type { ComponentMeta } from '../meta';

export const waveformMeta = {
  name: 'Waveform',
  category: 'atom',
  description:
    'A row of bars that shows how loud an audio clip is over time. The bars already played are cyan and the rest are dim, so it also shows the position. It is a picture with a text alternative, not a control.',
  spec: 'DESIGN.md §9.3, design/screens/Listen.dc.html',
  props: {
    bars: 'The height of each bar as a percentage of the full height, from 0 to 100',
    progress: 'How much of the clip was played, from 0 to 1',
    accessibilityLabel:
      'The text alternative, already translated, with the seconds played and the length',
    className: 'Extra classes; layout only',
  },
  states: ['default'],
  relationships: {
    pairsWith: ['PlaybackControls'],
    usedIn: ['Listen & shadow', 'Read aloud (later)'],
  },
  tokens: {
    color: ['ring', 'border'],
    spacing: ['1'],
  },
  accessibility: [
    'An image with a label that says the seconds played and the length',
    'Position is also given by the label, not only by the bar colour',
    'Not interactive: no touch target',
  ],
  aiHints: {
    useWhen: ['Showing the position inside a short audio clip'],
    avoidWhen: ['Seeking inside the clip: it is not a slider'],
    invalid: [
      'A progress below 0 or above 1',
      'A hard-coded label: it comes from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
