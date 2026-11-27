import type { ComponentMeta } from '../meta';

export const drawerMeta = {
  name: 'Drawer',
  category: 'organism',
  description:
    'The burger menu: a panel that covers the left four fifths of the screen (at most 20rem) over a dimmed scrim. It has the logo and the app name, a close button and a list of items. Pressing the scrim, the close button, or Escape or the back button closes it. It owns no state: the layout that holds it says when it is open.',
  spec: 'DESIGN.md §9.3, design/screens/Menu.dc.html',
  props: {
    isOpen: 'Whether the drawer is shown',
    onClose:
      'Called when the scrim, the close button, Escape or back is pressed',
    title: 'The app name, already translated',
    closeLabel: 'Names the close controls for a screen reader, from i18n',
    accessibilityLabel: 'Names the navigation for a screen reader, from i18n',
    children: 'The items, as Drawer.Item',
  },
  states: ['closed', 'open'],
  relationships: {
    composedOf: [
      'HardShadow',
      'LogoBadge',
      'TopBar',
      'PressableFocus',
      'Icon',
      'Text',
    ],
    usedIn: ['Main screens'],
    alternatives: {
      TabBar: 'The four main sections are always visible in the tab bar',
      AlertDialog: 'A question that needs an answer before going on',
    },
  },
  tokens: {
    color: [
      'background',
      'popover',
      'primary',
      'border',
      'highlight',
      'primary-foreground',
      'ring',
    ],
    typography: ['display-btn-sm', 'label', 'caption'],
    spacing: ['2', '5', '6', 'screen-top'],
    other: ['touch', 'shadow-hard', 'safe-area'],
  },
  accessibility: [
    'A navigation named from i18n; the items are links in a list',
    'The scrim and the close button both close it and are named from i18n',
    'Escape and the Android back button close it',
    'Every item has a text label',
  ],
  aiHints: {
    useWhen: [
      'The secondary destinations: account, review, word bank, settings',
    ],
    avoidWhen: [
      'The four main sections (TabBar)',
      'Confirming an action (AlertDialog)',
    ],
    invalid: ['An item without a text label', 'Hard-coded labels'],
  },
} satisfies ComponentMeta;
