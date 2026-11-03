# Daily Chunk: implementation plan

Status: **decisions confirmed, phase 0 next.**

## 1. What we are building

A mobile-first vocabulary trainer. **v1: learn German, with Russian or English as the native language.** Built so more languages can be added later (see section 2a). The user types or dictates the words they met today; the app normalises them (dictionary form, article, plural, Russian translation), the user confirms, and the app builds a 6-task lesson from them. Words then go into spaced repetition (1, 3, 7, 14, 30 days). Every 5th lesson unlocks a "Boss round" test. A tutor character ("Chunk") speaks in short, dry one-liners.

Look: "Arcade Night": dark only, scanline ground, square corners, hard pink offset shadows, Bungee / VT323 / IBM Plex Sans. Full visual spec: [`DESIGN.md`](DESIGN.md).

### Sources (copied into `design/`)

| Source | Link | Local copy |
| --- | --- | --- |
| Screens canvas "Daily Chunk Mobile" (20 artboards, 390×844) | https://claude.ai/code/artifact/612f1a57-16a0-467d-87a6-6097f560f8d7 | `design/screens/*.dc.html`, `design/screens/canvas.json` |
| Design system | https://claude.ai/artifact/WPoD6RE9v815a6kdYTLzX8 | `design/system/README.md`, `design/system/tokens.json`, `design/system/components/*.md` |
| Design spec (single source of truth for visuals) | — | [`DESIGN.md`](DESIGN.md), built from the design system above |

**How to use each source:**
- **Canvas = logic and content.** Which screens exist, what is on each one, the flow between them, navigation structure, copy, demo data, interactive behaviour (the `<script data-dc-script>` blocks).
- **`DESIGN.md` = how it looks.** Colours, type scale, spacing (rem), radii, shadows, sizes, breakpoints, motion, the shadcn token mapping, component styling, icon style, accessibility rules. `design/system/` is the original reference it was built from.
- When they disagree: *what* is shown → canvas; *how* it looks → `DESIGN.md`. Known conflicts are in section 3.

## 2. Decisions (confirmed 2026-11-03)

v1 is for the owner's daily use and as a portfolio piece. Test device: Samsung A54 (Android). The same app also runs on web. No Play Store or iOS release in v1.

| # | Decision | Choice |
| --- | --- | --- |
| D1 | App stack | **Expo (React Native) + TypeScript + Expo Router**. One app for Android, iOS and web (`react-native-web`). |
| D2 | Styling | **React Native Reusables (shadcn port) on NativeWind v4 (Tailwind 3.4)**, exactly as DESIGN.md §10. All lengths in rem, `1rem = 16px`. |
| D3 | State / data | Zustand for UI state. **Offline-first**: words, lessons and SRS in `expo-sqlite`. Local-only until sign-in exists; then sync to Supabase, each row has `updatedAt`, newest change wins. |
| D4 | Backend | **Supabase**: Postgres, row-level security, Edge Functions. Config in `supabase/`. |
| D4a | AI | **Gemini API**, called only from Edge Functions; key stored as a Supabase secret. Flash for normalising and checking, Flash for stories too (switch to Pro only if stories read badly). `packages/core` defines the request/response types, so the provider can be swapped. |
| D5 | Auth | **Guest first.** Google sign-in (Supabase) is optional and turns on sync of words, lessons and history. On first sign-in, local data uploads. The extension always needs sign-in. |
| D6 | Logo | Direction **B, Sheriff badge** |
| D7 | App name | **Daily Chunk** |
| D8 | Languages | Target German; native Russian, English. UI language follows native by default. |
| D9 | Repo | **Monorepo: npm workspaces + Nx** (Nx as task runner only, no `@nx/expo` plugin). Internal packages export TypeScript source (section 2b). |
| D10 | Component workshop | **Storybook for web** (`@storybook/react-native-web-vite`). Every component and every screen has a story. No on-device Storybook. |
| D11 | Tests | **One suite: Vitest.** Stories run as browser tests via the Storybook Vitest addon (interactions + accessibility). `packages/core` logic uses plain Vitest; coverage floor 80% for `core`. Fallback to Jest if the addon can't run the React Native web setup. No visual snapshots for now. |
| D12 | Audio | TTS: device voices (`expo-speech`) first; Gemini TTS for story audio in phase 6, cached per lesson. Pronunciation: recording → Edge Function → Gemini returns transcript, score, words to fix (mocked until the backend exists). Dictation: `expo-speech-recognition` (German), Web Speech API on web. |
| D13 | Browser extension | After the core loop. **WXT** + small React popup in `apps/extension`. Saves the selected word, its sentence and the page link to today's list; the app shows them on Home to confirm. Requires sign-in. |
| D14 | Hosting and deploys | **EAS** (Expo Application Services): Hosting for web, Build for the Android APK, Update for over-the-air JS updates. Supabase deploys from `main` (backend phase). Extension zip uploaded by hand later. Details in section 2c. |
| D15 | Running on the phone | Expo Go until a native library is needed (dictation on Home), then a development build. |

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
```

Inside `apps/app/`: `app/` (routes), `global.css`, `tailwind.config.js`, `src/theme/`, `src/components/ui/`, `src/components/`, `src/features/`, `src/mocks/`.

**Sharing code without "invisible types":**
- Each package's `package.json` points `exports` at its TypeScript source (`"exports": { ".": "./src/index.ts" }`). No build step for packages.
- Every consumer lists what it imports (`"@daily-chunk/core": "*"`).
- One `tsconfig.base.json` at the root, extended by every project. No hand-written `paths` aliases.
- `nx run-many -t typecheck` runs `tsc --noEmit` everywhere, locally and in CI.
- Edge Functions run on Deno and import shared packages through an import map pointing at `packages/*/src`.

## 2c. CI / CD

**CI (GitHub Actions, every PR, merge blocked until green):** all through `nx affected`
- `prettier --check`
- `lint`, including the design rule (no hex / px under `src/`, DESIGN.md §10.4)
- `typecheck`
- `test` (Vitest: stories + core logic, 80% coverage floor on `core`)
- meta check: every component has a `.meta.ts`, every token it names exists
- `expo export --platform web`
- backend phase: migrations checked against a local Supabase

**CD:**
- Design phase: Storybook preview link per PR (EAS Hosting), Storybook live on merge to `main`
- After the design phase: web app preview link per PR, production web on merge to `main` (EAS Hosting)
- Android: every merge to `main` publishes an EAS Update. A new APK (EAS Build, internal distribution) only when a native library is added or Expo is upgraded; the PR says so.
- Supabase: migrations + Edge Functions deploy from `main` once the backend phase starts

## 2d. How we work

- **Steps:** one step per branch. Each step: tests → reviewer subagent with a fresh context checks (1) tests, lint, typecheck, (2) design rules and metas, (3) language rules and no hard-coded strings, (4) a browser run compared against the `.dc.html` at 390×844 → fixes → the owner tries it and says OK → next step.
- **Learning:** concepts are explained in chat when they first come up, plus a short note in `docs/learn/<topic>.md` in the same branch.
- **Learning tasks** in `docs/tasks/NN-<topic>.md`: why it matters, files to touch, steps, hints, "done when". The owner does it and says "check"; it gets reviewed, then work continues. While a task is open, other work continues on parts that don't touch its files.
  1. Structure: create a shared package and import it in the app
  2. Styles: one small component with NativeWind, tokens, meta and story (design phase)
  3. Navigation: add a route and pass data between screens
  4. Interactions: a controlled component + screen state + a Zustand store
  5. Data: save and read words in SQLite
  6. Auth: Google sign-in and a protected route

## 2a. Languages: built to extend

v1 ships one target language (German) and two native languages (Russian, English). Nothing outside `packages/languages/` may hard-code German, Russian or English.

**Three separate language settings**
- `targetLang`: what you learn (v1: `de`)
- `nativeLang`: translations, hints, explanations (v1: `ru`, `en`)
- `uiLang`: app interface strings (v1: `en`, `ru`; defaults to `nativeLang`)

**Language packs** (`packages/languages/<code>/`)
- *Target pack* (`de`): grammatical genders and their articles (`masc` → der, `fem` → die, `neut` → das, `plural` → die … Pl.), which parts of speech show a gender chip, how a noun is displayed (article + capitalised noun), accepted typing alternatives (ae/oe/ue/ss → ä/ö/ü/ß), TTS voice options, grammar-tip rules used in feedback (e.g. an + dem = am).
- *Native pack* (`ru`, `en`): name, font needs (Cyrillic → Russo One for display, Pixelify Sans for pixel UI; Plex covers both). See DESIGN.md §5.1.
- *UI strings* (`packages/i18n/en.json`, `ru.json`): every visible string, including Chunk's lines (EN and RU versions of each).

**What this changes in the design**
- Article colour tokens stay as designed, but code uses them through **semantic gender roles** (`gender-masc`, `gender-fem`, `gender-neut`, `gender-plural`). The German pack maps them to der/die/das. A future language with 2 genders (French, Spanish) uses only masc/fem; one with none (English) hides the chip. Always show the article word with the colour, as the design system requires.
- Task 6 "RU → DE" becomes **"native → target"**, labelled from the pair (`RU → DE`, `EN → DE`).
- The Account rows "Native language" and "German level" become "Native language" and "<target> level"; Settings gets "App language".
- Word data stores translations per native language (`translations: { ru: "вокзал", en: "station" }`), so switching native language doesn't lose words.
- The AI backend (Edge Functions) takes `{ targetLang, nativeLang }` on every call (normalise, story, gap fill, translation check, pronunciation).
- Mocks: keep the Russian demo copy from the canvas and add an English twin for each screen.

**Adding a language later** = add a pack + UI strings + backend prompt support. No screen changes.

## 3. Design conflicts (canvas vs. design system)

Split rule: content/logic → canvas, visuals → `DESIGN.md`. "System" below means the original `design/system/` files.

| Topic | Kind | System says | Canvas shows | Use |
| --- | --- | --- | --- | --- |
| Name | content | Daily Wort | Daily Chunk | **Daily Chunk** (resolved: `design/system/` renamed) |
| Navigation items | content | Tabs WORDS · LEARN · REVIEW · ME | Tabs HOME · LESSONS · SCORE · STATS + burger menu (Account, Lessons, Review, Word bank, Boss round, Settings, Help) | Canvas (resolved: `design/system/` updated) |
| Tab bar look | visual | 56px + safe area, labels pixel 22px / 2px spacing, active yellow, others `ink-muted`, badge pink fill | min 60px, labels 18px, active also has a 3px yellow inset top bar | System (keep the yellow top bar as the active marker: it doesn't contradict the system) |
| Review (S10) mechanic | logic | Swipe flashcards (right = knew, left = again) | der/die/das picker with interval feedback ("NEXT REVIEW IN 14 DAYS" / "BACK TO 1 DAY") | Canvas; swipe flashcards can come later as a second review mode |
| Home main CTA | content | START LESSON | CHECK MY WORDS → Confirm (which has START LESSON) | Canvas |
| Tutor quote box | visual | padding 24/14/14, text pixel 24/26 | padding 22/14/12, text 23px / 1.1 | System |
| Section labels | visual | `label` 24px / 2px spacing | 20–22px | System type scale |
| Flashcard audio | visual | 48px cyan-outline audio button in the card footer | LISTEN button under the card | Keep canvas placement (content), apply system button style; confirm with user |
| Flashcard border | visual | 2px `line` | 2px `line` + `shadow-hard` | Same in both |
| Tablet / desktop | visual | Rail 240px, 720px lesson column, 1200px page, 12-col grid, display sizes grow | Not drawn | System (phase 6) |

Rule for building a screen: take the structure, copy and states from its `.dc.html`, then restyle every element with the matching token or component from `DESIGN.md`, not the inline px values in the canvas file.

## 4. Screens and routes

Expo Router file routes. Tab screens live in `app/(tabs)/`; the lesson flow is a stack in `app/lesson/`.

| Design file | Canvas title | Route | Interactive bits in the design |
| --- | --- | --- | --- |
| `Main.dc.html` | S1 Home · Add words | `/(tabs)/index` | textarea, dictate button, word count "MIN 3", "5 DUE FOR REVIEW" link, boss progress (5 segments) |
| `Confirm.dc.html` | S2 Confirm words | `/confirm` | editable rows (chip + word + forms + RU), plural-normalised notice (dashed orange) |
| `Flashcards.dc.html` | S3 Task 1 · Flashcards | `/lesson/flashcards` | tap to flip (front/back), LISTEN, AGAIN / KNEW IT |
| `Listen.dc.html` | S4 Task 2 · Listen & shadow | `/lesson/listen` | 2-step indicator, speed 0.75×, pause, record repeat |
| `Read.dc.html` | S5 Task 3 · Read the story | `/lesson/read` | RU ON/OFF toggle, tap an underlined word → popover card |
| `Record.dc.html` | S6 Task 4 · Read aloud | `/lesson/record` | play recording, score 86%, retry-word chips, tutor verdict |
| `GapFill.dc.html` | S7 Task 5 · Gap fill | `/lesson/gap-fill` | part A article pick (3 options), part B word pick (2×2), ✓/✗ states |
| `Translate.dc.html` | S8 Task 6 · native → target (RU/EN → DE) | `/lesson/translate` | textarea, voice answer, "USE:" chips, correction with diff |
| `Done.dc.html` | S9 Lesson done | `/lesson/done` | 3 stat tiles (XP, streak, accuracy), tutor quote, words added to review |
| `Review.dc.html` | S10 Review | `/review` | der/die/das picker, feedback line, NEXT CARD |
| `WordBank.dc.html` | S11 Word bank | `/word-bank` | 4 counters, search, NEW/LEARNING/LEARNED tabs, article filter, 5-pip SRS stage |
| `Test.dc.html` | S12 Boss round | `/boss` | lives (3 hearts), score, 3-part stepper, sentence builder tiles (add/remove) |
| `Settings.dc.html` | S13 Settings | `/settings` | Chunk mode radio (Full/Mild/Quiet), digest time, word-of-the-moment switch, language & voice rows |
| `Notifications.dc.html` | Push & home widgets | (native) | 2 push templates, small widgets (word, streak), medium widget (today) |
| `Menu.dc.html` | Burger menu (open) | drawer | 312px drawer, dim overlay, profile row, 7 items with badges, log out, version |
| `Account.dc.html` | My account | `/account` | profile card, native language, level, daily goal radio (3/5/10/15), plan, export, recordings, delete account |
| `Lessons.dc.html` | Tab · Lessons | `/(tabs)/lessons` | today card (START ▶), boss locked card, past lessons list with score colour |
| `Score.dc.html` | Tab · Score | `/(tabs)/score` | rank card, progress to next rank, 8-rank ladder, 3 badges |
| `Stats.dc.html` | Tab · Stats | `/(tabs)/stats` | WEEK/MONTH tabs, bar chart, article accuracy bars, 3 summary tiles |
| `Logo.dc.html` | Logo · 3 directions | — | reference only; build app icon + `Logo` component from direction B |

## 5. Component inventory

Each component ships with a meta and a story. The design phase builds the ones the core loop (Home → Done) needs; the rest come with their screens. Names match the design system where one exists. Base pieces come from React Native Reusables in `src/components/ui/`; DESIGN.md §9 maps each app component to its base and tokens. Every component ships a meta file next to it (`<Name>.meta.ts`, DESIGN.md §14).

**Primitives**
- `Screen`: scanline background, safe-area padding (`pt-screen-top px-gutter pb-screen-bottom`), optional tab bar slot
- `Text` with `variant` (the type scale in DESIGN.md §5.2), picks the Cyrillic display/pixel font from `uiLang`
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

## 6. Phases

Every component and screen is built story-first in Storybook. Steps follow section 2d.

### Phase 0: project setup (`chore/project-setup`)
- Root: npm workspaces, Nx (`nx.json`), `tsconfig.base.json`, Prettier, ESLint
- `apps/app`: `create-expo-app` (TypeScript, Expo Router), NativeWind v4 + React Native Reusables (`components.json`), `inlineRem: 16` (DESIGN.md §2, §10)
- Fonts via `@expo-google-fonts`: Bungee, Russo One, VT323, Pixelify Sans, IBM Plex Sans 400/600
- Storybook for web + Vitest addon; Vitest for packages
- `packages/core`, `packages/languages`, `packages/i18n` as empty internal packages
- GitHub Actions CI (section 2c), branch protection on `main`
- EAS project, Storybook preview deploy
- **Proofs before phase 0 is done:**
  - a type from `@daily-chunk/core` is imported and type-checks in the app (native + web), in Vitest and in a test Edge Function (Deno import map)
  - a NativeWind-styled component renders correctly in web Storybook and runs as a Vitest story test
  - rem breakpoints on native (DESIGN.md §15 Q1)
- Learning task 1 (structure)
- Fill in the Commands section of `CLAUDE.md`

### Phase 1: design system (theme + core-loop components)
- `global.css` and the theme part of `tailwind.config.js` exactly as in DESIGN.md §10
- `Text` variants (DESIGN.md §5.3), `Screen`, `HardShadow` (absolutely-positioned block on native, `boxShadow` on web), `PressableFocus`, scanline overlay (SVG pattern)
- Lint rule: no hex colours or px values under `src/` (DESIGN.md §10.4)
- `ComponentMeta` type in `src/components/meta.ts` (DESIGN.md §14) + meta check
- Components the core loop uses (Home, Confirm, the 6 tasks, Done), each with meta + story + story tests (role, label, state)
- Learning task 2 (styles)
- The owner reviews the kit in Storybook before phase 2

### Phase 2: core-loop screen stories
- `src/mocks/` with the exact demo content from the screens (Bahnhof, Fahrkarte, verspätet, Gleis; lesson 13; 1240 XP; streak 12/13; story "Der letzte Zug"), plus an English twin
- Screen stories for Home → Confirm → Flashcards → Listen → Read → Record → GapFill → Translate → Done, compared against each `.dc.html` at 390×844

### Phase 3: core loop in the app, one step per branch
- Navigation shell: `(tabs)` layout with `TabBar`, burger `Drawer`, lesson stack; quitting a lesson asks before leaving (learning task 3)
- Steps in order: Home → Confirm → Flashcards → Listen → Read → Record → GapFill → Translate → Done
- Real local logic from the start: `Word` / `Lesson` / `ReviewLog` / `Profile` model, SQLite storage, SRS scheduler (1, 3, 7, 14, 30 days; wrong → 1 day; correct at 30 → learned), XP and streak (learning tasks 4, 5)
- AI steps (normalise, story, gap sentences, translation check, pronunciation score) use mocks behind the `core` interfaces
- Answer checking accepts umlaut alternatives (ae/oe/ue/ss) from the target pack and shows the correct spelling
- Switch from Expo Go to a development build when dictation arrives (Home)
- Web app previews replace Storybook previews per PR

### Phase 4: the other screens
- Review, Word bank, Boss round (every 5th lesson over the last 5), Lessons, Score (ranks: one per 10 lessons, 8 ranks), Stats, Settings, Account, Menu
- Their remaining components, story-first

### Phase 5: backend
- Supabase project, migrations, row-level security, Supabase CI checks
- Edge Functions calling Gemini: normalise words, generate story + phrases + gap sentences + native sentences, check translation, pronunciation score. Every call passes `{ targetLang, nativeLang }`.
- Google sign-in (guest → account, local data uploads), sync (learning task 6)

### Phase 6: extension, device features, larger screens
- `apps/extension` (WXT): save word + sentence + page link
- Gemini TTS for story audio, speed control
- Notifications: daily digest at chosen time; word of the moment 3×/day 10:00–20:00
- Widgets: small (word now, streak), medium (today) via native widget modules (iOS WidgetKit / Android Glance)
- Tablet ≥600 and desktop ≥1024 layouts from the system README (rail, 720 column, 12-col grid)

### Phase 7: polish and QA
- Reduced motion: no flip animation, no XP count-up
- Contrast check (note: `line-strong` is 4.3:1 on bg-000; fine for borders at 3:1, never use it for text)
- Screen reader pass on every screen; every control ≥48px
- UI language EN / RU switch (strings live in `packages/i18n/` from day one, so this is a check, not a rewrite)
- Run the whole flow once with native = RU and once with native = EN

## 7. Out of scope for the first version
- Payments ("FREE · UPGRADE" row is a placeholder)
- Export to CSV / Anki (row present, action later)
- Help & feedback content
- Google Play and iOS releases
- Visual snapshot tests (add once the UI is stable)
