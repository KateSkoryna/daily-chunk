# NativeWind and design tokens

## What they are

- **Tailwind**: utility classes such as `p-4` or `bg-primary` instead of hand-written styles.
- **NativeWind**: makes the same classes work in React Native, on phone and web.
- **Token**: a named design value (`primary`, `gutter`). `DESIGN.md` defines them; code uses only the names.

## How the pieces connect

- `apps/app/global.css`: the colour variables (`--yellow`, `--background`...), copied from `DESIGN.md` §10.1.
- `apps/app/tailwind.config.js`: turns variables into class names (`bg-primary`), plus fonts, sizes and spacing, from §10.2.
- `apps/app/babel.config.js` and `metro.config.js`: tell the build to understand `className`. `inlineRem: 16` makes 1rem = 16px.
- `apps/app/app/_layout.tsx`: loads `global.css`, loads the six fonts, and keeps the splash screen until they are ready.
- `apps/app/app/dev/theme-check.tsx`: a developer-only screen showing the tokens. Open `/dev/theme-check`.

## Good to know

- On native, a font family is a single file, so each weight is its own class (`font-content` vs `font-content-semibold`).
- `rem` in build-time values (padding, sizes) uses `inlineRem`. Breakpoints are checked while the app runs, with a separate `rem` that starts at 14. See `docs/progress.md` step 0.3.
- Never write hex colours or px values in app code. Use the token classes.
