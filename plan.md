# Daily Chunk: implementation plan

Status: **decisions confirmed, phase 0 next.** Progress per step: [`docs/progress.md`](docs/progress.md).

## 1. What we are building

A mobile-first vocabulary trainer. **v1: learn German, with Russian or English as the native language.** Built so more languages can be added later (see section 2a). The user types or dictates the words they met today; the app normalises them (dictionary form, article, plural, translation), the user confirms, and the app builds a 6-task lesson from them. Words then go into spaced repetition (1, 3, 7, 14, 30 days). Every 5th lesson unlocks a "Boss round" test. A tutor character ("Chunk") speaks in short, dry one-liners.

Look: "Arcade Night": dark only, scanline ground, square corners, hard pink offset shadows, Bungee / VT323 / IBM Plex Sans. Full visual spec: [`DESIGN.md`](DESIGN.md).

### Sources (copied into `design/`)

| Source                                                      | Link                                                                 | Local copy                                                                              |
| ----------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Screens canvas "Daily Chunk Mobile" (20 artboards, 390×844) | https://claude.ai/code/artifact/612f1a57-16a0-467d-87a6-6097f560f8d7 | `design/screens/*.dc.html`, `design/screens/canvas.json`                                |
| Design system                                               | https://claude.ai/artifact/WPoD6RE9v815a6kdYTLzX8                    | `design/system/README.md`, `design/system/tokens.json`, `design/system/components/*.md` |
| Design spec (single source of truth for visuals)            | —                                                                    | [`DESIGN.md`](DESIGN.md), built from the design system above                            |

**How to use each source:**

- **Canvas = logic and content.** Which screens exist, what is on each one, the flow between them, navigation structure, copy, demo data, interactive behaviour (the `<script data-dc-script>` blocks).
- **`DESIGN.md` = how it looks.** Colours, type scale, spacing (rem), radii, shadows, sizes, breakpoints, motion, the shadcn token mapping, component styling, icon style, accessibility rules. `design/system/` is the original reference it was built from.
- When they disagree: _what_ is shown → canvas; _how_ it looks → `DESIGN.md`. Known conflicts are in section 3.

## 2. Decisions (confirmed 2026-11-03, extended 2026-11-06)

v1 is for the owner's daily use and as a portfolio piece. Test device: Samsung A54 (Android). The same app also runs on web. No Play Store or iOS release in v1.

| #   | Decision                   | Choice                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | App stack                  | **Expo (React Native) + TypeScript + Expo Router**. One app for Android, iOS and web (`react-native-web`). **SDK 58** (`expo ~58.0.23`, React Native 0.88.1, React 19.3.0), chosen in step 0.2 on 2026-11-06. Why: it is the newest SDK, and the Expo Go on the Play Store opens it, so any developer can test on a phone without sideloading. History: SDK 56 failed `expo-doctor` (Hermes V1 memory regression with `react-native-reanimated`, fixed in 57: [changelog](https://expo.dev/changelog/sdk-57)); the owner moved to 57, then to 58. Not confirmed officially with the next libraries: React Native Reusables' example app runs SDK 56 + NativeWind ^4.2.2 ([package.json](https://github.com/founded-labs/react-native-reusables/blob/main/apps/showcase/package.json)); NativeWind 4.2.7 (Tailwind 3 only) has no official SDK list, and its peer needs (`react-native-reanimated >=3.6.2`, Tailwind 3) are met on paper. Step 0.3 verifies it; if it blocks, the fallback is SDK 57 with the Expo Go 57 APK. Storybook `@storybook/react-native-web-vite` 10.6.6 accepts `react-native-web` ^0.19-0.21 (SDK 58 uses ~0.21.0). |
| D2  | Styling                    | **React Native Reusables (shadcn port) on NativeWind v4 (Tailwind 3.4)**, exactly as DESIGN.md §10. All lengths in rem, `1rem = 16px`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| D3  | State / data               | Zustand for UI state. **Offline-first**: words, lessons and SRS in `expo-sqlite` through **Drizzle ORM** (typed schema, generated migrations). Web support is checked in step 0.4; fallback is IndexedDB on web behind the same `core` interface. Local-only until sign-in exists; then sync to Supabase, each row has `updatedAt`, newest change wins. Web check 0.4: passed, but web needs COOP/COEP headers and an async warm-up before Drizzle's sync driver (see `docs/learn/storage-on-web.md`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| D4  | Backend                    | **Supabase**: Postgres, row-level security, Edge Functions. Config in `supabase/`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| D4a | AI                         | **Gemini API**, called only from Edge Functions; key stored as a Supabase secret. Flash for normalising and checking, Flash for stories too (switch to Pro only if stories read badly). `packages/core` defines the request/response types, so the provider can be swapped.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| D5  | Auth                       | **Guest first.** Google sign-in (Supabase) is optional and turns on sync of words, lessons and history. On first sign-in, local data uploads. The extension always needs sign-in.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| D6  | Logo                       | Direction **B, Sheriff badge**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| D7  | App name                   | **Daily Chunk**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| D8  | Languages                  | Target German; native Russian, English. App language follows native by default.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| D9  | Repo                       | **Monorepo: npm workspaces + Nx** (Nx as task runner only, no `@nx/expo` plugin). Internal packages export TypeScript source (section 2b).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| D10 | Component workshop         | **Storybook for web** (`@storybook/react-native-web-vite`). Every component and every screen has a story. No on-device Storybook.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| D11 | Tests                      | **One suite: Vitest.** Stories run as browser tests via the Storybook Vitest addon (interactions + accessibility). `packages/core` logic uses plain Vitest; coverage floor 80% for `core`. Fallback to Jest if the addon can't run the React Native web setup. No visual snapshots for now.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| D12 | Audio                      | TTS: device voices (`expo-speech`) first; Gemini TTS for story audio in phase 6, cached per lesson. Pronunciation: recording → Edge Function → Gemini returns transcript, score, words to fix (mocked until the backend exists). Dictation: `expo-speech-recognition` (German), Web Speech API on web.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| D13 | Browser extension          | After the core loop. **WXT** + small React popup in `apps/extension`. Saves the selected word, its sentence and the page link to today's list; the app shows them on Home to confirm. Requires sign-in.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| D14 | Hosting and deploys        | **EAS** (Expo Application Services): Hosting for web, Build for the Android APK, Update for over-the-air JS updates. Storybook is also tried on EAS Hosting; **fallback: GitHub Pages** (one Storybook from `main`, PRs reviewed locally). Supabase deploys from `main` (backend phase). Extension zip uploaded by hand later. Details in section 2c.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| D15 | Running on the phone       | Expo Go until a native library is needed (dictation on Home), then a development build.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| D16 | UI strings                 | **i18next + react-i18next** in `packages/i18n` (EN/RU, incl. Russian plural forms), `expo-localization` for the device language.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| D17 | Mocks                      | `src/mocks/` uses the real `packages/core` types, one file per feature (`words.ts`, `lesson.ts`, `stats.ts`…), RU and EN copy inside each object.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| D18 | Edge Function import proof | Moved from phase 0 to step 5.1.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| D19 | Local backend              | The backend runs locally with the **Supabase CLI** (`npx supabase start`), which creates its own Docker containers, so Docker Desktop must be installed from phase 5 on; or in a Supabase cloud project. Decided in step 5.1. The app itself never runs in Docker: `npm start` on the laptop.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

## 2a. Languages: built to extend

v1 ships one target language (German) and two native languages (Russian, English). Nothing outside `packages/languages/` may hard-code German, Russian or English.

**Three separate language settings**

- `targetLanguage`: what you learn (v1: `de`)
- `nativeLanguage`: translations, hints, explanations (v1: `ru`, `en`)
- `appLanguage`: app interface strings (v1: `en`, `ru`; defaults to `nativeLanguage`)

**Language packs** (`packages/languages/<code>/`)

- _Target pack_ (`de`): grammatical genders and their articles (`masc` → der, `fem` → die, `neut` → das, `plural` → die … Pl.), which parts of speech show a gender chip, how a noun is displayed (article + capitalised noun), accepted typing alternatives (ae/oe/ue/ss → ä/ö/ü/ß), TTS voice options, grammar-tip rules used in feedback (e.g. an + dem = am).
- _Native pack_ (`ru`, `en`): name, font needs (Cyrillic → Russo One for display, Pixelify Sans for pixel UI; Plex covers both). See DESIGN.md §5.1.
- _UI strings_ (`packages/i18n/en.json`, `ru.json`): every visible string, including Chunk's lines (EN and RU versions of each).

**What this changes in the design**

- Article colour tokens stay as designed, but code uses them through **semantic gender roles** (`gender-masc`, `gender-fem`, `gender-neut`, `gender-plural`). The German pack maps them to der/die/das. A future language with 2 genders (French, Spanish) uses only masc/fem; one with none (English) hides the chip. Always show the article word with the colour, as the design system requires.
- Task 6 "RU → DE" becomes **"native → target"**, labelled from the pair (`RU → DE`, `EN → DE`).
- The Account rows "Native language" and "German level" become "Native language" and "<target> level"; Settings gets "App language".
- Word data stores translations per native language (`translations: { ru: "вокзал", en: "station" }`), so switching native language doesn't lose words.
- The AI backend (Edge Functions) takes `{ targetLanguage, nativeLanguage }` on every call (normalise, story, gap fill, translation check, pronunciation).
- Mocks: keep the Russian demo copy from the canvas and add an English twin for each screen.

**Adding a language later** = add a pack + UI strings + backend prompt support. No screen changes.

## 2b. Repo layout

```
apps/app/            Expo app (Android, iOS, web) + Storybook (.storybook/)
apps/extension/      WXT browser extension (after the core loop)
packages/core/       domain types, SRS scheduler, lesson generator, AI request/response types
packages/languages/  language packs: de/ (target rules), ru/, en/ (native)
packages/i18n/       EN / RU UI strings, incl. Chunk's lines
supabase/            migrations, Edge Functions (backend phase)
docs/learn/          short notes per topic
docs/tasks/          learning tasks for the owner
docs/progress.md     step status and results (written by the agent)
```

Inside `apps/app/`: `app/` (routes), `global.css`, `tailwind.config.js`, `src/theme/`, `src/components/ui/`, `src/components/`, `src/features/`, `src/mocks/`.

**Sharing code without "invisible types":**

- Each package's `package.json` points `exports` at its TypeScript source (`"exports": { ".": "./src/index.ts" }`). No build step for packages.
- Every consumer lists what it imports (`"@daily-chunk/core": "*"`).
- One `tsconfig.base.json` at the root, extended by every project. No hand-written `paths` aliases.
- `nx run-many -t typecheck` runs `tsc --noEmit` everywhere, locally and in CI.
- Edge Functions run on Deno and import shared packages through an import map pointing at `packages/*/src` (proved in step 5.1).

## 2c. CI / CD

**CI (GitHub Actions, every PR, merge blocked until green):** four parallel jobs in `.github/workflows/ci.yml` (`format`, `lint-typecheck`, `test`, `build`), sharing the setup action `.github/actions/setup`. Checks go through `nx affected`. Changed 2026-11-09 from one job: separate jobs show in the PR exactly what failed, run in parallel on their own machines, and one failure no longer hides the others.

- `prettier --check`
- `lint`, including the design rule (no hex / px under `src/`, DESIGN.md §10.4; from step 1.1)
- `typecheck`
- `test` (Vitest: stories + core logic, 80% coverage floor on `core`)
- meta check: every component has a `.meta.ts`, every token it names exists (from step 1.1)
- `expo export --platform web`
- backend phase: migrations checked against a local Supabase

**Branch protection on `main`:** PR required, CI green required, no approval required (the owner can't approve their own PR), no direct pushes, no force pushes, no deletion, rules apply to admins too. **Applied 2026-11-06** without the CI check; step 0.6 adds the four CI jobs (`format`, `lint-typecheck`, `test`, `build`) as required checks. Deploy jobs are never required.

**CD:** deploys are jobs in `ci.yml` with `needs:` on the four check jobs. Changed 2026-11-09 (was a separate `storybook.yml`, then a `workflow_run` workflow). Why:

- A deploy must start only when every check is green, so hosting capacity is never spent on code that fails. A separate workflow starts at the same time as CI and does not wait for it.
- `workflow_run` could wait for CI, but it runs only from the file on `main` (so it cannot be tested on the PR), and GitHub's security guidance warns against giving it secrets while it builds pull request code.
- `needs:` is simpler, shows the whole flow on one page, and is testable on the PR itself.
- Security rules for every deploy job: run only for pushes to `main` and for PRs from this repository (never forks); the secret is given only to the steps that need it, never to install or build steps that run PR code; permissions are `contents: read` plus `pull-requests: write` only on the job that comments.

- Design phase: Storybook preview link per PR (EAS Hosting) or, on fallback, Storybook from `main` on GitHub Pages
- After the design phase: web app preview link per PR, production web on merge to `main` (EAS Hosting)
- Android: every merge to `main` publishes an EAS Update. A new APK (EAS Build, internal distribution) only when a native library is added or Expo is upgraded; the PR says so.
- Supabase: migrations + Edge Functions deploy from `main` once the backend phase starts

## 2d. How we work

### Roles

- **Owner**: answers questions, does learning tasks, checks results, says "open the PRs", always merges.
- **Agent**: builds one step at a time, verifies it, records results in `docs/progress.md`. **Never commits, pushes, opens PRs or merges unless the owner says so in chat.** Every step stops for the owner's review first.

### Running a phase with `/loop`

The owner starts a phase with `/loop run plan.md phase <N>`. Every loop iteration does exactly this:

1. **Read** `CLAUDE.md`, this file, `docs/progress.md`, and the memory index. Read `DESIGN.md` before any UI step.
2. **Pick** the first step of phase N in section 6 whose status in `docs/progress.md` is `TODO` and whose `Depends on` steps are all `DONE` (or `WAITING-OWNER` if the step says that's enough). If no step can start: write the phase report (step 9) and end the loop.
3. **Branch** from the branch of the previous step in the phase (branches are stacked: 0.2 starts from 0.1's branch, which exists because the owner had 0.1 committed). The first step of a phase starts from `main`. Use the branch name in the step. If the previous step is `WAITING-REVIEW` (uncommitted), don't start: end the loop.
4. **Set** the step to `IN-PROGRESS` in `docs/progress.md`.
5. **Build** only what the step's `Scope` lists. Don't touch `Not in scope` items, open learning-task files, or `DESIGN.md`.
6. **Verify** every item in the step's `Done when` plus the Standard Done list below. Run each command and record the command and result (exit code, key output line, URL or file) under the step in `docs/progress.md`.
7. **Review**: start a reviewer subagent with a fresh context (`Agent`, general-purpose). Give it the step text, the diff (`git diff <base>...HEAD`) and this checklist: tests/lint/typecheck pass; design rules and metas (CLAUDE.md); language rules and no hard-coded strings; no AI attribution; scope respected; every `Done when` item has evidence. Fix every finding, re-run verification, and record "review: N findings, all fixed".
8. **Stop for review. Do not commit.** Leave all changes (including `docs/progress.md`) uncommitted in the working tree on the step's branch. Set the step to `WAITING-REVIEW` (or `WAITING-OWNER` with the exact owner action) and end the loop with a short message: what changed, how to see the diff (`git status`, `git diff`), what to say next. **One step per loop run.**
9. **After the owner's OK** ("approved", "commit"): fix any review comments, commit with clear names (CLAUDE.md git rules), set the step to `DONE`, commit `docs/progress.md`. The owner then starts the next step with `/loop run plan.md phase <N>`.
10. **Phase report** when the phase has no startable step: add a "Phase N report" section to `docs/progress.md` with a table of steps, status, branch, and one line each; then a list "Owner actions" (in order) and "Questions". Then stop the loop.

**Stop rules (set the step to `BLOCKED`, write the question in `docs/progress.md` with 1–2 options and a recommendation, then go on to the next step that doesn't depend on it):**

- anything in CLAUDE.md "Stop and ask the user" (missing token, DESIGN.md conflict, rule that can't be followed)
- a `Done when` command still fails after 3 fix attempts
- a library or version can't do what the step needs
- the step needs the owner (login, secret, device check, push)

**Never (in loop mode):** commit before the owner's OK, push, open a PR, merge, change GitHub settings, change `DESIGN.md`, edit an open learning task's files, skip the reviewer, mark `DONE` without evidence, add AI attribution anywhere.

### Standard Done (applies to every step)

- `npm ci` exits 0 from a clean checkout of the branch
- `npx prettier --check .` exits 0
- `npx nx run-many -t lint typecheck test` exits 0 (only the targets that exist at that point)
- New components: meta + story + story tests (role, label, state); meta check passes (from step 1.1)
- New concept first used → `docs/learn/<topic>.md` (what it is, why we use it, where it lives in the repo; ≤ 40 lines)
- Reviewer subagent run, all findings fixed
- `docs/progress.md` updated with evidence

### Step format (section 6)

Each step has: **Branch**, **Goal** (SMART: specific result, measurable by `Done when`, achievable in one branch, relevant to the phase, time-boxed to one loop iteration), **Depends on**, **Scope**, **Not in scope**, **Done when** (checkable commands or files), **Owner** (what the owner does or checks, if anything).

### Learning

- Concepts are explained in chat when they first come up, plus a short note in `docs/learn/<topic>.md` in the same branch.
- Learning tasks live in `docs/tasks/NN-<topic>.md`: why it matters, files to touch, steps, hints, "done when". The agent writes the task file; the owner does it on their own branch `task/NN-<topic>` and says "check"; the agent reviews it. While a task is open, the agent doesn't edit its files and keeps working elsewhere.
  1. Structure: import a type from `@daily-chunk/core` into the app (written in step 0.2)
  2. Styles: one small component with NativeWind, tokens, meta and story (written in step 1.3)
  3. Navigation: add a route and pass data between screens (written in step 3.1)
  4. Interactions: a controlled component + screen state + a Zustand store (written in step 3.5)
  5. Data: describe the `words` table in Drizzle, generate the migration, save and read a word (written in step 3.2)
  6. Auth: Google sign-in and a protected route (written in step 5.7)

### PRs

After a phase report, the owner reviews `docs/progress.md` and the branches. When the owner says "open the PRs", the agent pushes the stacked branches and opens one PR per step, in order, each based on the previous step's branch (the first on `main`). PR description: what changed and why, short. The owner merges in order; after each merge the agent retargets the next PR to `main` if GitHub didn't.

## 3. Design conflicts (canvas vs. design system)

Split rule: content/logic → canvas, visuals → `DESIGN.md`. "System" below means the original `design/system/` files.

| Topic                 | Kind    | System says                                                                                           | Canvas shows                                                                                                        | Use                                                                                     |
| --------------------- | ------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Name                  | content | Daily Wort                                                                                            | Daily Chunk                                                                                                         | **Daily Chunk** (resolved: `design/system/` renamed)                                    |
| Navigation items      | content | Tabs WORDS · LEARN · REVIEW · ME                                                                      | Tabs HOME · LESSONS · SCORE · STATS + burger menu (Account, Lessons, Review, Word bank, Boss round, Settings, Help) | Canvas (resolved: `design/system/` updated)                                             |
| Tab bar look          | visual  | 56px + safe area, labels pixel 22px / 2px spacing, active yellow, others `ink-muted`, badge pink fill | min 60px, labels 18px, active also has a 3px yellow inset top bar                                                   | System (keep the yellow top bar as the active marker: it doesn't contradict the system) |
| Review (S10) mechanic | logic   | Swipe flashcards (right = knew, left = again)                                                         | der/die/das picker with interval feedback ("NEXT REVIEW IN 14 DAYS" / "BACK TO 1 DAY")                              | Canvas; swipe flashcards can come later as a second review mode                         |
| Home main CTA         | content | START LESSON                                                                                          | CHECK MY WORDS → Confirm (which has START LESSON)                                                                   | Canvas                                                                                  |
| Tutor quote box       | visual  | padding 24/14/14, text pixel 24/26                                                                    | padding 22/14/12, text 23px / 1.1                                                                                   | System                                                                                  |
| Section labels        | visual  | `label` 24px / 2px spacing                                                                            | 20–22px                                                                                                             | System type scale                                                                       |
| Flashcard audio       | visual  | 48px cyan-outline audio button in the card footer                                                     | LISTEN button under the card                                                                                        | **Resolved 2026-11-06:** canvas placement (under the card), secondary `Button` style    |
| Flashcard border      | visual  | 2px `line`                                                                                            | 2px `line` + `shadow-hard`                                                                                          | Same in both                                                                            |
| Tablet / desktop      | visual  | Rail 240px, 720px lesson column, 1200px page, 12-col grid, display sizes grow                         | Not drawn                                                                                                           | System (phase 6)                                                                        |

Rule for building a screen: take the structure, copy and states from its `.dc.html`, then restyle every element with the matching token or component from `DESIGN.md`, not the inline px values in the canvas file.

## 4. Screens and routes

Expo Router file routes. Tab screens live in `app/(tabs)/`; the lesson flow is a stack in `app/lesson/`.

| Design file             | Canvas title                             | Route                | Interactive bits in the design                                                                               |
| ----------------------- | ---------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------ |
| `Main.dc.html`          | S1 Home · Add words                      | `/(tabs)/index`      | textarea, dictate button, word count "MIN 3", "5 DUE FOR REVIEW" link, boss progress (5 segments)            |
| `Confirm.dc.html`       | S2 Confirm words                         | `/confirm`           | editable rows (chip + word + forms + RU), plural-normalised notice (dashed orange)                           |
| `Flashcards.dc.html`    | S3 Task 1 · Flashcards                   | `/lesson/flashcards` | tap to flip (front/back), LISTEN, AGAIN / KNEW IT                                                            |
| `Listen.dc.html`        | S4 Task 2 · Listen & shadow              | `/lesson/listen`     | 2-step indicator, speed 0.75×, pause, record repeat                                                          |
| `Read.dc.html`          | S5 Task 3 · Read the story               | `/lesson/read`       | RU ON/OFF toggle, tap an underlined word → popover card                                                      |
| `Record.dc.html`        | S6 Task 4 · Read aloud                   | `/lesson/record`     | play recording, score 86%, retry-word chips, tutor verdict                                                   |
| `GapFill.dc.html`       | S7 Task 5 · Gap fill                     | `/lesson/gap-fill`   | part A article pick (3 options), part B word pick (2×2), ✓/✗ states                                          |
| `Translate.dc.html`     | S8 Task 6 · native → target (RU/EN → DE) | `/lesson/translate`  | textarea, voice answer, "USE:" chips, correction with diff                                                   |
| `Done.dc.html`          | S9 Lesson done                           | `/lesson/done`       | 3 stat tiles (XP, streak, accuracy), tutor quote, words added to review                                      |
| `Review.dc.html`        | S10 Review                               | `/review`            | der/die/das picker, feedback line, NEXT CARD                                                                 |
| `WordBank.dc.html`      | S11 Word bank                            | `/word-bank`         | 4 counters, search, NEW/LEARNING/LEARNED tabs, article filter, 5-pip SRS stage                               |
| `Test.dc.html`          | S12 Boss round                           | `/boss`              | lives (3 hearts), score, 3-part stepper, sentence builder tiles (add/remove)                                 |
| `Settings.dc.html`      | S13 Settings                             | `/settings`          | Chunk mode radio (Full/Mild/Quiet), digest time, word-of-the-moment switch, language & voice rows            |
| `Notifications.dc.html` | Push & home widgets                      | (native)             | 2 push templates, small widgets (word, streak), medium widget (today)                                        |
| `Menu.dc.html`          | Burger menu (open)                       | drawer               | 312px drawer, dim overlay, profile row, 7 items with badges, log out, version                                |
| `Account.dc.html`       | My account                               | `/account`           | profile card, native language, level, daily goal radio (3/5/10/15), plan, export, recordings, delete account |
| `Lessons.dc.html`       | Tab · Lessons                            | `/(tabs)/lessons`    | today card (START ▶), boss locked card, past lessons list with score colour                                  |
| `Score.dc.html`         | Tab · Score                              | `/(tabs)/score`      | rank card, progress to next rank, 8-rank ladder, 3 badges                                                    |
| `Stats.dc.html`         | Tab · Stats                              | `/(tabs)/stats`      | WEEK/MONTH tabs, bar chart, article accuracy bars, 3 summary tiles                                           |
| `Logo.dc.html`          | Logo · 3 directions                      | —                    | reference only; build app icon + `Logo` component from direction B                                           |

## 5. Component inventory

Each component ships with a meta and a story. Names match the design system where one exists. Base pieces come from React Native Reusables in `src/components/ui/`; DESIGN.md §9 maps each app component to its base and tokens. Every component ships a meta file next to it (`<Name>.meta.ts`, DESIGN.md §14).

**Primitives**

- `Screen`: scanline background, safe-area padding (`pt-screen-top px-gutter pb-screen-bottom`), optional tab bar slot
- `Text` with `variant` (the type scale in DESIGN.md §5.2), picks the Cyrillic display/pixel font from `appLanguage`
- `GlitchTitle`: Bungee with `3px 0 pink, -3px 0 cyan` text shadow
- `Icon`: inline stroke SVGs from the screens (`react-native-svg`): menu, back, close, mic, speaker, play, pause, stop, pencil, check, cross, home, book, trophy, chart, search, heart
- `PressableFocus`: wraps every control with the 2px cyan focus ring + 48px minimum target

**Design-system components** (`design/system/components/*.md`)

- `Button`: primary (yellow, hard shadow, pressed = translate 4px + no shadow), secondary (cyan outline), ghost, danger outline (pink, used for AGAIN)
- `ArticleChip`: tag, plural (dashed), picker with answered states
- `WordCard`: flip card, front/back
- `LessonStepper`: N segments (6 for lessons, 5 for boss progress, 3 for boss parts) + label + XP
- `TutorQuote`: box with label tab on the border; variants start/pass/fail
- `GapFill`: sentence with blank + option grid; sentence-build variant
- `RecordButton`: 80px / 64px round, idle/recording/done
- `TabBar`: 4 tabs (canvas version); desktop rail in phase 6

**App components found in the screens**

- `TopBar` (back/close/menu + right label), `HeaderStats` (XP + streak), `LogoBadge`
- `SectionLabel` ("01 / ADD TODAY'S WORDS", pink)
- `ListGroup` + `ListRow` (2px `line` border, 52px rows, cyan value + ›)
- `StatTile` (filled yellow / cyan outline / pink outline)
- `SegmentedTabs` (WEEK/MONTH, NEW/LEARNING/LEARNED)
- `Switch` (square, 64×36), `RadioCard` (Chunk mode), `OptionGrid` (daily goal)
- `ProgressPips` (5 SRS pips), `BarChart`, `RankLadder`, `Drawer` (burger menu), `WordPopover` (Read screen)

## 6. Phases and steps

Every step follows section 2d (loop protocol, Standard Done). Status lives in `docs/progress.md`, not here.

### Phase 0: project setup

Phase goal: a monorepo where the Expo app runs on web and Android, styled with the DESIGN.md theme, with Storybook, Vitest, CI and a hosted Storybook, so phase 1 can build components story-first.

Phase done when: steps 0.1–0.7 are `DONE` (0.6 and 0.7 may be `WAITING-OWNER` until the owner acts), and the phase report is in `docs/progress.md`.

#### 0.1 Workspace and shared packages

- **Branch:** `chore/workspace`
- **Goal:** One `npm ci` installs the whole repo, and `nx run-many -t lint typecheck` passes for three empty shared packages.
- **Depends on:** —
- **Scope:** root `package.json` (`"private": true`, `"workspaces": ["apps/*", "packages/*"]`, `engines.node` ≥ 24), `.nvmrc` (24), `nx.json` (task runner only; cacheable `lint`, `typecheck`, `test`; no Nx plugins), `tsconfig.base.json` (`strict: true`, `noUncheckedIndexedAccess: true`, `moduleResolution: "bundler"`), Prettier (`.prettierrc`; `.prettierignore` must list `DESIGN.md` and `design/`: they only change with the owner's approval, never by formatting), ESLint flat config (`eslint.config.mjs` with `typescript-eslint`), `packages/core`, `packages/languages`, `packages/i18n`: each with `package.json` (`name: @daily-chunk/<name>`, `exports: { ".": "./src/index.ts" }`, scripts `typecheck: tsc --noEmit`, `lint: eslint .`), `tsconfig.json` extending the base, `src/index.ts` with `export {};`. `.gitignore` covers `node_modules`, `dist`, `.nx`, `storybook-static`. `docs/learn/monorepo-workspaces-nx.md`.
- **Not in scope:** the Expo app, any domain types, i18next.
- **Done when:**
  - `npm ci` exits 0
  - `npx nx show projects` lists exactly `core`, `languages`, `i18n` (names may carry the `@daily-chunk/` prefix)
  - `npx nx run-many -t lint typecheck` exits 0 for all three
  - `npx prettier --check .` exits 0
  - `npx nx run-many -t typecheck` a second time reports the tasks as cached
- **Owner:** nothing.

#### 0.2 Expo app with Expo Router

- **Branch:** `chore/expo-app`
- **Goal:** `apps/app` is an Expo Router app on a pinned SDK that exports for web and Android and runs through Nx.
- **Depends on:** 0.1
- **Scope:**
  - Pick the SDK: the newest Expo SDK that **all** of these officially support: NativeWind v4 (Tailwind 3.4), React Native Reusables, `@storybook/react-native-web-vite`, and an Expo Go build for that SDK (the Play Store version only follows the newest SDK; older builds are APKs from expo-go-releases). Check each project's docs or release notes. If they don't agree on one SDK → `BLOCKED` with the options.
  - Create the app with `create-expo-app` (TypeScript template) in `apps/app`, name `@daily-chunk/app`; remove the template's example screens and assets; one route `app/index.tsx` showing a placeholder text; `app/_layout.tsx` with a `Stack`.
  - Monorepo setup per the Expo monorepo guide for that SDK (Metro config only if the guide needs it). `tsconfig.json` extends the root base.
  - Scripts: `start`, `web`, `android`, `typecheck`, `lint` (`eslint-config-expo` added to the flat config), `export:web` (`expo export --platform web`).
  - D1 in this file: add "SDK NN, React Native X.Y, React 19.x: chosen because …" (one line per library checked, with the doc link).
  - `docs/tasks/01-structure.md` (learning task 1): add a `LanguagePair` type (`{ targetLanguage: 'de'; nativeLanguage: 'ru' | 'en' }`) to `packages/core/src/`, export it, add `@daily-chunk/core` to `apps/app/package.json`, use the type in `apps/app/app/index.tsx`, prove with `nx run app:typecheck`, then show a deliberate type error being caught. Files reserved for the task: `packages/core/src/**`, `apps/app/app/index.tsx`, the `@daily-chunk/core` line in `apps/app/package.json`.
  - `docs/learn/expo-and-expo-router.md`.
- **Not in scope:** NativeWind, fonts, Storybook, storage, any `@daily-chunk/core` import in the app.
- **Done when:**
  - `npx expo-doctor` (in `apps/app`) reports no failed checks
  - `npx nx run-many -t lint typecheck` exits 0 for four projects
  - `npx nx run app:export:web` exits 0 and `apps/app/dist/index.html` exists
  - `npx expo export --platform android` (in `apps/app`) exits 0
  - the web dev server started in the background answers `curl -s -o /dev/null -w '%{http_code}' http://localhost:8081` with `200`; the server is stopped afterwards
  - D1 lists the pinned versions with reasons and links
  - `docs/tasks/01-structure.md` exists and `docs/progress.md` says "Learning task 1 is open"
- **Owner:** open the app in Expo Go on the A54 (`npx expo start` → scan the QR code) and see the placeholder. Start learning task 1 whenever you like.

#### 0.3 Theme: NativeWind, React Native Reusables, fonts

- **Branch:** `chore/theme-setup`
- **Goal:** The app renders DESIGN.md tokens (colours, fonts, rem spacing) on web and Android, and we know whether rem breakpoints work on native.
- **Depends on:** 0.2
- **Scope:**
  - NativeWind v4 + Tailwind 3.4 install and config per NativeWind docs for the pinned SDK (Babel, Metro, `nativewind-env.d.ts`), `inlineRem: 16`.
  - `apps/app/global.css` copied exactly from DESIGN.md §10.1; the theme part of `apps/app/tailwind.config.js` copied exactly from DESIGN.md §10.2; `components.json` per §10.3.
  - Fonts via `@expo-google-fonts` (the six faces in DESIGN.md §5.1) loaded in `app/_layout.tsx`; splash stays until fonts load.
  - A dev-only route `app/dev/theme-check.tsx` that shows `bg-background`, `bg-primary`, `text-foreground`, each font family once, a `p-gutter` box, and one element that changes at the first DESIGN.md §8 breakpoint. Only DESIGN.md classes; no hex or px.
  - Check DESIGN.md §15 Q1 (rem in `screens` on native): record the result and, if it fails, the proposed `tailwind.config.js` conversion in `docs/progress.md` as a question for the owner. Don't edit DESIGN.md.
  - `docs/learn/nativewind-and-tokens.md`.
- **Not in scope:** components in `src/components/`, `Text` variants, lint design rule, HardShadow, scanlines.
- **Done when:**
  - `grep -rnE '#[0-9a-fA-F]{3,8}\b|[0-9]+px' apps/app/app` finds nothing
  - `diff` of the `:root` block in `global.css` against DESIGN.md §10.1 shows no differences (same for the §10.2 theme object)
  - `npx nx run app:export:web` exits 0; serving `dist` and loading `/dev/theme-check` in headless Chromium (Playwright via `npx playwright` or a one-off script in the scratchpad) shows `getComputedStyle(body).backgroundColor` matching `--background`, and `document.fonts.check('1rem Bungee')` (or the loaded family name) is `true`
  - `npx expo export --platform android` exits 0
  - Q1 result written in `docs/progress.md`
- **Owner:** open `/dev/theme-check` in Expo Go and confirm colours and fonts look right; answer the Q1 question if one was raised.

#### 0.4 Web storage check (expo-sqlite + Drizzle)

- **Branch:** `chore/web-storage-check`
- **Goal:** Know, with evidence, whether `expo-sqlite` + Drizzle can save and read a row on web (dev server and exported build) and on Android export, so D3 can be confirmed or switched to the fallback.
- **Depends on:** 0.3
- **Scope:**
  - Temporary: install `expo-sqlite`, `drizzle-orm`, `drizzle-kit`; a throwaway table and a dev route `app/dev/storage-check.tsx` that inserts one row, reads it back, and shows `saved: <value>`; any web headers (COOP/COEP) or Metro/wasm config the expo-sqlite web docs need.
  - Run the check, record results, then **remove** the throwaway table, route and `drizzle-kit` config (keep `expo-sqlite` + `drizzle-orm` installed only if the check passed, plus any required web config).
  - `docs/learn/storage-on-web.md`: what SQLite, expo-sqlite and Drizzle are; what was tested; result; what the headers do and what they may break (e.g. Google sign-in popups, third-party embeds).
  - D3 in this file: append "Web check 0.4: passed" or "failed → IndexedDB fallback proposed (see docs/progress.md)".
- **Not in scope:** the real `words` schema (that's learning task 5), storage interfaces in `core`.
- **Done when:**
  - Evidence in `docs/progress.md` for each: web dev server (row shown after a page reload, checked in headless Chromium), exported web build served locally with the same headers, `npx expo export --platform android` exits 0
  - After cleanup: `git grep -n "storage-check"` finds nothing outside `docs/`
  - If the check failed: step is `BLOCKED` with a question to the owner: keep SQLite on web with a workaround, or IndexedDB on web (recommendation + trade-off)
- **Owner:** read `docs/learn/storage-on-web.md`; answer the question if raised.

#### 0.5 Storybook and Vitest

- **Branch:** `chore/storybook-vitest`
- **Goal:** `nx run-many -t test` runs plain Vitest tests in the packages and a NativeWind-styled story as a browser test, and `build-storybook` produces a static site.
- **Depends on:** 0.3 (not 0.4)
- **Scope:**
  - `@storybook/react-native-web-vite` in `apps/app/.storybook/` with NativeWind working in stories, global decorator that loads `global.css` and the fonts.
  - Storybook Vitest addon with Playwright Chromium (headless) and the a11y addon; `test` script in `apps/app` runs story tests.
  - Vitest in `packages/*` (`test` script, `passWithNoTests` where empty). In `packages/languages`: `export const supportedTargetLanguages = ['de'] as const;` plus one test; in `apps/app` one Vitest test that imports it from `@daily-chunk/languages` (cross-package proof; not `core`, which belongs to learning task 1).
  - One throwaway check story `apps/app/.storybook/checks/Theme.stories.tsx` (not under `src/components/`, so no meta): a `View` with `bg-primary p-gutter` and a pixel-font label; its play function asserts the computed background colour equals the `--primary` token and that the a11y check passes. Delete it in step 1.2.
  - Scripts: `storybook`, `build-storybook` (`storybook-static/`).
  - `docs/learn/storybook-and-vitest.md`.
  - If the addon can't run React Native web: try the documented fixes once, then `BLOCKED` with the Jest fallback from D11 as an option.
- **Not in scope:** real components, coverage floor (comes with real `core` logic in phase 3), visual snapshots.
- **Done when:**
  - `npx nx run-many -t test` exits 0 and the output shows the story test and both Vitest tests passing
  - Changing the check story's expected colour to `--secondary` makes the test fail (then revert); the failing run is recorded as evidence
  - `npx nx run app:build-storybook` exits 0 and `apps/app/storybook-static/index.html` exists
- **Owner:** run `npm run storybook -w @daily-chunk/app` and open the check story (optional).

#### 0.6 CI on GitHub Actions

- **Branch:** `chore/ci`
- **Goal:** A CI workflow that runs the section 2c checks on every PR, verified locally now and on GitHub after the owner pushes.
- **Depends on:** 0.5
- **Scope:**
  - `.github/workflows/ci.yml`: on `pull_request` and `push` to `main`; Node from `.nvmrc`; `npm ci`; Nx cache; `npx playwright install --with-deps chromium`; `prettier --check`; `nx affected -t lint typecheck test` (base `origin/main`); `nx run app:export:web`.
  - Branch protection on `main` already exists (PR required, 0 approvals, admins included, no force pushes or deletion). Write, but **don't run**, the command that adds only the CI job as a required status check, in `docs/progress.md`: `gh api -X PATCH repos/KateSkoryna/daily-chunk/branches/main/protection/required_status_checks` with `strict: true` and `contexts: ["<CI job name>"]`, plus a one-line explanation. If GitHub answers 404 because no checks are set yet, the command is instead a `PUT` on `.../branches/main/protection` with the current rules unchanged plus `required_status_checks`. Before writing it, check the current rules with `gh api repos/KateSkoryna/daily-chunk/branches/main/protection`.
  - `docs/learn/ci-github-actions.md`.
- **Not in scope:** deploy jobs (0.7), meta check and design lint (1.1), Supabase checks.
- **Done when:**
  - `npx --yes actionlint` (or the `actionlint` binary) reports no errors on `ci.yml`
  - Every command in `ci.yml` run locally in the same order exits 0 (recorded)
  - Status `WAITING-OWNER` with the actions below
- **Owner:** say "open the PRs" (or push these branches); see CI go green on GitHub; read the required-check command and say "apply it". The agent then runs it and sets the step to `DONE`.

#### 0.7 EAS project and hosted Storybook

- **Branch:** `chore/eas`
- **Goal:** Storybook is live at a public URL from `main`, with per-PR preview links if EAS Hosting supports a Storybook folder, otherwise via GitHub Pages.
- **Depends on:** 0.5; the owner's Expo login for the EAS part
- **Scope:**
  - Without login (do first): `apps/app/eas.json` (profiles `development`, `preview`, `production`; Android `buildType: apk` for `preview`), `docs/learn/eas.md` (what EAS Hosting / Build / Update are, how a deploy works).
  - Check `npx eas-cli deploy --help` for a way to deploy a given folder (e.g. an export-dir option). Record the result.
  - If supported: a job `deploy-storybook` in `.github/workflows/ci.yml` (`needs` the four check jobs, see section 2c) that builds Storybook and runs `eas deploy` with `EXPO_TOKEN`: preview deploy on PRs (comment the URL on the PR), `--prod` on `main`.
  - If not supported: the same workflow deploys `storybook-static` to GitHub Pages on `main` with `actions/upload-pages-artifact` + `actions/deploy-pages`; note in D14 "Storybook on GitHub Pages".
  - After the owner logs in: `npx eas-cli init` (writes `projectId` into the app config), one manual `eas deploy` of `storybook-static`, record the URL.
- **Not in scope:** web app deploys (after phase 2), EAS Build/Update runs (phase 3).
- **Done when:**
  - Workflow passes `actionlint`
  - `npx eas-cli whoami` prints the owner's username (after login)
  - `curl -s -o /dev/null -w '%{http_code}' <storybook URL>` returns `200` and the page title contains "Storybook"
  - Until the owner acts: status `WAITING-OWNER`
- **Owner:** create an account at https://expo.dev/signup; run `! npx eas-cli login` in the Claude session; create a token at https://expo.dev/settings/access-tokens and add it to GitHub → repo Settings → Secrets and variables → Actions → New repository secret, name `EXPO_TOKEN`. For the Pages fallback: GitHub → Settings → Pages → Source: "GitHub Actions".

#### 0.8 Phase 0 wrap-up

- **Branch:** `chore/phase-0-wrap-up`
- **Goal:** CLAUDE.md lists the real commands, and the phase report tells the owner exactly what to check and do.
- **Depends on:** 0.1–0.5 `DONE`; 0.6, 0.7 `DONE` or `WAITING-OWNER`
- **Scope:** fill the "Commands" section of `CLAUDE.md` (install, start, web, android, typecheck, lint, test, storybook, build-storybook, export, deploy) with the exact commands that were run in this phase; update CLAUDE.md "Status"; write the phase report (2d step 10).
- **Done when:** every command listed in CLAUDE.md runs and exits 0 (except deploy, which needs the owner's login); phase report exists.
- **Owner:** read the phase report, do the owner actions, say "open the PRs", merge in order. Say "check" when learning task 1 is done.

### Phase 1: design system (theme primitives + core-loop components)

Phase goal: every component the core loop (Home → Done) needs exists with meta, story and passing story tests, built only from DESIGN.md tokens, reviewed by the owner in Storybook.

Every component step: **Done when** = component + `.meta.ts` + `.stories.tsx` with stories for each variant and state; story tests assert role, accessibility label and state; meta check passes; a Playwright screenshot of the story at 390 px wide is compared with the matching element in its `.dc.html` and every difference is either a DESIGN.md rule (named) or fixed; Standard Done. Spec sources: DESIGN.md §9 + `design/system/components/<Name>.md`.

| Step | Branch                            | Goal (SMART)                                                                                                                                                                                                                                                       | Depends on |
| ---- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| 1.1  | `chore/design-guards`             | Lint fails on any hex/px under `src/` (DESIGN.md §10.4); `ComponentMeta` type in `src/components/meta.ts` (§14); a meta-check script fails when a component has no meta or names an unknown token. Proven by fixture tests that fail on purpose. Both added to CI. | phase 0    |
| 1.2  | `feat/i18n-setup`                 | `packages/i18n` with i18next + react-i18next + `expo-localization`, `en.json`/`ru.json`, `useAppLanguage()`; Russian plural test (1/2/5 words) passes. Delete the 0.5 check story.                                                                                 | 1.1        |
| 1.3  | `feat/text-primitive`             | `Text` with every §5.3 variant; picks Cyrillic display/pixel fonts from `appLanguage`; story shows all variants in EN and RU. Writes learning task 2.                                                                                                              | 1.2        |
| 1.4  | `feat/layout-primitives`          | `Screen` (safe area + scanlines), `HardShadow` (native block / web `boxShadow`), `PressableFocus` (2px cyan ring, 2px offset, ≥48px target).                                                                                                                       | 1.3        |
| 1.5  | `feat/icons`                      | `Icon` with the 17 stroke icons from the screens, `currentColor`, label required when used alone.                                                                                                                                                                  | 1.4        |
| 1.6  | `feat/button`                     | React Native Reusables `button` restyled per §9.1: primary, secondary, ghost, danger; pressed state.                                                                                                                                                               | 1.5        |
| 1.7  | `feat/article-chip`               | `packages/languages/de` maps gender roles → article words; `ArticleChip` tag / plural (dashed) / picker with answered ✓/✗ states.                                                                                                                                  | 1.6        |
| 1.8  | `feat/word-card`                  | Controlled `WordCard` (`isFlipped` + `onFlip`), no flip animation under reduced motion.                                                                                                                                                                            | 1.7        |
| 1.9  | `feat/lesson-stepper-tutor-quote` | `LessonStepper` (N segments + label + XP), `TutorQuote` (start/pass/fail).                                                                                                                                                                                         | 1.6        |
| 1.10 | `feat/gap-fill-record-button`     | `GapFill` (blank + `OptionGrid`, sentence-build variant), `RecordButton` (80/64, idle/recording/done, text alternative).                                                                                                                                           | 1.7        |
| 1.11 | `feat/app-chrome`                 | `TopBar`, `HeaderStats`, `LogoBadge`, `SectionLabel`, `StatTile`, `TabBar`.                                                                                                                                                                                        | 1.6        |
| 1.12 | `chore/phase-1-review`            | Phase report; status `WAITING-OWNER` until the owner reviews the kit in Storybook and says OK.                                                                                                                                                                     | 1.1–1.11   |

### Phase 2: core-loop screen stories

Phase goal: the 9 core-loop screens exist as stories with mock data, matching their `.dc.html` at 390×844.

Every screen step: **Done when** = screen story in EN and RU; Playwright screenshot at 390×844 next to the `.dc.html` screenshot in `docs/progress.md`; every difference is a named DESIGN.md rule or fixed; no strings outside `packages/i18n`; Standard Done.

| Step | Branch                           | Goal (SMART)                                                                                                                                                         | Depends on      |
| ---- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| 2.1  | `feat/core-domain-types`         | `Word`, `Lesson`, `ReviewLog`, `Profile` types in `packages/core` (translations per native language); type tests. Needs learning task 1 checked.                     | phase 1, task 1 |
| 2.2  | `feat/mocks`                     | `src/mocks/` per D17 with the exact demo copy (Bahnhof, Fahrkarte, verspätet, Gleis; lesson 13; 1240 XP; streak 12/13; "Der letzte Zug") + EN twin, typed by `core`. | 2.1             |
| 2.3  | `feat/home-confirm-stories`      | Home and Confirm screen stories.                                                                                                                                     | 2.2             |
| 2.4  | `feat/flashcards-listen-stories` | Flashcards and Listen screen stories.                                                                                                                                | 2.2             |
| 2.5  | `feat/read-record-stories`       | Read (with `WordPopover`) and Record screen stories.                                                                                                                 | 2.2             |
| 2.6  | `feat/gapfill-translate-stories` | GapFill and Translate screen stories.                                                                                                                                | 2.2             |
| 2.7  | `feat/done-story`                | Done screen story; phase report.                                                                                                                                     | 2.3–2.6         |

### Phase 3: core loop in the app

Phase goal: on the A54 and on web, the owner can add 3+ words, confirm them, finish all 6 tasks, and see them scheduled for review, with data surviving an app restart.

| Step     | Branch                  | Goal (SMART)                                                                                                                                                                     | Done when (besides Standard Done)                                                                         | Depends on    |
| -------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------- |
| 3.1      | `feat/navigation-shell` | `(tabs)` layout with `TabBar`, burger `Drawer`, lesson stack; leaving a lesson asks first. Writes learning task 3.                                                               | Each tab and drawer item opens its route in a web e2e check; the leave prompt appears on back.            | phase 2       |
| 3.2      | `feat/storage`          | Storage interface in `core` + Drizzle setup (or the 0.4 fallback). Writes learning task 5 (the `words` table is the owner's).                                                    | Store a profile row and read it after reload on web; Android export passes.                               | 3.1           |
| 3.3      | `feat/srs-scheduler`    | SRS in `core`: 1, 3, 7, 14, 30 days; wrong → 1; correct at 30 → learned; XP and streak rules.                                                                                    | Vitest table tests for every transition; `core` coverage ≥ 80%.                                           | 2.1           |
| 3.4      | `feat/ai-mocks`         | AI request/response types in `core` + mock implementations (normalise, story, gap sentences, translation check, pronunciation), all taking `{ targetLanguage, nativeLanguage }`. | Type tests; mocks return the demo content.                                                                | 2.2           |
| 3.5      | `feat/home-screen`      | Home works with real storage. Writes learning task 4. Switch to a development build when dictation is added.                                                                     | Typed words appear on Confirm; dev build APK installs (owner).                                            | 3.2, 3.4      |
| 3.6–3.13 | `feat/<screen>-screen`  | One step per screen in order: Confirm, Flashcards, Listen, Read, Record, GapFill, Translate, Done. Answer checking accepts ae/oe/ue/ss from the target pack.                     | The screen's interactive bits (section 4) work in a web e2e check; state saved where the screen saves it. | previous step |
| 3.14     | `chore/phase-3-review`  | Web app preview per PR replaces Storybook previews; phase report.                                                                                                                | Full loop e2e on web passes; owner runs it on the A54.                                                    | 3.13          |

### Phase 4: the other screens

Phase goal: every screen in section 4 is reachable and works with local data.

One step per screen, each with its new components story-first (same Done as phases 1–3): 4.1 Review · 4.2 Word bank · 4.3 Lessons · 4.4 Boss round (every 5th lesson, over the last 5) · 4.5 Score (one rank per 10 lessons, 8 ranks) · 4.6 Stats · 4.7 Settings · 4.8 Account · 4.9 Menu · 4.10 phase report.

### Phase 5: backend

Phase goal: words are normalised and lessons generated by Gemini through Supabase, and a signed-in user's data syncs between web and phone.

| Step | Goal (SMART)                                                                                                                                                  | Done when                                                                                   |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 5.1  | Decide local (Supabase CLI, needs Docker Desktop) or cloud Supabase (D19); a test Edge Function that imports a `core` type through the Deno import map (D18). | `supabase functions serve` + `curl` returns the typed response; `deno check` passes.        |
| 5.2  | Schema + row-level security migrations; CI runs them against local Supabase.                                                                                  | Migration test: a user can't read another user's rows.                                      |
| 5.3  | `normalise` Edge Function (Gemini Flash), replacing its mock.                                                                                                 | Contract test with recorded Gemini responses; app uses it behind the same `core` interface. |
| 5.4  | `story` + gap sentences + native sentences function.                                                                                                          | Same as 5.3.                                                                                |
| 5.5  | Translation check function.                                                                                                                                   | Same as 5.3.                                                                                |
| 5.6  | Pronunciation score function.                                                                                                                                 | Same as 5.3.                                                                                |
| 5.7  | Google sign-in, guest → account upload. Writes learning task 6.                                                                                               | Sign in on web; local words appear in Postgres.                                             |
| 5.8  | Sync (`updatedAt`, newest wins).                                                                                                                              | Edit on web → appears on the phone after sync, and the reverse.                             |

### Phase 6: extension, device features, larger screens

6.1 extension (WXT: save word + sentence + page link) · 6.2 Gemini TTS story audio + speed · 6.3 notifications (daily digest; word of the moment 3×/day 10:00–20:00) · 6.4 widgets (small, medium) · 6.5 tablet ≥600 and desktop ≥1024 layouts. Each step: SMART goal and Done when written into this file before the phase starts.

### Phase 7: polish and QA

7.1 reduced motion (no flip, no XP count-up) · 7.2 contrast check (`line-strong` never for text) · 7.3 screen reader pass + ≥48px targets on every screen · 7.4 App language EN/RU switch check · 7.5 full flow once with native = RU and once with native = EN. Each step: Done when written before the phase starts.

## 7. Out of scope for the first version

- Payments ("FREE · UPGRADE" row is a placeholder)
- Export to CSV / Anki (row present, action later)
- Help & feedback content
- Google Play and iOS releases
- Visual snapshot tests (add once the UI is stable)
