import type { ComponentMeta } from '../meta';

export const storyTextMeta = {
  name: 'StoryText',
  category: 'molecule',
  description:
    'A text of the target language in which chosen words are marked. With onWordPress the marked words are buttons (the Read screen opens a card for the word). Without it they are only marked (the Read aloud screen marks the words to retry in pink). A word with a gender role takes the colour of that role, with no underline. A word without one is underlined in grey, and a word to retry is pink and underlined; on the web the underline is set off from the word and is thicker on phone widths.',
  spec: 'DESIGN.md §9.3, design/screens/Read.dc.html, Record.dc.html',
  props: {
    text: 'The text',
    marks:
      'The words to mark and their tone: a gender role, none (grey) or retry (pink)',
    activeWord: 'The word whose card is open; it gets a dim fill',
    onWordPress: 'Called with the word; makes the marked words buttons',
    className: 'Extra classes; layout only',
  },
  states: ['plain', 'marked', 'pressable', 'active word'],
  relationships: {
    composedOf: ['Text'],
    pairsWith: ['WordPopover'],
    usedIn: ['Read', 'Read aloud'],
  },
  tokens: {
    color: [
      'gender-masc',
      'gender-fem',
      'gender-neut',
      'gender-plural',
      'muted-foreground',
      'highlight',
      'popover',
    ],
    typography: ['reading'],
  },
  accessibility: [
    'Pressable words are buttons inside the sentence; the sentence stays readable as one text',
    'The tone is only a colour: the card gives the article in writing',
  ],
  aiHints: {
    useWhen: [
      'Story or sentence text with words the person can open or must retry',
    ],
    avoidWhen: ['A single word with its article: use Noun'],
    invalid: [
      'A marked word that is not in the text (it is ignored)',
      'Hard-coded text: the story comes from the lesson data',
    ],
  },
} satisfies ComponentMeta;
