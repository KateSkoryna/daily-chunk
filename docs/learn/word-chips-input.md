# Word chips input

The Home screen collects today's words in one field where every word is a **chip** (a small box with the word and a cross). It replaces the multi-line text area.

## How it behaves

- Type a word and press Enter, space, comma or semicolon: the text becomes a chip. A pasted list is split into chips. Leaving the field also turns the text into a chip.
- Tap a chip to take it back into the text and edit it; tap its cross to remove it; Backspace on empty text takes the last chip back.
- A lesson takes at most `maxWordsPerLesson` (6) words (`packages/core/src/start-lesson.ts`). At 6 the text input goes away and a notice says how many words were left out. If more new words exist than fit, `startLesson` takes an evenly sized part (7 words: 4 now, 3 later).

## Where it lives

- `apps/app/src/lib/word-chips.ts`: the pure rules (split, skip duplicates, the limit, edit, remove), unit tests in `apps/app/tests/word-chips.test.ts`.
- `apps/app/src/components/WordChipsInput/`: the controlled component. The words and the draft text live in the Home route, the component only reports changes.
- The chip is a row 3rem high with a 2rem box drawn behind two buttons (edit, remove). Touch targets must be 3rem, so the box is smaller than the area you can press, the same trick as the item dots.
