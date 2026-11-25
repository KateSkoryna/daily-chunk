# Validating what an AI returns

An AI answer is text that looks right, not a promise. If the app shows it as it is, one bad answer (a text that is too hard, a question with two right answers, a missing word) reaches the learner.

What we do instead:

1. **The app decides everything it can.** The level, the quiz language (`quizLanguage`), the number of sentences and questions are numbers in `core`, sent in the request. The AI only writes.
2. **The app checks the answer** with plain code (`storyProblems` in `core`): counts sentences, looks for every lesson word, checks that each question has three different options with the right answer among them and at most 3 words, and that the level the AI reports is at most two above the learner's (`highestTextLevel`).
3. **Anything the AI is bad at is done by the app.** Models tend to put the right option in the same place, so the app shuffles the options (`shuffleOptions`) with a seed, which keeps the order stable between renders.
4. **A failed check means ask again** (in phase 5, a retry or two, then an error notice), never show a half-wrong lesson.

The mock AI passes the same check in a test, so the mock and the real AI are held to one rule.
