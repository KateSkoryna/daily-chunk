# The Answer task: ordering words

**What it is.** Task 4 of a lesson. Chunk asks a question in German ("Wo wartest du auf deinen Zug?") and the learner answers by tapping word tiles into the right order, with every tap checked at once.

**Why this way.** Building a whole sentence trains word order and the lesson word in a real answer, without typing and without a microphone. It replaces the old Read aloud task, because Listen & shadow already records the voice.

**How the pieces fit.**

- `packages/core/src/answer-task.ts`: pure functions, no UI. `answerTiles` splits the answer into tiles and shuffles them with a seed (`lessonId:questionIndex`), so the order is the same on every render but never already correct. `expectedAnswerWord` says which word must come next; the route accepts a tap only if the tile has that text, so the answer line only ever holds right words.
- The level: `answerWordRange` says how many words an answer may have at each level; `answerProblems` is the check the real AI answer will pass through in phase 5 (like `storyProblems` for the story).
- Help: three wrong taps in a row (`mistakesBeforeHint`) make the screen mark the right tile (cyan border, lamp icon). Any right tap resets the count.
- Scoring: a question counts as right when it had no wrong tap (`answerResult`).
- `AnswerScreen` only draws; the route `app/lesson/answer.tsx` owns the placed tiles and the status (the wrong tile, from the tap).
- The data comes from `AiService.generateAnswerExercises`; today a mock returns one exercise per demo word.
