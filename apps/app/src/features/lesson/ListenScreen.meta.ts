import type { ComponentMeta } from '../../components/meta';

export const listenScreenMeta = {
  name: 'ListenScreen',
  category: 'organism',
  description:
    'Task 2 of the lesson: hear a phrase with the word of the lesson, then repeat it aloud. Shows the phrase with the word underlined in its gender colour, its translation, the waveform of the audio and the controls: speed, play or pause, record. The screen owns no playback state: it comes in as props.',
  spec: 'design/screens/Listen.dc.html (S4), plan.md §4',
  props: {
    lessonNumber: 'The number of the lesson, for the header',
    xp: 'The XP earned so far in this lesson',
    word: 'The word the phrase is about',
    highlightedWord: 'The part of the sentence that is underlined',
    nativeLanguage: 'Which translation to show',
    step: 'The part of the task: 1 listen, 2 repeat',
    playback:
      'The bars, the seconds played, the length, the speed and whether it is playing',
    recordState: 'What the record button shows',
    phrase: 'The number of this phrase and how many there are',
    repeat: 'The number of this repeat and how many there are',
    onBack: 'Called by the back button',
    onTogglePlay: 'Called by the play or pause button',
    onSpeedPress: 'Called by the speed button',
    onRecord: 'Called by the record button',
    onNextPhrase: 'Called by the primary button',
  },
  states: ['listen', 'repeat'],
  relationships: {
    composedOf: [
      'Screen',
      'LessonHeader',
      'StepIndicator',
      'Waveform',
      'PlaybackControls',
      'ArticleChip',
      'PartOfSpeechChip',
      'Icon',
      'Button',
    ],
    pairsWith: ['FlashcardsScreen'],
    usedIn: ['/lesson/listen'],
  },
  tokens: {
    color: [
      'card',
      'border',
      'gender-masc',
      'gender-fem',
      'gender-neut',
      'gender-plural',
    ],
    typography: ['word-l', 'reading', 'body-sm', 'caption'],
    spacing: ['4', '3.5', '2.5', '5'],
  },
  accessibility: [
    'The waveform is an image whose text says the seconds played and the length',
    'The record, play and speed buttons are named; the record state is shown by its icon, not only by colour',
    'The underlined word is also part of the readable sentence',
  ],
  aiHints: {
    useWhen: [
      'The route of task 2, with the phrase and the audio state from the lesson',
    ],
    avoidWhen: ['Reading the whole story aloud: that is task 4'],
    invalid: [
      'A second primary button on the screen',
      'Hard-coded copy: it comes from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
