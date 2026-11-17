import type { ComponentMeta } from '../meta';

export const listGroupMeta = {
  name: 'ListGroup',
  category: 'molecule',
  description:
    'A bordered group of rows. ListGroup draws the frame and the lines between rows; ListGroup.Row holds a left slot (a chip), the body and a right slot (a value, an icon). A row with onPress is a button (for example to edit a word).',
  spec: 'DESIGN.md §9.3, design/screens/Confirm.dc.html, Done.dc.html',
  props: {
    children: 'The rows (ListGroup.Row)',
    'Row left': 'Slot before the body, such as an ArticleChip',
    'Row right': 'Slot after the body, such as a value or an icon',
    'Row onPress': 'Makes the row a button',
    'Row accessibilityLabel':
      'Optional name of a pressable row; it must contain the row’s visible text, otherwise the name is the text of the row',
    'Row children': 'The body, usually Text',
  },
  states: ['default', 'pressable'],
  relationships: {
    composedOf: ['PressableFocus'],
    pairsWith: ['ArticleChip', 'Noun', 'Icon'],
    usedIn: ['Confirm', 'Lesson done', 'Word bank', 'Settings'],
  },
  tokens: {
    color: ['border', 'card'],
    spacing: ['3', '2.5'],
    other: ['touch'],
  },
  accessibility: [
    'The group is a list and every row is a list item',
    'A pressable row is a button named by its text (or by a label that contains that text); plain rows are only text',
  ],
  aiHints: {
    useWhen: ['Several rows of the same kind: words, settings, stats'],
    avoidWhen: [
      'A single card: use a bordered View',
      'Choosing one of a few: use OptionGrid',
    ],
    invalid: [
      'An accessibility label that does not contain the row’s visible text',
      'Hard-coded row text',
    ],
  },
} satisfies ComponentMeta;
