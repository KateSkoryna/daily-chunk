import type { ComponentMeta } from '../meta';

export const letterKeyboardMeta = {
  name: 'LetterKeyboard',
  category: 'molecule',
  description:
    'Typing single letters into the crossword. On the web it is a drawn keyboard: the rows come from the target-language pack (German: QWERTZ with Ü, Ö, Ä and ß), keys share the width of the row and are as tall as a touch target, a shorter row is centred. In the phone app it opens the phone keyboard instead (owner, 2026-11-27): a hidden one-letter field takes the focus, every typed letter is passed on in upper case, and closing the phone keyboard calls onDismiss.',
  spec: 'design/screens/CrosswordActive.dc.html; DESIGN.md §9.3',
  props: {
    rows: 'The letters of each row, from the target-language pack (keyboardRows)',
    label: 'The accessible name of the keyboard, already translated',
    onKeyPress: 'Called with the letter of the pressed key or the typed letter',
    onDismiss:
      'Called in the phone app when the phone keyboard is closed; the crossword closes the clue panel',
    className: 'Extra classes; layout only',
  },
  states: ['web keyboard', 'phone keyboard'],
  relationships: {
    composedOf: ['PressableFocus'],
    pairsWith: ['Crossword'],
    usedIn: ['CrosswordScreen'],
  },
  tokens: {
    color: ['input', 'card', 'foreground'],
    typography: ['chip'],
    spacing: ['1'],
    other: ['touch'],
  },
  accessibility: [
    'Web: a named group; every key is a button named by its letter',
    'Phone: the hidden field is named by label, so a screen reader announces it with the phone keyboard',
    'Keys are 3rem tall; on a phone they are narrower than 3rem, like a system keyboard (owner, 2026-11-27)',
  ],
  aiHints: {
    useWhen: ['Typing letters into the crossword'],
    avoidWhen: [
      'Typing words or sentences: use a text field and the system keyboard',
    ],
    invalid: [
      'Letters written in the component: the rows come from the target-language pack',
    ],
  },
} satisfies ComponentMeta;
