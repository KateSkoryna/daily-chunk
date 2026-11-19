import type { ComponentMeta } from '../../components/meta';

export const gapFillScreenMeta = {
  name: 'GapFillScreen',
  category: 'organism',
  description:
    'Task 5 of the lesson: two sentences with a blank. The first asks for the article form, the second for the word. The person picks one option for each and presses Check; then both blanks and all options show the result and the button becomes Next. The choices and the checked state belong to the screen that uses it.',
  spec: 'design/screens/GapFill.dc.html (S7), plan.md §4',
  props: {
    lessonNumber: 'The number of the lesson, for the header',
    xp: 'The XP earned so far in this lesson',
    article: 'The article exercise: sentence parts, answer, options, hint',
    word: 'The word exercise: sentence parts, answer, options, hint',
    articleChoice: 'The chosen option of the article exercise, or null',
    wordChoice: 'The chosen option of the word exercise, or null',
    isChecked: 'Whether the answers were checked; the result is shown',
    onArticleChoose: 'Called with the option picked in the article exercise',
    onWordChoose: 'Called with the option picked in the word exercise',
    onBack: 'Called by the back button',
    onCheck: 'Called by the Check button',
    onContinue: 'Called by the Next button',
  },
  states: ['open', 'checked'],
  relationships: {
    composedOf: [
      'Screen',
      'LessonHeader',
      'SectionLabel',
      'GapFill',
      'OptionGrid',
      'Button',
      'Icon',
      'Text',
    ],
    pairsWith: ['TranslateScreen'],
    usedIn: ['/lesson/gap-fill'],
  },
  tokens: {
    color: ['border'],
    spacing: ['2.5', '4'],
  },
  accessibility: [
    'Each option group has a translated name; the options are radios',
    'Right and wrong are told by icons and a dashed border, not by colour alone',
    'Check stays disabled until both blanks have an answer',
  ],
  aiHints: {
    useWhen: ['The route of task 5'],
    avoidWhen: ['A single gap outside a lesson: use GapFill'],
    invalid: [
      'A second primary button on the screen',
      'Hard-coded copy: it comes from the lesson data and i18n',
    ],
  },
} satisfies ComponentMeta;
