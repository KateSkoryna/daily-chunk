# Layout primitives

Four small wrappers that every screen and control is built from. Screens never write their own padding, shadow, focus ring or scanlines.

## What each one does

- **`Screen`** (`src/components/Screen`): the page ground. `bg-background`, one `Scanlines`, and the padding from `DESIGN.md` §6: `pt-screen-top px-gutter pb-screen-bottom`, wider gutters at the tablet and desktop breakpoints.
- **`Scanlines`** (`src/theme/Scanlines`): the faint horizontal lines, a 0.0625rem line every 0.25rem in `foreground` at 5% (`opacity-5`). Placed once, inside `Screen`.
- **`HardShadow`** (`src/theme/HardShadow`): the hard offset shadow. React Native has no blur-free shadow on Android, so it draws a plain block behind the child, moved 0.25rem right and down. The same code runs everywhere.
- **`PressableFocus`** (`src/components/PressableFocus`): a `Pressable` with the minimum touch size (`touch`, 3rem) and the focus ring: 2px, `ring` colour, 2px away from the element. The ring is an overlay, so showing it never moves the layout. It shows on focus and on press, the same way.

## Two things worth knowing

- **Platform files.** `Scanlines.web.tsx` (a CSS gradient) is used on the web and in Storybook; `Scanlines.tsx` (about 200 thin views, one per line) is used on phones. Metro and Storybook pick the file by its extension. Both share `scanline-metrics.ts` and the meta file of `Scanlines.tsx`. After adding a platform file, restart the Storybook dev server, because Vite caches how it resolved the name. Phones use views because an SVG pattern version closed Expo Go on the A54 twice (plain SVG shapes worked there, so the cause was not pinned down).
- **The browser's own outline.** Browsers draw a default outline on focused elements. `PressableFocus` switches it off (`outline-none`), otherwise you see two rings.

## Where things live

| What                         | Where                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| Components, metas, stories   | `src/theme/Scanlines`, `src/theme/HardShadow`, `src/components/Screen`, `src/components/PressableFocus` |
| rem measuring in story tests | `src/lib/browser-rem.ts`                                                                                |
| The rules                    | `DESIGN.md` §6 (spacing), §7.4 (shadow), §7.5 (focus), §7.6 (scanlines)                                 |
