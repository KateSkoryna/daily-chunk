import type { ComponentMeta } from '../../components/meta';

export const readScreenMeta = {
  name: 'ReadScreen',
  category: 'organism',
  description:
    'Task 3 of the lesson: read a short story that uses the words of the lesson. The words are coloured by their gender role (grey when they have none); tapping one opens its card as a small popup right under the word. The text is one piece. A listen button reads it aloud and a translation button (book icon) shows or hides its translation. The open card and the story come in as props.',
  spec: 'design/screens/Read.dc.html (S5), plan.md §4',
  props: {
    lessonNumber: 'The number of the lesson, shown in the header',
    xp: 'The XP earned so far in this lesson',
    text: 'The story as one text',
    highlightedWords: 'The lesson words to underline in the text',
    translation: 'The whole text in the native language, shown on request',
    isTranslationShown: 'Whether the translation is shown under the text',
    words:
      'The words of the lesson, to find the gender and translation of a highlighted word',
    nativeLanguage: 'The language of the word card translation',
    activeWord: 'The word whose card is open, or none',
    taskNames: 'The names of the seven tasks, for the stepper',
    onTaskSelect: 'Called with the number of the task picked in the stepper',
    onWordPress: 'Called with the tapped word',
    onTranslationToggle: 'Called by the show or hide translation button',
    isListening: 'Whether the voice is reading the text aloud',
    onPlayText:
      'Called by the listen button, to start or stop reading the whole text',
    onPlayWord: 'Called by the play button of the card',
    onBack: 'Called by the back button',
    onClose: 'Called by the quit button',
    onStartQuiz: 'Called by the primary button, which starts the quiz',
  },
  states: ['default', 'word card open', 'translation shown'],
  relationships: {
    composedOf: [
      'Screen',
      'LessonHeader',
      'TopBar',
      'StoryText',
      'WordPopover',
      'Button',
      'ListenButton',
      'Icon',
    ],
    pairsWith: ['ListenScreen', 'ReadQuizScreen'],
    usedIn: ['/lesson/read'],
  },
  tokens: {
    color: ['foreground'],
    typography: ['reading', 'caption'],
    spacing: ['4', '2.5'],
  },
  accessibility: [
    'Underlined words are buttons; the card is a named group with a play button',
    'Meaning is never given by colour alone: the card writes the article',
  ],
  aiHints: {
    useWhen: ['The route of task 3, with the story from the lesson'],
    avoidWhen: [
      'The quiz questions: that is ReadQuizScreen',
      'Reading aloud: that is task 4',
    ],
    invalid: [
      'A second primary button on the screen',
      'Hard-coded copy: it comes from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
