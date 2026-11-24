# Tips and the lamp

A tip is a short note about something curious in a word, for example "no article before a number: `von Gleis drei`, not `vom`". It is optional: most words have none.

## Where it lives

- `Word.tip` in `packages/core` is a `Translations` object (one text per native language), like `translations`. The AI normalise step fills it; the mock puts one on `Gleis`.
- The SQLite `word` table has a nullable `tip` JSON column. It came from `npm run db:generate` (migration `0003_add_word_tip.sql`), so existing words keep working: they just have no tip.
- `TipButton` (the square lamp) and `TipCard` (the card under the word) are in `apps/app/src/components/`. The flashcard screen shows the lamp only when the word has a tip in the native language.

## Why the lamp is always visible

A hover-only button does not exist on a phone, so a tip would be unreachable. The lamp is always shown for words that have a tip.

## Why pressing the lamp does not flip the card

On a phone a touch goes to the innermost pressable, and web `Pressable` does the same. The lamp is a sibling of the card's pressable surface (the `corner` slot of `WordCard`), not a child of it, so there is nothing to bubble to. It also does not turn with the card.
