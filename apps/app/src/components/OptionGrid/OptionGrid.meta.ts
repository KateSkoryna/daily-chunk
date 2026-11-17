import type { ComponentMeta } from '../meta';

export const optionGridMeta = {
  name: 'OptionGrid',
  category: 'molecule',
  description:
    'Lets the person pick one answer from a short list of words, in rows of 2 or 3. Once the right answer is known the grid is locked and shows the result: the right pick turns cyan with a check, a wrong pick turns pink with a cross and the right one is shown with a dashed cyan border.',
  spec: 'DESIGN.md §9.3, design/system/components/GapFill.md',
  props: {
    options: 'The answers, as the words to show',
    value: 'The chosen answer, or null before a choice',
    onSelect: 'Called with the answer the person pressed',
    correctAnswer:
      'The right answer. While it is missing the grid is open; once it is set the grid shows the result and is locked',
    columns: '2 or 3 options per row; 2 by default',
    accessibilityLabel: 'Names the group for a screen reader, from i18n',
  },
  states: ['idle', 'selected', 'correct', 'wrong', 'revealed'],
  relationships: {
    composedOf: ['PressableFocus', 'Text', 'Icon'],
    usedIn: ['GapFill'],
    alternatives: {
      ArticlePicker: 'Choosing a noun’s gender is an article picker',
      SentenceBuilder:
        'Building an answer from several words is a sentence builder',
    },
  },
  tokens: {
    color: ['muted', 'input', 'field', 'success', 'highlight', 'foreground'],
    typography: ['option'],
    spacing: ['1', '2'],
    other: ['control'],
  },
  accessibility: [
    'A radiogroup named from i18n; each option is a radio with its checked state',
    'Correct and wrong are shown by a check or cross icon with a translated name, a dashed border for the revealed answer, and colour; never colour alone',
    'Each option is at least 3.5rem high',
  ],
  aiHints: {
    useWhen: [
      'Picking one word or phrase from 2 to 4 answers, such as in gap fill',
    ],
    avoidWhen: [
      'Choosing the gender of a noun: use the ArticlePicker',
      'Picking from more than 6 answers',
    ],
    invalid: [
      'A correct answer that is not one of the options',
      'Hard-coded option text: it comes from the lesson data',
    ],
  },
} satisfies ComponentMeta;
