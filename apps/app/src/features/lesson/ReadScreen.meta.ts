import type { ComponentMeta } from '../../components/meta';

export const readScreenMeta = {
  name: 'ReadScreen',
  category: 'organism',
  description:
    'Task 3 of the lesson: read a short story that uses the words of the lesson. The words are underlined in their gender colour; tapping one opens its card under the paragraph. A switch shows or hides the translation of each paragraph. The open card, the switch and the story come in as props.',
  spec: 'design/screens/Read.dc.html (S5), plan.md §4',
  props: {
    xp: 'The XP earned so far in this lesson',
    title: 'The title of the story',
    paragraphs: 'The paragraphs with their highlighted words and translations',
    words:
      'The words of the lesson, to find the gender and translation of a highlighted word',
    nativeLanguage: 'Which translation to show',
    showTranslation: 'Whether the translations are shown',
    activeWord: 'The word whose card is open, or none',
    onToggleTranslation: 'Called by the toggle',
    onWordPress: 'Called with the tapped word',
    onPlayWord: 'Called by the play button of the card',
    onBack: 'Called by the back button',
    onContinue: 'Called by the primary button',
  },
  states: ['default', 'translation shown', 'word card open'],
  relationships: {
    composedOf: [
      'Screen',
      'LessonHeader',
      'Toggle',
      'StoryText',
      'WordPopover',
      'Icon',
      'Button',
    ],
    pairsWith: ['ListenScreen', 'RecordScreen'],
    usedIn: ['/lesson/read'],
  },
  tokens: {
    color: ['foreground'],
    typography: ['display-num', 'body-sm', 'caption'],
    spacing: ['4', '2.5'],
  },
  accessibility: [
    'The switch says RU ON or RU OFF in words',
    'Underlined words are buttons; the card is a named group with a play button',
    'Meaning is never given by colour alone: the card writes the article',
  ],
  aiHints: {
    useWhen: ['The route of task 3, with the story from the lesson'],
    avoidWhen: ['Reading aloud: that is task 4'],
    invalid: [
      'A second primary button on the screen',
      'Hard-coded copy: it comes from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
