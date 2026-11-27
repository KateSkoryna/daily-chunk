import type { ComponentMeta } from '../../components/meta';

export const readQuizScreenMeta = {
  name: 'ReadQuizScreen',
  category: 'organism',
  description:
    'Task 3 of the lesson, second part: after reading the story, answer five questions about its details, one at a time, each with three short answers. After an answer the right one is shown and the next button appears; after the last one a notice tells the score and whether it counts toward the next level (80% or better).',
  spec: 'plan.md D20, D21',
  props: {
    lessonNumber: 'The number of the lesson, shown in the header',
    xp: 'The XP earned so far in this lesson',
    questions:
      'The questions with their options (already in the order to show) and the right answer',
    answers: 'The answer given to each question, or none yet',
    questionIndex: 'The question on screen',
    taskNames: 'The names of the seven tasks, for the stepper',
    onTaskSelect: 'Called with the number of the task picked in the stepper',
    onAnswer: 'Called with the option the person pressed',
    onNextQuestion: 'Called by the next-question button',
    onBack: 'Called by the back button',
    onClose: 'Called by the quit button',
    onContinue: 'Called by the next-section button after the last question',
  },
  states: [
    'question',
    'answered',
    'last answered, passed',
    'last answered, not passed',
  ],
  relationships: {
    composedOf: [
      'Screen',
      'LessonHeader',
      'TopBar',
      'SectionLabel',
      'OptionGrid',
      'Notice',
      'Button',
    ],
    pairsWith: ['ReadScreen'],
    usedIn: ['/lesson/read'],
  },
  tokens: {
    color: ['foreground'],
    typography: ['reading'],
    spacing: ['4', '2.5'],
  },
  accessibility: [
    'The answers are a named radio group; right and wrong are shown by an icon and colour, never colour alone',
    'The score notice is a polite status message',
  ],
  aiHints: {
    useWhen: ['The questions after the story of task 3'],
    avoidWhen: ['Showing the story: that is ReadScreen'],
    invalid: [
      'Answers that are whole sentences: they must stay short phrases',
      'Hard-coded copy: it comes from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
