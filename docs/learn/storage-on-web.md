# Storage on web: SQLite, expo-sqlite, Drizzle

## What they are

- **SQLite**: a small database that lives in one file. No server.
- **expo-sqlite**: lets React Native code use SQLite. On a phone it is the real SQLite. On web it runs SQLite as WebAssembly (`.wasm`) inside a Web Worker and saves to the browser's private file storage, so data survives reloads.
- **Drizzle**: describes tables in TypeScript and gives typed queries. Its `expo-sqlite` driver uses expo-sqlite's synchronous calls.

## What step 0.4 tested

A throwaway screen saved one row and read it back, then the page was reloaded. Result in headless Chromium, both in the dev server and in the exported build: **works**. After a reload the table had 2 rows and the first row's value was unchanged. Android export builds.

## What web needs

- Metro bundles `.wasm` files (`metro.config.js`).
- The page must be "cross-origin isolated" so the browser allows `SharedArrayBuffer`. That needs two headers: `Cross-Origin-Embedder-Policy: credentialless` and `Cross-Origin-Opener-Policy: same-origin`. Dev server: set in `metro.config.js`. Production: the `expo-router` plugin in `app.json` writes them to `dist/_expo/.routes.json`, which EAS Hosting reads. Without the headers the page fails with "SharedArrayBuffer is not defined".
- Any other host for the web app must send the same two headers. GitHub Pages cannot set custom headers (only fragile workarounds such as a service worker exist).
- Only tested in Chromium. Safari support for `credentialless` is unconfirmed, which matters if iOS web is a target.

## What the headers may break

- `Cross-Origin-Opener-Policy: same-origin` cuts the link between a page and a popup it opens, so sign-in flows that use a popup can fail. Redirect-based sign-in is fine.
- `credentialless` blocks third-party resources that need cookies, and embeds that don't allow cross-origin loading.

## Caveats for the real storage layer (step 3.2)

- The first synchronous call on web can time out because the worker has not started yet ("Sync operation timeout"). Fix: open the database once with the async API first (`openDatabaseAsync`, then close it) before using Drizzle.
- Synchronous calls block the page while they run; expo-sqlite warns about this on web. An async layer may suit web better. Decide in step 3.2.
