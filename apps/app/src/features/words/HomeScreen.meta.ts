import type { ComponentMeta } from '../../components/meta';

export const homeScreenMeta = {
  name: 'HomeScreen',
  category: 'organism',
  description:
    'The first tab: add the words you met today. Shows the stats, Chunk’s line, the progress to the Boss round, a text area for the words (one per line, or by voice) and the button that checks them. The tab bar belongs to the navigation layout, not to the screen.',
  spec: 'design/screens/Main.dc.html (S1), plan.md §4',
  props: {
    xp: 'Total XP',
    streak: 'Days in a row',
    dueForReviewCount: 'Words due for review today',
    bossRound: 'Lessons done and lessons needed for the next Boss round',
    words: 'The text in the text area, one word per line',
    minimumWords:
      'How many words a lesson needs; below it the button is disabled',
    onWordsChange: 'Called with the new text',
    onDictate: 'Called by the mic button',
    onOpenMenu: 'Called by the menu button',
    onOpenReview: 'Called by the due for review link',
    onOpenBossRound: 'Called by the Boss round progress',
    onCheckWords: 'Called by the primary button',
  },
  states: ['default', 'too few words'],
  relationships: {
    composedOf: [
      'Screen',
      'TopBar',
      'LogoBadge',
      'HeaderStats',
      'GlitchTitle',
      'TutorQuote',
      'LessonStepper',
      'SectionLabel',
      'Textarea',
      'Button',
    ],
    pairsWith: ['TabBar', 'ConfirmScreen'],
    usedIn: ['/(tabs)/index'],
  },
  tokens: {
    color: ['ring'],
    typography: ['caption'],
    spacing: ['section', '2.5'],
  },
  accessibility: [
    'The menu, mic and primary buttons have names from i18n; the text area has a label',
    'The Boss round progress is one button named by its visible text (the lessons left and the count done)',
    'The primary button is disabled, not hidden, when there are fewer words than the minimum',
  ],
  aiHints: {
    useWhen: ['The route of the Home tab, with data from the store'],
    avoidWhen: ['Any other screen: build it from the same components'],
    invalid: [
      'A second primary button on the screen',
      'Hard-coded copy: it comes from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
