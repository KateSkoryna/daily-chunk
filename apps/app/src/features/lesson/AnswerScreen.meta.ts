import type { ComponentMeta } from '../../components/meta';

export const answerScreenMeta = {
  name: 'AnswerScreen',
  category: 'organism',
  description:
    'Task 4 of the lesson: a question in the target language, as in a dialog, and the answer built by tapping word tiles in order. Every tap is checked at once: the right next word goes into the answer line; a wrong tile gets a pink border and a cross and stays in the pool. After three wrong taps in a row the right tile is marked with a cyan border and a lamp. When every word is placed, the sentence and its translation appear with the next button.',
  spec: 'owner request 2026-11-25 (no screen design), DESIGN.md §9.3',
  props: {
    lessonNumber: 'The number of the lesson, shown in the header',
    xp: 'The XP earned so far in this lesson',
    question: 'The question to answer, in the target language',
    questionNumber: 'The number of the question on screen',
    questionCount: 'How many questions the task has',
    placed: 'The tiles in the answer line, in order; all of them are right',
    pool: 'The tiles that are not placed yet',
    wrongTileId: 'The pool tile that was just pressed by mistake, if any',
    hintTileId: 'The pool tile with the next right word, after three mistakes',
    rightAnswer: 'The answer sentence, shown when every word is placed',
    translation:
      'The answer in the native language, shown when every word is placed',
    isLast: 'True on the last question: the button leads to the next task',
    taskNames: 'The names of the six tasks, for the stepper',
    onTaskSelect: 'Called with the number of the task picked in the stepper',
    onTilePress: 'Called with the id of a pool tile that was pressed',
    onNext: 'Called by the next button once every word is placed',
    onBack: 'Called by the back button',
    onClose: 'Called by the quit button',
  },
  states: ['empty', 'half built', 'wrong word', 'hint', 'done', 'done, last'],
  relationships: {
    composedOf: [
      'Screen',
      'LessonHeader',
      'TopBar',
      'SectionLabel',
      'SentenceBuilder',
      'AnswerFeedback',
      'Notice',
      'Button',
    ],
    pairsWith: ['ReadQuizScreen', 'GapFillScreen'],
    usedIn: ['/lesson/answer'],
  },
  tokens: {
    color: ['border', 'card'],
    typography: ['reading', 'caption'],
    spacing: ['4', '2.5', '3.5'],
  },
  accessibility: [
    'The answer tiles are a named group and every tile is a button',
    'A wrong or hint tile says so in its name and shows an icon, not only a colour',
    'The feedback is a status message, so a screen reader announces it',
  ],
  aiHints: {
    useWhen: ['The route of task 4: answer a question by ordering words'],
    avoidWhen: ['Picking a missing word: that is GapFillScreen'],
    invalid: [
      'Revealing the right word before three mistakes in a row',
      'Hard-coded copy: it comes from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
