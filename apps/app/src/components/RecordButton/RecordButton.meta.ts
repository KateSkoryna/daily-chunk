import type { ComponentMeta } from '../meta';

export const recordButtonMeta = {
  name: 'RecordButton',
  category: 'atom',
  description:
    'The round button for read-aloud and shadowing. Idle: pink outline and a microphone. Recording: pink fill and a stop square. Done: cyan outline and a play triangle, to hear the recording. The timer and the score are text next to the button, not inside it. It is the only round control.',
  spec: 'DESIGN.md §9.3, design/system/components/RecordButton.md',
  props: {
    state: 'idle, recording or done',
    onPress:
      'Called when the button is pressed: start, stop or play, depending on the state',
    accessibilityLabel:
      'The text alternative for what a press does in this state, from i18n',
    size: 'default (5rem, read aloud) or small (4rem, shadowing)',
  },
  variants: {
    default: '5rem circle',
    small: '4rem circle',
  },
  states: ['idle', 'recording', 'done'],
  relationships: {
    composedOf: ['PressableFocus', 'Icon'],
    usedIn: ['Read aloud screen', 'Listen and shadow screen'],
    pairsWith: ['TutorQuote'],
  },
  tokens: {
    color: ['highlight', 'success', 'background', 'primary-foreground'],
    other: ['record', 'button', 'border-3'],
  },
  accessibility: [
    'A button whose name says what the press does now, such as start, stop or play the recording, from i18n',
    'The state is shown by the icon and the fill, not by colour alone',
    'Audio always has a text alternative: show the timer and the score as text next to the button',
  ],
  aiHints: {
    useWhen: ['Starting, stopping and replaying a voice recording'],
    avoidWhen: [
      'Any other action: use a Button',
      'Playing a model pronunciation: use a secondary Button with the speaker icon',
    ],
    invalid: [
      'A rounded button for anything but recording',
      'A hard-coded accessibility label: it comes from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
