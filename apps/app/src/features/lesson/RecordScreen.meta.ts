import type { ComponentMeta } from '../../components/meta';

export const recordScreenMeta = {
  name: 'RecordScreen',
  category: 'organism',
  description:
    'Task 4 of the lesson: after reading the story aloud, shows the recording with its length, the score and a short verdict, the words to retry as chips, a pronunciation tip and Chunk’s comment. The result comes in as props.',
  spec: 'design/screens/Record.dc.html (S6), plan.md §4',
  props: {
    lessonNumber: 'The number of the lesson, for the header',
    xp: 'The XP earned so far in this lesson',
    storyText: 'The text that was read aloud',
    durationSeconds: 'The length of the recording',
    scorePercent: 'The pronunciation score',
    verdict: 'clear, almost or unclear: the words under the score',
    retryWords: 'The words to try again; they are marked in the text',
    pronunciationTip:
      'A tip for the first word to retry, already in the native language',
    onBack: 'Called by the back button',
    onPlayRecording: 'Called by the play button',
    onRetryWord: 'Called with the word of the chip',
    onRecordAgain: 'Called by the record again button',
    onContinue: 'Called by the primary button',
  },
  states: ['clear', 'unclear'],
  relationships: {
    composedOf: [
      'Screen',
      'LessonHeader',
      'StoryText',
      'RecordButton',
      'Chip',
      'SectionLabel',
      'TutorQuote',
      'Button',
    ],
    pairsWith: ['ReadScreen'],
    usedIn: ['/lesson/record'],
  },
  tokens: {
    color: ['success', 'destructive', 'border', 'card'],
    typography: ['display-num', 'ui', 'caption'],
    spacing: ['3.5', '5', '2'],
  },
  accessibility: [
    'The play button and every retry chip have names from i18n',
    'The verdict is written next to the score, not shown by colour alone',
    'The words to retry are underlined and also listed as chips',
  ],
  aiHints: {
    useWhen: ['The route of task 4, after the recording was scored'],
    avoidWhen: ['Showing a score outside a lesson: use a StatTile'],
    invalid: [
      'A second primary button on the screen',
      'Hard-coded copy: it comes from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
