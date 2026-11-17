import type { ComponentMeta } from '../meta';

export const gapFillMeta = {
  name: 'GapFill',
  category: 'molecule',
  description:
    'A sentence with one blank, an optional hint in the native language, and a slot for the answer options. The blank shows the chosen answer; once the answer is checked its underline and text turn cyan when right and pink when wrong.',
  spec: 'DESIGN.md §9.3, design/system/components/GapFill.md',
  props: {
    before: 'The sentence up to the blank',
    after: 'The sentence after the blank',
    answer: 'The word in the blank, or null while nothing is chosen',
    status: 'open (default), correct or wrong',
    blankLabel: 'Name of an empty blank for a screen reader, from i18n',
    hint: 'The sentence in the native language, optional',
    children: 'The options, usually an OptionGrid',
  },
  variants: {
    open: 'Cyan underline: the answer is still being chosen',
    correct: 'Cyan underline and text',
    wrong: 'Pink underline and text',
  },
  states: ['empty', 'filled', 'correct', 'wrong'],
  relationships: {
    composedOf: ['Text'],
    pairsWith: ['OptionGrid', 'LessonStepper'],
    usedIn: ['Gap fill screen', 'Boss round'],
    alternatives: {
      SentenceBuilder:
        'Building a whole sentence from tiles is a sentence builder',
    },
  },
  tokens: {
    color: ['field', 'success', 'highlight', 'foreground'],
    typography: ['body', 'option', 'body-sm'],
    spacing: ['1', '3'],
    other: ['border-3'],
  },
  accessibility: [
    'The blank is one element named by the chosen word or by the translated blank label',
    'Right and wrong are also told by the checked options (icons and names), not by the blank’s colour alone',
  ],
  aiHints: {
    useWhen: ['A sentence where one word or form is missing'],
    avoidWhen: ['Several words are missing: use the SentenceBuilder'],
    invalid: [
      'More than one blank',
      'Hard-coded sentence text: it comes from the lesson data',
    ],
  },
} satisfies ComponentMeta;
