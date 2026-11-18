import type { ComponentMeta } from '../../components/meta';

export const translateScreenMeta = {
  name: 'TranslateScreen',
  category: 'organism',
  description:
    'Task 6 of the lesson: a sentence in the native language to write in German, the words to use as chips and a text box with a dictate button. After Check the result box shows a right answer or the answer with its fix and a short explanation; a fix offers Try again beside Next.',
  spec: 'design/screens/Translate.dc.html (S8), plan.md §4',
  props: {
    lessonNumber: 'The number of the lesson, for the header',
    xp: 'The XP earned so far in this lesson',
    nativeLanguage: 'The language of the prompt; part of the task name',
    targetLanguage: 'The language to write; part of the task name',
    prompt: 'The sentence to translate, in the native language',
    wordsToUse: 'The lesson words the answer should use',
    answer: 'The typed answer',
    feedback:
      'null before the check; then correct, or almost with the wrong word, the right word and the explanation',
    onAnswerChange: 'Called with the new text on every change',
    onDictate: 'Called by the dictate button',
    onBack: 'Called by the back button',
    onCheck: 'Called by the Check button',
    onTryAgain: 'Called by Try again',
    onContinue: 'Called by the Next button',
  },
  states: ['empty', 'typed', 'almost', 'correct'],
  relationships: {
    composedOf: [
      'Screen',
      'LessonHeader',
      'ArticleChip',
      'PartOfSpeechChip',
      'Textarea',
      'TopBar',
      'AnswerFeedback',
      'CorrectionSentence',
      'Button',
      'Icon',
      'Text',
    ],
    pairsWith: ['GapFillScreen'],
    usedIn: ['/lesson/translate'],
  },
  tokens: {
    color: ['border', 'card', 'muted-foreground'],
    typography: ['reading', 'ui', 'option', 'caption'],
    spacing: ['2', '3', '3.5'],
  },
  accessibility: [
    'The text box and the dictate button have names from i18n',
    'The result is announced as a status; the fix is told in words, not only shown by strike-through',
    'Check stays disabled while the answer is empty',
  ],
  aiHints: {
    useWhen: ['The route of task 6'],
    avoidWhen: ['Choosing from options: use the GapFillScreen'],
    invalid: [
      'A second primary button on the screen',
      'Hard-coded copy: it comes from the lesson data and i18n',
    ],
  },
} satisfies ComponentMeta;
