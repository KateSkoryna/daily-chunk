import type { ComponentMeta } from '../meta';

export const headerStatsMeta = {
  name: 'HeaderStats',
  category: 'atom',
  description:
    'The small XP and streak readout in the top right of a screen: the XP number in yellow with its label, and the streak line below, both right-aligned.',
  spec: 'DESIGN.md §9.3, design/screens/Main.dc.html',
  props: {
    xp: 'The XP total',
    xpLabel: 'The word after the number, already translated',
    streakLabel: 'The whole streak line, already translated with its number',
  },
  states: ['default'],
  relationships: {
    pairsWith: ['TopBar'],
    usedIn: ['Home'],
  },
  tokens: {
    color: ['primary', 'ring'],
    typography: ['display-btn-sm', 'caption'],
    spacing: ['1'],
  },
  accessibility: [
    'Plain text, read in order: the number, its label, then the streak',
  ],
  aiHints: {
    useWhen: ['Showing the total XP and the streak in the top bar'],
    avoidWhen: ['Showing the XP earned in one lesson: use a StatTile'],
    invalid: ['Hard-coded labels: they come from the i18n strings'],
  },
} satisfies ComponentMeta;
