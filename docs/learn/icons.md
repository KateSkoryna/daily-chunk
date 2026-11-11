# Icons

## What it is

`Icon` (`apps/app/src/components/Icon`) draws one of the app's 14 icons: back, cross, check, play, pause, mic, speaker, pencil, menu, lock, home, book, trophy, chart. You write `<Icon name="check" label="Correct" />`. The set and the style are in `DESIGN.md` §12: 24 grid, stroke 2, square caps, no fill; play and pause are the only filled icons.

## How it is built

- **One list of shapes** (`icon-shapes.ts`): each icon is a few SVG path strings. Both platforms read it, so an icon is drawn once. A new icon is one more entry, never an inline SVG in a screen.
- **Two files, like `Scanlines`.** `Icon.web.tsx` draws a plain `<svg>` (web and Storybook). `Icon.tsx` uses `react-native-svg` on phones. Storybook's bundler cannot load `react-native-svg`, which is why the web file exists.
- **Colour.** The icon uses `currentColor`. On the web that is the colour of the text around it. On a phone nothing is inherited, so `Icon` reads the `TextClassContext` (the same context `Button` will use for its label) and also accepts a `className` such as `text-ring`. Only solid colours: a see-through colour on an SVG closed Expo Go once (step 1.4).
- **Size.** Always `size-6` (1.5rem). On a phone the number comes from `rem.get()`.

## The label rule

An icon on its own must have an accessible name. The props type is either `label` or `decorative`, so an icon without either does not compile. An icon next to text is `decorative` and is hidden from screen readers.

## Where things live

| What                   | Where                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------- |
| Component, meta, story | `src/components/Icon/Icon.tsx`, `Icon.web.tsx`, `Icon.meta.ts`, `Icon.stories.tsx` |
| Shapes and constants   | `src/components/Icon/icon-shapes.ts`                                               |
| The rule               | `DESIGN.md` §12                                                                    |
