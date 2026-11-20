# Spaced repetition and progress rules

**What:** `packages/core` holds the pure rules that decide when a word comes back and what a lesson earns. No storage, no clock: callers pass the time in.

**Spaced repetition (`srs.ts`):** a word has a `reviewStage` 0 to 5. A correct answer moves it up one stage and schedules the next review 1, 3, 7, 14 or 21 days later (stage 1 to 5). A wrong answer always goes back to stage 1, due tomorrow. A correct answer at stage 5 (the 21 day review) marks the word learned: `learnedAt` is set and `nextReviewAt` is `null`.

**Progress (`progress.ts`):** only a finished lesson counts. It gives 100 XP and moves the streak: yesterday means +1, today again means unchanged (no second bonus), anything older resets to 1. Reaching 3, 7, 14, 21, 50 or 100 days adds a bonus (30, 60, 100, 200, 300, 500 XP) as a nudge to build the habit. The numbers are named constants, easy to change.

**Dates:** `lastStudyDate` is a local calendar day `YYYY-MM-DD`; review times are UTC ISO timestamps.

**Why pure functions:** every transition is a table test, and the same code runs in the app, in tests and later in an Edge Function.

**Where:** `packages/core/src/srs.ts`, `progress.ts` and their `*.test.ts`. `npm test` in `core` also enforces 80% coverage.
