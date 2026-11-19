import type { ComponentMeta } from '../meta';

export const toggleMeta = {
  name: 'Toggle',
  category: 'atom',
  description:
    'A small button with a text label that is either on or off, such as RU ON / RU OFF for the translation of a story. The label says the state in words and the outline turns cyan when it is on. It owns no state.',
  spec: 'DESIGN.md §9.3, design/screens/Read.dc.html',
  props: {
    label: 'The text with the state, already translated, for example RU ON',
    isOn: 'Whether the option is on',
    onToggle: 'Called when pressed',
    className: 'Extra classes; layout only',
  },
  states: ['off', 'on', 'focused'],
  relationships: {
    composedOf: ['PressableFocus', 'Text'],
    alternatives: {
      Switch: 'A setting in a list of settings, with the label next to it',
    },
    usedIn: ['Read (translation)'],
  },
  tokens: {
    color: ['ring', 'input'],
    typography: ['ui'],
    spacing: ['3'],
    other: ['control'],
  },
  accessibility: [
    'A switch whose checked state is on or off; its name is the visible label',
    'The state is written in the label, not only shown by the outline colour',
    'At least 3.5rem tall and has the focus ring',
  ],
  aiHints: {
    useWhen: [
      'One option inside a screen that is shown or hidden: translation, hints',
    ],
    avoidWhen: [
      'Settings that are saved: use Switch',
      'Choosing one of several: use OptionGrid',
    ],
    invalid: [
      'A label that does not change with the state',
      'A hard-coded label: it comes from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
