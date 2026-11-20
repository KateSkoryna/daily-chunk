import type { ComponentMeta } from '../../components/meta';

export const leaveLessonDialogMeta = {
  name: 'LeaveLessonDialog',
  category: 'organism',
  description:
    'The question that appears when someone goes back out of a lesson: leave and lose the progress of this lesson, or keep going. It owns no state; the lesson layout says when it is open and what leaving does.',
  spec: 'DESIGN.md §9.3 (alert-dialog), plan.md step 3.1',
  props: {
    isOpen: 'Whether the dialog is shown',
    onLeave: 'Called when "Leave" is pressed',
    onClose:
      'Called whenever the dialog closes, also right after "Leave"; it only hides the dialog',
  },
  states: ['closed', 'open'],
  relationships: {
    composedOf: ['AlertDialog', 'Button', 'Text'],
    usedIn: ['Lesson layout'],
    alternatives: {
      Drawer: 'A list of places to go, not a question',
    },
  },
  tokens: {
    color: [
      'popover',
      'border',
      'background',
      'muted-foreground',
      'destructive',
    ],
    typography: ['display-btn', 'body'],
    spacing: ['3', '4', 'gutter'],
    other: ['shadow-hard'],
  },
  accessibility: [
    'An alert dialog: focus moves into it, Escape closes it as "keep going", it has a title and a description',
    'The leave button is destructive; both buttons have text labels',
  ],
  aiHints: {
    useWhen: ['Going back out of a lesson that is not finished'],
    avoidWhen: ['The Done screen, where nothing is lost'],
    invalid: ['Hard-coded text'],
  },
} satisfies ComponentMeta;
