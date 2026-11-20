import type { ComponentMeta } from '../../components/meta';

export const placeholderScreenMeta = {
  name: 'PlaceholderScreen',
  category: 'organism',
  description:
    'A stand-in for a screen that is built in a later step: a button in the top corner (menu, back or close), the screen title and one line saying it comes later. It lets every route of the navigation exist and be tested before its real screen does. Each real screen replaces it.',
  spec: 'plan.md step 3.1',
  props: {
    title: 'The screen name, already translated',
    buttonIcon: 'The icon of the top-corner button: menu, back or close',
    buttonLabel: 'Names the button for a screen reader, from i18n',
    onButtonPress: 'Called when the button is pressed',
  },
  states: ['default'],
  relationships: {
    composedOf: ['Screen', 'TopBar', 'GlitchTitle', 'Text'],
    usedIn: ['Routes whose screen is not built yet'],
  },
  tokens: {
    color: ['muted-foreground'],
    typography: ['display-l', 'body'],
    spacing: ['4', 'section'],
  },
  accessibility: [
    'The title is a heading; the corner button is named from i18n',
  ],
  aiHints: {
    useWhen: ['A route must exist before its screen is built'],
    avoidWhen: ['The real screen exists'],
    invalid: ['Hard-coded text'],
  },
} satisfies ComponentMeta;
