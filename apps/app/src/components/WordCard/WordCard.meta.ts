import type { ComponentMeta } from '../meta';

export const wordCardMeta = {
  name: 'WordCard',
  category: 'organism',
  description:
    'The flashcard. A tappable card with a front and a back that turns over when pressed (both sides are drawn back to back and one animated value turns them, so pressing again mid-turn simply reverses it). The faces are slots, so the screen decides what each side shows (a noun with its coloured article, a verb with its forms). The card only knows which side is shown and when it was pressed: it is controlled. Under reduced motion the sides swap at once.',
  spec: 'DESIGN.md §9.3, design/system/components/WordCard.md',
  props: {
    isFlipped: 'Whether the back is shown',
    onFlip: 'Called when the card is pressed; the screen changes isFlipped',
    front: 'The content of the front face, above the hint line',
    back: 'The content of the back face, above the hint line',
  },
  states: ['front', 'back'],
  relationships: {
    composedOf: ['HardShadow', 'PressableFocus', 'Text'],
    pairsWith: ['Noun', 'Button'],
    usedIn: ['Flashcards screen', 'Review'],
  },
  tokens: {
    color: ['card', 'popover', 'border', 'shadow', 'muted-foreground'],
    typography: ['caption'],
    other: ['touch', 'shadow-hard', 'duration-flip'],
  },
  accessibility: [
    'A button named by the text of the side that is shown; the hidden side is hidden from screen readers. Phones also read a translated hint that it flips the card (the web drops the hint, but the visible hint line says the same)',
    'Reduced motion: no turn, the sides swap at once',
    'The hint line says "Tap to flip" or "Tap to flip back", never only an icon',
  ],
  aiHints: {
    useWhen: ['Showing a word that is turned over to reveal its details'],
    avoidWhen: ['A card that does not flip: use a plain card surface'],
    invalid: [
      'Keeping the flipped state inside the screen layout instead of passing isFlipped',
      'Animating the flip when reduced motion is on',
      'Putting a second primary action inside the card: the whole card is the button',
    ],
  },
} satisfies ComponentMeta;
