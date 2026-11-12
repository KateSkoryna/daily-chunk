import type { ComponentMeta } from '../meta';

export const articleChipMeta = {
  name: 'ArticleChip',
  category: 'atom',
  description:
    'Shows a noun’s grammatical gender as a small tag. The article word is always written; the colour only reinforces it. The plural is a dashed outline with its own label from the language pack.',
  spec: 'DESIGN.md §9.3, design/system/components/ArticleChip.md',
  props: {
    gender:
      'The gender role: masc, fem, neut or plural. The language pack turns it into the article word',
    targetLanguage:
      'The language being learned; its pack supplies the article words and the plural label',
    className: 'Extra classes; layout only',
  },
  variants: {
    tag: 'masc, fem and neut: filled with the gender colour, dark label',
    plural:
      'Transparent with a dashed outline and the plural colour, label from the pack',
  },
  states: ['default'],
  relationships: {
    usedIn: ['WordCard', 'WordBank rows', 'Confirm rows', 'Review'],
    alternatives: {
      ArticlePicker:
        'Asking the person to choose the gender is a picker, not a tag',
    },
  },
  tokens: {
    color: [
      'gender-masc',
      'gender-fem',
      'gender-neut',
      'gender-plural',
      'gender-foreground',
    ],
    typography: ['chip'],
  },
  accessibility: [
    'The article word is real text, so a screen reader reads it; colour is never the only carrier',
    'Not interactive: no role and no touch target',
  ],
  aiHints: {
    useWhen: [
      'Showing the gender of a noun next to the word, in lists, cards and notifications',
    ],
    avoidWhen: ['Letting the person choose a gender: use the ArticlePicker'],
    invalid: [
      'A hard-coded article word such as der, die or das: take it from the language pack',
      'A gender colour without the written article',
      'A filled chip for the plural: it is the dashed outline',
    ],
  },
} satisfies ComponentMeta;
