# Daily Chunk — Design System

This file is the **single source of truth** for how Daily Chunk looks. Colours, type, spacing, radius, shadows, sizes, breakpoints and motion are all defined here. Code implements these values exactly and never invents new ones.

- Visual reference: `design/system/` (brand book, `tokens.json`, component specs) and https://claude.ai/artifact/WPoD6RE9v815a6kdYTLzX8
- Content and flow: `design/screens/*.dc.html`
- Stack: Expo + **NativeWind v4** (Tailwind 3.4) + **React Native Reusables** (the shadcn/ui port for React Native). Same `components.json`, CSS variables and component API as shadcn.

If this file and code disagree, this file wins. To change a value, change it here first, then in `global.css` / `tailwind.config.js`.

---

## 1. Principles

1. **Dark only.** One theme, "Arcade Night". No light mode, no `dark:` variants.
2. **Square corners.** Radius is `0` everywhere except progress segments and round controls.
3. **Depth = hard offset shadow**, never blur.
4. **Each colour has a job.** Yellow = the one primary action. Cyan = focus, inputs, correct. Pink = section labels, record, wrong.
5. **Never colour alone.** Correct/wrong always show ✓/✗. Article colours always appear next to the written article.
6. **Each font has a job.** Display = titles/buttons/numbers. Pixel = UI labels. Content = every target-language word and every translation.
7. **rem, not px.** All lengths are in rem, with `1rem = 16px` (see §2).

---

## 2. Units

All lengths are in **rem**, with **`1rem = 16px`** on every platform.

NativeWind converts `rem` to pixels on native at **14** by default. Set it to 16 so web and native match:

```js
// metro.config.js
module.exports = withNativeWind(config, {
  input: './global.css',
  inlineRem: 16,
});
```

The base grid is **0.25rem**. Tailwind's default spacing scale already uses 0.25rem steps, so `p-4` = 1rem.

| px  | rem    |     | px  | rem  |
| --- | ------ | --- | --- | ---- |
| 2   | 0.125  |     | 24  | 1.5  |
| 3   | 0.1875 |     | 32  | 2    |
| 4   | 0.25   |     | 48  | 3    |
| 8   | 0.5    |     | 56  | 3.5  |
| 12  | 0.75   |     | 64  | 4    |
| 16  | 1      |     | 80  | 5    |
| 20  | 1.25   |     | 360 | 22.5 |

The px column is for reading the design files only. Code and this file use rem.

---

## 3. Token architecture

Three layers. Components only touch layers 2 and 3.

```
1. Palette (raw)     yellow, cyan, pink, bg-000 …       → global.css only
2. Semantic (shadcn) primary, background, ring, border … → every component
3. Domain            gender-*, success, highlight …      → app components
```

- **Palette** values appear in exactly one place: the `:root` block in `global.css`.
- **Semantic** tokens use shadcn's names, so any component added from React Native Reusables picks up the brand with no edits to its colour classes.
- **Domain** tokens cover what shadcn has no name for (article genders, correct/wrong, section labels, the shadow colour).
- To restyle the app, change variable values. Class names never change.

---

## 4. Colour

### 4.1 Palette

| Token            | Hex       | HSL               | Role                                             |
| ---------------- | --------- | ----------------- | ------------------------------------------------ |
| `bg-000`         | `#120E24` | `251 44% 9.8%`    | Screen ground (+ scanlines)                      |
| `bg-100`         | `#1B1636` | `249 42.1% 14.9%` | Cards, inputs, list rows, tutor bubble           |
| `bg-200`         | `#251E48` | `250 41.2% 20%`   | Raised: flashcard back, selected row, sheet      |
| `ink`            | `#F3EFE6` | `42 35.1% 92.7%`  | Primary text                                     |
| `ink-muted`      | `#A9A3C2` | `252 20.3% 70%`   | Secondary text, placeholders, inactive tabs      |
| `ink-inverse`    | `#120E24` | `251 44% 9.8%`    | Text/icons on yellow, cyan, pink, article fills  |
| `line`           | `#5A4E96` | `250 31.6% 44.7%` | **Decorative only**: dividers, idle card borders |
| `line-strong`    | `#7A6CC4` | `250 42.7% 59.6%` | Borders of idle controls                         |
| `yellow`         | `#FFD23F` | `46 100% 62.4%`   | Primary action, active tab, selected option, XP  |
| `cyan`           | `#2EE6D6` | `175 78.6% 54.1%` | Focus, input border, top-bar labels, correct     |
| `pink`           | `#FF3D8B` | `336 100% 62%`    | Section labels, hard shadow, record, wrong       |
| `article-der`    | `#5AA9FF` | `211 100% 67.6%`  | Masculine                                        |
| `article-die`    | `#FF6B6B` | `0 100% 71%`      | Feminine (never used for errors)                 |
| `article-das`    | `#4ADE80` | `142 69.2% 58%`   | Neuter                                           |
| `article-plural` | `#FFB547` | `36 100% 63.9%`   | Plural, **dashed outline only**                  |

### 4.2 Semantic tokens (shadcn names)

| shadcn variable                              | Palette                                                   | Used for                                                     |
| -------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------ |
| `--background`                               | `bg-000`                                                  | Screen                                                       |
| `--foreground`                               | `ink`                                                     | Default text                                                 |
| `--card` / `--card-foreground`               | `bg-100` / `ink`                                          | Card, list row, input fill                                   |
| `--popover` / `--popover-foreground`         | `bg-200` / `ink`                                          | Sheets, dialogs, menus, select lists                         |
| `--primary` / `--primary-foreground`         | `yellow` / `ink-inverse`                                  | The one primary button, active states                        |
| `--secondary` / `--secondary-foreground`     | `bg-200` / `ink`                                          | Subtle filled surfaces (badges, chips)                       |
| `--muted` / `--muted-foreground`             | `bg-100` / `ink-muted`                                    | Disabled fills, hints, captions                              |
| `--accent` / `--accent-foreground`           | `bg-200` / `ink`                                          | Hover/pressed/selected rows, menu highlight                  |
| `--destructive` / `--destructive-foreground` | `pink` / `ink-inverse`                                    | Wrong answer, delete confirm                                 |
| `--border`                                   | `line`                                                    | Decorative borders, dividers                                 |
| `--input`                                    | `line-strong`                                             | Idle control borders (checkbox, switch track, option button) |
| `--ring`                                     | `cyan`                                                    | Focus ring                                                   |
| `--radius`                                   | `0rem`                                                    | Base radius                                                  |
| `--chart-1…5`                                | `yellow`, `cyan`, `pink`, `article-der`, `article-plural` | Stats charts                                                 |

The design's **secondary button** (cyan outline) is not shadcn's `secondary` fill. It is a button _variant_ (§9.1), so `--secondary` stays a neutral surface for every other shadcn component that uses it.

### 4.3 Domain tokens

| Variable                             | Palette                | Used for                                                                        |
| ------------------------------------ | ---------------------- | ------------------------------------------------------------------------------- |
| `--field`                            | `cyan`                 | Text input / textarea border (inputs are cyan by design, unlike other controls) |
| `--success` / `--success-foreground` | `cyan` / `ink-inverse` | Correct answer border, ✓ icon                                                   |
| `--highlight`                        | `pink`                 | Section labels `01 / FLASHCARDS`, retry underline                               |
| `--shadow`                           | `pink`                 | Hard shadow colour                                                              |
| `--gender-masc`                      | `article-der`          | Masculine role                                                                  |
| `--gender-fem`                       | `article-die`          | Feminine role                                                                   |
| `--gender-neut`                      | `article-das`          | Neuter role                                                                     |
| `--gender-plural`                    | `article-plural`       | Plural role                                                                     |
| `--gender-foreground`                | `ink-inverse`          | Text on a gender fill                                                           |

**Gender roles, not articles.** Components use `gender-masc/fem/neut/plural`. The target-language pack (`src/languages/de/`) maps each role to its article word (`der`/`die`/`das`/`die · Pl.`). A future language with different genders only adds roles. See `plan.md` §2a.

### 4.4 Contrast (WCAG, checked)

| Pair                                            | Ratio             |                                               |
| ----------------------------------------------- | ----------------- | --------------------------------------------- |
| `ink` on `bg-000` / `bg-200`                    | 16.4 / 13.5       | text ✓                                        |
| `ink-muted` on `bg-000` / `bg-100` / `bg-200`   | 7.8 / 7.2 / 6.4   | text ✓                                        |
| `ink-inverse` on yellow / cyan / pink           | 13.1 / 12.0 / 5.6 | text ✓                                        |
| `ink-inverse` on der / die / das                | 7.7 / 6.8 / 10.8  | text ✓                                        |
| `yellow` / `cyan` / `pink` on `bg-000`          | 13.1 / 12.0 / 5.6 | text ✓                                        |
| `pink` on `bg-100`                              | 5.2               | text ✓ (lowest text pair)                     |
| `article-plural` on `bg-000`                    | 10.7              | text ✓                                        |
| `line-strong` on `bg-000` / `bg-100` / `bg-200` | 4.3 / 3.9 / 3.5   | control border ✓ (≥3:1)                       |
| `line` on `bg-000`                              | 2.7               | **decorative only**, never a control boundary |

`article-das` and `article-plural` are equally light. That's why plural is always a **dashed outline** and never a fill next to das.

---

## 5. Typography

### 5.1 Families

| Token                   | Font              | Job                                                  | Never for             |
| ----------------------- | ----------------- | ---------------------------------------------------- | --------------------- |
| `font-display`          | Russo One 400     | Titles, buttons, numbers. Latin and Cyrillic         | Target-language words |
| `font-pixel`            | Handjet 400       | Labels, short UI copy, uppercase. Latin and Cyrillic |                       |
| `font-content`          | IBM Plex Sans 400 | Sentences, translations, reading text                |                       |
| `font-content-semibold` | IBM Plex Sans 600 | Words, options, article chips                        |                       |

**On native, a font family is a single font file.** React Native has no fallback chain, and `fontWeight` doesn't pick a file. So:

- Each weight is its own family (`font-content` vs `font-content-semibold`). Don't combine `font-content` with `font-semibold`.
- Every family covers both Latin and Cyrillic, so no font depends on the app language and nothing switches fonts by language.
- On web, the same classes get full fallback stacks (`tailwind.config.js`).

Loaded with `@expo-google-fonts`: `RussoOne_400Regular`, `Handjet_400Regular`, `IBMPlexSans_400Regular`, `IBMPlexSans_600SemiBold`.

### 5.2 Type scale

Each style is one Tailwind `fontSize` entry (size + line height + letter spacing) used together with its family.

| Style            | Family           | Size / line (rem) | Extra                                | Sample                    | Use                      |
| ---------------- | ---------------- | ----------------- | ------------------------------------ | ------------------------- | ------------------------ |
| `display-xl`     | display          | 2.875 / 2.875     | desktop 4 / 4; text-shadow pink/cyan | DAILY CHUNK               | Home title               |
| `display-l`      | display          | 2.125 / 2.125     | desktop 2.75 / 2.75                  | LEKTION 12                | Section, lesson titles   |
| `display-num`    | display          | 1.625 / 1.625     |                                      | 1240 XP                   | XP, streak, score        |
| `display-btn`    | display          | 1.25 / 1.5        | uppercase                            | START LESSON              | Primary button           |
| `display-btn-sm` | display          | 1 / 1.25          | uppercase                            | NEXT                      | Secondary button         |
| `label`          | pixel            | 1.5 / 1.5         | tracking 0.125rem, uppercase         | 01 / FLASHCARDS           | Section labels, top bar  |
| `label-sm`       | pixel            | 1.25 / 1.25       | tracking 0.125rem, uppercase         | 03 / READ THE STORY       | Stepper label, tutor tab |
| `ui`             | pixel            | 1.375 / 1.5625    |                                      | 5 words due today         | UI copy, tab labels      |
| `caption`        | pixel            | 1.125 / 1.25      |                                      | Tap to flip               | Hints, metadata          |
| `word-xl`        | content-semibold | 3 / 3.5           |                                      | der Bahnhof               | Flashcard front          |
| `word-l`         | content-semibold | 1.375 / 1.75      |                                      | die Bahnhöfe              | Word in lists, plural    |
| `option`         | content-semibold | 1.125 / 1.5       |                                      | des Bahnhofs              | Gap-fill options         |
| `chip`           | content-semibold | 1 / 1.25          |                                      | der                       | Article chip             |
| `reading`        | content          | 1.25 / 2          | max line length 34em                 | Am Bahnhof wartet …       | Story text               |
| `body`           | content          | 1.0625 / 1.625    |                                      | Он ждёт поезд на вокзале. | Sentences, translations  |
| `body-sm`        | content          | 0.9375 / 1.375    |                                      | вокзал (м.)               | Translation under a word |

`display-btn-sm`, `label-sm`, `option` and `chip` come from the component specs (`Button.md`, `LessonStepper.md`, `TutorQuote.md`, `GapFill.md`, `ArticleChip.md`). They're promoted to the scale so no component sets a font size inline.

Tutor quote text = `label` with line height 1.625rem (`TutorQuote.md`).

### 5.3 Text component

Use one `Text`, written in the style of React Native Reusables' `Text` and extended with a `variant` prop (a table of class strings, no helper library). It owns family + size + colour defaults, so screens write `<Text variant="label">`, never `className="font-pixel text-label uppercase tracking-…"`.

```tsx
const variantClasses = {
  'display-xl':
    'font-display text-display-xl uppercase desktop:text-display-xl-desktop',
  'display-l':
    'font-display text-display-l uppercase desktop:text-display-l-desktop',
  'display-num': 'font-display text-display-num text-primary',
  'display-btn': 'font-display text-display-btn uppercase',
  'display-btn-sm': 'font-display text-display-btn-sm uppercase',
  label: 'font-pixel text-label uppercase text-highlight',
  'label-sm': 'font-pixel text-label-sm uppercase text-highlight',
  ui: 'font-pixel text-ui',
  caption: 'font-pixel text-caption text-muted-foreground',
  'word-xl': 'font-content-semibold text-word-xl',
  'word-l': 'font-content-semibold text-word-l',
  option: 'font-content-semibold text-option',
  chip: 'font-content-semibold text-chip',
  reading: 'font-content text-reading',
  body: 'font-content text-body',
  'body-sm': 'font-content text-body-sm text-muted-foreground',
} satisfies Record<TextVariant, string>;
```

The component sets `className={cn('text-foreground', variantClasses[variant], parentTextClass, className)}`: the variant first, then the parent's `TextClassContext` string, then the caller's classes (the last one wins).

React Native Reusables' `TextClassContext` lets a parent (Button, Badge) set the text style of its children. Use it instead of passing text classes down.

---

## 6. Spacing

The base is 0.25rem. **Only these steps are allowed.** They match Tailwind's default spacing keys, so `p-6`, `gap-2` etc. work as is.

| Token      | Tailwind key | rem  | Use                                                    |
| ---------- | ------------ | ---- | ------------------------------------------------------ |
| `space-1`  | `1`          | 0.25 | Icon-to-label gap in chips                             |
| `space-2`  | `2`          | 0.5  | Chip gap, option grid gap                              |
| `space-3`  | `3`          | 0.75 | Card horizontal padding in lists                       |
| `space-4`  | `4`          | 1    | Card padding, gap between cards, screen bottom padding |
| `space-5`  | `5`          | 1.25 | Gap between screen sections (mobile)                   |
| `space-6`  | `6`          | 1.5  | Mobile gutter, desktop card padding, desktop grid gap  |
| `space-8`  | `8`          | 2    | Tablet gutter, desktop section gap                     |
| `space-12` | `12`         | 3    | Desktop gutter                                         |
| `space-14` | `14`         | 3.5  | Mobile top padding (status bar)                        |
| `space-16` | `16`         | 4    | Desktop page top padding                               |

Semantic aliases (in `tailwind.config.js` → `spacing`). Use these for layout so a gutter change is one edit:

| Alias            | rem    | Class example                                                                                                                                     |
| ---------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gutter`         | 1.5    | `px-gutter`                                                                                                                                       |
| `gutter-tablet`  | 2      | `tablet:px-gutter-tablet`                                                                                                                         |
| `gutter-desktop` | 3      | `desktop:px-gutter-desktop`                                                                                                                       |
| `section`        | 1.25   | `gap-section`                                                                                                                                     |
| `screen-top`     | 3.5    | `pt-screen-top`                                                                                                                                   |
| `screen-bottom`  | 1      | `pb-screen-bottom`                                                                                                                                |
| `glitch`         | 0.1875 | `translate-x-glitch`: the pink and cyan copies behind a `GlitchTitle` (one shadow cannot be drawn twice on a phone, so the title is three layers) |

Mobile screen padding: `pt-screen-top px-gutter pb-screen-bottom` (= 3.5 / 1.5 / 1 rem). The `Screen` wrapper applies it. Desktop: `desktop:pt-6` on top (1.5 rem) and `desktop:pb-10` at the bottom (2.5 rem).

---

## 7. Sizes, radius, borders, shadow

### 7.1 Sizes

| Token               | rem   | Use                                                                          |
| ------------------- | ----- | ---------------------------------------------------------------------------- |
| `touch`             | 3     | Min height/width of anything tappable                                        |
| `control`           | 3.5   | Secondary button, option button, tab item                                    |
| `button`            | 4     | Primary button height                                                        |
| `record`            | 5     | Record button (shadowing variant: `button`, 4)                               |
| `tabbar`            | 3.5   | Bottom tab bar (+ safe-area inset)                                           |
| `rail`              | 15    | Desktop nav rail width                                                       |
| `content`           | 45    | Lesson column max width (tablet/desktop)                                     |
| `page`              | 75    | Desktop dashboard max width                                                  |
| `button-max`        | 22.5  | Primary button max width on desktop                                          |
| `flashcard`         | 22.5  | Flashcard height mobile (desktop 26.25); max width of the square card on web |
| `flashcard-desktop` | 26.25 | Max width of the square card on desktop web (max-width scale)                |

### 7.2 Radius

| Token                                         | Value    | Use                        |
| --------------------------------------------- | -------- | -------------------------- |
| `--radius` → `rounded`, `rounded-sm/md/lg/xl` | `0rem`   | Everything                 |
| `rounded-segment`                             | 0.125rem | Progress segments only     |
| `rounded-full`                                | full     | Record button, avatar only |

shadcn computes `md`/`sm` as `calc(var(--radius) - 2px)`. With radius 0 that's negative, so the config sets every step to `var(--radius)` (§10). Components keep their `rounded-md` classes and still render square.

### 7.3 Borders

| Class                           | rem    | Use                                                      |
| ------------------------------- | ------ | -------------------------------------------------------- |
| `border` (DEFAULT) / `border-2` | 0.125  | All borders, focus ring, dashed plural chip              |
| `border-3`                      | 0.1875 | Record button, gap-fill blank underline, retry underline |

Border colours: `border-border` (decorative), `border-input` (idle control), `border-field` (text input), `border-ring` (focused), `border-success` / `border-destructive` (answered).

### 7.4 Hard shadow

Shadows are drawn only by `HardShadow`. The names below are not Tailwind classes (they are not in `tailwind.config.js`); they name the offsets `HardShadow` uses, and metas list them as tokens.

| Token            | Offset                          | Use                                    |
| ---------------- | ------------------------------- | -------------------------------------- |
| `shadow-hard`    | 0.25rem 0.25rem 0, `--shadow`   | Primary button, active flashcard       |
| `shadow-hard-lg` | 0.375rem 0.375rem 0, `--shadow` | Hero cards (today's lesson, test card) |

- No blur, ever. The `shadow-sm`/`shadow-md` classes that come with shadcn components are removed when the component is added.
- **Pressed** primary: `translate-x-1 translate-y-1` and no shadow.
- The `HardShadow` wrapper renders it on every platform (on native, an offset block behind the child), so components never deal with platform shadow APIs.

### 7.5 Focus

`ring-2 ring-ring ring-offset-2 ring-offset-background` on every interactive element (2 = 0.125rem). `PressableFocus` draws the same ring on every platform, only for keyboard/switch focus: a mouse click or a tap does not show it (the web's `:focus-visible` rule).

### 7.6 Scanlines

The screen ground is `bg-background` plus a scanline overlay: a 1/16rem line of `ink` at 5% opacity every 0.25rem (Tailwind's `opacity-5` / `/5`). The `Scanlines` component draws it. It's placed once in `Screen`, never per card.

---

## 8. Layout and breakpoints

| Screen           | min-width | Layout                                                                                                                                                                             |
| ---------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mobile (default) | 0         | Design frame 390×844. One column, padding 3.5/1.5/1 rem, primary button full width pinned above the 4-tab bar                                                                      |
| `tablet`         | 37.5rem   | Gutter 2rem; lesson column centred, max `content` (45rem); tab bar stays                                                                                                           |
| `desktop`        | 64rem     | Tab bar becomes a left rail (`rail`, 15rem, `bg-card`, right border `border-border`); 12-col grid, gap 1.5rem; page max `page` (75rem); `display-xl` → 4rem, `display-l` → 2.75rem |
| `wide`           | 90rem     | Design frame 1440×900; content stays capped at 75rem                                                                                                                               |

Tabs: **HOME · LESSONS · SCORE · STATS**. Desktop home: 8 columns add-words + 4 columns side panel. Desktop lesson: `content` column centred in the space beside the rail.

---

## 9. Components

Base components live in `src/components/ui/` and are **owned code**: style them once there, never per screen. App components live in `src/components/` and are built from `ui/` pieces.

Components with real behaviour (dialogs, select, switch, toggle group, tabs: focus, keyboard, screen-reader roles, overlays) are added from React Native Reusables with its CLI. Simple ones (button, text, chips, cards) are written by hand in the same style: a table of class strings per variant and the label style through `TextClassContext`. Keep them short and readable.

When adding a component from React Native Reusables (a hand-written one follows the same rules):

1. Remove the `shadow-*` classes. Keep `rounded-*` (they render square).
2. Set heights to `touch` / `control` / `button`.
3. Make sure the focus ring uses `ring-ring`.
4. Make sure every colour class is a semantic or domain token. No palette names, no hex.
5. Create its meta file (§14).

### 9.1 Button (`ui/button`)

| Variant             | Height           | Look                                                                                            | Label                                           |
| ------------------- | ---------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `default` (primary) | `h-button`       | `bg-primary`, `HardShadow`; mobile `w-full`, desktop `max-w-button-max` centred (`self-center`) | `display-btn`, `text-primary-foreground`        |
| `default` pressed   |                  | `translate-x-1 translate-y-1`, no shadow                                                        |                                                 |
| `default` disabled  |                  | `bg-popover`, no shadow                                                                         | `text-muted-foreground`                         |
| `secondary`         | `h-control px-5` | transparent, `border-2 border-ring` (cyan)                                                      | `display-btn-sm`, `text-ring`                   |
| `ghost`             | `h-touch px-5`   | none                                                                                            | `label`, `text-muted-foreground`                |
| `destructive`       | `h-control px-5` | `bg-destructive`                                                                                | `display-btn-sm`, `text-destructive-foreground` |
| `again`             | `h-button`       | transparent, `border-2 border-highlight` (pink), no shadow (Record, Done)                       | `display-btn`, `text-highlight`                 |

Disabled applies to every variant the same way: `bg-popover` fill, `text-muted-foreground` label, no shadow. On `secondary` the border also becomes `bg-popover`'s colour (`border-popover`), so a disabled button never keeps its cyan outline.

Rule: one `default` button per screen.

### 9.2 shadcn → app mapping

| App need                                | Build on (`ui/`)          | Notes                                                                    |
| --------------------------------------- | ------------------------- | ------------------------------------------------------------------------ |
| Primary / secondary / ghost actions     | `button`                  | §9.1                                                                     |
| Add-words text area, typed answer       | `textarea`, `input`       | `bg-card border-2 border-field h-touch`                                  |
| Card surfaces (`WordCard`, lesson card) | `card`                    | `bg-card border-2 border-border`, hero adds `HardShadow`                 |
| `ArticlePicker`, `OptionGrid`, mood     | `toggle-group`            | Controlled `value` / `onValueChange`; idle `border-input`, selected fill |
| `SegmentedTabs` (word bank filters)     | `tabs`                    | Active `text-primary`                                                    |
| Daily goal 3/5/10/15                    | `radio-group`             |                                                                          |
| Settings toggles                        | `switch`                  | Track off `bg-input`, on `bg-primary`                                    |
| Delete account, confirmations           | `alert-dialog`            | `bg-popover`, `destructive` action                                       |
| Sheets, menus                           | `dialog`, `dropdown-menu` | `bg-popover`                                                             |
| Progress bars (test-in-2-lessons)       | `progress`                | `rounded-segment`                                                        |
| Avatar                                  | `avatar`                  | `rounded-full`                                                           |
| Dividers                                | `separator`               | `bg-border`                                                              |

### 9.3 App components (custom, from `design/system/components/`)

| Component                                                                                                                                                              | Key tokens                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ArticleChip`                                                                                                                                                          | Tag: `h-8 px-2.5`, `chip` style, `bg-gender-*` + `text-gender-foreground`. Plural: `border-2 border-dashed border-gender-plural text-gender-plural`, label from pack. Picker: `h-touch min-w-[4.5rem]` via `toggle-group`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `WordCard`                                                                                                                                                             | `card`, `aspect-square w-full` (a square; owner request 2026-11-23, the Flashcards screen puts an `ArrowButton` on each side of it), `p-6`, front `bg-card`, back `bg-popover`, `HardShadow`. Flip `duration-flip`; reduced motion = instant swap. Controlled `isFlipped` + `onFlip` Optional `corner` slot: a control in the top right, `absolute right-2 top-2`, beside the pressable card and not turning with it (the `TipButton`). Optional `overlay` slot: a popover (the `TipCard`) that does not move the layout: below `desktop` it is `absolute inset-x-2 top-16` over the card, under the corner control; from `desktop` up it is `absolute left-full top-2 ml-4 w-rail`, to the right of the card, level with the lamp. It needs no z-index: it comes after the card in the tree and, on a phone, stays inside the card; on desktop it only overlaps empty page space (the next arrow is level with the middle of the card) |
| `LessonStepper`                                                                                                                                                        | 6 (Boss: 3) segments `h-2 gap-1 rounded-segment`. Done `bg-success`, current `bg-primary`, upcoming `bg-popover`. Label `label-sm`. `variant="progress"` (Home: lessons toward the Boss round, 5 segments): the count of finished steps is `bg-success`, the rest `bg-popover`, none is `bg-primary`. With `onSelect` (lesson task screens) each segment is a button with a `min-h-touch` touch area around the same `h-2` bar, named by its task; the bar keeps its look                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `ItemDots`                                                                                                                                                             | One `size-3 border-2` square per word or phrase inside a task, `flex-row flex-wrap justify-center`, each in a `min-h-touch min-w-touch` button; current `border-primary bg-primary`, others `border-border bg-popover`; tapping jumps to that item. The 3rem touch area is mostly empty, so the phone app's Listen screen pulls the row closer to its neighbours with `-my-2` (web keeps the full gap)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `ArrowButton`                                                                                                                                                          | Square `secondary` `Button`, `w-control px-0` (3.5rem, the button height, so it is square), an arrow icon only (the `back` arrow, mirrored for next), named by its label; on the left (previous) and right (next) side of the card, `gap-2`; disabled on the first and last item; used on the web only (a phone has no small buttons, see `CardNavigator`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `CardNavigator`                                                                                                                                                        | Wraps the card of a task. Web: an `ArrowButton` on each side of the card (`flex-row gap-4`, `desktop:gap-8`), the card centred, at most `max-w-flashcard` wide (`desktop:max-w-flashcard-desktop` on desktop) so the page does not scroll. Phone: no buttons; the card is swiped left (next) or right (previous) by at least 50 points, and a quiet `body-sm` line under the card says so (`gap-2`); `ItemDots` stay as the button alternative (owner request 2026-11-23)                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `GapFill`                                                                                                                                                              | Sentence `body`; blank `min-w-[6.875rem] border-b-3 border-field`; hint `body-sm`; options 2×2 `gap-2 h-control`, `option` style                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `RecordButton`                                                                                                                                                         | `size-record rounded-full border-3`. Idle `border-highlight` + mic; recording `bg-highlight` + stop + timer; done `border-success` + play + score                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `TutorQuote`                                                                                                                                                           | `border-2`, `pt-6 px-3.5 pb-3.5`; tab on top border, `label-sm` `text-primary-foreground`. Variants: start `primary`, pass `success` + ✓, fail `destructive` + ✗                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `LogoBadge`                                                                                                                                                            | The Sheriff badge (`plan.md` D6): `size-10`, four layers: `text-highlight` shadow star, `text-primary` star with five tip dots, `text-background` disc, `text-foreground` letters DC                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `GlitchTitle`                                                                                                                                                          | `display-xl` / `display-l` text with a `text-highlight` copy at `translate-x-glitch` and a `text-ring` copy at `-translate-x-glitch` behind it                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `Textarea`                                                                                                                                                             | `min-h-36 border-2 border-field bg-card p-3`, `body`; an optional trailing control at `bottom-2.5 right-2.5` and `pb-16`. On the web its scrollbar is thin (`scrollbar-width: thin`) with the thumb in `line-strong` and a transparent track, set once for every `textarea` in `global.css` (owner, 2026-11-20); phones keep the system scrollbar                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `ListGroup`, `ListGroup.Row`                                                                                                                                           | Group `border-2 border-border`, rows separated by `border-t-2`; row `min-h-touch` (3rem, the touch minimum, even where a screen draws 44px) `bg-card px-3 py-2.5 gap-3` with left, body and right slots                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `Chip`                                                                                                                                                                 | `h-control border-2 border-highlight bg-card`, optional pink icon, `option` label; pressable                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `PartOfSpeechChip`                                                                                                                                                     | Tag for a word without an article (adjective, verb): `h-8 px-2.5 border-2 border-dashed border-muted-foreground`, `chip` style in `text-muted-foreground`; the label is the part of speech from i18n. Sits where `ArticleChip` sits                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `TopBar` extras                                                                                                                                                        | `center` slot (Home: `LogoBadge`). `TopBar.Button` `variant="record"`: `border-highlight bg-background`, icon `text-highlight` (dictate button in `Textarea`). `TopBar.Action`: a ghost `Button` with an `Icon` and its word (`Menu`, `Quit`; negative margins put the drawn edge of the icon on the screen's text edge, not on the edge of the icon box; `iconPosition="end"` puts the icon after the word, for Quit on the right), the word is also the accessible name; used for the menu on Home and for leaving a lesson, so an icon never stands alone for an action that is not obvious (owner, 2026-11-20)                                                                                                                                                                                                                                                                                                                      |
| `LessonHeader`                                                                                                                                                         | Top of a lesson task screen: a row of three (left: optional ghost `Button` with a back icon to the previous part of the lesson; middle: the lesson name in `label` muted, the same size as the buttons beside it; right: the quit ghost `Button` with a cross) over a `LessonStepper`; `gap-2` in the phone app, `gap-4` on web                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `StepIndicator`                                                                                                                                                        | Parts of one task (`1 · Listen`, `2 · Repeat`): `border-2 border-border`, each part `min-h-touch flex-1`; the current one `bg-popover` with `text-primary`, the others `text-muted-foreground`; `ui` style. With `onSelect` the parts are tabs (`tablist` / `tab`, same look)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `Waveform`                                                                                                                                                             | `h-12` row of `flex-1` bars with `gap-1`; heights are percentages of the row; played bars `bg-ring`, the rest `bg-border`; an image with a text alternative. In the Listen card it is `h-6` at the bottom of the card, a quiet detail and not the focus                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `PlaybackControls`                                                                                                                                                     | Speed button `h-control border-2 border-input px-4` (text `0.75×`), play or pause `size-control rounded-full border-3 border-ring bg-ring` (the same height as the speed button) with a `text-primary-foreground` icon, centred with `gap-6`; no record button (it lives in `RecordControls`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `RecordControls`                                                                                                                                                       | The Repeat part of Listen: one `RecordButton` (mic, or stop while recording); after a recording, a `done` `RecordButton` (play my recording) and an `idle` one (record again), side by side with `gap-6`, centred                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `LessonOverviewScreen` (no screen design; owner request 2026-11-23)                                                                                                    | After Confirm: `GlitchTitle` with the lesson number, one `body-sm` line, a `ListGroup` of the six tasks (each row: a `size-9 border-2` box with the number, or a check in `border-success` and `text-success` (cyan) when done; the task name in `option`; one `body-sm` line, or Done; the XP it gave, `ui` in `text-success`, for example +20 XP: in the phone app at the right end of the name line of a finished task, so the explanation line keeps the full width of the row; on web on the right of the row), and the primary `Button` that starts the first task not done. A tap on any row starts that task                                                                                                                                                                                                                                                                                                                    |
| `StoryText`                                                                                                                                                            | Paragraph in `reading` style with marked words underlined in the colour of their gender role (`decoration-gender-*`), grey for a word without a gender, pink with pink text for words to retry; the open word has `bg-popover`; with `onWordPress` the words are buttons                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `WordPopover`                                                                                                                                                          | Card under a paragraph: `border-2` in the gender colour, `bg-popover px-3 py-2.5 gap-2.5`, `HardShadow`; `ArticleChip`, the word in `option` style, translation and plural in `body-sm`, a `border-2 border-ring` play button                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `TipButton`                                                                                                                                                            | Lamp button for something interesting to know about a word: no border, `min-h-touch min-w-touch` touch area, `lamp` icon in `text-ring`; open: `bg-ring` square behind the icon, icon `text-background`. Always visible when the word has a tip (no hover-only). Sits beside the pressable surface it belongs to, positioned by the parent (flashcard: `absolute right-2 top-2`), never inside it. `aria-expanded`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `TipCard`                                                                                                                                                              | Popover over the flashcard, under its lamp, when the lamp is open (no layout shift): `border-2 border-ring`, `bg-popover px-3 py-2.5 gap-2.5`, `HardShadow`; a `text-ring` lamp, the label "Good to know" in `caption` uppercase and the tip in `body-sm`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `WordTag`                                                                                                                                                              | The tag that starts a word row: `ArticleChip` for a word with a gender, `PartOfSpeechChip` for any other; chosen from the word; a list passes `min-w-14` so every tag in it has the same width                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `AnswerFeedback`                                                                                                                                                       | Box under a checked typed answer: `border-2 mt-1.5 gap-2.5 px-3.5 pb-3.5 pt-6`; `border-success` (right) or `border-highlight` (almost); a tab on the top border (`-top-[0.8125rem] left-3 px-2`, `label-sm` in `text-primary-foreground`) with a check or cross icon; `role="status"`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `CorrectionSentence`                                                                                                                                                   | The answer in `body` with the wrong word `text-highlight line-through` and the right word after it `font-content-semibold text-success underline decoration-success`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `HomeScreen`, `ConfirmScreen`, `FlashcardsScreen`, `ListenScreen`, `ReadScreen`, `RecordScreen`, `GapFillScreen`, `TranslateScreen`, `DoneScreen`, `PlaceholderScreen` | Built from the components above; padding by `Screen`; sections `gap-section` (Confirm `gap-4`); the primary button sits at the bottom (`mt-auto`); the tab bar is part of the navigation layout, not of the screen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `Notice`                                                                                                                                                               | `border-2 border-dashed border-gender-plural px-3 py-2.5`, `label-sm` in `text-gender-plural` (only for plural notices until a neutral colour is decided); `role="status"`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `TabBar`                                                                                                                                                               | Custom Expo Router `tabBar`. `h-tabbar` + safe area, top `border-2 border-border`, `caption` labels (1.125rem) with tracking 0.125rem; active `text-primary` with a `border-t-3 border-primary` bar that replaces the top border over that tab, else `text-muted-foreground`; badge `bg-highlight`. Desktop: rail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `Drawer`                                                                                                                                                               | Burger menu over a `bg-background/80` scrim: panel `w-4/5 max-w-xs` from the left, `bg-popover border-r-2 border-primary px-5 pb-6 pt-screen-top gap-5`, `HardShadow`; header with `LogoBadge`, the app name in `display-btn-sm` and a close `TopBar.Button`; items `min-h-touch px-2 border-b-2 border-border`, `label` text, an `Icon` in `text-ring` before the label, optional `bg-highlight px-1.5` badge in `caption`; closes by scrim, close button, Escape or back                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `AlertDialog`                                                                                                                                                          | Question over a `bg-background/80` scrim: `border-2 border-border bg-popover p-4 gap-4` with `HardShadow`, title in `display-btn`, description in `body` `text-muted-foreground`, footer `gap-3` with the destructive `Button` first and a `secondary` one for "keep going"; Escape closes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `Screen`, `HardShadow`, `Scanlines`, `PressableFocus`                                                                                                                  | Wrappers from §6 and §7                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

Arbitrary values such as `min-w-[4.5rem]` are allowed only for component dimensions listed in a component spec. Never use them for colour or font.

---

## 10. Implementation

### 10.1 `global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* palette */
    --bg-000: 251 44% 9.8%;
    --bg-100: 249 42.1% 14.9%;
    --bg-200: 250 41.2% 20%;
    --ink: 42 35.1% 92.7%;
    --ink-muted: 252 20.3% 70%;
    --line: 250 31.6% 44.7%;
    --line-strong: 250 42.7% 59.6%;
    --yellow: 46 100% 62.4%;
    --cyan: 175 78.6% 54.1%;
    --pink: 336 100% 62%;
    --article-der: 211 100% 67.6%;
    --article-die: 0 100% 71%;
    --article-das: 142 69.2% 58%;
    --article-plural: 36 100% 63.9%;

    /* semantic (shadcn) */
    --background: var(--bg-000);
    --foreground: var(--ink);
    --card: var(--bg-100);
    --card-foreground: var(--ink);
    --popover: var(--bg-200);
    --popover-foreground: var(--ink);
    --primary: var(--yellow);
    --primary-foreground: var(--bg-000);
    --secondary: var(--bg-200);
    --secondary-foreground: var(--ink);
    --muted: var(--bg-100);
    --muted-foreground: var(--ink-muted);
    --accent: var(--bg-200);
    --accent-foreground: var(--ink);
    --destructive: var(--pink);
    --destructive-foreground: var(--bg-000);
    --border: var(--line);
    --input: var(--line-strong);
    --ring: var(--cyan);
    --radius: 0rem;
    --chart-1: var(--yellow);
    --chart-2: var(--cyan);
    --chart-3: var(--pink);
    --chart-4: var(--article-der);
    --chart-5: var(--article-plural);

    /* domain */
    --field: var(--cyan);
    --success: var(--cyan);
    --success-foreground: var(--bg-000);
    --highlight: var(--pink);
    --shadow: var(--pink);
    --gender-masc: var(--article-der);
    --gender-fem: var(--article-die);
    --gender-neut: var(--article-das);
    --gender-plural: var(--article-plural);
    --gender-foreground: var(--bg-000);
  }
}
```

Values are HSL channels without `hsl()`, the format React Native Reusables / NativeWind v4 expects. If nested `var()` doesn't resolve on native, inline the channel values in the semantic block. Names stay the same.

### 10.2 `tailwind.config.js` (theme part)

```js
const color = (name) => `hsl(var(--${name}) / <alpha-value>)`;
const pair = (name) => ({
  DEFAULT: color(name),
  foreground: color(`${name}-foreground`),
});

module.exports = {
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    screens: { tablet: '37.5rem', desktop: '64rem', wide: '90rem' },
    extend: {
      colors: {
        background: color('background'),
        foreground: color('foreground'),
        card: pair('card'),
        popover: pair('popover'),
        primary: pair('primary'),
        secondary: pair('secondary'),
        muted: pair('muted'),
        accent: pair('accent'),
        destructive: pair('destructive'),
        success: pair('success'),
        border: color('border'),
        input: color('input'),
        ring: color('ring'),
        field: color('field'),
        highlight: color('highlight'),
        shadow: color('shadow'),
        gender: {
          masc: color('gender-masc'),
          fem: color('gender-fem'),
          neut: color('gender-neut'),
          plural: color('gender-plural'),
          foreground: color('gender-foreground'),
        },
        chart: {
          1: color('chart-1'),
          2: color('chart-2'),
          3: color('chart-3'),
          4: color('chart-4'),
          5: color('chart-5'),
        },
      },
      fontFamily: {
        display: [
          'RussoOne_400Regular',
          'Russo One',
          'system-ui',
          'sans-serif',
        ],
        pixel: ['Handjet_400Regular', 'Handjet', 'ui-monospace', 'monospace'],
        content: [
          'IBMPlexSans_400Regular',
          'IBM Plex Sans',
          'system-ui',
          'sans-serif',
        ],
        'content-semibold': [
          'IBMPlexSans_600SemiBold',
          'IBM Plex Sans',
          'system-ui',
          'sans-serif',
        ],
      },
      fontSize: {
        'display-xl': ['2.875rem', { lineHeight: '2.875rem' }],
        'display-xl-desktop': ['4rem', { lineHeight: '4rem' }],
        'display-l': ['2.125rem', { lineHeight: '2.125rem' }],
        'display-l-desktop': ['2.75rem', { lineHeight: '2.75rem' }],
        'display-num': ['1.625rem', { lineHeight: '1.625rem' }],
        'display-btn': ['1.25rem', { lineHeight: '1.5rem' }],
        'display-btn-sm': ['1rem', { lineHeight: '1.25rem' }],
        label: ['1.5rem', { lineHeight: '1.5rem', letterSpacing: '0.125rem' }],
        'label-sm': [
          '1.25rem',
          { lineHeight: '1.25rem', letterSpacing: '0.125rem' },
        ],
        ui: ['1.375rem', { lineHeight: '1.5625rem' }],
        caption: ['1.125rem', { lineHeight: '1.25rem' }],
        'word-xl': ['3rem', { lineHeight: '3.5rem' }],
        'word-l': ['1.375rem', { lineHeight: '1.75rem' }],
        option: ['1.125rem', { lineHeight: '1.5rem' }],
        chip: ['1rem', { lineHeight: '1.25rem' }],
        reading: ['1.25rem', { lineHeight: '2rem' }],
        body: ['1.0625rem', { lineHeight: '1.625rem' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.375rem' }],
      },
      spacing: {
        gutter: '1.5rem',
        'gutter-tablet': '2rem',
        'gutter-desktop': '3rem',
        section: '1.25rem',
        'screen-top': '3.5rem',
        'screen-bottom': '1rem',
        glitch: '0.1875rem',
        touch: '3rem',
        control: '3.5rem',
        button: '4rem',
        record: '5rem',
        tabbar: '3.5rem',
        rail: '15rem',
        flashcard: '22.5rem',
      },
      maxWidth: {
        content: '45rem',
        page: '75rem',
        'button-max': '22.5rem',
        'flashcard-desktop': '26.25rem',
        reading: '34em',
      },
      borderRadius: {
        none: '0',
        sm: 'var(--radius)',
        DEFAULT: 'var(--radius)',
        md: 'var(--radius)',
        lg: 'var(--radius)',
        xl: 'var(--radius)',
        segment: '0.125rem',
      },
      borderWidth: { DEFAULT: '0.125rem', 2: '0.125rem', 3: '0.1875rem' },
      transitionDuration: { fast: '120ms', flip: '500ms', reward: '600ms' },
    },
  },
};
```

`app.json`: `"userInterfaceStyle": "dark"`.

`darkMode: 'class'` is there only so NativeWind's web startup doesn't throw `Cannot manually set color scheme, as dark mode is type 'media'`. The app has one theme and no `dark:` variants; the colours live in one `:root` block.

### 10.3 `components.json`

React Native Reusables uses the standard shadcn file. Point it at our paths: `"tailwind": { "css": "global.css", "baseColor": "neutral", "cssVariables": true }`, `"aliases": { "components": "@/components", "ui": "@/components/ui", "lib": "@/lib", "utils": "@/lib/utils" }`. The CLI also requires `"style": "default"`, `"rsc": false`, `"tsx": true` and `"tailwind.config": "tailwind.config.js"`, otherwise it stops and asks to rewrite the file. `@/*` maps to `src/*` in `tsconfig.json`. `baseColor` doesn't matter, because `global.css` above replaces the generated variables.

### 10.4 Rules for code

- No hex, `rgb()`, px font size or px spacing in components. Lint for `#[0-9a-f]{3,8}` and `\d+px` under `src/`.
- Components use semantic/domain classes (`bg-primary`, `text-gender-masc`). Never palette variables (`--yellow`).
- Typography goes through `Text` `variant`, never raw `text-*` + `font-*` pairs in screens.
- Shadows go through `HardShadow`, focus through `PressableFocus`, screen padding and scanlines through `Screen`.

---

## 11. Motion

| Token             | Value | Use                                                             |
| ----------------- | ----- | --------------------------------------------------------------- |
| `duration-fast`   | 120ms | Button press, chip select. Easing `steps(2)` for the pixel feel |
| `duration-flip`   | 500ms | Flashcard flip (rotateY, in perspective, ease in and out)       |
| `duration-reward` | 600ms | XP count-up                                                     |

Reduced motion (`useReducedMotion` / `prefers-reduced-motion`): no flip (swap faces instantly), no count-up (show the final value), press translate stays (it isn't animated).

---

## 12. Icons

Inline SVG via `react-native-svg` on phones and a plain `<svg>` on web: 24 viewBox, stroke 2, square caps and joins, `currentColor`, no fill. Rendered at `size-6` (1.5rem) inside a `touch` target. Colour comes from the parent text class (`text-ring`, `text-muted-foreground`). Set (23): back, cross, check, play, pause, stop, mic, speaker, pencil, menu, lock, home, book, trophy, chart, retry, account, lessons, wordBank, boss, settings, help, lamp. Play, pause and stop are the only filled icons. No emoji.

---

## 13. Accessibility

- Text ≥4.5:1, control borders and icons ≥3:1 (§4.4). `border-border` (`line`) is decorative only.
- Touch targets ≥ `touch` (3rem).
- Focus: 0.125rem `ring` with 0.125rem offset on every interactive element.
- Correct/wrong: colour + ✓/✗ icon + accessible label. Articles: colour + written article.
- `accessibilityRole`, `accessibilityLabel` on icon-only controls, `accessibilityState` for selected/checked (built into React Native Reusables' primitives; keep it when restyling).
- Audio and recordings always have a text alternative.
- Font sizes are rem. Keep `allowFontScaling` on and check layouts at 200% text size.

---

## 14. Component metadata

Every component ships a **meta file** next to it. It tells developers and AI agents what the component is for, when to use it, what it's made of and which tokens it uses. An agent building a screen reads the metas to pick the right component instead of inventing one.

### 14.1 Where it lives

| Component                              | Meta file                                  |
| -------------------------------------- | ------------------------------------------ |
| `src/components/ui/button.tsx`         | `src/components/ui/button.meta.ts`         |
| `src/components/WordCard/WordCard.tsx` | `src/components/WordCard/WordCard.meta.ts` |

The `ComponentMeta` type lives in `src/components/meta.ts`. Storybook (later) shows each meta as a "Metadata" tab.

### 14.2 Format

```ts
export type ComponentMeta = {
  name: string;
  category: 'atom' | 'molecule' | 'organism';
  description: string;
  base?: string;
  spec: string;
  props: Record<string, string>;
  variants?: Record<string, string>;
  states: string[];
  relationships: {
    composedOf?: string[];
    usedIn?: string[];
    pairsWith?: string[];
    alternatives?: Record<string, string>;
  };
  tokens: {
    color: SemanticToken[];
    typography?: TextVariant[];
    spacing?: string[];
    other?: string[];
  };
  accessibility: string[];
  aiHints: {
    useWhen: string[];
    avoidWhen: string[];
    invalid: string[];
  };
};
```

| Field           | What goes in it                                                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `category`      | `atom` = one element (Button, ArticleChip). `molecule` = a few atoms (GapFill, TutorQuote). `organism` = a screen section (TabBar, WordCard with its actions) |
| `description`   | One sentence: what it does                                                                                                                                    |
| `base`          | The React Native Reusables component it's built on (`button`, `toggle-group`), if any                                                                         |
| `spec`          | Where its look is defined: a DESIGN.md section and/or `design/system/components/*.md`                                                                         |
| `props`         | Each prop and its meaning. Types come from TypeScript; this says _why_. Controlled pairs together: `"value / onValueChange": "…"`                             |
| `variants`      | Each variant and when to use it                                                                                                                               |
| `states`        | Every visual state that must exist (and get a story): `idle`, `pressed`, `focused`, `disabled`, `correct`, `wrong`…                                           |
| `relationships` | Parts it's built from, where it's used, what it's paired with, and which other component to use instead, and when                                             |
| `tokens`        | Token **names** it uses (§4.2, §4.3, §5.2, §6, §7). **Never values**                                                                                          |
| `accessibility` | Role, label and state requirements                                                                                                                            |
| `aiHints`       | When to use, when not to, and combinations that are never allowed                                                                                             |

### 14.3 Rules

- **Names, never values.** A meta lists `primary`, `label`, `gutter`, never `#FFD23F`, `24px` or `1.5rem`. `SemanticToken` and `TextVariant` are typed lists matching §4.2–4.3 and §5.3, so a wrong name fails type-checking. DESIGN.md stays the only place with values.
- **Language-neutral.** Use gender roles (`gender-masc`), not `der`/`die`/`das`. No user-visible copy; that lives in `src/i18n/`.
- **Matches the code.** Every variant, prop and state in the meta exists in the component, and the other way round. A component change and its meta change go in the same commit.
- **Usage rules come from the design.** `variants`, `useWhen`, `avoidWhen` and `invalid` come from DESIGN.md, the component specs and the screens. If a rule isn't clear from them, ask the user. Don't invent one.

### 14.4 Example: Button

```ts
export const buttonMeta = {
  name: 'Button',
  category: 'atom',
  description:
    'Triggers an action; the default variant is the one primary action of a screen.',
  base: 'button',
  spec: 'DESIGN.md §9.1, design/system/components/Button.md',
  props: {
    variant: 'Visual weight of the action, see variants',
    disabled:
      'Blocks the action until the screen is ready, e.g. fewer than 3 words added',
    onPress: 'Called on press',
    children: 'Label as a Text, or icon + Text',
  },
  variants: {
    default:
      'The single primary action of the screen: START LESSON, CHECK MY WORDS, NEXT CARD',
    secondary: 'An action next to or below the primary: LISTEN, KNEW IT',
    ghost: 'Low-priority action: SKIP, show hint',
    destructive: 'Confirms losing data; only inside AlertDialog',
  },
  states: ['idle', 'pressed', 'focused', 'disabled'],
  relationships: {
    composedOf: ['Text', 'Icon', 'HardShadow', 'PressableFocus'],
    usedIn: ['Screen footer', 'AlertDialog', 'WordCard', 'GapFill'],
    alternatives: {
      ArticleChip:
        'Choosing der/die/das (a gender role) is a picker, not a button',
      'ToggleGroup item': 'Choosing one option from a set',
    },
  },
  tokens: {
    color: [
      'primary',
      'primary-foreground',
      'ring',
      'destructive',
      'destructive-foreground',
      'muted-foreground',
      'popover',
      'shadow',
    ],
    typography: ['display-btn', 'display-btn-sm', 'label'],
    other: [
      'button',
      'control',
      'touch',
      'button-max',
      'flashcard-desktop',
      'shadow-hard',
      'duration-fast',
    ],
  },
  accessibility: [
    'accessibilityRole="button"',
    'Icon-only buttons need accessibilityLabel from i18n',
    'accessibilityState.disabled when disabled',
    'Height at least touch',
  ],
  aiHints: {
    useWhen: ['The user starts, confirms or moves to the next step'],
    avoidWhen: [
      'Navigating between tabs (TabBar)',
      'Picking an answer option (ToggleGroup / ArticleChip)',
    ],
    invalid: [
      'Two default buttons on one screen',
      'destructive outside AlertDialog',
      'A label in a content font (buttons use display)',
    ],
  },
} satisfies ComponentMeta;
```

---

## 15. Open questions

| #   | Question                                             | Default until decided                                                             |
| --- | ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| Q1  | Does NativeWind accept `rem` in `screens` on native? | Verify in phase 0. If not, keep rem here and convert only in `tailwind.config.js` |
