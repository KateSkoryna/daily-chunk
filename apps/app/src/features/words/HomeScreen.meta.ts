import type { ComponentMeta } from '../../components/meta';

export const homeScreenMeta = {
  name: 'HomeScreen',
  category: 'organism',
  description:
    'The first tab: add the words you met today. Shows the stats, Chunk’s line, the progress to the Boss round, a list of word fields (typed, pasted or by voice) and the button that checks them. The tab bar belongs to the navigation layout, not to the screen.',
  spec: 'design/screens/Main.dc.html (S1), plan.md §4',
  props: {
    xp: 'Total XP',
    streak: 'Days in a row',
    dueForReviewCount: 'Words due for review today',
    bossRound: 'Lessons done and lessons needed for the next Boss round',
    words:
      'The text of every word field, in order; the length is the number of fields',
    maxWords: 'How many words a lesson takes; the add button stops there',
    minimumWords:
      'How many words a lesson needs; below it the button is disabled',
    notice:
      'Optional message shown in a Notice under the field, for example that dictation is not available yet or that no words were recognised',
    onWordsChange: 'Called with the new list of field texts',
    onWordsLeftOut: 'Called with how many words did not fit under the limit',
    onOpenMenu: 'Called by the menu action (icon and the word Menu)',
    onOpenReview: 'Called by the due for review link',
    onOpenBossRound: 'Called by the Boss round progress',
    onCheckWords: 'Called by the primary button',
  },
  states: ['default', 'too few words', 'notice'],
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
      'WordFields',
      'Notice',
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
    'The menu, mic and primary buttons have names from i18n; the word field has a label',
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
