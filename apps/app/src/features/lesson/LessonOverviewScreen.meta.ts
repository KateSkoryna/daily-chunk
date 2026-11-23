import type { ComponentMeta } from '../../components/meta';

export const lessonOverviewScreenMeta = {
  name: 'LessonOverviewScreen',
  category: 'organism',
  description:
    'The list of the six lesson tasks, shown after the words are confirmed so the person sees what to expect. Each row names the task and says in one line what it is; a finished task shows a check and "Done". Tapping a row starts that task, so a lesson can begin anywhere. The primary button starts the first task that is not done.',
  spec: 'plan.md §4 (no screen design yet), DESIGN.md §9.3',
  props: {
    lessonNumber: 'The number shown in the title, for example Lesson 13',
    completedTasks: 'The tasks that already have a result',
    earnedXp:
      'The XP earned per finished task, shown at the right end of the title line in the phone app and on the right of the row on web',
    nativeLanguage: 'Used in the name of the last task, for example RU → DE',
    targetLanguage: 'Used in the name of the last task, for example RU → DE',
    onOpenTask: 'Called with the task whose row was tapped',
    onStart: 'Called by the primary button',
    onClose: 'Called by the quit button',
  },
  states: ['nothing done', 'some tasks done'],
  relationships: {
    composedOf: ['Screen', 'TopBar', 'GlitchTitle', 'ListGroup', 'Button'],
    pairsWith: ['ConfirmScreen', 'FlashcardsScreen'],
    usedIn: ['/lesson/overview'],
  },
  tokens: {
    color: ['success', 'border'],
    typography: ['option', 'body-sm', 'chip'],
    spacing: ['4'],
  },
  accessibility: [
    'Each row is a button read as the task name and its line',
    'A finished task is shown by the check and the word Done, not by colour alone',
  ],
  aiHints: {
    useWhen: ['Between confirming the words and the first task'],
    avoidWhen: ['Inside a task: use the LessonHeader stepper to jump'],
    invalid: [
      'Locking tasks: a lesson can start with any task',
      'Hard-coded copy: it comes from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
