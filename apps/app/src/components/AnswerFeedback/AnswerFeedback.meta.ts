import type { ComponentMeta } from '../meta';

export const answerFeedbackMeta = {
  name: 'AnswerFeedback',
  category: 'molecule',
  description:
    'The box under a checked typed answer. A label tab sits on its top border with an icon: a check on cyan for a right answer, a cross on pink for an answer that is almost right. The content (the corrected sentence, the explanation) comes in as children.',
  spec: 'DESIGN.md §9.3, design/screens/Translate.dc.html',
  props: {
    status: 'correct (cyan, check) or almost (pink, cross)',
    tabLabel: 'The words on the tab, already translated',
    children: 'The corrected sentence and the explanation',
  },
  variants: {
    correct: 'Cyan border and tab with a check',
    almost: 'Pink border and tab with a cross',
  },
  states: ['correct', 'almost'],
  relationships: {
    composedOf: ['Icon', 'Text'],
    pairsWith: ['CorrectionSentence', 'Textarea'],
    usedIn: ['Translate screen'],
    alternatives: {
      TutorQuote: 'Chunk’s own line is a tutor quote',
    },
  },
  tokens: {
    color: ['success', 'highlight', 'primary-foreground'],
    typography: ['label-sm'],
    spacing: ['1', '2', '2.5', '3', '3.5', '6'],
  },
  accessibility: [
    'role status, so a screen reader announces the result',
    'Right and almost are told by the icon and the words on the tab, not by colour alone',
  ],
  aiHints: {
    useWhen: ['Showing the result of a checked typed answer'],
    avoidWhen: ['Chunk speaks: use the TutorQuote'],
    invalid: ['A tab label that is not translated'],
  },
} satisfies ComponentMeta;
