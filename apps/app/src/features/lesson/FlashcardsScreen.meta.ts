import type { ComponentMeta } from '../../components/meta';

export const flashcardsScreenMeta = {
  name: 'FlashcardsScreen',
  category: 'organism',
  description:
    'Task 1 of the lesson: one word card at a time. Tap the card to flip it, listen to the word, then go to the next card, or back to the previous one. The screen owns neither the current card nor the flip: both come in as props.',
  spec: 'design/screens/Flashcards.dc.html (S3), plan.md §4',
  props: {
    lessonNumber: 'The number of the lesson, for the header',
    xp: 'The XP earned so far in this lesson',
    word: 'The word on the card',
    cardNumber: 'The position shown in the counter, counting from 1',
    cardTotal: 'How many words the lesson has, for the counter',
    isFirstCard:
      'Whether this is the first card; the previous button is disabled then',
    isFlipped: 'Whether the back (the example sentence) is shown',
    isTipOpen:
      'Whether the tip card of the word is open; the lamp shows only when the word has a tip',
    nativeLanguage: 'Which translation to show',
    onFlip: 'Called when the card is pressed',
    onTipToggle: 'Called by the lamp button: open or close the tip card',
    onListen: 'Called by the listen button',
    onCardSelect: 'Called with the card (from 1) whose dot was tapped',
    onPrevious: 'Called by the previous button',
    isLastCard: 'True on the last card; the next card button is disabled',
    onNextSection:
      'Called by the primary button: finish the cards and go to the next section',
    onNext: 'Called by the next card button',
    taskNames:
      'The names of the six tasks, already translated, for the stepper buttons',
    onTaskSelect:
      'Called with the task (from 1) whose stepper segment was tapped',
    onBack: 'Called by the back button: the list of lesson tasks',
    onClose: 'Called by the quit button',
  },
  states: [
    'word side',
    'sentence side',
    'word without an article',
    'word with a tip',
    'tip open',
  ],
  relationships: {
    composedOf: [
      'Screen',
      'LessonHeader',
      'WordCard',
      'TipButton',
      'TipCard',
      'Icon',
      'ArticleChip',
      'PartOfSpeechChip',
      'Button',
    ],
    pairsWith: ['ListenScreen'],
    usedIn: ['/lesson/flashcards'],
  },
  tokens: {
    color: ['gender-plural', 'muted-foreground'],
    typography: ['word-xl', 'word-l', 'reading', 'body', 'caption'],
    spacing: ['4', '3', '2'],
    other: ['flashcard', 'button'],
  },
  accessibility: [
    'The card is one button that flips it; both sides are text',
    'The quit button has an accessible name from i18n',
    'The article or part of speech is written in the tag, not only shown by colour',
  ],
  aiHints: {
    useWhen: [
      'The route of task 1, with the words and position from the lesson state',
    ],
    avoidWhen: ['Reviewing words outside a lesson: use the Review screen'],
    invalid: [
      'A second primary button on the screen',
      'Hard-coded copy: it comes from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
