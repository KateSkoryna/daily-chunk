# Daily Chunk

Mobile-first vocabulary trainer. **v1: target language German; native language Russian or English.** Must stay open to more languages (rules below). The user adds the words they met today; the app normalises them and runs a 6-task lesson (flashcards → listen & shadow → read story → read aloud → gap fill → RU→DE), then spaced repetition and a Boss round every 5th lesson. A tutor character, "Chunk", speaks in short dry one-liners.

**Status:** planning. See `plan.md` for phases, open decisions (D1–D7) and the screen/route map. Don't start a phase until the user asks.

## Index

| Path | What |
| --- | --- |
| `DESIGN.md` | **Design system, single source of truth for visuals**: tokens (rem), shadcn variable mapping, type scale, components, NativeWind config |
| `plan.md` | Implementation plan, decisions, screen → route table, component inventory |
| `design/screens/*.dc.html` | The 20 designed screens (390×844), one file each. Markup + inline styles + a `<script data-dc-script>` block with the demo state logic |
| `design/screens/canvas.json` | Screen titles and order (S1–S13 + tabs, menu, account, logo, notifications) |
| `design/system/README.md` | Original design system brand book (reference for DESIGN.md): product flow, visual rules, layout specs (mobile/tablet/desktop), voice, icons, a11y |
| `design/system/tokens.json` | Original token values (px) that DESIGN.md was built from |
| `design/system/components/*.md` | Specs: ArticleChip, Button, GapFill, LessonStepper, RecordButton, TabBar, TutorQuote, WordCard |

Design links: screens https://claude.ai/code/artifact/612f1a57-16a0-467d-87a6-6097f560f8d7 · system https://claude.ai/artifact/WPoD6RE9v815a6kdYTLzX8

**How to use the sources:**
- `design/screens/` (canvas) = **logic and content**: which screens exist, what's on them, flow, navigation, copy, demo data, interactive behaviour.
- `DESIGN.md` = **how it looks**: tokens, component styling and states, layout, icons, a11y. Read it before building any UI.
- Disagreement: *what* → screens, *how it looks* → `DESIGN.md`. Never copy inline px/hex values from a `.dc.html`; map them to `DESIGN.md` tokens and components. Conflict list in `plan.md` §3.

## Planned stack (confirm D1–D5 in plan.md first)

Expo (React Native) + TypeScript + Expo Router, NativeWind v4 + React Native Reusables (shadcn), `react-native-svg` for icons, Zustand, `expo-sqlite`, small backend for AI calls. Fonts: Bungee, Russo One (Cyrillic display), VT323, Pixelify Sans, IBM Plex Sans 400/600.

Planned layout:
```
app/                 Expo Router routes: (tabs)/, lesson/, review, word-bank, boss, settings, account
global.css           CSS variables from DESIGN.md §10.1
tailwind.config.js   theme from DESIGN.md §10.2
src/theme/           fonts, HardShadow, Scanlines
src/components/ui/   React Native Reusables components, restyled per DESIGN.md §9
src/components/      primitives + app components (see plan.md §5)
src/features/        words, lesson, srs, review, boss, stats, settings
src/mocks/           demo content copied from the design screens
src/languages/       language packs: de/ (target rules), ru/, en/ (native)
src/i18n/            EN / RU UI strings, incl. Chunk's lines
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
- Use component composition: build with `children` and slots (e.g. `<Card><Card.Header/>…</Card>`, `<TopBar left={…} right={…}/>`) instead of one component with many config props. Prefer compound components for related parts (`SegmentedTabs` + `SegmentedTabs.Tab`).
- Make reusable UI components controlled: they take `value` / `selected` / `checked` and report changes with `onChange` / `onSelect` / `onToggle`; they don't own that state. Examples: `Switch`, `SegmentedTabs`, `ArticlePicker`, `OptionGrid`, `WordCard` (`isFlipped` + `onFlip`).
- Keep state where it's used: the lowest screen or feature component that needs it owns it and passes it to the controlled components. Lift it only when siblings share it. Global stores only for app-wide data (profile, words, progress).

## Language rules (must follow)

- Three settings: `targetLang` (v1 `de`), `nativeLang` (`ru` | `en`), `uiLang` (`en` | `ru`, defaults to native).
- No German/Russian/English logic outside `src/languages/`. Articles, genders, noun display, typing alternatives (ae→ä…), grammar tips and TTS voices come from the target pack.
- Components use semantic gender roles (`gender-masc/fem/neut/plural`), not `der/die/das`. The pack maps roles to article words and the design's article colours.
- No user-visible string in components: everything goes through `src/i18n/`.
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
