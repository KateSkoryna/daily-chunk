# SVG in Storybook and the tests

`react-native-svg` is built for phones. Its web code still imports one phone-only module (`TurboModuleRegistry` from `react-native`, which `react-native-web` does not have) and one package that is not installed on web (`@react-native/assets-registry`). Vite bundles ("optimises") such libraries before the browser loads them, and the bundler stops on both problems.

## Why it only broke later

The library is found by Vite when the first file imports it. A warm cache from an earlier successful run hid the problem, and the first SVG file kept working. A new file that imported the library (the logo) made Vite bundle it again, and the error showed, also on a clean `npm run storybook` and when a single story file was run alone.

## The fix

`.storybook/main.ts` has a `viteFinal` with two lines of config:

- `optimizeDeps.rolldownOptions.shimMissingExports: true`: a missing export becomes an empty value instead of an error (the phone code that uses it never runs on web).
- an alias that points `@react-native/assets-registry/registry` to a stub (`tests/stubs/assets-registry.ts`).

The Vitest story project reads the same Storybook config, so tests, `npm run storybook` and `build-storybook` agree.

## Drawing a multi-colour mark

An icon takes one colour (`currentColor`). The logo has four colours, so it is four stacked SVG layers, each coloured by a token class (`text-highlight`, `text-primary`, `text-background`, `text-foreground`). No hex colour is written in code.
