# Daily Chunk

Mobile-first vocabulary trainer. **v1: target language German; native language Russian or English.** Must stay open to more languages (rules below). The user adds the words they met today; the app normalises them and runs a 6-task lesson (flashcards → listen & shadow → read story → read aloud → gap fill → RU→DE), then spaced repetition and a Boss round every 5th lesson. A tutor character, "Chunk", speaks in short dry one-liners.

**Status:** planning. See `plan.md` for phases, open decisions (D1–D7) and the screen/route map. Don't start a phase until the user asks.

## Index

| Path | What |
| --- | --- |
| `plan.md` | Implementation plan, decisions, screen → route table, component inventory |
| `design/screens/*.dc.html` | The 20 designed screens (390×844), one file each. Markup + inline styles + a `<script data-dc-script>` block with the demo state logic |
| `design/screens/canvas.json` | Screen titles and order (S1–S13 + tabs, menu, account, logo, notifications) |
| `design/system/README.md` | Design system brand book: product flow, visual rules, layout specs (mobile/tablet/desktop), voice, icons, a11y |
| `design/system/tokens.json` | Source of truth for colours, type, spacing, radius, shadow, sizes, breakpoints, durations |
| `design/system/components/*.md` | Specs: ArticleChip, Button, GapFill, LessonStepper, RecordButton, TabBar, TutorQuote, WordCard |

Design links: screens https://claude.ai/code/artifact/612f1a57-16a0-467d-87a6-6097f560f8d7 · system https://claude.ai/artifact/WPoD6RE9v815a6kdYTLzX8

**How to use the two sources:**
- `design/screens/` (canvas) = **logic and content**: which screens exist, what's on them, flow, navigation, copy, demo data, interactive behaviour.
- `design/system/` = **visual reference**: tokens, component anatomy and states, layout grid, desktop/tablet layouts, icons, a11y.
- Disagreement: *what* → screens, *how it looks* → system. Never copy inline px/hex values from a `.dc.html`; map them to tokens and system components. Conflict list in `plan.md` §3.

## Planned stack (confirm D1–D5 in plan.md first)

Expo (React Native) + TypeScript + Expo Router, `react-native-svg` for icons, Zustand, `expo-sqlite`, small backend for AI calls. Fonts: Bungee, VT323, Pixelify Sans, IBM Plex Sans 400/600.

Planned layout:
```
app/                 Expo Router routes: (tabs)/, lesson/, review, word-bank, boss, settings, account
src/theme/           tokens.ts (generated from design/system/tokens.json), fonts, HardShadow, Scanlines
src/components/      primitives + design-system components (see plan.md §5)
src/features/        words, lesson, srs, review, boss, stats, settings
src/mocks/           demo content copied from the design screens
src/languages/       language packs: de/ (target rules), ru/, en/ (native)
src/i18n/            EN / RU UI strings, incl. Chunk's lines
scripts/build-tokens.ts
```

## Commands

Not set up yet (phase 0). Fill this in once the project is created.

## Git rules (must follow)

- No AI attribution anywhere: no `Co-Authored-By`, "Generated with", or any Claude/AI mention in commits, branch names, PR titles or descriptions, or code.
- Each commit has a clear name that says what changed (e.g. `Add ArticleChip component`).
- One branch = one purpose (e.g. `feat/flashcards-screen`). Don't mix unrelated changes.
- Branch/PR description: concise and short. What changed and why, nothing else.

## Code rules (must follow)

- Avoid comments. Code should explain itself; comment only when the *why* is impossible to show in code.
- Clear, self-explaining names for variables, functions and components. No abbreviations like `w`, `r`, `p`, `tmp`.
- Reuse components: if a UI pattern appears twice, make it a component.
- Build reusable wrappers for shared behaviour (e.g. `Screen`, `HardShadow`, `PressableFocus`) instead of repeating styles or logic.
- Keep state where it's used: put it in the lowest component that needs it; lift it only when siblings share it. Global stores only for app-wide data (profile, words, progress).

## Language rules (must follow)

- Three settings: `targetLang` (v1 `de`), `nativeLang` (`ru` | `en`), `uiLang` (`en` | `ru`, defaults to native).
- No German/Russian/English logic outside `src/languages/`. Articles, genders, noun display, typing alternatives (ae→ä…), grammar tips and TTS voices come from the target pack.
- Components use semantic gender roles (`gender-masc/fem/neut/plural`), not `der/die/das`. The pack maps roles to article words and the design's article colours.
- No user-visible string in components: everything goes through `src/i18n/`.
- Translations are stored per native language (`translations.ru`, `translations.en`). Never a `ru` field on its own.
- Labels built from the pair, e.g. task 6 = `RU → DE` / `EN → DE`.
- Every backend call passes `{ targetLang, nativeLang }`.
- Full details: `plan.md` §2a.

## Design rules (must follow)

- **Tokens only.** Never hard-code a hex, font size or spacing in a component; use `src/theme/tokens.ts`. Change values in `design/system/tokens.json` and regenerate.
- **Dark only.** Ground `bg-000` + scanline overlay; cards `bg-100`; raised `bg-200`.
- **Square corners** (`radius-0`). Only exceptions: progress segments 2px, record button and avatar round.
- **Depth = hard offset shadow** (`4px 4px 0 pink`, hero `6px 6px 0`), never blur. Pressed primary: translate 4px, no shadow.
- **Colour jobs:** yellow = the one primary action per screen; cyan = focus, inputs, correct; pink = section labels, record, wrong. Correct/wrong always with ✓/✗, never colour alone.
- **Article colours:** der `#5AA9FF`, die `#FF6B6B`, das `#4ADE80`, plural = dashed orange outline. The article word is always written next to the colour.
- **Fonts by job:** Bungee = titles, buttons, numbers (Latin only, unicase: never target-language words or Cyrillic). VT323 = labels/UI copy, uppercase, numbered like `01 / FLASHCARDS` (Pixelify Sans for Cyrillic). IBM Plex Sans = every target-language word and sentence and all translations.
- **Icons:** inline stroke SVG, 24 viewBox, stroke 2, square caps, `currentColor`. No emoji.
- **Layout (mobile):** padding 56/24/16, primary button full width 64px pinned above the 4-tab bar (HOME · LESSONS · SCORE · STATS).

## Accessibility (must follow)

- Real buttons/links with `accessibilityRole`, `accessibilityLabel` on icon-only controls, `accessibilityState` for selected/checked.
- Touch targets ≥48px. Focus ring 2px cyan, 2px offset.
- Text ≥4.5:1. `line` (`#5A4E96`) is decorative only; control borders use `line-strong`.
- Respect reduced motion (no card flip, no XP count-up).
- Audio and recordings always have a text alternative.

## Voice

- Tutor lines: max 2 short sentences, second person, dry humour. Errors never scold: show the right answer with its article colour and move on.
- Use the demo copy from the screens as-is in mocks; don't invent filler. Unknown facts become placeholders like `[YOUR PRICE]`.
