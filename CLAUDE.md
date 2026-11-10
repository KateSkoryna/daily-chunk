# Daily Chunk

Mobile-first vocabulary trainer. **v1: target language German; native language Russian or English.** Must stay open to more languages (rules below). The user adds the words they met today; the app normalises them and runs a 6-task lesson (flashcards → listen & shadow → read story → read aloud → gap fill → RU→DE), then spaced repetition and a Boss round every 5th lesson. A tutor character, "Chunk", speaks in short dry one-liners.

**Status:** decisions confirmed (`plan.md` §2), phase 0 (project setup) built; phase 1 next. See `plan.md` for decisions, repo layout, CI/CD, how we work (§2d), phases and the screen/route map. Step status and results: `docs/progress.md`. Don't start a phase until the user asks.

## Index

| Path                            | What                                                                                                                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DESIGN.md`                     | **Design system, single source of truth for visuals**: tokens (rem), shadcn variable mapping, type scale, components, NativeWind config                                                          |
| `plan.md`                       | Implementation plan: decisions, repo layout, CI/CD, how we work (incl. the `/loop` protocol), phases split into steps with goals and done-when checks, screen → route table, component inventory |
| `docs/progress.md`              | Status and evidence for every step, phase reports, owner actions and questions                                                                                                                   |
| `design/screens/*.dc.html`      | The 20 designed screens (390×844), one file each. Markup + inline styles + a `<script data-dc-script>` block with the demo state logic                                                           |
| `design/screens/canvas.json`    | Screen titles and order (S1–S13 + tabs, menu, account, logo, notifications)                                                                                                                      |
| `design/system/README.md`       | Original design system brand book (reference for DESIGN.md): product flow, visual rules, layout specs (mobile/tablet/desktop), voice, icons, a11y                                                |
| `design/system/tokens.json`     | Original token values (px) that DESIGN.md was built from                                                                                                                                         |
| `design/system/components/*.md` | Specs: ArticleChip, Button, GapFill, LessonStepper, RecordButton, TabBar, TutorQuote, WordCard                                                                                                   |

Design links: screens https://claude.ai/code/artifact/612f1a57-16a0-467d-87a6-6097f560f8d7 · system https://claude.ai/artifact/WPoD6RE9v815a6kdYTLzX8

**How to use the sources:**

- `design/screens/` (canvas) = **logic and content**: which screens exist, what's on them, flow, navigation, copy, demo data, interactive behaviour.
- `DESIGN.md` = **how it looks**: tokens, component styling and states, layout, icons, a11y. Read it before building any UI.
- Disagreement: _what_ → screens, _how it looks_ → `DESIGN.md`. Never copy inline px/hex values from a `.dc.html`; map them to `DESIGN.md` tokens and components. Conflict list in `plan.md` §3.

## Stack (plan.md §2)

Monorepo: npm workspaces + Nx (task runner only). Expo (React Native) + TypeScript + Expo Router for Android, iOS and web. React Native Reusables (shadcn) on NativeWind v4, `react-native-svg` for icons, Zustand, `expo-sqlite` (offline-first). Storybook for web; Vitest for all tests. Backend: Supabase (Postgres, Google auth, Edge Functions) calling the Gemini API. Deploys: EAS (Hosting, Build, Update). Fonts: Bungee, Russo One (Cyrillic display), VT323, Pixelify Sans, IBM Plex Sans 400/600.

Layout:

```
apps/app/                Expo app + Storybook (.storybook/)
  app/                   Expo Router routes: (tabs)/, lesson/, review, word-bank, boss, settings, account
  global.css             CSS variables from DESIGN.md §10.1
  tailwind.config.js     theme from DESIGN.md §10.2
  src/theme/             fonts, HardShadow, Scanlines
  src/components/ui/     React Native Reusables components, restyled per DESIGN.md §9
  src/components/        primitives + app components (see plan.md §5)
  src/features/          words, lesson, srs, review, boss, stats, settings
  src/mocks/             demo content copied from the design screens
apps/extension/          WXT browser extension (later)
packages/core/           domain types, SRS, lesson generator, AI request/response types
packages/languages/      language packs: de/ (target rules), ru/, en/ (native)
packages/i18n/           EN / RU UI strings, incl. Chunk's lines
supabase/                migrations, Edge Functions
docs/learn/, docs/tasks/ learning notes and the owner's learning tasks
```

Paths in `DESIGN.md` like `src/languages/` and `src/i18n/` mean `packages/languages/` and `packages/i18n/`; `src/components/` means `apps/app/src/components/`.

## Workflow (must follow, plan.md §2d)

- Every component and screen gets a story (`*.stories.tsx`) next to its meta. Stories are the component tests.
- Phases run step by step with `/loop run plan.md phase <N>` following `plan.md` §2d: pick the next `TODO` step, build only its scope, prove every "Done when" item, record evidence in `docs/progress.md`.
- Never commit, push, open a PR or merge unless the user says so in chat. Each step is left uncommitted for the user's review; commit only after their OK. The user always merges.
- One step per branch. Before handing a step to the user: run tests, then a reviewer subagent with a fresh context checks tests/lint/typecheck, design rules + metas, language rules, and a browser run against the `.dc.html`. Fix its findings first.
- When a learning task in `docs/tasks/` is open, tell the user, don't touch its files, keep building other parts. Review it when the user says "check".
- Explain new concepts in chat when they first come up and add a short `docs/learn/<topic>.md` note in the same branch.
- Shared packages export TypeScript source; every consumer lists the packages it imports in its `package.json`.

## Commands

Run from the repo root.

| Command                                                           | What it does                                                                   |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `npm ci`                                                          | Install exactly what `package-lock.json` says                                  |
| `npm start`                                                       | Expo dev server, QR code for Expo Go                                           |
| `npm run web`                                                     | Run the app in the browser                                                     |
| `npm run android`                                                 | Run on an Android device or emulator                                           |
| `npx nx run-many -t lint typecheck`                               | Lint and typecheck every project                                               |
| `npm test`                                                        | All tests: packages in Node, stories in headless Chromium (needs Playwright)   |
| `npm run storybook`                                               | Storybook dev server on port 6006                                              |
| `npx nx run @daily-chunk/app:build-storybook`                     | Build Storybook into `apps/app/storybook-static`                               |
| `npx nx run @daily-chunk/app:export:web`                          | Build the web app into `apps/app/dist`                                         |
| `npx prettier --check .` / `npm run format`                       | Check / fix formatting                                                         |
| `cd apps/app && npx eas-cli deploy --export-dir storybook-static` | Manual Storybook preview deploy (needs `eas login`); CI does this after checks |

First time on a new machine: `cd apps/app && npx playwright install chromium`. CI runs the same checks as four parallel jobs (`format`, `lint-typecheck`, `test`, `build`) plus `deploy-storybook`.

## CI/CD and secrets

Follow the global CI/CD and secrets rules; the reasoning is in `plan.md` §2c. The only secret so far is `EXPO_TOKEN` (GitHub secret, deploy step only).

## Git rules (must follow)

- No AI attribution anywhere: no `Co-Authored-By`, "Generated with", or any Claude/AI mention in commits, branch names, PR titles or descriptions, or code.
- Each commit has a clear name that says what changed (e.g. `Add ArticleChip component`).
- One branch = one purpose (e.g. `feat/flashcards-screen`). Don't mix unrelated changes.
- Branch/PR description: concise and short. What changed and why, nothing else.

## Code rules (must follow)

- Avoid comments. Code should explain itself; comment only when the _why_ is impossible to show in code.
- Clear, self-explaining names for variables, functions and components. No abbreviations like `w`, `r`, `p`, `tmp`.
- Reuse components: if a UI pattern appears twice, make it a component.
- Build reusable wrappers for shared behaviour (e.g. `Screen`, `HardShadow`, `PressableFocus`) instead of repeating styles or logic.
- Use component composition: build with `children` and slots (e.g. `<Card><Card.Header/>…</Card>`, `<TopBar left={…} right={…}/>`) instead of one component with many config props. Prefer compound components for related parts (`SegmentedTabs` + `SegmentedTabs.Tab`).
- Make reusable UI components controlled: they take `value` / `selected` / `checked` and report changes with `onChange` / `onSelect` / `onToggle`; they don't own that state. Examples: `Switch`, `SegmentedTabs`, `ArticlePicker`, `OptionGrid`, `WordCard` (`isFlipped` + `onFlip`).
- Keep state where it's used: the lowest screen or feature component that needs it owns it and passes it to the controlled components. Lift it only when siblings share it. Global stores only for app-wide data (profile, words, progress).

## Component metadata (mandatory, never violate)

Every component has a meta file next to it: `<Name>.meta.ts` (format and example: `DESIGN.md` §14).

- **Creating a component** (including one added from React Native Reusables): create its meta in the same commit. A component without a meta is not done.
- **Changing a component** (props, variants, states, tokens, usage): update its meta in the same commit so they always match.
- **Before building a screen or a new component:** read the existing metas and reuse a component whose `useWhen` fits. Make a new one only when none fits.
- **Follow `aiHints`:** never use a component in a way its `avoidWhen` or `invalid` lists.
- Metas name tokens (`primary`, `label`), never values. Use gender roles, not articles. No user-visible copy.
- If a usage rule isn't clear from `DESIGN.md`, the component specs or the screens, **stop and ask the user**. Don't invent it.

## Language rules (must follow)

- Three settings: `targetLang` (v1 `de`), `nativeLang` (`ru` | `en`), `uiLang` (`en` | `ru`, defaults to native).
- No German/Russian/English logic outside `packages/languages/`. Articles, genders, noun display, typing alternatives (ae→ä…), grammar tips and TTS voices come from the target pack.
- Components use semantic gender roles (`gender-masc/fem/neut/plural`), not `der/die/das`. The pack maps roles to article words and the design's article colours.
- No user-visible string in components: everything goes through `packages/i18n/`.
- Translations are stored per native language (`translations.ru`, `translations.en`). Never a `ru` field on its own.
- Labels built from the pair, e.g. task 6 = `RU → DE` / `EN → DE`.
- Every backend call passes `{ targetLang, nativeLang }`.
- Full details: `plan.md` §2a.

## Design rules (mandatory, never violate)

**`DESIGN.md` is the single source of truth for design.** Every colour, font, size, spacing, radius, border, shadow, breakpoint, duration and component style comes from it. These rules are mandatory for every agent and every task. Not following them counts as a bug.

**Before any UI work** (a screen, component, style or layout), read `DESIGN.md` and use only what it defines:

- Only the tokens and classes from `DESIGN.md` (`bg-primary`, `text-label`, `px-gutter`, `border-field`…). No hex, `rgb()`, px or one-off value in code. All lengths in rem.
- Only the semantic and domain tokens in components, never palette names.
- Typography only through `Text` `variant`; shadows only through `HardShadow`; focus only through `PressableFocus`; screen padding and scanlines only through `Screen`.
- shadcn / React Native Reusables components are restyled once in `src/components/ui/` as `DESIGN.md` §9 says, never per screen.
- `design/system/` and `.dc.html` inline styles are reference only. If they differ from `DESIGN.md`, `DESIGN.md` wins.

**Stop and ask the user. Never guess, invent or work around** when:

- a value, token, style or component you need is not in `DESIGN.md`;
- `DESIGN.md` contradicts itself, a screen, a component spec, `plan.md` or this file;
- a rule can't be followed (platform limit, library limit, accessibility conflict);
- a change would need a new token or a change to an existing one.

Show the user: what you were building, which rule or section is involved, the problem, and 1–2 options with a recommendation. Wait for their answer before writing that part. Keep working on parts that don't depend on it.

**Changing `DESIGN.md`** only with the user's explicit approval. Change it first, then `global.css` / `tailwind.config.js`, in the same branch. Never change the config alone.

The core principles, so they're never missed (values are in `DESIGN.md`):

- Dark only. Square corners. Depth = hard offset shadow, never blur.
- Colour jobs: yellow = the one primary action per screen; cyan = focus, inputs, correct; pink = section labels, record, wrong. Correct/wrong always with ✓/✗, never colour alone.
- Gender colours always next to the written article; plural = dashed outline.
- Fonts by job: display (Bungee; Russo One for Cyrillic) = titles, buttons, numbers; pixel (VT323; Pixelify Sans for Cyrillic) = UI labels; content (IBM Plex Sans) = every target-language word and every translation.
- Icons: inline stroke SVG, `currentColor`, no emoji.

## Accessibility (must follow)

- Real buttons/links with `accessibilityRole`, `accessibilityLabel` on icon-only controls, `accessibilityState` for selected/checked.
- Touch targets ≥48px. Focus ring 2px cyan, 2px offset.
- Text ≥4.5:1. `line` (`#5A4E96`) is decorative only; control borders use `line-strong`.
- Respect reduced motion (no card flip, no XP count-up).
- Audio and recordings always have a text alternative.

## Voice

- Tutor lines: max 2 short sentences, second person, dry humour. Errors never scold: show the right answer with its article colour and move on.
- Use the demo copy from the screens as-is in mocks; don't invent filler. Unknown facts become placeholders like `[YOUR PRICE]`.
