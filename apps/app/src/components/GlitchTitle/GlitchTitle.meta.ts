import type { ComponentMeta } from '../meta';

export const glitchTitleMeta = {
  name: 'GlitchTitle',
  category: 'atom',
  description:
    'A big display title with a pink copy shifted right and a cyan copy shifted left behind it. It is drawn as three layers, because one text shadow cannot be drawn twice on a phone. Only the front layer is read by a screen reader.',
  spec: 'DESIGN.md §5.2 (display-xl), §8 spacing (glitch)',
  props: {
    variant: 'display-xl (Home title, default) or display-l',
    children: 'The title text, already translated',
  },
  variants: {
    'display-xl': 'The Home title size',
    'display-l': 'A section or lesson title size',
  },
  states: ['default'],
  relationships: {
    composedOf: ['Text'],
    usedIn: ['Home', 'Lesson done'],
  },
  tokens: {
    color: ['highlight', 'ring', 'foreground'],
    typography: ['display-xl', 'display-l'],
    spacing: ['glitch'],
  },
  accessibility: [
    'The front layer is a heading; the two copies are hidden from screen readers',
    'The text is real text, so it scales and can be selected (only the front layer; the two copies cannot be selected); the shadow colours never carry meaning',
  ],
  aiHints: {
    useWhen: ['The one big title of a screen (Home, Lesson done)'],
    avoidWhen: [
      'Ordinary section titles: use SectionLabel or Text',
      'More than one glitch title on a screen',
    ],
    invalid: [
      'A hard-coded title: it comes from the i18n strings',
      'Another shadow colour or offset',
    ],
  },
} satisfies ComponentMeta;
