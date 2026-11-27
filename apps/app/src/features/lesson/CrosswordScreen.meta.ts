import type { ComponentMeta } from '../../components/meta';

export const crosswordScreenMeta = {
  name: 'CrosswordScreen',
  category: 'organism',
  description:
    'Task 2 of the lesson (web desktop: the grid and the task panel side by side, the share of the grid growing with its columns, half at 9 columns; the next button under them): find the lesson words in a crossword from a clue in the target language. Tapping a cell opens its word: a panel shows the clue, a line about the word and a lamp for the translation, and the letter keyboard replaces the next button. Every letter is checked at once; three wrong letters on a cell and Chunk fills it in. A link word joins the lesson words and does not count. When a word is solved the panel closes and the word is shown with its article; when all are solved the next button turns on.',
  spec: 'design/screens/Crossword.dc.html, CrosswordActive.dc.html; DESIGN.md §9.3',
  props: {
    lessonNumber: 'The number of the lesson, shown in the header',
    xp: 'The XP earned so far in this lesson',
    puzzle:
      'The crossword: grid size, words with their clues and translations, given cells',
    session:
      'Where the learner is: the open word, the letters, wrong tries, hints and solved words',
    keyboardRows: 'The letter rows of the target-language pack',
    targetLanguage: 'The target language, for the article of a solved word',
    taskNames: 'The names of the lesson tasks, for the stepper',
    onTaskSelect: 'Called with the number of the task picked in the stepper',
    onCellPress: 'Called with the key of a pressed cell',
    onKeyPress: 'Called with the letter of a pressed key',
    onHint: 'Called by the lamp: show the translation of the open word',
    onCloseClue: 'Called by the close button of the clue panel',
    onNext: 'Called by the next button once every word is solved',
    onBack: 'Called by the back button',
    onClose: 'Called by the quit button',
  },
  states: [
    'start',
    'word open',
    'link word open',
    'wrong letter',
    'letter filled in',
    'hint shown',
    'word solved',
    'all solved',
  ],
  relationships: {
    composedOf: [
      'Screen',
      'LessonHeader',
      'TopBar',
      'SectionLabel',
      'Crossword',
      'LetterKeyboard',
      'Noun',
      'Icon',
      'Button',
    ],
    pairsWith: ['FlashcardsScreen', 'ListenScreen'],
    usedIn: ['/lesson/crossword'],
  },
  tokens: {
    color: [
      'card',
      'border',
      'ring',
      'muted-foreground',
      'destructive',
      'success',
      'foreground',
    ],
    typography: ['label-sm', 'body', 'caption'],
    spacing: ['1', '2', '3'],
    other: ['touch'],
  },
  accessibility: [
    'The feedback line and the start or solved line are status messages, so a screen reader announces them',
    'A wrong letter shows a cross and says the letter in words, not only a pink border',
    'The lamp says whether the hint is used and is disabled after it',
    'The next button is disabled until every word is solved',
  ],
  aiHints: {
    useWhen: ['The route of task 2: the crossword'],
    avoidWhen: ['Picking a missing word in a sentence: that is GapFillScreen'],
    invalid: [
      'Counting a link word in the score',
      'Showing a translation before the lamp is pressed',
      'Hard-coded copy or keyboard letters: they come from i18n and the language pack',
    ],
  },
} satisfies ComponentMeta;
