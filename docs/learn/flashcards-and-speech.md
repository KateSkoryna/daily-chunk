# Flashcards and reading words aloud

**Flashcards logic (`packages/core/src/flashcards.ts`):** a session is a queue of word ids. "Next" takes the word out of the queue; "Again" puts it at the end and remembers it as missed. The task is done when the queue is empty. The score is the words known on the first try out of all words, saved on the lesson as `taskResults.flashcards`. All of this is plain functions with tests; the screen only shows the current word.

**Where the state lives:** the route `app/lesson/flashcards.tsx` owns the session and the flip (it is only used there). `FlashcardsScreen` stays a controlled component: it gets the word, the counter and callbacks. The counter counts words known so far plus one, so "Again" keeps it where it was.

**Speech:** `expo-speech` reads text with the device voice. It works in Expo Go and on the web. The voice language is not written in the app: the target pack has `speechLocale` (`de-DE`), so a new target language only needs its pack. `speakWord` (`src/lib/speak-word.ts`) stops what is playing and speaks. On the word side the button reads the word with its article, on the sentence side it reads the sentence.

**Saving:** `saveTaskResult` in the store writes the result on the open lesson and keeps the results of the other tasks.
