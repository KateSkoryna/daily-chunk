# Storybook and Vitest

## What they are

- **Storybook**: a workshop page that shows one component at a time, in each state. We build and check components there before using them in screens. It runs on web only.
- **Story**: one saved state of a component, written as a small file (`*.stories.tsx`). A story can also have a `play` function that clicks and checks things.
- **Vitest**: the test runner. Plain tests (packages, logic) run in Node. **Story tests** run every story in a real headless Chromium (driven by Playwright) and fail if the `play` function or the accessibility check (axe) fails.

## Where it lives

- `apps/app/.storybook/main.ts`: which stories to load and which add-ons.
- `apps/app/.storybook/preview.tsx`: runs before every story: loads `global.css`, the six fonts, a dark background, and turns on the accessibility check for every story.
- `apps/app/vitest.config.mts`: two projects: `unit` (`tests/*.test.ts`, Node) and `storybook` (all stories, Chromium).
- `apps/app/postcss.config.js` and the `content` list in `tailwind.config.js`: how Tailwind finds classes inside Storybook.
- `.storybook/checks/Theme.stories.tsx`: a throwaway check (removed in step 1.2).

## Commands

- `npm run storybook -w @daily-chunk/app`: open Storybook at http://localhost:6006.
- `npx nx run-many -t test`: all tests in all projects.
- `npx nx run @daily-chunk/app:build-storybook`: static site in `apps/app/storybook-static`.

## Good to know

- NativeWind only maps `className` to React Native components when `NODE_ENV` is not `test`. Vitest sets it to `test`, so `vitest.config.mts` sets it to `development` (this applies to the `unit` project too). Without that, story tests render unstyled.
- Storybook needs `jsxImportSource: 'nativewind'` (set in `main.ts`) so `className` works on web.
- The accessibility check failed on an unnamed button, as it should. In one trial it did not flag text with the same colour as its background, so don't rely on it for colour contrast yet.

## Reading the Theme story (the throwaway smoke test)

- The component: a box with `className="bg-primary"`. The class becomes a CSS rule through `tailwind.config.js` and `global.css`.
- Step 1: ask the browser (`getComputedStyle`) for the box's real colour.
- Step 2: read the `--primary` token and paint a temporary swatch with it (`colourPaintedFromToken`), then ask the browser for the swatch's colour and remove the swatch.
- Step 3: the two colours must be equal.
- It fails if the component uses another token or the Tailwind link breaks. It cannot fail on a wrong colour value (both sides come from `global.css`). Its job is to prove the setup works end to end.

## Phone size in Storybook

Storybook runs the components on the web (`react-native-web`), not on a phone. To see the phone layout, open the viewport button in the toolbar and choose "Phone (design size)" (390 x 844, the size of the design screens); the preview narrows and the `desktop:` rules switch off. Behaviour that only a real phone shows (native animation driver, Android dashed borders, notches) is checked on the A54 through `/dev/theme-check`.
