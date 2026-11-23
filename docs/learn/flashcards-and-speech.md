# Flashcards and reading words aloud

**Flashcards logic (`packages/core/src/flashcards.ts`):** a session is the list of word ids and the index of the card on screen. "Next" goes one card forward, "Previous" one card back (disabled on the first card); "Next" on the last card finishes the task. All cards counted as seen is the result saved on the lesson as `taskResults.flashcards`. These are plain functions with tests; the screen only shows the current word.

**Where the state lives:** the route `app/lesson/flashcards.tsx` owns the session and the flip (it is only used there). `FlashcardsScreen` stays a controlled component: it gets the word, the counter and callbacks. The counter is the position of the card: Previous lowers it, Next raises it.

**Speech:** `expo-speech` reads text with the device voice. It works in Expo Go and on the web. The voice language is not written in the app: the target pack has `speechLocale` (`de-DE`), so a new target language only needs its pack. `speakWord` (`src/lib/speak-word.ts`) stops what is playing and speaks. On the word side the button reads the word with its article, on the sentence side it reads the sentence.

**Saving:** `saveTaskResult` in the store writes the result on the open lesson and keeps the results of the other tasks.
