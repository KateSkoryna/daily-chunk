# The app store (Zustand)

**What:** one small store in `apps/app/src/state/app-store.ts` holds the app-wide data: the profile and the words, plus the load status. Zustand is a tiny state library: `createStore` makes the store, `useStore` reads from it in a component.

**Why a factory:** `createAppStore({ getStorage, ai, now })` takes its storage, AI service and clock as arguments. The app passes the real SQLite storage and the mock AI (`state/use-app-store.ts`); the tests pass an in-memory storage and a fixed time, so the store is tested in Node without a database.

**Flow:** `load(appLanguage)` runs once (`idle`, `loading`, `ready` or `error`): it reads the profile (creating one on the first start, with the app language as the native language) and the words. `addTypedWords(text)` asks the AI to normalise the text, turns the result into new `Word`s, saves the ones that are not saved yet, and remembers a typed plural for the Confirm notice.

**Where state lives:** only app-wide data is here. The text in the Home text area is local state of the Home route.

**Words in storage:** the `word` table (`drizzle/0001_create_words.sql`, made by `npm run db:generate`); translations are stored as JSON text per native language. A word id is `word-<language>-<lemma in lower case>`, so typing a word twice finds the same word.

**Lessons:** `startLesson()` in the store saves a lesson (`lesson` table) with the ids of the new words. There is one open lesson at a time: starting again reuses it with the current words. The pure rule is `startLesson` in `packages/core/src/start-lesson.ts`.
