import type { ComponentMeta } from '../meta';

export const noticeMeta = {
  name: 'Notice',
  category: 'atom',
  description:
    'A short message in a dashed orange box, such as the one on Confirm that says a plural was saved as its singular. It is read out when it appears.',
  spec: 'DESIGN.md §9.3, design/screens/Confirm.dc.html',
  props: {
    children: 'The message, already translated, one or two short lines',
    className: 'Extra classes; layout only',
  },
  states: ['default'],
  relationships: {
    composedOf: ['Text'],
    pairsWith: ['ListGroup'],
    usedIn: ['Confirm'],
    alternatives: { TutorQuote: 'A line in Chunk’s voice is a TutorQuote' },
  },
  tokens: {
    color: ['gender-plural'],
    typography: ['label-sm'],
    spacing: ['3', '2.5'],
  },
  accessibility: [
    'A status message (role status, polite live region): a screen reader reads it when it appears',
    'The dashed outline and the words carry the meaning, not the colour alone',
  ],
  aiHints: {
    useWhen: [
      'Telling the person what the app did for them, in one short sentence',
    ],
    avoidWhen: [
      'Errors that block the person',
      'Chunk’s voice: use TutorQuote',
    ],
    invalid: ['A hard-coded message', 'More than two short lines'],
  },
} satisfies ComponentMeta;
