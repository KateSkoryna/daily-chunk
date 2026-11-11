import type { ComponentMeta } from '../meta';

export const textMeta = {
  name: 'Text',
  category: 'atom',
  description:
    'The only way to show text: one variant sets font family, size, line height and default colour.',
  base: 'text',
  spec: 'DESIGN.md §5',
  props: {
    variant: 'The type-scale style of the text; defaults to body',
    className:
      'Extra classes merged last; layout only, never font or colour pairs',
    children: 'The text to show',
  },
  variants: {
    'display-xl': 'Home title',
    'display-l': 'Section and lesson titles',
    'display-num': 'XP, streak and score numbers',
    'display-btn': 'Primary button label',
    'display-btn-sm': 'Secondary button label',
    label: 'Section labels and top bar',
    'label-sm': 'Stepper label and tutor tab',
    ui: 'UI copy and tab labels',
    caption: 'Hints and metadata',
    'word-xl': 'Flashcard front',
    'word-l': 'Word in lists and plural form',
    option: 'Gap-fill options',
    chip: 'Article chip',
    reading: 'Story text',
    body: 'Sentences and translations',
    'body-sm': 'Translation under a word',
  },
  states: ['default'],
  relationships: {
    usedIn: [
      'Button',
      'ArticleChip',
      'WordCard',
      'LessonStepper',
      'TutorQuote',
      'GapFill',
      'TopBar',
      'SectionLabel',
      'StatTile',
      'TabBar',
    ],
    pairsWith: ['TextClassContext'],
  },
  tokens: {
    color: ['foreground', 'primary', 'highlight', 'muted-foreground'],
    typography: [
      'display-xl',
      'display-l',
      'display-num',
      'display-btn',
      'display-btn-sm',
      'label',
      'label-sm',
      'ui',
      'caption',
      'word-xl',
      'word-l',
      'option',
      'chip',
      'reading',
      'body',
      'body-sm',
    ],
  },
  accessibility: [
    'Renders a native text element with no role or label of its own',
    'For a heading, pass role and aria-level to the element',
  ],
  aiHints: {
    useWhen: [
      'Any visible text: titles, labels, German words, sentences, hints',
    ],
    avoidWhen: [
      'Text inside a Button or Badge: the parent sets its text style through TextClassContext',
    ],
    invalid: [
      'Raw text-* and font-* class pairs in a screen',
      'font-content together with font-semibold',
    ],
  },
} satisfies ComponentMeta;
