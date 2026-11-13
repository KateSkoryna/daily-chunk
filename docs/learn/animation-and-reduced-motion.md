# Animation and reduced motion

## What it is

`WordCard` turns over when pressed: a `rotateY` turn that takes `duration-flip` (500ms, slowed down from 280ms after the owner found it too quick), drawn in perspective so it looks like a real card.

## How it is built

- **One thing turns.** The shadow, the focus frame and the card are inside one element that is rotated, so they turn together. If only the card turned, the pink shadow and the cyan frame would stay full size behind it.
- **One number drives it.** `0` means front, `1` means back. The turn goes 0 to 90 degrees while the number goes 0 to 0.5, then jumps to -90 and goes back to 0 by 1, so the card keeps turning in the same direction. X No JavaScript runs in the middle of the animation, so it can run on the native driver (smooth on a phone) and pressing again mid-turn just reverses it.
- **`Animated` from React Native**, not Reanimated. It works the same on phones and on web, so Storybook needs nothing extra.
- **Perspective.** A turn without it is a flat squash; with it the near edge grows and the far edge shrinks. The value (2000) is a feel setting in `WordCard.tsx`, not a design token.
- **Controlled.** The card never decides which side is up. The screen passes `isFlipped` and `onFlip`; the card animates towards what it is told.
- **Screen readers** see only the side that is shown (`aria-hidden` on the other).
- **The duration** is a number in `flip-duration.ts`; a unit test checks it equals `duration-flip` in `tailwind.config.js`, so `DESIGN.md` stays the one place to change it.

## Reduced motion

People can switch animations off in the phone or browser settings. `useReducedMotion` (`src/lib`) reads that setting through React Native's `AccessibilityInfo`. When it is on, the number jumps to its target and nothing animates. The story `ReducedMotion` fakes the setting and checks that the card never changes width. The rule is in `DESIGN.md` §11.
