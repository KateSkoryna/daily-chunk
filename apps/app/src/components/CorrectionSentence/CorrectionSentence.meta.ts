import type { ComponentMeta } from '../meta';

export const correctionSentenceMeta = {
  name: 'CorrectionSentence',
  category: 'atom',
  description:
    'The answer with its fix: the wrong word is struck through in pink and the right word follows it in cyan, underlined and bold. The rest of the sentence is plain.',
  spec: 'DESIGN.md §9.3, design/screens/Translate.dc.html',
  props: {
    before: 'The sentence up to the wrong word',
    wrongWord: 'The word that was wrong',
    rightWord: 'The word that replaces it',
    after: 'The sentence after the wrong word',
    accessibilityLabel:
      'The corrected sentence and the change in words, from i18n; a strike-through cannot be heard',
  },
  states: ['default'],
  relationships: {
    composedOf: ['Text'],
    pairsWith: ['AnswerFeedback'],
    usedIn: ['Translate screen'],
  },
  tokens: {
    color: ['highlight', 'success'],
    typography: ['body'],
  },
  accessibility: [
    'One label that gives the corrected sentence and says what changed',
    'The fix is shown by a strike-through and an underline, not by colour alone',
  ],
  aiHints: {
    useWhen: ['Showing one wrong word and its replacement in a sentence'],
    avoidWhen: ['Several fixes in one sentence: needs a new component'],
    invalid: ['A fix that is not a whole word'],
  },
} satisfies ComponentMeta;
