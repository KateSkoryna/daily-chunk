import type { ComponentMeta } from '../meta';

export const wordFieldsMeta = {
  name: 'WordFields',
  category: 'organism',
  description:
    'A list of one-line fields, one word in each. It starts with a few empty fields and a button adds more up to a limit. A field fills the width of the list. A bordered cross button stands apart on its right, with a gap, when there is something to delete: it holds text, or it is one of the extra fields beyond the minimum. Empty required fields show no cross. The field gets narrower by the cross and its gap while the cross is there. The cross removes an extra field and only clears the text of a required one. Enter moves to the next field and adds one after the last. A pasted list (commas, semicolons, line breaks or spaces) is spread over the following fields, adding fields up to the limit. It is controlled: the screen owns the list of field texts.',
  spec: 'DESIGN.md §9.3, plan.md step 3.9c',
  props: {
    words:
      'The text of every field, in order; the length is the number of fields',
    minFields:
      'How many fields there are at least; below it the cross only clears the text',
    maxFields:
      'The most fields there can be; the add button is hidden at the limit',
    placeholder: 'Hint in the first field while it is empty, translated',
    onDictate:
      'Called with the index of the field whose dictate button was pressed',
    onChange: 'Called with the new list of field texts after every change',
    onWordsLeftOut:
      'Called with how many words of a pasted list did not fit under the limit',
  },
  states: ['empty', 'filled', 'more fields added', 'full'],
  relationships: {
    composedOf: ['TopBar', 'Button', 'Text'],
    pairsWith: ['SectionLabel', 'Notice', 'Button'],
    alternatives: {
      Textarea: 'Free text with lines, such as a sentence to translate',
    },
    usedIn: ['Home (add words)'],
  },
  tokens: {
    color: ['field', 'card', 'foreground', 'muted-foreground', 'input'],
    typography: ['body'],
    spacing: ['3', '2'],
    other: ['touch'],
  },
  accessibility: [
    'The fields are in a group named from i18n; every field is named Word and its number',
    'The cross is named Remove word and its number and is at least 3rem square',
    'The add button is a real button with a visible label',
    'The browser outline is off; the cyan border is the focus look',
  ],
  aiHints: {
    useWhen: ['Collecting a short list of single words, such as today’s words'],
    avoidWhen: [
      'A sentence or free text: use Textarea',
      'Picking from options: use OptionGrid',
    ],
    invalid: [
      'Keeping the texts inside the component: it is controlled',
      'Hard-coded text: labels and the placeholder come from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
