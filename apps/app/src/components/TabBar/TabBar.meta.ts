import type { ComponentMeta } from '../meta';

export const tabBarMeta = {
  name: 'TabBar',
  category: 'organism',
  description:
    'The main navigation at the bottom of a phone screen: four equal tabs with an icon and a label. The active tab is yellow with a 0.1875rem yellow bar that covers the purple line along the top of the bar, the others muted. It only draws and reports; the navigation shell (step 3.1) decides what a tab opens. The desktop rail comes in phase 6.',
  spec: 'DESIGN.md §9.3, design/system/components/TabBar.md',
  props: {
    tabs: 'The tabs: key, translated label, icon name, and an optional badge count',
    activeKey: 'The key of the active tab',
    onSelect: 'Called with the key of the tab that was pressed',
    accessibilityLabel: 'Names the navigation for a screen reader, from i18n',
    bottomInset:
      'The bottom safe-area inset of the device, in layout units, added under the tabs; 0 by default',
  },
  states: ['active', 'inactive'],
  relationships: {
    composedOf: ['PressableFocus', 'Icon', 'Text'],
    usedIn: ['Main screens'],
    alternatives: {
      Button: 'A single action is a button, not a tab',
    },
  },
  tokens: {
    color: [
      'background',
      'border',
      'primary',
      'muted-foreground',
      'highlight',
      'primary-foreground',
    ],
    typography: ['caption'],
    spacing: ['1'],
    other: ['tabbar', 'border-3'],
  },
  accessibility: [
    'A tablist named from i18n; each tab is a tab with its selected state',
    'The active tab is told by its yellow colour, the bar on its top edge and its selected state; every tab has a text label',
    'Each tab is at least 3.5rem high; the bar adds the bottom safe-area inset',
  ],
  aiHints: {
    useWhen: ['Switching between the 4 main sections of the app'],
    avoidWhen: [
      'Choosing an answer (OptionGrid)',
      'Switching a view inside a screen',
    ],
    invalid: [
      'More than 5 tabs',
      'A tab without a text label',
      'Hard-coded labels',
    ],
  },
} satisfies ComponentMeta;
