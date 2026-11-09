# Progress

Written by the agent while running steps (plan.md §2d). The owner reads this to check results.

Statuses: `TODO` · `IN-PROGRESS` · `DONE` · `WAITING-REVIEW` (built and verified, uncommitted, waiting for the owner's OK) · `WAITING-OWNER` (needs an owner action) · `BLOCKED` (question below)

## Open learning tasks

- Task 1 (`docs/tasks/01-structure.md`): open

## Phase 0: project setup

| Step                                                 | Status         | Branch                    |
| ---------------------------------------------------- | -------------- | ------------------------- |
| 0.1 Workspace and shared packages                    | DONE           | `chore/workspace`         |
| 0.2 Expo app with Expo Router                        | DONE           | `chore/expo-app`          |
| 0.3 Theme: NativeWind, React Native Reusables, fonts | DONE           | `chore/theme-setup`       |
| 0.4 Web storage check                                | DONE           | `chore/web-storage-check` |
| 0.5 Storybook and Vitest                             | DONE           | `chore/storybook-vitest`  |
| 0.6 CI on GitHub Actions                             | WAITING-OWNER  | `chore/ci`                |
| 0.7 EAS project and hosted Storybook                 | WAITING-REVIEW | `chore/eas`               |
| 0.8 Phase 0 wrap-up                                  | TODO           | `chore/phase-0-wrap-up`   |

<!-- Per step, add a section below:
### 0.N <title>
- Result: one line
- Evidence: `command` → result (one line per Done-when item)
- Review: N findings, all fixed
- Owner actions: …
- Questions: …
-->

### 0.1 Workspace and shared packages

- Result: npm workspaces + Nx task runner with empty `core`, `languages`, `i18n` packages.
- Evidence:
  - `npm ci` (from a deleted `node_modules`) → exit 0
  - `npx nx show projects` → `@daily-chunk/core`, `@daily-chunk/languages`, `@daily-chunk/i18n`
  - `npx nx run-many -t lint typecheck` → exit 0, 3 projects
  - `npx prettier --check .` → exit 0; `DESIGN.md` and `design/` unchanged
  - second `npx nx run-many -t typecheck` → "read the output from the cache … 3 out of 3 tasks"
- Review: 0 blocking findings, 3 minor notes (`.gitignore` reorder, `noEmit`/`isolatedModules` may overlap Expo's tsconfig in 0.2, caret versions pinned by lockfile); no change needed.
- Owner actions: none.

### 0.2 Expo app with Expo Router

- Result: `apps/app` is an Expo Router app on SDK 57 (expo ~57.0.32, React Native 0.86.3, React 19.2.3), one placeholder route, wired into Nx. Uncommitted on `chore/expo-app`.
- SDK decision history: the owner chose SDK 56 first; `expo-doctor` then failed on a known Hermes V1 memory regression (affects apps using reanimated); the owner switched to SDK 57 (fixed there). Reasons and links are in `plan.md` D1.
- Evidence:
  - root `README.md` added (requirements, run commands, layout, doc links)
  - root scripts `npm start`, `npm run web`, `npm run android` added; `npm start` → Metro status endpoint answered `200`
  - `npx expo-doctor` (in `apps/app`) → 21/21 checks passed
  - `npx nx run-many -t lint typecheck` → exit 0, 4 projects (core, languages, i18n, app)
  - `npx nx run @daily-chunk/app:export:web` → exit 0, `apps/app/dist/index.html` exists
  - `npx expo export --platform android` (in `apps/app`) → exit 0
  - dev server (`expo start --web --port 8081`) → `curl` returned `200`; stopped afterwards (port closed)
  - `npx prettier --check .` → exit 0
  - D1 in `plan.md` lists the pinned versions with reasons and links
  - `docs/tasks/01-structure.md` exists
- Choices to review:
  - Template demo code, assets and `reactCompiler` experiment removed; routes are in `apps/app/app/` (the template used `src/app/`) to match the planned layout.
  - `apps/app/tsconfig.json` extends the root base and `expo/tsconfig.base` (no `@/*` path aliases).
  - Root `typescript` moved to `~6.0.3` to match the version SDK 57 expects (one TypeScript version in the repo).
  - `.prettierignore` also skips `.expo/` and `expo-env.d.ts` (generated).
  - `app.json` still has the template's icon and splash colours (`#E6F4FE`, `#208AEF`). The real icon and splash need values from `DESIGN.md` and the logo; to be decided when the app icon is built.
- Review: 0 blocking findings, 4 low/info. Fixed: stale Expo Go wording in the 0.2 scope text; task 1 "Done when" now matches the real TypeScript error. Noted for later: `app.json` has `userInterfaceStyle: "automatic"` but the design is dark only (set `"dark"` when the icon and splash are built); Metro may need a `metro.config.js` (`watchFolders`) if it can't resolve `@daily-chunk/core` once task 1 is done (export and typecheck can't show this).
- Learning task 1 is open: `docs/tasks/01-structure.md`. The agent doesn't edit its files (`packages/core/src/**`, `apps/app/app/index.tsx`, the `@daily-chunk/core` line in `apps/app/package.json`).
- Owner actions:
  - If Expo Go from the Play Store is installed, uninstall it first (it only opens SDK 58).
  - Install [Expo Go 57.0.9](https://github.com/expo/expo-go-releases/releases/download/Expo-Go-57.0.9/Expo-Go-57.0.9.apk) on the A54 (allow "install unknown apps"), run `npm start` in the repo root (phone and laptop on the same Wi-Fi), scan the QR code with Expo Go. If it can't connect, run `npx expo start --tunnel` in `apps/app` instead, and check that "Daily Chunk" shows.
  - Start learning task 1 whenever you like, and say "check" when done.

#### 0.2 follow-up: switch to SDK 58 (uncommitted)

- Why: the owner wants any developer to test with the Play Store Expo Go (SDK 58), without sideloading (Expo Go 57 APK was needed before).
- Done: `expo ~58.0.23`, React Native 0.88.1, React 19.3.0, reanimated 4.7.1, worklets 0.13.0, expo-router ~58.0.30; D1, `README.md` and the Expo learn note updated.
- Evidence:
  - `npx expo-doctor` → 20/20 checks passed
  - `npx nx run-many -t lint typecheck` → exit 0, 4 projects
  - `npx nx run @daily-chunk/app:export:web` → exit 0, `dist/index.html` exists
  - `npx expo export --platform android` → exit 0
  - `npm start` → Metro status endpoint `200`; stopped afterwards
  - `npx prettier --check .` → exit 0
- Risk: NativeWind v4 and Reusables are not confirmed on SDK 58 (their peer needs are met on paper). Step 0.3 checks this; fallback is SDK 57.
- Owner actions: uninstall the sideloaded Expo Go 57, install Expo Go from the Play Store, run `npm start`, scan the QR code, check "Daily Chunk" shows.

### 0.3 Theme: NativeWind, React Native Reusables, fonts

- Result: NativeWind 4.2.7 + Tailwind 3.4.19 work on SDK 58 for the web build and compile for Android. Theme, fonts and a dev check screen are in place. Uncommitted on `chore/theme-setup`. Both questions were answered; decisions below.
- SDK 58 verdict: no incompatibility found so far (web render verified in a browser, Android bundle builds, `expo-doctor` 20/20). On-device rendering still needs the owner's check. React Native Reusables components are not installed in this step; their SDK 58 support is first tested when Phase 1 adds one.
- Evidence:
  - `grep -rnE '#[0-9a-fA-F]{3,8}\b|[0-9]+px' apps/app/app` → nothing found
  - `global.css` vs `DESIGN.md` §10.1 → identical (non-empty lines, trimmed); `tailwind.config.js` theme vs §10.2 → identical (deep comparison of the evaluated object; one `content` key added)
  - `npx nx run @daily-chunk/app:export:web` → exit 0; `/dev/theme-check` loaded in headless Chromium (served with clean URLs): all 6 font faces report loaded (`document.fonts.check`), `font-display`/`font-pixel`/`font-content`/`font-content-semibold` resolve to the right families, `p-gutter` = 24px (1.5rem), no console errors
  - the screen's `bg-background` element renders `rgb(18, 14, 36)`, which equals `hsl(251 44% 9.8%)`
  - breakpoint element (`bg-secondary tablet:bg-primary`): `rgb(37, 30, 72)` at 390px wide, `rgb(255, 210, 63)` at 700px wide
  - `npx expo export --platform android` → exit 0 (also with `--no-bytecode` for inspection)
  - `npx expo-doctor` → 20/20; `npm start` dev server → status 200 and `/dev/theme-check` route 200
  - `npx nx run-many -t lint typecheck` → exit 0; `npx prettier --check .` → exit 0
- Not met as written: "`getComputedStyle(body).backgroundColor` matches `--background`". Body is transparent; the screen on top paints the colour. See question 2.
- Question 1 (DESIGN.md §15 Q1, rem in `screens` on native): **Result: accepted, but evaluated with the wrong rem.** The Android bundle keeps the breakpoint as `{unit: "rem", value: 37.5}`. NativeWind resolves it at runtime with a `rem` value that starts at 14 (`react-native-css-interop`, `unit-observables.js`: `rem = observable(14)`), because `inlineRem: 16` only affects values converted at build time. So on native the `tablet` breakpoint would be 525px instead of 600px (and `desktop` 896px instead of 1024px) while web uses 600/1024. Options:
  - **A (recommended).** Keep `DESIGN.md` as is and call `rem.set(16)` (exported by `nativewind`) once in `app/_layout.tsx`. Then web and native match. Not tested on a device.
  - **B.** The `DESIGN.md` §15 default: convert the breakpoints to px in `tailwind.config.js` only. Needs your approval to change `DESIGN.md` §8/§10.2 wording.
- Question 2 (body background on web): a custom `app/+html.tsx` (needed to put `bg-background` on `<body>`) makes Expo Router on SDK 58 drop both the stylesheet link and the script tag from the exported pages, even in its most minimal form (two builds compared; removed again). Options:
  - **1 (recommended).** Leave it. The root screen paints the colour over the whole viewport; `<body>` only shows on overscroll. The `Screen` component (step 1.4) will own the full-screen background.
  - **2.** A web-only effect that adds the class to `<body>` after the page loads (a workaround; white flash before JavaScript runs).
  - **3.** Dig into why `+html` breaks injection (possible Expo bug) and revisit later.
- Review: 0 blocking findings, 4 low/info. Fixed: `tailwindcss` moved to `devDependencies` (NativeWind docs). Noted: the Tailwind `content` globs only cover `app/` and `src/`, so classes used inside `packages/*` would not be scanned (fine until a package ships UI); `rem.set(16)` is not applied until question 1 is answered. The reviewer confirmed the facts in question 1 from the NativeWind source.
- Notes for later:
  - `components.json` uses the `@/components`, `@/lib` aliases; `apps/app/tsconfig.json` has no `@/*` path yet. Add it when the first Reusables component is installed (step 1.6).
  - The default Stack screen background is light (`rgba(242,242,242)`), hidden behind the dev screen. `Screen` (step 1.4) should cover it.
  - `app/dev/theme-check.tsx` has hard-coded English text and ships in production builds; remove or guard it before release.
  - `app.json` `userInterfaceStyle` is now `dark` (`DESIGN.md` §10.2).
  - Expo's tooling added `nativewind-env.d.ts` to `apps/app/tsconfig.json` itself.
- Owner actions:
  - Run `npm start`, scan the QR code with Expo Go, open `/dev/theme-check` (add `/dev/theme-check` to the URL, or use the Expo dev menu). Check: dark background, yellow box, six different fonts (two with Cyrillic text), 24px-ish padding around the card. Rotate the phone to landscape: the second box turns yellow.
  - Look for the line `rem: 16` under the title. If it says `rem: 14`, tell me.

#### 0.3 decisions

- Question 1: owner chose **Fix A**. `app/_layout.tsx` now calls `rem.set(16)` (from `nativewind`) at module level, right after `SplashScreen.preventAutoHideAsync()`. `DESIGN.md` is unchanged. Native breakpoints are now 600/1024/1440px like web.
  - Evidence: web page at `/dev/theme-check` shows `rem: 16` (headless Chromium, both widths, no console errors, breakpoint box still flips at 700px); the readable Android bundle contains `rem.set(16)` right after `preventAutoHideAsync()` (module level, before any screen renders); lint, typecheck, Prettier, web and Android exports all exit 0.
  - Not yet seen on a device: the dev screen shows the live value (`rem: …`) so the owner can confirm `16` on the A54.
- Question 2: owner accepted the recommendation, **option 1**: leave the web `<body>` transparent; the `Screen` component (step 1.4) owns the full-screen background.
- Note: `expo export --platform android` writes into the same `dist` folder as the web export and replaces it; always rebuild the web export before serving `dist`.
- Dark app shell (owner saw a light app): the navigation theme's default background (`rgb(242, 242, 242)`) was drawn over the dark root. `app/_layout.tsx` now wraps the `Stack` in `ThemeProvider` with `DarkTheme` and a `transparent` background, inside a `View className="flex-1 bg-background"`, plus `StatusBar style="light"`. Evidence: headless Chromium at 390x844 on `/` and `/dev/theme-check` → only `rgb(18, 14, 36)` full-screen layer, no light layer; lint, typecheck and web export exit 0. Not yet seen on a device.
- Home placeholder (owner's request, after seeing an empty-looking screen): `app/index.tsx` had an uncoloured `<Text>`, black on the dark background. It is rewritten with DESIGN.md classes only: title (`font-display text-display-xl text-foreground`), a muted line, and a yellow `bg-primary` link button (`min-h-touch`, 48px) to `/dev/theme-check`. This file is reserved for learning task 1, so the task file `docs/tasks/01-structure.md` step 4 now says to add `pair.nativeLang` as a new `<Text>` on this screen. Evidence: headless Chromium at 390x844: title colour `rgb(243, 239, 230)`, font Bungee, button `rgb(255, 210, 63)`, 48px high, click opens `/dev/theme-check` which shows `rem: 16`; no console errors; screenshot checked; lint, typecheck, Prettier, web export exit 0. Hard-coded English text on this placeholder is temporary until the i18n step (1.2) and Home (3.5).

### 0.4 Web storage check (expo-sqlite + Drizzle)

- Result: **passed.** `expo-sqlite` 58 + `drizzle-orm` can save and read a row on web (dev server and exported build) and the Android export builds. D3 is confirmed (no IndexedDB fallback needed). Uncommitted on `chore/web-storage-check`.
- Evidence (headless Chromium 390x844, fresh browser profile per run, page reloaded once):
  - dev server on port 8083, headers served: first load `saved: row-…`, `rows: 1`; after reload `rows: 2` and `first:` unchanged (data persisted); `crossOriginIsolated` true; the page response carried `cross-origin-embedder-policy: credentialless` and `cross-origin-opener-policy: same-origin`
  - exported build (`npx nx run @daily-chunk/app:export:web`) served locally with the headers read from `dist/_expo/.routes.json`: same result, no 404s, no console errors
  - same exported build served without the headers: `error: SharedArrayBuffer is not defined`
  - `npx expo export --platform android` → exit 0
  - cleanup: throwaway route removed, `drizzle-kit` uninstalled (0 mentions in `package.json` and the lockfile), `expo-sqlite` and `drizzle-orm` kept; `git grep -n "storage-check" -- . ':!docs'` matches only the step text in `plan.md`, no code
  - `npx nx run-many -t lint typecheck` → exit 0; `npx prettier --check .` → exit 0
- What is kept: `metro.config.js` bundles `.wasm` and sends the two headers in the dev server; `app.json` has the `expo-router` plugin with the same `headers` (written to `.routes.json` on export) and the `expo-sqlite` plugin entry that `expo install` added; D3 in `plan.md` updated; `docs/learn/storage-on-web.md`.
- Findings for later:
  - First synchronous SQLite call on web timed out ("Sync operation timeout"): the worker has not started yet. A one-time async open first fixes it. Step 3.2 must do this, or use an async layer on web.
  - Synchronous calls block the page on web (expo-sqlite warns about it).
  - COOP `same-origin` and COEP `credentialless` can break popup-based sign-in and some third-party embeds (step 5.7). Any host of the web app must send both headers; GitHub Pages cannot (only matters for Storybook if it ever uses SQLite; it does not).
  - Not caused by this step, seen in the web dev server only: `Error: Cannot manually set color scheme, as dark mode is type 'media'. Please use StyleSheet.setFlag('darkMode', 'class')`. Likely from `userInterfaceStyle: "dark"` (step 0.3) with NativeWind's default dark-mode type. The exported build had no such error. Needs a decision before it annoys development (for example `StyleSheet.setFlag('darkMode', 'class')` at startup).
  - Web check ran in Chromium only. Safari support for `COEP: credentialless` is unconfirmed (reviewer's note); if iOS web is a target, test it before relying on web SQLite there.
  - Not tested on a device: native SQLite on the A54 (the web check and Android export cannot show it).
- Review: 0 blocking findings, 3 low/medium notes. Fixed: GitHub Pages wording softened; Chromium-only caveat added to the learn note and findings. The color-scheme dev error stays a separate out-of-scope finding.
- Owner actions: read `docs/learn/storage-on-web.md`. No question raised for this step.

### 0.5 Storybook and Vitest

- Result: Storybook 10.6.6 (`@storybook/react-native-web-vite`) with NativeWind works on web. `nx run-many -t test` runs plain Vitest tests in the packages, a cross-package test in the app, and a NativeWind-styled story as a headless-Chromium test with the accessibility check on. `build-storybook` produces a static site. Uncommitted on `chore/storybook-vitest`.
- Evidence:
  - `npx nx run-many -t test --skip-nx-cache` → exit 0, 4 projects: `languages` 1 test passed; `core` and `i18n` pass with no tests; `app` 2 files passed (the cross-package `unit` test importing `supportedTargetLangs` from `@daily-chunk/languages`, and the `storybook` project running `Checks/Theme › PrimarySurfaceUsesPrimaryToken` in Chromium)
  - negative check 1: expected token changed to `--secondary` → the story test fails (`expected 'rgb(255, 210, 63)' to be 'rgb(37, 30, 72)'`); reverted
  - negative check 2 (accessibility): adding an unnamed `<Pressable accessibilityRole="button" />` → the story test fails with `button-name` from axe; reverted. See the caveat below.
  - `npx nx run @daily-chunk/app:build-storybook` → exit 0, `apps/app/storybook-static/index.html` exists (about 8 MB, six font files bundled, git-ignored); the built site served locally renders the story: background `rgb(255, 210, 63)`, label font `VT323_400Regular` loaded, no page errors
  - Storybook dev server (port 6007, then stopped): the story rendered with `bg-primary` applied and no console errors
  - `npx nx run-many -t lint typecheck`, `npx prettier --check .`, `npx expo-doctor` (20/20), web export and Android export → all exit 0
- Problems found and fixed on the way (details for the next step that adds components):
  - NativeWind's `wrap-jsx` only registers `View`/`Text` for `className` when `NODE_ENV !== 'test'`, and Vitest sets it to `test`, so story tests rendered with no styles. Fix: `vitest.config.mts` sets `process.env.NODE_ENV = 'development'` (it applies to the whole Vitest process, including the `unit` project). (Overriding it with `define` or `esbuild` options did not help; the dependency pre-bundler reads the real variable.)
  - ESLint scanned the generated `storybook-static/` output; now ignored in `apps/app/eslint.config.mjs`.
  - Not needed, so removed again: `css: true` in the Vitest config and a `vitest.setup.ts` (Storybook 10.3+ applies the add-on annotations itself; the accessibility check was re-verified without it).
- Readability (owner is new to this): the check story uses three named `step()` calls (shown in Storybook's Interactions panel: read the box's real colour, read the `--primary` token colour, check both are equal) and the helper is named `colourPaintedFromToken`; no comments in code (project rule); `docs/learn/storybook-and-vitest.md` has a line-by-line section. Re-verified after the change: tests pass, the `--secondary` negative check still fails, the three step names appear in the Interactions panel (headless Chromium on a Storybook dev server on port 6007, stopped afterwards).
- Kept (minimal): `.storybook/main.ts` (`jsxImportSource: 'nativewind'`), `preview.tsx` (global CSS, fonts loader, dark background, `a11y: { test: 'error' }`), `fonts.ts`, `vite-env.d.ts`, `checks/Theme.stories.tsx` (delete in step 1.2); `postcss.config.js`; `.storybook` added to the Tailwind `content` list (the rest of `tailwind.config.js` is unchanged); `tsconfig.json` includes `.storybook`; `vitest.config.mts` with `unit` and `storybook` projects (`.mts` avoids Vite's warning about ESM syntax in a CommonJS package); root scripts `storybook` and `test`, README rows; `packages/*` `test` scripts (`vitest run --passWithNoTests`); `packages/languages` exports `supportedTargetLangs`; `@daily-chunk/languages` added to the app's dependencies.
- Caveats:
  - In one trial the accessibility check did not flag text with the same colour as its background (`text-primary` on `bg-primary`), so colour contrast may not be enforced yet. Needs a closer look when real components exist (phase 1, and the contrast pass in phase 7).
  - The Storybook `vite-tsconfig-paths` plugin prints a Vite notice that Vite 8 supports tsconfig paths natively; harmless, comes from the framework.
  - A local command wrapper in the owner's shell rewrites `vitest` calls to a tool that hides results and writes a `.vitest/` folder into the project; the agent bypassed it with `rtk proxy`. Not a project file.
  - For step 0.6: Nx caches the `test` target and the browser version is not part of the cache key. A cache hit skips the browser run, so CI must install Chromium (`npx playwright install --with-deps chromium`) before `nx affected -t test`, and the cache should be cleared when Playwright is upgraded.
  - Playwright's Chromium was downloaded to the local cache (`npx playwright install chromium`); CI (step 0.6) must install it too.
- Owner actions: run `npm run storybook` and open "Checks / Theme" (optional); look at `docs/learn/storybook-and-vitest.md`.

### 0.6 CI on GitHub Actions

- Result: `.github/workflows/ci.yml` (four parallel jobs `format`, `lint-typecheck`, `test`, `build`, on `pull_request` and push to `main`) with the shared setup in `.github/actions/setup/action.yml` and `docs/learn/ci-github-actions.md`. Uncommitted on `chore/ci`. Status `WAITING-OWNER`.
- Evidence (every command of `ci.yml`, run locally in the same order, all finished without errors):
  - `npm ci` → ok; `npx playwright install --with-deps chromium` (in `apps/app`) → ok; `npx prettier --check .` → "All matched files use Prettier code style!"
  - `npx nx affected -t lint typecheck test --base=origin/main --head=HEAD` → "No tasks were run" (only `.github/` and docs changed, so nothing is affected; expected). Full run instead: `npx nx run-many -t lint typecheck test --skip-nx-cache` → "Successfully ran targets lint, typecheck, test for 4 projects"
  - `npx nx run @daily-chunk/app:export:web --skip-nx-cache` → "Successfully ran target"
- `actionlint .github/workflows/ci.yml` (installed with Homebrew, run by the owner) → printed nothing, no errors. (`npx --yes actionlint` does not exist on npm; the binary download by the agent was blocked, so the owner ran it.)
- Notes: on a push to `main` the base is the commit before the push (`github.event.before`) (affected has no PR base there). The `ci.yml` actions are pinned to major versions (`@v4`).
- Required check (not run). Current rules checked with `gh api repos/KateSkoryna/daily-chunk/branches/main/protection`: no `required_status_checks` yet, so a `PATCH` would answer 404; a `PUT` with the current rules unchanged plus the check is needed. After the first green run on GitHub, the owner says "apply it" and the agent runs:

  ```
  gh api -X PUT repos/KateSkoryna/daily-chunk/branches/main/protection --input - <<'JSON'
  {
    "required_status_checks": { "strict": true, "contexts": ["format", "lint-typecheck", "test", "build"] },
    "enforce_admins": true,
    "required_pull_request_reviews": { "required_approving_review_count": 0, "dismiss_stale_reviews": false, "require_code_owner_reviews": false },
    "restrictions": null,
    "allow_force_pushes": false,
    "allow_deletions": false,
    "required_linear_history": false,
    "block_creations": false,
    "required_conversation_resolution": false,
    "lock_branch": false
  }
  JSON
  ```

  It keeps PR required, 0 approvals, admins enforced, no force pushes or deletion, and adds only "the four CI jobs must be green and the branch up to date".

- Owner actions: (1) read `docs/learn/ci-github-actions.md`; (2) say "commit", then "open pr"; (3) watch the four jobs go green on the PR; (4) say "apply it".
- Review: 0 blocking findings, 3 low notes, all fixed (`permissions: contents: read`; cancel-in-progress only for PRs; push base is `github.event.before`). actionlint passed (run by the owner).
- Changed after the owner asked for separate checks: one job split into four parallel jobs (own machine each); `actionlint` still prints nothing; `nx affected` for lint, typecheck and test → "No tasks were run" for this docs and workflow only diff (expected).

### 0.7 EAS project and hosted Storybook

- Result: EAS Hosting accepts the static Storybook folder, so the EAS route is used (no GitHub Pages fallback). Storybook is live at https://daily-chunk--2076nn47rb.expo.app (a preview deployment). Uncommitted on `chore/eas`. Status `WAITING-REVIEW`; the CI deploy starts working once the owner adds `EXPO_TOKEN` (see owner actions).
- Written: `apps/app/eas.json` (profiles `development`, `preview` with `buildType: apk`, `production`), the job `deploy-storybook` in `.github/workflows/ci.yml`, `docs/learn/eas.md`.
- Check: `npx eas-cli deploy --help` (eas-cli 27.5.0, "in preview") has `--export-dir` (default `dist`), `--prod`, `--dry-run`, `--json`, `--non-interactive`, `--dev-domain`. So a folder can be deployed. Before login, `eas deploy --dry-run` stopped with "An Expo user account is required"; after login the real deploy below proved a plain static site is accepted.
- Workflow (changed twice after the owner's questions: first to not spend Expo capacity on red code, then to the simplest best-practice form): the job `deploy-storybook` in `ci.yml` has `needs: [format, lint-typecheck, test, build]`, so it only starts when all four are green; it is not one of the required checks. It runs for pushes to `main` and for pull requests from this repository (forks are skipped). Security: the token is only in the token check and the deploy step (not in the install or the Storybook build, which run PR code); permissions are `contents: read`, plus `pull-requests: write` only on this job. Preview for PRs (one PR comment, edited on each push), `--prod` on pushes to `main`. Steps after the token check are skipped while `EXPO_TOKEN` is not set. The URL is read from the `url` field of the `--json` output (checked on the real deploy). Unlike a `workflow_run` workflow, it is testable on the PR itself once the token exists. The separate `storybook.yml` was removed.
- Login and project (after the owner approved a device login in the browser): `npx eas-cli whoami` → `civciv_katesko` (owner of `civciv_katesko` and `civcivkateskos-team`). `npx eas-cli init --account civciv_katesko --non-interactive` → created `@civciv_katesko/daily-chunk` (https://expo.dev/accounts/civciv_katesko/projects/daily-chunk), project ID `267ba1aa-9cca-4306-b902-3b622bba5748`. The personal account was chosen as the default; say if the team account should own it. `app.json` gained `extra.eas.projectId` and `owner`. `eas init` also wrote an unwanted `extra.router` block (duplicate headers plus `asyncRoutes.web: true`); removed it by hand. `npx expo-doctor` → 20/20.
- Deploy: `npx nx run @daily-chunk/app:build-storybook` → exit 0; `npx eas-cli@27.5.0 deploy --export-dir storybook-static --non-interactive --json` → exit 0, `url` https://daily-chunk--2076nn47rb.expo.app; `curl -s -o /dev/null -w '%{http_code}'` → `200`; page title "storybook - Storybook". Dashboard: https://expo.dev/projects/267ba1aa-9cca-4306-b902-3b622bba5748/hosting/deployments
- Verification run: `actionlint .github/workflows/*.yml` → no output (passes); `npx --yes eas-cli whoami` → "Not logged in" before the owner's login (now `civciv_katesko`, see above).
- Owner actions: (1) say "commit", then "open pr", and merge (this puts `projectId` and the workflow on `main`); (2) after the merge, create a token at https://expo.dev/settings/access-tokens and add it as the repository secret `EXPO_TOKEN` (GitHub → Settings → Secrets and variables → Actions); the next PR then gets a preview link and `main` a production deploy; (3) optional: open the Storybook link.
- Review: 0 blocking findings, 5 medium/low, all fixed: the secret is only given to the token check and the deploy step (not the whole job); the deploy step fails if no URL is found; the PR comment is updated instead of repeated (`--edit-last --create-if-none`); `eas-cli` pinned to 27.5.0 (the version the flags were checked on); `actionlint` result recorded; owner order changed so `eas init` comes before the token.
