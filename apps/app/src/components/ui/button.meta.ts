import type { ComponentMeta } from '../meta';

export const buttonMeta = {
  name: 'Button',
  category: 'atom',
  description:
    'Triggers an action. The default variant is the one primary action of a screen and is the only one with a hard shadow; while it is pressed it moves down and right and loses the shadow. A disabled button of any variant has the same grey fill and muted label.',
  base: 'button',
  spec: 'DESIGN.md §9.1, design/system/components/Button.md',
  props: {
    variant: 'Visual weight of the action, see variants',
    disabled:
      'Blocks the action until the screen is ready, for example fewer than 3 words added; every variant turns grey',
    onPress: 'Called on press',
    className: 'Extra classes for the pressable; layout only',
    accessibilityLabel: 'Required when the content is an icon only',
    children: 'The label as a Text, or an Icon followed by a Text',
  },
  variants: {
    default:
      'The single primary action of the screen: start lesson, check my words, next card',
    secondary: 'An action next to or below the primary: listen, knew it',
    ghost: 'A low-priority action: skip, show hint',
    destructive: 'Confirms losing data; only inside an alert dialog',
  },
  states: ['idle', 'pressed', 'focused', 'disabled'],
  relationships: {
    composedOf: ['Text', 'Icon', 'HardShadow', 'PressableFocus'],
    usedIn: ['Screen footer', 'AlertDialog', 'WordCard', 'GapFill'],
    pairsWith: ['TextClassContext'],
    alternatives: {
      ArticleChip: 'Choosing a gender role is a picker, not a button',
      'ToggleGroup item': 'Choosing one option from a set',
    },
  },
  tokens: {
    color: [
      'primary',
      'primary-foreground',
      'ring',
      'destructive',
      'destructive-foreground',
      'muted-foreground',
      'popover',
      'shadow',
    ],
    typography: ['display-btn', 'display-btn-sm', 'label'],
    other: ['button', 'control', 'touch', 'button-max', 'shadow-hard'],
  },
  accessibility: [
    'accessibilityRole is button',
    'accessibilityState.disabled is set when disabled',
    'An icon-only button needs an accessibilityLabel from i18n',
    'The height is never below the touch size',
  ],
  aiHints: {
    useWhen: ['The user starts, confirms or moves to the next step'],
    avoidWhen: [
      'Navigating between tabs: use the TabBar',
      'Picking an answer option: use the ToggleGroup or the ArticleChip',
    ],
    invalid: [
      'Two default buttons on one screen',
      'destructive outside an alert dialog',
      'A label in a content font: buttons use the display font',
      'A text colour on the label: the variant sets it',
    ],
  },
} satisfies ComponentMeta;
