import type { ComponentMeta } from '../meta';

export const pressableFocusMeta = {
  name: 'PressableFocus',
  category: 'atom',
  description:
    'Makes anything tappable: the minimum touch size and the focus ring when it has keyboard focus or is pressed. It is a component and not a CSS class because the ring must look the same on web and phones. On phones NativeWind ignores the outline classes (outline-2, outline-offset-2, outline-ring), and a border cannot leave the gap between control and ring that DESIGN.md asks for. So the ring is drawn as an extra view 0.25rem outside the control, shown while it is focused or pressed. Every control (Button, TabBar, ArticleChip, the gap-fill options) wraps itself in PressableFocus, so the ring is written once.',
  base: 'pressable',
  spec: 'DESIGN.md §7.1, §7.5',
  props: {
    className: 'Extra classes for the pressable; layout only',
    onPress: 'Called on press',
    onPressIn: 'Called when the press starts; the ring shows until it ends',
    onPressOut: 'Called when the press ends',
    disabled: 'Blocks the press; passed through to the pressable',
    accessibilityRole: 'The role of the control, for example button or link',
    accessibilityLabel: 'Required when the content is an icon only',
    children: 'The content of the control',
  },
  states: ['idle', 'focused', 'pressed'],
  relationships: {
    usedIn: ['Button', 'ArticleChip', 'TabBar'],
  },
  tokens: {
    color: ['ring'],
    spacing: ['1'],
    other: ['touch'],
  },
  accessibility: [
    'Pass accessibilityRole and accessibilityLabel; content that is only an icon needs a label',
    'The ring appears when the element has focus or is pressed, the same way for both, and the browser default outline is switched off',
  ],
  aiHints: {
    useWhen: ['Every interactive element'],
    avoidWhen: ['Content that is not interactive'],
    invalid: [
      'Removing or hiding the focus ring',
      'An interactive element smaller than the touch size',
    ],
  },
} satisfies ComponentMeta;
