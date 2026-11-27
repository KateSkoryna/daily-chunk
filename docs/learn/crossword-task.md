# The Crossword task: finding words from their meaning

**What it is.** Task 2 of a lesson (lessons now have 7 tasks). The lesson words sit in a crossword with German clues ("Ein Gebäude, in dem sich Reisende und Züge treffen."). The learner taps a word, types it on an on-screen keyboard, and every letter is checked at once.

**Why this way.** After the flashcards, recalling a word from its meaning is the first time the learner produces the word themselves instead of only recognising it, and spelling it letter by letter trains the umlauts and ß.

**How the pieces fit.**

- `packages/core/src/crossword.ts`: pure functions, no UI. A `CrosswordPuzzle` is the grid size, the entries (number, direction, start cell, answer, clue, translation) and the given cells. A cell is named by its key `row,column`, such as `2,2`.
- The session is a plain object that every action returns a new copy of: `selectCrosswordEntry` opens a word, `typeCrosswordLetter` checks the next empty cell of the open word, `showCrosswordHint` shows the translation, `closeCrosswordEntry` closes the panel. The route holds it in `useState`, so the screen only draws. A letter is compared ignoring case, so ß stays ß (`'ß'.toUpperCase()` would be `SS`).
- Help: three wrong letters on one cell (`wrongTriesBeforeFill`) and Chunk fills it in; the cell gets a dashed border.
- Link words: an entry with `wordId: null` only joins the lesson words. It never counts.
- Scoring: `crosswordResult` counts the lesson words with no filled-in letter. The hint is free.
- `crosswordProblems` checks a grid (a lesson word missing, a word leaving the grid, two words wanting different letters in one cell). The real AI grid will pass through it, like `storyProblems` for the story.
- `apps/app/src/lib/crossword-grid.ts` turns the puzzle and the session into rows of cells with a look (open, given, active, solved, link solved) and a cursor. The `Crossword` component only draws those rows.
- The keyboard letters come from the language pack (`keyboardRows`), so the app has no German letters in its code.
- The data comes from `AiService.generateCrossword`. Today a mock returns the designed grid (Bahnhof, Zug, Gleis, Fahrkarte); a lesson word that is not in it is missing, and a grid word not in the lesson becomes a link word. A function that places any words on a grid is a later step.

**Class merging.** `cn` uses `tailwind-merge`, which only knows Tailwind's built-in sizes. `src/lib/utils.ts` now tells it about ours (`touch`, `control`…), so `cn('min-w-touch', 'min-w-0')` keeps only `min-w-0`. Without that, both classes stayed and the keyboard keys could not be narrower than 3rem.
