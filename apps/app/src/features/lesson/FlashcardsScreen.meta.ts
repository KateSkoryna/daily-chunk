import type { ComponentMeta } from '../../components/meta';

export const flashcardsScreenMeta = {
  name: 'FlashcardsScreen',
  category: 'organism',
  description:
    'Task 1 of the lesson: one word card at a time. Tap the card to flip it, listen to the word, then say if you knew it or want to see it again. The screen owns neither the current card nor the flip: both come in as props.',
  spec: 'design/screens/Flashcards.dc.html (S3), plan.md §4',
  props: {
    lessonNumber: 'The number of the lesson, for the header',
    xp: 'The XP earned so far in this lesson',
    cards: 'The words of the lesson, in order',
    cardIndex: 'Which word is shown, counting from 0',
    isFlipped: 'Whether the back (the example sentence) is shown',
    nativeLanguage: 'Which translation to show',
    onFlip: 'Called when the card is pressed',
    onListen: 'Called by the listen button',
    onAgain: 'Called by the again button',
    onKnewIt: 'Called by the primary button',
    onClose: 'Called by the quit button',
  },
  states: ['word side', 'sentence side', 'word without an article'],
  relationships: {
    composedOf: [
      'Screen',
      'LessonHeader',
      'WordCard',
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
