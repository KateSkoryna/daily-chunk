import type { ComponentMeta } from '../meta';

export const wordChipsInputMeta = {
  name: 'WordChipsInput',
  category: 'organism',
  description:
    'A field for a list of words. Each word is a chip with a cross; the text being typed follows the last chip. Enter, space or a comma turns the text into a chip, and a pasted list is split into chips. Tapping a chip takes it back into the text to edit, the cross removes it, and Backspace on empty text takes the last chip back. At the limit the text input goes away. It is controlled: the words and the draft come in as props and every change goes out through one callback. An optional trailing control sits in the bottom right corner.',
  spec: 'DESIGN.md §9.3, plan.md step 3.9c',
  props: {
    words: 'The words that are already chips, in order',
    draft: 'The text being typed after the last chip',
    maxWords: 'How many chips fit; the text input is hidden at the limit',
    placeholder: 'Hint shown while there are no chips and no text, translated',
    accessibilityLabel:
      'Names the text input for a screen reader (there is no visible label), from i18n',
    trailing:
      'A control in the bottom right corner, such as TopBar.Button with the mic icon',
    onChange: 'Called with the new words and the new draft after every change',
    onWordsLeftOut:
      'Called with how many words did not fit under the limit (for example from a pasted list), so the screen can say so',
  },
  states: ['empty', 'typing', 'with chips', 'full'],
  relationships: {
    composedOf: ['PressableFocus', 'Icon', 'Text'],
    pairsWith: ['SectionLabel', 'Notice', 'Button'],
    alternatives: {
      Textarea: 'Free text with lines, such as a sentence to translate',
    },
    usedIn: ['Home (add words)'],
  },
  tokens: {
    color: [
      'field',
      'card',
      'border',
      'popover',
      'foreground',
      'muted-foreground',
    ],
    typography: ['chip', 'body'],
    spacing: ['3', '2', '2.5', '16'],
    other: ['touch'],
  },
  accessibility: [
    'The text input has an accessibility label; the placeholder is not the label',
    'Every chip has two buttons named Edit and the word, and Remove and the word; each is at least 3rem high, the chip itself is drawn 2rem high',
    'The cross is an icon with a button label, never the only way to know what it does',
    'The browser outline is off; the cyan border is the focus look',
  ],
  aiHints: {
    useWhen: ['Collecting a short list of single words, such as today’s words'],
    avoidWhen: [
      'A sentence or free text: use Textarea',
      'Picking from options: use OptionGrid',
    ],
    invalid: [
      'Keeping the words in the field and not in the screen: it is controlled',
      'Hard-coded text: labels and the placeholder come from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
