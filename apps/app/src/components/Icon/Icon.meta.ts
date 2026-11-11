import type { ComponentMeta } from '../meta';

export const iconMeta = {
  name: 'Icon',
  category: 'atom',
  description:
    'One of the app icons, drawn as a stroke or a filled shape in the colour of the text around it.',
  spec: 'DESIGN.md §12',
  props: {
    name: 'Which icon to draw, from the typed list of icon names',
    label: 'The accessible name; required unless the icon is decorative',
    decorative:
      'Marks an icon that sits next to text and needs no name of its own',
    className:
      'Extra classes, for example the colour from the text token of the context',
  },
  variants: {
    stroke: 'Every icon except play and pause',
    filled: 'Play and pause only',
  },
  states: ['default'],
  relationships: {
    usedIn: ['Button', 'TabBar', 'TopBar', 'RecordButton', 'ArticleChip'],
    pairsWith: ['TextClassContext', 'PressableFocus'],
  },
  tokens: {
    color: ['ring', 'muted-foreground', 'success', 'highlight'],
    spacing: ['6'],
  },
  accessibility: [
    'An icon on its own needs a label; the types require either label or decorative',
    'An icon next to text is decorative and hidden from screen readers',
    'Correct and wrong carry the check or cross icon, never colour alone',
  ],
  aiHints: {
    useWhen: [
      'Any icon in the app: the set is fixed, add a new icon to the shared list instead of drawing one inline',
    ],
    avoidWhen: ['Emoji or text characters in place of an icon'],
    invalid: [
      'An icon on its own without a label',
      'A hard-coded colour: the icon takes the colour of the text around it',
      'A fill on any icon except play and pause',
    ],
  },
} satisfies ComponentMeta;
