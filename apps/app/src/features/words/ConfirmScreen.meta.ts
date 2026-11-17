import type { ComponentMeta } from '../../components/meta';

export const confirmScreenMeta = {
  name: 'ConfirmScreen',
  category: 'organism',
  description:
    'Shows the words the app understood from what was typed: the article (or the part of speech), the dictionary form, the plural and the translation in the native language. A row is a button to edit that word. A dashed notice says when a plural was saved as its singular.',
  spec: 'design/screens/Confirm.dc.html (S2), plan.md §4',
  props: {
    words: 'The normalised words',
    nativeLanguage: 'Which translation to show',
    pluralInput:
      'The plural the person typed and the word it was saved as; omitted when nothing was normalised',
    onBack: 'Called by the back button',
    onEditWord: 'Called with the id of the tapped word',
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
      'ArticleChip',
      'PartOfSpeechChip',
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
    'Each row is a button named by its text; the pencil icon is decorative',
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
