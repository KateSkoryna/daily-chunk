import type { ComponentMeta } from '../meta';

export const nounMeta = {
  name: 'Noun',
  category: 'atom',
  description:
    'A noun written with its article, the article in the gender colour and the noun in the normal text colour. The article word comes from the language pack, so the gender colour always sits next to the written article.',
  spec: 'DESIGN.md §1 rule 5, §4.2 gender tokens',
  props: {
    gender: 'The gender role: masc, fem, neut or plural',
    targetLanguage:
      'The language being learned; its pack supplies the article word',
    variant:
      'The text style of the whole word; defaults to the flashcard word size',
    children: 'The noun itself, without its article',
  },
  states: ['default'],
  relationships: {
    composedOf: ['Text'],
    usedIn: ['WordCard', 'WordBank rows', 'Review'],
    alternatives: {
      ArticleChip:
        'A separate tag for the gender, used in lists and notifications',
    },
  },
  tokens: {
    color: [
      'gender-masc',
      'gender-fem',
      'gender-neut',
      'gender-plural',
      'foreground',
    ],
    typography: ['word-xl', 'word-l'],
  },
  accessibility: [
    'One piece of text, so a screen reader reads the article and the noun together',
    'The gender is never carried by colour alone: the article word is written',
  ],
  aiHints: {
    useWhen: [
      'Showing a noun that has an article, where an extra chip would repeat the article',
    ],
    avoidWhen: [
      'Words without a gender, such as verbs and adjectives: use Text',
    ],
    invalid: [
      'Writing the article inside the children: it comes from the pack',
      'Colouring the whole noun: only the article takes the gender colour',
    ],
  },
} satisfies ComponentMeta;
