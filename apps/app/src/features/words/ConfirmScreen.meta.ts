import type { ComponentMeta } from '../../components/meta';

export const confirmScreenMeta = {
  name: 'ConfirmScreen',
  category: 'organism',
  description:
    'Shows the words the app understood from what was typed: the article (or the part of speech), the dictionary form, the plural and the translation in the native language. The word count sits on the right of the intro line, above the list. The rows are read only: the words are not edited here. A dashed notice says when a plural was saved as its singular.',
  spec: 'design/screens/Confirm.dc.html (S2), plan.md §4',
  props: {
    words: 'The normalised words',
    nativeLanguage: 'Which translation to show',
    pluralInput:
      'The plural the person typed and the word it was saved as; omitted when nothing was normalised',
    onBack: 'Called by the back button',
    onStartLesson: 'Called by the primary button',
    onAddMore: 'Called by the add more words button',
  },
  states: ['default', 'single word'],
  relationships: {
    composedOf: [
      'Screen',
      'TopBar',
      'GlitchTitle',
      'ListGroup',
      'WordTag',
      'Notice',
      'Button',
    ],
    pairsWith: ['HomeScreen'],
    usedIn: ['/confirm'],
  },
  tokens: {
    color: ['ring', 'foreground'],
    typography: ['word-l', 'body-sm', 'caption'],
    spacing: ['4', '3', '14'],
  },
  accessibility: [
    'Each row is a list item read as its text',
    'The gender or part of speech is written in the tag, never shown by colour alone',
  ],
  aiHints: {
    useWhen: [
      'The route after the words were normalised, before the lesson starts',
    ],
    avoidWhen: ['Showing words outside the flow: use ListGroup directly'],
    invalid: [
      'A gender role for a word that is not a noun',
      'Hard-coded copy: it comes from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
