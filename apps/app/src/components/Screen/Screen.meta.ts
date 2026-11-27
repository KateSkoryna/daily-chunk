import type { ComponentMeta } from '../meta';

export const screenMeta = {
  name: 'Screen',
  category: 'molecule',
  description:
    'The ground of a page: background, scanlines and the screen padding. On a phone it keeps the content clear of the status bar and, unless a tab bar owns the bottom (ScreenEdgesContext), of the navigation bar, using the real safe-area insets of the phone. The content scrolls when it is taller than the screen, and it moves up out of the way of the phone keyboard, frame by frame as the keyboard slides in (react-native-keyboard-controller; owner, 2026-11-27).',
  spec: 'DESIGN.md §6, §7.6, §8',
  props: {
    className: 'Extra classes for the content area; layout only',
    children: 'The content of the screen',
  },
  states: ['default'],
  relationships: {
    composedOf: ['Scanlines'],
    usedIn: ['Every screen'],
  },
  tokens: {
    color: ['background'],
    spacing: [
      'gutter',
      'screen-top',
      'screen-bottom',
      'gutter-tablet',
      'gutter-desktop',
      '16',
    ],
    other: ['safe-area'],
  },
  accessibility: [
    'A plain container with no role of its own',
    'Taps on buttons still work while the keyboard is open',
  ],
  aiHints: {
    useWhen: ['As the root of every screen'],
    avoidWhen: [
      'Inside another Screen or on a card: the scanlines go once per screen',
    ],
    invalid: ['Screen padding or scanlines written by hand in a screen'],
  },
} satisfies ComponentMeta;
