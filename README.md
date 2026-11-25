# Daily Chunk

Mobile-first vocabulary trainer. You add the German words you met today, the app turns them into a 6-task lesson and then schedules reviews. Runs on Android, iOS and web.

## Requirements

- Node 24 (`.nvmrc`)
- Expo Go from the Play Store (it opens SDK 58 apps), to try the app on an Android phone without building it

## Run the app

```bash
npm ci
npm start
```

Scan the QR code with Expo Go (phone and laptop on the same Wi-Fi). If it can't connect, run `npx expo start --tunnel` inside `apps/app`.

| Command                                        | What it does                                                   |
| ---------------------------------------------- | -------------------------------------------------------------- |
| `npm start`                                    | Dev server, QR code for Expo Go                                |
| `npm run web`                                  | Open the app in the browser                                    |
| `npm run android`                              | Open on an Android emulator or device                          |
| `npm run storybook`                            | Open Storybook (component workshop) on port 6006               |
| `npm test`                                     | Run all tests (packages in Node, stories in headless Chromium) |
| `npx nx run-many -t lint typecheck check-meta` | Lint, typecheck and component meta check                       |
| `npx nx run @daily-chunk/app:export:web`       | Build the web version into `apps/app/dist`                     |
| `npm run format`                               | Format all files with Prettier                                 |

## Where things are

```
apps/app/                       the Expo app (Android, iOS, web)
  app/                          screens as routes (the file name is the URL)
    (tabs)/                     Home, Lessons, Score, Stats tabs
    lesson/                     one file per lesson task: overview, flashcards, listen, read, answer
    confirm.tsx                 confirm the typed words
    [page].tsx                  placeholder pages (account, review, settings...)
  src/
    features/                   the screens' own UI: lesson/ (FlashcardsScreen, ReadScreen, AnswerScreen...), words/ (Home, Confirm), navigation/
    components/                 reusable pieces (Button, WordCard, SentenceBuilder...); each has a .meta.ts and .stories.tsx
    components/ui/              restyled shadcn components (button, text, alert-dialog)
    state/                      the Zustand store: words, lessons, stories, answer exercises
    storage/                    SQLite + Drizzle: tables and row converters
    ai/                         the AI service (today a mock that returns demo content)
    mocks/                      demo content: words, story, answer sentences, gap fill
    lib/                        small helpers and hooks (speech, recorder, navigation between tasks)
    theme/                      fonts, hard shadow, scanlines
  e2e/                          browser tests of whole flows (Playwright)
  tests/                        unit tests of the app code
packages/core/src/              domain types and rules, no UI: Word, Lesson, SRS, XP, quiz, answer task, AI request/response types
packages/languages/src/         rules of the target language: de/ (articles, genders, typing alternatives)
packages/i18n/src/locales/      UI text: en.json and ru.json
docs/                           learning notes (docs/learn/) and progress.md
design/                         the designed screens and the original design system
```

## Where are the translations?

| What is translated                                               | Where it lives                                                                                                                                     |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Buttons, labels, task names, Chunk's lines (English and Russian) | `packages/i18n/src/locales/en.json` and `ru.json`. Same keys in both files, for example `answer.next`, `lesson.tasks.answer`.                      |
| A word's meaning and its example sentence in `ru` / `en`         | On each word: `translations` and `sentenceTranslations` (type in `packages/core/src/translations.ts`). Demo values: `apps/app/src/mocks/words.ts`. |
| The story text, and the Answer task's sentences, in `ru` / `en`  | Demo values in `apps/app/src/mocks/lesson-tasks.ts` (`translations: { ru, en }`). In phase 5 the AI returns them for the learner's language.       |
| Gap fill hints                                                   | `apps/app/src/mocks/gap-fill.ts` (`hints: { ru, en }`).                                                                                            |

Rules: no user-visible text inside components (it comes from `i18n`); a translation is always stored per native language (`translations.ru`, `translations.en`), never as a field of its own; German rules (articles, genders) live only in `packages/languages`.

## Where do I change...

- a button label or a Chunk line → `packages/i18n/src/locales/en.json` and `ru.json`
- what a lesson task looks like → `apps/app/src/features/lesson/<Task>Screen.tsx` (and its `.stories.tsx`)
- what a lesson task does (state, saving the result, next route) → `apps/app/app/lesson/<task>.tsx`
- the rules of a task (scoring, word order, levels) → `packages/core/src/<task>.ts`
- the demo content → `apps/app/src/mocks/`
- colours, spacing, fonts → `DESIGN.md`, then `apps/app/global.css` and `apps/app/tailwind.config.js`

## Docs

- [`plan.md`](plan.md): decisions, phases and steps
- [`DESIGN.md`](DESIGN.md): design system
- [`docs/progress.md`](docs/progress.md): status of every step
- [`CLAUDE.md`](CLAUDE.md): project rules
