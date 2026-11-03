# Daily Chunk: implementation plan

Status: **planning only, nothing implemented yet.**

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

## 2. Decisions to confirm before coding

The repo is empty, so there are no existing components or conventions yet. Recommendations:

| # | Decision | Recommendation | Why | Alternative |
| --- | --- | --- | --- | --- |
| D1 | App stack | **Expo (React Native) + TypeScript + Expo Router** | Design needs push notifications, home-screen widgets, mic recording, TTS: all native features. `react-native-web` also covers the desktop layout from the system. | React + Vite PWA (faster to build, but no real widgets, weaker iOS push and recording) |
| D2 | Styling | **NativeWind v4 (Tailwind 3.4) + React Native Reusables** (shadcn/ui port). Tokens defined in `DESIGN.md`, implemented in `global.css` + `tailwind.config.js` (DESIGN.md §10). All lengths in rem, `1rem = 16px` | shadcn components and API, one set of CSS variables for web and native | `StyleSheet` + typed theme object |
| D3 | State / data | Zustand for UI state, local SQLite (`expo-sqlite`) for words and reviews, offline-first | SRS must work offline; data is per-user and small | Remote DB only |
| D4 | Backend + AI | Small API (e.g. Supabase or a serverless function) that calls an LLM for: word normalisation, story generation, translation checking, pronunciation feedback | Keys must not ship in the app | Run everything on device (not realistic for AI) |
| D5 | Auth | Google sign-in (Account screen shows "Google sign-in") | Matches design | Email magic link |
| D6 | Logo | Direction **B, Sheriff badge** (marked CHOSEN on the Logo artboard; the star badge with "DC" already used in the screen headers) | Design says so | A or C |
| D7 | App name | **Daily Chunk** ("Daily Wort" was the working title) | Canvas title, logo and screens all say Daily Chunk | |
| D8 | Languages | **Target: German. Native: Russian, English.** UI language follows the native language by default (changeable in Settings) | User decision | — |

Phases 1–4 below use mock data only, so D3/D4/D5 can wait until phase 5.

## 2a. Languages: built to extend

v1 ships one target language (German) and two native languages (Russian, English). Nothing outside `src/languages/` may hard-code German, Russian or English.

**Three separate language settings**
- `targetLang`: what you learn (v1: `de`)
- `nativeLang`: translations, hints, explanations (v1: `ru`, `en`)
- `uiLang`: app interface strings (v1: `en`, `ru`; defaults to `nativeLang`)

**Language packs** (`src/languages/<code>/`)
- *Target pack* (`de`): grammatical genders and their articles (`masc` → der, `fem` → die, `neut` → das, `plural` → die … Pl.), which parts of speech show a gender chip, how a noun is displayed (article + capitalised noun), accepted typing alternatives (ae/oe/ue/ss → ä/ö/ü/ß), TTS voice options, grammar-tip rules used in feedback (e.g. an + dem = am).
- *Native pack* (`ru`, `en`): name, font needs (Cyrillic → Russo One for display, Pixelify Sans for pixel UI; Plex covers both). See DESIGN.md §5.1.
- *UI strings* (`src/i18n/en.json`, `ru.json`): every visible string, including Chunk's lines (EN and RU versions of each).

**What this changes in the design**
- Article colour tokens stay as designed, but code uses them through **semantic gender roles** (`gender-masc`, `gender-fem`, `gender-neut`, `gender-plural`). The German pack maps them to der/die/das. A future language with 2 genders (French, Spanish) uses only masc/fem; one with none (English) hides the chip. Always show the article word with the colour, as the design system requires.
- Task 6 "RU → DE" becomes **"native → target"**, labelled from the pair (`RU → DE`, `EN → DE`).
- The Account rows "Native language" and "German level" become "Native language" and "<target> level"; Settings gets "App language".
- Word data stores translations per native language (`translations: { ru: "вокзал", en: "station" }`), so switching native language doesn't lose words.
- The AI backend takes `{ targetLang, nativeLang }` on every call (normalise, story, gap fill, translation check, pronunciation).
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

Build these once, then compose screens. Names match the design system where one exists. Base pieces come from React Native Reusables in `src/components/ui/`; DESIGN.md §9 maps each app component to its base and tokens. Every component ships a meta file next to it (`<Name>.meta.ts`, DESIGN.md §14).

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

### Phase 0: project setup
- `npx create-expo-app` (TypeScript, Expo Router), ESLint + Prettier, Jest + React Native Testing Library
- NativeWind v4 + React Native Reusables (`components.json`), `inlineRem: 16` in `metro.config.js` (DESIGN.md §2, §10)
- Load fonts with `expo-font` / `@expo-google-fonts`: Bungee, Russo One, VT323, Pixelify Sans, IBM Plex Sans 400/600
- Check that rem breakpoints work on native (DESIGN.md §15 Q1)
- Fill in the Commands section of `CLAUDE.md`

### Phase 1: theme from DESIGN.md
- Write `global.css` (palette, shadcn and domain variables) and the theme part of `tailwind.config.js` exactly as in DESIGN.md §10
- `Text` variants (DESIGN.md §5.3)
- Lint rule: no hex colours or px values under `src/` (DESIGN.md §10.4)
- Hard shadows on native: RN `shadow*` blurs, so draw the offset shadow as an absolutely-positioned block behind the element (`HardShadow` wrapper). Web can use `boxShadow`.
- Scanline overlay: SVG pattern (1px line every 4px, ink at 4%)

### Phase 2: primitives and components
- Build everything in section 5 against a dev-only gallery route `/dev/components` that shows each state (like the design-system previews)
- `ComponentMeta` type in `src/components/meta.ts`, with typed `SemanticToken` and `TextVariant` lists (DESIGN.md §14)
- Each component ships its `<Name>.meta.ts`, with every state from the meta shown in the gallery
- Each component gets a render test and an accessibility test (role, label, state)
- A test checks that every token named in a meta exists in `global.css` / the type scale

### Phase 3: navigation shell
- `(tabs)` layout with the custom `TabBar` (HOME, LESSONS, SCORE, STATS)
- Burger `Drawer` from every tab screen header
- Lesson stack with the 6 tasks + Done; quitting asks before leaving
- Static routes for Review, Word bank, Boss round, Settings, Account

### Phase 4: screens with mock data
- `src/mocks/` holds the exact demo content from the screens (Bahnhof, Fahrkarte, verspätet, Gleis; lesson 13; 1240 XP; streak 12/13; story "Der letzte Zug")
- Build screens in flow order: Home → Confirm → Flashcards → Listen → Read → Record → GapFill → Translate → Done → Review → WordBank → Boss → Settings → Menu → Account → Lessons → Score → Stats
- Done when each screen has the content, order and states of its `.dc.html` (behaviour like the design's script block), styled only with system tokens and components (side-by-side screenshot check at 390×844)

### Phase 5: real data and logic
- Data model: `Word` (targetLang, lemma, gender, plural, forms, pos, translations per native language, srsStage, dueAt), `Lesson` (targetLang, nativeLang, words, tasks, scores), `ReviewLog`, `Profile` (targetLang, nativeLang, uiLang, goal, level per target language, tutor mode, notification settings)
- SRS scheduler: intervals 1, 3, 7, 14, 30 days; wrong answer → back to 1 day; correct at 30 → learned
- Lesson generator: every 5th lesson = Boss round over the last 5
- XP, streak, ranks (one per 10 lessons, 8 ranks from the Score screen)
- Backend endpoints: normalise words, generate story + phrases + gap sentences + RU sentences, check translation, pronunciation score
- Answer checking accepts umlaut alternatives (ae/oe/ue/ss) and shows the correct spelling

### Phase 6: device features and larger screens
- Audio: TTS (`expo-speech` or backend voice "FEMALE · BERLIN"), speed control
- Recording: `expo-audio`, upload for scoring; keep a transcript as text alternative
- Dictation on Home and Translate (speech-to-text)
- Notifications: daily digest at chosen time; word of the moment 3×/day 10:00–20:00
- Widgets: small (word now, streak), medium (today) via native widget modules (iOS WidgetKit / Android Glance)
- Tablet ≥600 and desktop ≥1024 layouts from the system README (rail, 720 column, 12-col grid)

### Phase 7: polish and QA
- Reduced motion: no flip animation, no XP count-up
- Contrast check (note: `line-strong` is 4.3:1 on bg-000; fine for borders at 3:1, never use it for text)
- Screen reader pass on every screen; every control ≥48px
- UI language EN / RU switch (strings live in `src/i18n/` from day one, so this is a check, not a rewrite)
- Run the whole flow once with native = RU and once with native = EN

## 7. Out of scope for the first version
- Payments ("FREE · UPGRADE" row is a placeholder)
- Export to CSV / Anki (row present, action later)
- Help & feedback content
