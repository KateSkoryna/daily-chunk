import type { ComponentMeta } from '../meta';

export const articlePickerMeta = {
  name: 'ArticlePicker',
  category: 'molecule',
  description:
    'Lets the person choose the gender of a noun from the article words of the target language. Once the right answer is known the picker is locked and shows the result. Correct: the pick is filled with its article colour, has a cyan border and a check. Wrong: the pick gets a pink border and a cross, and the right chip is filled so the person sees the answer, without a check. In the story, set the correct answer in the controls to see both.',
  spec: 'DESIGN.md §9.3, design/system/components/ArticleChip.md',
  props: {
    targetLanguage: 'The language being learned; its pack lists the choices',
    value: 'The chosen gender, or null before a choice',
    onSelect: 'Called with the gender the person pressed',
    correctAnswer:
      'The right gender. While it is missing the picker is open; once it is set the picker shows the result and is locked',
    accessibilityLabel: 'Names the group for a screen reader, from i18n',
  },
  states: ['idle', 'selected', 'correct', 'wrong', 'revealed'],
  relationships: {
    composedOf: ['PressableFocus', 'Text', 'Icon'],
    usedIn: ['Review', 'Notifications quick answer'],
    alternatives: {
      ArticleChip: 'Only showing a gender is a tag, not a picker',
      Button: 'Starting or confirming an action is a button',
    },
  },
  tokens: {
    color: [
      'gender-masc',
      'gender-fem',
      'gender-neut',
      'gender-foreground',
      'muted',
      'input',
      'success',
      'highlight',
      'foreground',
    ],
    typography: ['chip'],
    other: ['touch'],
  },
  accessibility: [
    'A radio group; each choice is a radio with its checked state',
    'After answering the choices are disabled',
    'Correct and wrong carry the check or cross icon with a translated name, never colour alone',
    'Each choice is at least the touch size',
  ],
  aiHints: {
    useWhen: ['Asking which article or gender a noun has'],
    avoidWhen: ['Choosing between arbitrary options: use the option grid'],
    invalid: [
      'A plural choice: the picker lists only the genders of the pack',
      'Marking correct or wrong with colour alone',
      'Keeping the picker open after the answer is known',
    ],
  },
} satisfies ComponentMeta;
