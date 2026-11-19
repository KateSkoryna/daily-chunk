import type { ComponentMeta } from '../../components/meta';

export const doneScreenMeta = {
  name: 'DoneScreen',
  category: 'organism',
  description:
    'The end of a lesson: Stage clear with three stat tiles (XP, streak, accuracy), Chunk’s comment, the words that were added to review with when they come back (a weak word comes back tomorrow marked in pink) and how far away the Boss round is. The primary button returns to Home; a quiet one replays the recording.',
  spec: 'design/screens/Done.dc.html (S9), plan.md §4',
  props: {
    lessonNumber: 'The number of the lesson that was finished',
    xp: 'The XP earned in this lesson',
    streakDays: 'The streak in days',
    accuracyPercent: 'The share of right answers',
    reviewWords: 'The lesson words, each marked weak or not',
    bossRound: 'How many lessons are done of the lessons needed',
    onBackToBase: 'Called by the primary button',
    onReplayRecording: 'Called by the replay button',
  },
  states: ['default'],
  relationships: {
    composedOf: [
      'Screen',
      'GlitchTitle',
      'StatTile',
      'TutorQuote',
      'SectionLabel',
      'ListGroup',
      'WordTag',
      'Button',
      'Text',
    ],
    pairsWith: ['TranslateScreen'],
    usedIn: ['/lesson/done'],
  },
  tokens: {
    color: ['ring', 'highlight'],
    typography: ['label', 'ui', 'option', 'caption'],
    spacing: ['2', '4', '14'],
  },
  accessibility: [
    'The weak word is told in words (Tomorrow · weak), not by colour alone',
    'The stat tiles read as their number and label',
  ],
  aiHints: {
    useWhen: ['The route after the last task of a lesson'],
    avoidWhen: ['A summary outside a lesson: use the Stats screen'],
    invalid: [
      'A second primary button on the screen',
      'Hard-coded copy: it comes from i18n and the lesson data',
    ],
  },
} satisfies ComponentMeta;
