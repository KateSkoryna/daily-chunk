import type { ComponentMeta } from '../../components/meta';

export const tabPlaceholderMeta = {
  name: 'TabPlaceholder',
  category: 'organism',
  description:
    'The stand-in for a main tab screen that is built in a later step: the tab title and a Menu action that opens the burger menu. It takes the title from i18n and the menu from the menu context, so each tab route file is one line. Each real tab screen replaces it.',
  spec: 'plan.md step 3.1',
  props: {
    titleKey:
      'The i18n key of the tab name: nav.home, nav.lessons, nav.score or nav.stats',
  },
  states: ['default'],
  relationships: {
    composedOf: ['PlaceholderScreen'],
    usedIn: ['The four routes in app/(tabs)'],
    alternatives: {
      PlaceholderScreen: 'A screen that is not a tab, with its own button',
    },
  },
  tokens: { color: [] },
  accessibility: ['The menu button is named from i18n'],
  aiHints: {
    useWhen: ['A main tab route exists before its screen is built'],
    avoidWhen: ['The real tab screen exists'],
    invalid: ['Hard-coded text'],
  },
} satisfies ComponentMeta;
