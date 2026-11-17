import type { ComponentMeta } from '../meta';

export const textareaMeta = {
  name: 'Textarea',
  category: 'molecule',
  description:
    'A multi-line text input with a cyan border (inputs are cyan). It is controlled. An optional trailing control, such as a dictate button, sits in its bottom right corner and the text keeps clear of it.',
  spec: 'DESIGN.md §9.2 (textarea), design/screens/Main.dc.html, Translate.dc.html',
  props: {
    value: 'The text',
    onChangeText: 'Called with the new text on every change',
    placeholder: 'Hint shown while empty, already translated',
    accessibilityLabel:
      'Names the field for a screen reader (there is no visible label), from i18n',
    trailing:
      'A control in the bottom right corner, such as TopBar.Button with the mic icon',
    className: 'Extra classes; layout only',
  },
  states: ['empty', 'filled', 'focused'],
  relationships: {
    pairsWith: ['SectionLabel', 'Button'],
    usedIn: ['Home (add words)', 'Translate (typed answer)'],
  },
  tokens: {
    color: ['field', 'card', 'foreground', 'muted-foreground'],
    typography: ['body'],
    spacing: ['3', '2.5', '16'],
  },
  accessibility: [
    'The field has an accessibility label; the placeholder is not the label',
    'The trailing control is its own button with its own label',
    'The browser outline is off; the cyan border is the focus look',
  ],
  aiHints: {
    useWhen: ['Typing several lines or a sentence'],
    avoidWhen: [
      'A single short value: use an input (later)',
      'Picking from options: use OptionGrid',
    ],
    invalid: [
      'No accessibility label',
      'A trailing control without its own label',
    ],
  },
} satisfies ComponentMeta;
