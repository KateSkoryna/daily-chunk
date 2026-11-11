# Progress

Written by the agent while running steps (plan.md §2d). The owner reads this to check results.

Statuses: `TODO` · `IN-PROGRESS` · `DONE` · `WAITING-REVIEW` (built and verified, uncommitted, waiting for the owner's OK) · `WAITING-OWNER` (needs an owner action) · `BLOCKED` (question below)

## Phase 0: project setup

| Step                                                 | Status         | Branch                    |
| ---------------------------------------------------- | -------------- | ------------------------- |
| 0.1 Workspace and shared packages                    | DONE           | `chore/workspace`         |
| 0.2 Expo app with Expo Router                        | DONE           | `chore/expo-app`          |
| 0.3 Theme: NativeWind, React Native Reusables, fonts | DONE           | `chore/theme-setup`       |
| 0.4 Web storage check                                | DONE           | `chore/web-storage-check` |
| 0.5 Storybook and Vitest                             | DONE           | `chore/storybook-vitest`  |
| 0.6 CI on GitHub Actions                             | DONE           | `chore/ci`                |
| 0.7 EAS project and hosted Storybook                 | DONE           | `chore/eas`               |
| 0.8 Phase 0 wrap-up                                  | WAITING-REVIEW | `chore/phase-0-wrap-up`   |

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
- Choices to review:
  - Template demo code, assets and `reactCompiler` experiment removed; routes are in `apps/app/app/` (the template used `src/app/`) to match the planned layout.
  - `apps/app/tsconfig.json` extends the root base and `expo/tsconfig.base` (no `@/*` path aliases).
  - Root `typescript` moved to `~6.0.3` to match the version SDK 57 expects (one TypeScript version in the repo).
  - `.prettierignore` also skips `.expo/` and `expo-env.d.ts` (generated).
  - `app.json` still has the template's icon and splash colours (`#E6F4FE`, `#208AEF`). The real icon and splash need values from `DESIGN.md` and the logo; to be decided when the app icon is built.
- Review: 0 blocking findings, 4 low/info. Fixed: stale Expo Go wording in the 0.2 scope text; task 1 "Done when" now matches the real TypeScript error. Noted for later: `app.json` has `userInterfaceStyle: "automatic"` but the design is dark only (set `"dark"` when the icon and splash are built); Metro may need a `metro.config.js` (`watchFolders`) if it can't resolve `@daily-chunk/core` once task 1 is done (export and typecheck can't show this).
- Owner actions:
  - If Expo Go from the Play Store is installed, uninstall it first (it only opens SDK 58).
  - Install [Expo Go 57.0.9](https://github.com/expo/expo-go-releases/releases/download/Expo-Go-57.0.9/Expo-Go-57.0.9.apk) on the A54 (allow "install unknown apps"), run `npm start` in the repo root (phone and laptop on the same Wi-Fi), scan the QR code with Expo Go. If it can't connect, run `npx expo start --tunnel` in `apps/app` instead, and check that "Daily Chunk" shows.

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
- Home placeholder (owner's request, after seeing an empty-looking screen): `app/index.tsx` had an uncoloured `<Text>`, black on the dark background. It is rewritten with DESIGN.md classes only: title (`font-display text-display-xl text-foreground`), a muted line, and a yellow `bg-primary` link button (`min-h-touch`, 48px) to `/dev/theme-check`. Evidence: headless Chromium at 390x844: title colour `rgb(243, 239, 230)`, font Bungee, button `rgb(255, 210, 63)`, 48px high, click opens `/dev/theme-check` which shows `rem: 16`; no console errors; screenshot checked; lint, typecheck, Prettier, web export exit 0. Hard-coded English text on this placeholder is temporary until the i18n step (1.2) and Home (3.5).

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
  - `npx nx run-many -t test --skip-nx-cache` → exit 0, 4 projects: `languages` 1 test passed; `core` and `i18n` pass with no tests; `app` 2 files passed (the cross-package `unit` test importing `supportedTargetLanguages` from `@daily-chunk/languages`, and the `storybook` project running `Checks/Theme › PrimarySurfaceUsesPrimaryToken` in Chromium)
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
- Kept (minimal): `.storybook/main.ts` (`jsxImportSource: 'nativewind'`), `preview.tsx` (global CSS, fonts loader, dark background, `a11y: { test: 'error' }`), `fonts.ts`, `vite-env.d.ts`, `checks/Theme.stories.tsx` (delete in step 1.2); `postcss.config.js`; `.storybook` added to the Tailwind `content` list (the rest of `tailwind.config.js` is unchanged); `tsconfig.json` includes `.storybook`; `vitest.config.mts` with `unit` and `storybook` projects (`.mts` avoids Vite's warning about ESM syntax in a CommonJS package); root scripts `storybook` and `test`, README rows; `packages/*` `test` scripts (`vitest run --passWithNoTests`); `packages/languages` exports `supportedTargetLanguages`; `@daily-chunk/languages` added to the app's dependencies.
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
- Applied on the owner's "apply it" (2026-11-09), after the four jobs were green on `main`: `gh api -X PUT repos/KateSkoryna/daily-chunk/branches/main/protection` with the body above. Read back with `gh api repos/KateSkoryna/daily-chunk/branches/main/protection`: required checks `format`, `lint-typecheck`, `test`, `build` (`strict: true`), `enforce_admins: true`, 0 required approvals, no force pushes, no deletions. `deploy-storybook` is not required. Status `DONE`.

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
- Closed after the merge (PR #10): the run on `main` finished green, all five jobs `success` (`format`, `lint-typecheck`, `test`, `build`, `deploy-storybook`). Production Storybook https://daily-chunk.expo.app → `curl` `200`, title "storybook - Storybook". The PR preview comment with a working link was seen by the owner on PR #10. Status `DONE`.

### 0.8 Phase 0 wrap-up

- Result: `CLAUDE.md` "Commands" is filled with the real commands and "Status" says phase 0 is built; the phase report is below. Uncommitted on `chore/phase-0-wrap-up`. Status `WAITING-REVIEW`.
- Evidence (run from the repo root, exit codes): `npm ci` 0; `npx prettier --check .` 0; `npx nx run-many -t lint typecheck --skip-nx-cache` 0; `npm test` 0; `npx nx run @daily-chunk/app:build-storybook --skip-nx-cache` 0; `npx nx run @daily-chunk/app:export:web --skip-nx-cache` 0; `npx expo export --platform android` (output to a temporary folder) 0. Long-running commands: `npm run storybook` (port 6011) and `npx expo start --web` (port 8091) both answered `200` and were stopped; `npm start` and `npm run android` are the same Expo server and need a phone or emulator, checked by the owner in step 0.2. The deploy command needs the owner's login and was run in step 0.7.
- Also done here: `docs/progress.md` statuses brought up to date (0.5 and 0.7 `DONE`).
- Review: 0 blocking findings, 2 low notes, nothing to fix. Note 1: `npm start` and `npm run android` were not run here (they need a phone or emulator); the owner can confirm them on the A54. Note 2: "open pr" is the right wording because the earlier steps are already merged.

## Phase 0 report

| Step | Status         | Branch                    | In one line                                                                                          |
| ---- | -------------- | ------------------------- | ---------------------------------------------------------------------------------------------------- |
| 0.1  | DONE           | `chore/workspace`         | npm workspaces + Nx, packages `core`, `languages`, `i18n` exporting TypeScript source                |
| 0.2  | DONE           | `chore/expo-app`          | Expo SDK 58 app with Expo Router, runs on the owner's phone in Expo Go                               |
| 0.3  | DONE           | `chore/theme-setup`       | NativeWind with the DESIGN.md tokens, six fonts, dark app shell, rem set to 16                       |
| 0.4  | DONE           | `chore/web-storage-check` | `expo-sqlite` + Drizzle work on web with the COOP/COEP headers; D3 confirmed                         |
| 0.5  | DONE           | `chore/storybook-vitest`  | Storybook 10 + Vitest (Node and browser projects), a theme smoke story, a11y check on                |
| 0.6  | DONE           | `chore/ci`                | CI as four parallel jobs, green on GitHub and required on `main`                                     |
| 0.7  | DONE           | `chore/eas`               | EAS project linked, `deploy-storybook` job after the checks; production https://daily-chunk.expo.app |
| 0.8  | WAITING-REVIEW | `chore/phase-0-wrap-up`   | real commands in `CLAUDE.md`, this report                                                            |

### Owner actions (in order)

1. Read this report; say "commit" and "open pr" for step 0.8, then merge.
2. Optional: check the app once on the A54 after the latest changes (native SQLite is not tested yet: the web check and the Android export cannot show it).
3. Optional: tell the agent if the Expo project should belong to the team account `civcivkateskos-team` instead of `civciv_katesko`.

### Questions and open findings (decide before or during phase 1)

- Web dev error "Cannot manually set color scheme, as dark mode is type 'media'" (step 0.4), fixed: `darkMode: 'class'` in `tailwind.config.js` and `DESIGN.md` §10.2 (owner approved). Cause: NativeWind's own web startup calls `colorScheme.set('system')` and its `media` guard rejects it; our code never sets the colour scheme. Known upstream: NativeWind issue #1489, closed with this workaround. Tested in the web dev server: with `class` no error and the page renders the same; `StyleSheet.setFlag` at startup and `Appearance.setColorScheme` before the import did not remove the error; forcing `dark` adds nothing. The app stays dark on every device because the colours live in one `:root` block. Not tested on a device.
- The accessibility check did not flag text with the same colour as its background (step 0.5), so contrast is not enforced by Storybook yet. Recommendation: add a real contrast story when the first Reusables component lands (step 1.6).
- `app.json` still has the template's icon, splash and adaptive-icon background colours (hex). Needs the real brand assets; decide when the logo is ready.
- `components.json` aliases need a `@/*` path in `tsconfig` when the first Reusables component is installed (step 1.6); the agent will add it then.
- The dev route and the home placeholder contain hard-coded English until i18n exists (steps 1.2 and 3.5).
- Safari support for `COEP: credentialless` (web SQLite) is unconfirmed; only matters if iOS web is a target.
- The owner's shell wrapper `rtk` hides Vitest output and creates a `.vitest/` folder; the agent bypasses it with `rtk proxy`. Not a project problem.

## Phase 1: design system (theme primitives + core-loop components)

| Step | Status         | Branch                            |
| ---- | -------------- | --------------------------------- |
| 1.1  | DONE           | `chore/design-guards`             |
| 1.2  | DONE           | `feat/i18n-setup`                 |
| 1.3  | DONE           | `feat/text-primitive`             |
| 1.4  | DONE           | `feat/layout-primitives`          |
| 1.5  | WAITING-REVIEW | `feat/icons`                      |
| 1.6  | TODO           | `feat/button`                     |
| 1.7  | TODO           | `feat/article-chip`               |
| 1.8  | TODO           | `feat/word-card`                  |
| 1.9  | TODO           | `feat/lesson-stepper-tutor-quote` |
| 1.10 | TODO           | `feat/gap-fill-record-button`     |
| 1.11 | TODO           | `feat/app-chrome`                 |
| 1.12 | TODO           | `chore/phase-1-review`            |

### 1.1 Design guards (lint rule, ComponentMeta, meta check)

- Result: the lint fails on hex, `rgb()` and px values under `apps/app/src/`; `ComponentMeta` and the token lists exist; `npm run check-meta` fails when a component has no meta or a meta names an unknown token. Both run in CI. Uncommitted on `chore/design-guards`. Status `WAITING-REVIEW`.
- Added: `apps/app/eslint.design-rules.mjs` (used by `eslint.config.mjs`, scope `src/**/*.{ts,tsx}`), `src/components/tokens.ts` (token lists), `src/components/meta.ts` (`ComponentMeta`, DESIGN.md §14.2), `scripts/check-component-meta.mjs` and `scripts/check-meta.mjs`, script `check-meta` in `apps/app/package.json`, `check-meta` cached in `nx.json`, `check-meta` added to the `lint-typecheck` job in `ci.yml`, `docs/learn/design-guards.md`, tests `tests/design-guards.test.ts` and `tests/design-tokens.test.ts` with fixtures in `tests/fixtures/meta-check/`.
- Evidence:
  - Fixture tests that fail on purpose (all pass, meaning the guards fail on bad input): hex colour, short hex in a `className`, hex as JSX text, `rgb()`, `rgba()`, px in a string, px in a template string, all rejected in `src/`; `#123` in prose is rejected too (it is a valid colour), words like `#added`, `#a11y`, `&#8212;`, `#1` pass; the same code outside `src/` is allowed; token classes and rem values pass. Meta check: a valid meta, nested folders and ignored files (stories, tests, specs, `index.tsx`) pass; a component without a meta file, a meta without a component, a meta with unknown token names (`hot-pink`, `huge-title`), a meta with values (`#FFD23F`, `1.5rem`) and a token group that is not an array all fail.
  - Real files: a temporary `src/components/Temp.tsx` with `'#FFD23F'` and `'width: 24px'` → `eslint src` reports 2 errors (hex, px); with no `Temp.meta.ts`, `npm run check-meta` exits non-zero; both pass again after the file was removed.
  - `npx nx run-many -t lint typecheck check-meta test --skip-nx-cache` → "Successfully ran targets lint, typecheck, check-meta, test for 4 projects" (app: 3 unit test files, 28 tests, plus the Storybook story test); `npx prettier --check .` → clean; `actionlint .github/workflows/*.yml` → no output.
  - `tests/design-tokens.test.ts` compares `tokens.ts` with `tailwind.config.js` in both directions (colours, font sizes, spacing, max widths, radius, border width, durations); a mutation check (adding a fake `bogus-size` token) made it fail. `shadow-hard` and `shadow-hard-lg` have no config entry (the `HardShadow` component draws them), so they are exempt.
- Review: 0 blocking findings, 7 notes. Fixed: JSX text is linted; the hex pattern needs exactly 3, 4, 6 or 8 digits and is not preceded by a word character, `&` or `#`; the meta check scans all of `src/` (not only `src/components/`); orphan meta files and token groups of the wrong shape are reported; more fixtures (nested, ignored files, orphan, bad shape); the token test checks both directions; `.vitest/` added to `apps/app/.gitignore`. Not changed: `hsl()` and `oklch()` are not linted (DESIGN.md §10.4 names only hex, `rgb()` and px); `ComponentMeta` types `spacing` and `other` as the token unions where DESIGN.md §14.2 says `string[]`: stricter on purpose (§14.3 wants wrong names to fail type-checking); DESIGN.md is not changed without the owner's approval, so §14.2 still shows `string[]`.
- Caveats: the lint rule does not catch bare numbers (`{ width: 24 }`); there are no real components yet, so the meta check passes on an empty folder; the check relies on Node 24 reading `.meta.ts` files directly (type stripping), so meta files must stay free of type-only syntax that Node cannot erase (plain `satisfies` and `import type` are fine).
- Owner actions: read `docs/learn/design-guards.md`. Question: say if DESIGN.md §14.2 should show the stricter `spacing` and `other` types (the agent will not change DESIGN.md without your OK).

### 1.2 i18n setup

- Result: `packages/i18n` has i18next + react-i18next, `en.json` and `ru.json`, `createI18n`, `useAppLanguage()` and `pickAppLanguage`; the app uses `expo-localization` for the device language. The Russian plural test (1, 2, 5 words) passes; the 0.5 check story is deleted. Uncommitted on `feat/i18n-setup`. Status `WAITING-REVIEW`.
- Added: `packages/i18n/src/` (`app-language.ts`, `resources.ts`, `create-i18n.ts`, `use-app-language.ts`, typed keys declared in `resources.ts`, `locales/en.json`, `locales/ru.json`, three test files), `packages/i18n/tsconfig.json` (JSX, JSON modules); app: `@daily-chunk/i18n` and `expo-localization` dependencies (`expo install`, plugin entry in `app.json`), provider and language apply in `app/_layout.tsx`, an i18n block in the dev route `app/dev/theme-check.tsx` (language, plural string, switch button); `.storybook/checks/` deleted and its glob removed from `.storybook/main.ts`; `passWithNoTests: true` in `vitest.config.mts` (Storybook has no stories until step 1.3); `docs/learn/i18n.md`.
- Versions chosen: i18next 26.7.2 and react-i18next 17.1.13. The newest majors (27.1.1 published 2026-11-10, 18.0.1 on 2026-11-08) were days old; 26/17 are the line with months of patches. react-i18next 17 needs i18next >= 26.2 and React >= 16.8 (React 19.3 here). `expo-localization` ~58.0.5 from `expo install`.
- Evidence:
  - `packages/i18n` tests: 3 files, 11 tests pass. Russian: 1 and 21 → "слово", 2, 4, 22 → "слова", 5, 11, 25 → "слов"; English: 1 → "1 word is due today", 2 and 5 → "words are". `pickAppLanguage`, key parity between the two JSON files (plural suffixes ignored), `createI18n` in the requested language, and `useAppLanguage` (server render with a provider, and `setAppLanguage` changing the instance language) also pass.
  - `npx nx run-many -t lint typecheck check-meta test --skip-nx-cache` → exit 0 for 4 projects (app: 28 unit tests; the Storybook project finds no stories and exits 0); `npx nx run @daily-chunk/app:build-storybook` → exit 0 (empty Storybook); `npx nx run @daily-chunk/app:export:web` → exit 0; `npx expo export --platform android` → exit 0; `npx expo-doctor` in `apps/app` → 20/20; `npm ci` → exit 0; `actionlint` → no output.
  - Real browser (Playwright, exported web build served with `expo serve`, `/dev/theme-check`): browser locale `ru-RU` → "appLanguage: ru" and "На сегодня 5 слов"; `en-US` and `de-DE` → "appLanguage: en" and "5 words are due today"; the switch button flips each to the other language; no console errors in any of 5 runs.
- Problems found and fixed on the way:
  - Hydration mismatch (React error 418) on a Russian browser: the web export is built in English, and the screens hydrate after the root's first effect. Switching the language right after mount, even deferred with a timer, still broke it. Fix: start in English and render the app only after the device language is applied (`isAppLanguageApplied`), which is also the shape needed when `appLanguage` comes from the stored profile.
  - `useAppLanguage` read `resolvedLanguage` first, which lagged behind `language` right after a switch (label said "en" next to Russian text). It now reads `language` first.
  - First `npx expo-doctor` run from the repo root reported a failed check; it passes from `apps/app`.
- Caveats:
  - Russian strings are the agent's translations of the English demo copy ("5 words are due today", "App language"); no Russian twin exists in the screens. The owner should read `ru.json`.
  - The language names in both files are the native names ("English", "Русский").
  - `appLanguage` follows the phone's language for now; the plan says it defaults to `nativeLanguage` from the profile. That comes with the profile (later step).
  - Plurals use `Intl.PluralRules`; Hermes on Android supports it (not yet run on the A54 in this step).
  - Storybook is empty until step 1.3 adds the first component story; the theme smoke story is gone as planned. `passWithNoTests: true` in `apps/app/vitest.config.mts` covers the whole run and could hide a broken stories glob later: remove it in step 1.3, when the first story exists.
  - `deploy-storybook` builds and deploys an empty Storybook for this one step (acceptable).
  - The dev route and the Home placeholder still have hard-coded English labels.
- Review: 0 blocking findings, 1 medium and 4 low, all fixed: a failed `changeLanguage` no longer leaves a blank screen (the error is swallowed and the app renders in English); a test now checks that every Russian plural key has the four forms (one, few, many, other) and every English one has two; a hook test reads the language right after a switch (the `language` vs `resolvedLanguage` regression); `react` is a peer dependency of `@daily-chunk/i18n`; the `passWithNoTests` note above.
- Owner actions: read `docs/learn/i18n.md`; read `packages/i18n/src/locales/ru.json` and tell the agent if a Russian line should change; optional: on the A54 open `/dev/theme-check` and check that the language follows the phone and the button switches it.

### 1.3 Text primitive

- Result: `Text` (`apps/app/src/components/ui/text.tsx`) with all 16 type-scale variants (owner chose option A: the 12 in the `DESIGN.md` §5.3 example plus `display-btn`, `display-btn-sm`, `option`, `chip` from §5.2), built with cva. The first component story exists (`Primitives/Text`, English and Russian) and `passWithNoTests` is removed from `apps/app/vitest.config.mts`.
- Font change (owner's decision during review, `DESIGN.md` §5.1 and §10.2 changed with explicit approval): Russo One (display), Handjet (pixel) and IBM Plex Sans 400/600 (content), replacing Bungee, VT323 and Pixelify Sans. All of them cover Latin and Cyrillic (checked against the Google Fonts CSS: Bungee and VT323 have no Cyrillic; Russo One, Handjet, IBM Plex Sans have it), so there is no font swap by language any more: no `font-display-cyrillic` / `font-pixel-cyrillic`, no `nativeFontScripts` in `packages/languages`, and `Text` does not read the app language. 3 families in 4 font files, down from 5 families in 6 files. Reason: the owner did not like Pixelify Sans (the digit 5 looks like an S) and wanted fewer fonts.
- Added: `src/components/ui/text.tsx`, `text.meta.ts`, `text.stories.tsx`; `src/lib/utils.ts` (`cn` = clsx + tailwind-merge, configured with our text sizes); `src/mocks/type-specimens.ts`; `tests/class-names.test.ts`; `docs/learn/text-variants.md`. Dependencies: `class-variance-authority` 0.7.1, `clsx` 2.1.1, `tailwind-merge` 2.6.1 (2.x on purpose: NativeWind 4 uses Tailwind 3, tailwind-merge 3 is for Tailwind 4), `@expo-google-fonts/handjet`; removed `@expo-google-fonts/bungee`, `vt323`, `pixelify-sans`. Changed: `tailwind.config.js` `fontFamily` (4 entries), `app/_layout.tsx` and `.storybook/fonts.ts` (4 fonts loaded), the font lines in the dev route `app/dev/theme-check.tsx`, and the font mentions in `CLAUDE.md` and `plan.md`.
- Decisions: after the review the owner approved two `DESIGN.md` updates: the §5.3 example now lists all 16 variants, and the `caption` row in §5.2 no longer says "minimum pixel size". The owner also removed the separate learning tasks: `docs/tasks/` is deleted and the rules about them are removed from `CLAUDE.md` and `plan.md` (§2d, the step texts); only `docs/learn/` stays. Variants and defaults agreed with the owner (16 variants; no text shadow on `display-xl` for now; default colours as in §5.3, `foreground` for the four extra variants); fonts as above. `Text` sets no heading role by itself. Storybook has no i18n provider: a global app-language decorator was built and then removed (owner's call: `Text` does not read the language, and the stories get the language as a plain prop); add it back in the step of the first component that shows translated text.
- Evidence:
  - `npx nx run-many -t lint typecheck check-meta test --skip-nx-cache` → exit 0 for 4 projects (app: 55 tests, of which 2 are the `Text` stories in headless Chromium; i18n: 14; languages: 1). `npm run check-meta` passes with `text.meta.ts`. `npx prettier --check .` → exit 0.
  - Story tests (play functions, Chromium), both languages: for all 16 variants the computed font family is the expected face (Russo One for the 5 display variants, Handjet for the 4 pixel variants, IBM Plex Sans 600 / 400 for the content variants) and the size in rem matches `DESIGN.md` §5.2 (14 variants; `display-xl` and `display-l` are skipped because the test browser is desktop width, where they correctly switch to their desktop size); `label` and `label-sm` tracking is 0.125rem; colour relations: `label` = `label-sm`, `caption` = `body-sm`, `body` = `chip`, and `label`, `display-num`, `caption` differ from `body`. Sizes are in rem because the px lint applies to stories. Proof the tests are not vacuous (done before the font change with the then Cyrillic swap): with the Russian display family deliberately set back to the Latin one the Russian story failed (`expected 'Bungee_400Regular…' to contain 'RussoOne_400Regular'`).
  - `tests/class-names.test.ts` (23 tests): `cn` keeps `text-label text-highlight`, keeps `desktop:text-display-xl-desktop`, lets a later colour, family or size win, and keeps every text size in `tailwind.config.js` next to a colour (one test per size, so a new desktop size is covered).
  - `npx nx run @daily-chunk/app:build-storybook` → exit 0; `npx nx run @daily-chunk/app:export:web` → exit 0; `npx expo export --platform android` → exit 0; `npm ci --dry-run` → exit 0.
  - App in a real browser (Expo dev server, `/dev/theme-check`, headless Chromium): exactly 4 font faces loaded (`RussoOne_400Regular`, `Handjet_400Regular`, `IBMPlexSans_400Regular`, `IBMPlexSans_600SemiBold`), no console or page errors, the new font lines render.
  - Comparison with the screens (Playwright at 390 px, computed styles, story vs `.dc.html`): size, line height and tracking match: `display-xl` vs the `Main` title 2.875rem / 2.875rem; `display-btn` vs the `Confirm` button 1.25rem; `display-num` vs `Done` "+140" 1.625rem; `label-sm` vs the `Flashcards` label 1.25rem, tracking 0.125rem, pink. Differences, all explained: font families (the screens use Bungee and VT323; `DESIGN.md` §5.1 now says Russo One and Handjet, owner's decision); the screen title has a pink/cyan text shadow (decided: not in `Text`; see Questions); button and tile text is dark on yellow in the screens, but the colour is the parent's job (`Button` in 1.6, `StatTile` in 1.11 through `TextClassContext`); screens write the text in capitals, `Text` uses `uppercase`.
  - Screenshots at 390 px, English and Russian, looked right.
- Problems found and fixed on the way:
  - `tailwind-merge` takes `text-label` for a text colour and drops it next to `text-highlight`. Fixed by telling it our text sizes (`src/lib/utils.ts`), guarded by `tests/class-names.test.ts`.
  - `text.meta.ts` could not import the token list: meta files are read by plain Node, which needs file extensions. The 16 names are written out in the meta; `check-meta` and the type still reject a wrong name.
  - The story asserted a title size, but the test browser is desktop width, where `display-xl` correctly becomes 4rem. Asserts moved to variants without a desktop size, and in rem, because the px lint applies to stories.
  - The English story showed the Russian translation lines from the §5.2 samples. The English story now has English translations and the Russian story Russian ones.
- Caveats:
  - Web only: `Text` was not run on the A54 or an emulator. The Android bundle builds.
  - Handjet looks small and thin at the `caption` (1.125rem) and `ui` (1.375rem) sizes in the design. If it feels too small on the phone, those sizes change in `DESIGN.md` §5.2 (owner decision).
  - The specimen text in `src/mocks/type-specimens.ts` is the agent's wording: the Russian lines (translations of the §5.2 samples plus the specimen `Съешь ещё`) and the English translation lines of the English story (`body`, `body-sm`). Please read both.
  - `Text` was written by hand in the style of the React Native Reusables `Text` (cva + `TextClassContext`), not generated with the Reusables CLI: it needs no Slot dependency and no config rewrite. The CLI is first used for `Button` in step 1.6, where the `@/` alias in `tsconfig` is also needed.
  - The reference files in `design/system/` and the `.dc.html` screens still name Bungee and VT323; they are reference only and `DESIGN.md` wins.
- Questions for the owner:
  1. `GlitchTitle` (the pink/cyan shadow title, `plan.md` §5) is not in any Phase 1 step. It needs a shadow token in `DESIGN.md` first (`3px` is not allowed in code). Recommended: add a step after 1.11 and the token when you are ready.
- Owner actions: read `docs/learn/text-variants.md`; read `src/mocks/type-specimens.ts` (the Russian and English translation lines); open Storybook (`npm run storybook`, `Primitives/Text`) in both languages; no open question.
- Review: first pass (before the font change) found 0 blocking, 0 medium, 4 low, all fixed (the story tests now cover all 16 variants, the cva export is renamed `textVariantStyles`, `cn` has a test for every size in `tailwind.config.js`; the finding about a parent overriding the Cyrillic swap no longer applies). Second pass after the font change (fresh reviewer): 0 blocking, 0 medium, 2 low. Fonts, `DESIGN.md` §5.1/§10.2, `tailwind.config.js`, `_layout.tsx` and the Storybook loader are consistent; no live leftovers of the old fonts; computed families and Cyrillic glyphs correct in both languages. Low 1: the `DESIGN.md` §5.2 `caption` row said "minimum pixel size", wording from the old fonts; the owner then approved dropping it (done). Low 2: `plan.md` phase 0 evidence still names Bungee; it is history of a finished step, left as it is.

### 1.4 Layout primitives

- Result: `Screen`, `Scanlines`, `HardShadow` and `PressableFocus`, each with a meta file and a story with play tests. Owner's decisions: scanline opacity from Tailwind's scale (`opacity-5`, 5%, not the 4% in `DESIGN.md` §7.6); `HardShadow` default size only; `Screen` uses exactly the `DESIGN.md` padding (insets are checked on the A54 later); scanlines are a CSS gradient on web and thin views on phones (platform files); the owner also asked that focus and press look the same.
- Added: `src/theme/Scanlines` (`Scanlines.tsx` for phones: about 200 thin views, a `bg-foreground` line of 0.0625rem every 0.25rem inside a wrapper with `opacity-5`, sizes from `rem.get()` and the window height; `Scanlines.web.tsx` for web and Storybook: a CSS `repeating-linear-gradient` in `currentColor` with `text-foreground/5`; `scanline-metrics.ts` = the 0.0625rem and 0.25rem both use), `src/theme/HardShadow` (an offset block, `absolute inset-0 translate-x-1 translate-y-1 bg-shadow`, behind the child), `src/components/Screen` (`bg-background`, one `Scanlines`, `pt-screen-top px-gutter pb-screen-bottom tablet:px-gutter-tablet desktop:px-gutter-desktop desktop:pt-16`), `src/components/PressableFocus` (`Pressable`, `min-h-touch min-w-touch`, a ring overlay `absolute -inset-1 border-2 border-ring` shown while focused or pressed, the browser's own outline switched off with `outline-none`), `src/lib/browser-rem.ts` (rem helper for story tests; `text.stories.tsx` uses it), a "Layout primitives" block at the bottom of the dev route `app/dev/theme-check.tsx` (scanline box, `HardShadow` box, a "Hold me" `PressableFocus` button with a "press: pressed / not pressed" line), `docs/learn/layout-primitives.md`. No new dependency: `react-native-svg` was installed during the step and removed again, because nothing uses it now (step 1.5 adds it).
- Guard change: the meta check treats `Name.web.tsx`, `.native.tsx`, `.ios.tsx` and `.android.tsx` as platform files that share the meta of `Name.tsx`, and fails when a platform file has no base file next to it (`scripts/check-component-meta.mjs`, two new fixture tests, `CLAUDE.md` rule line updated).
- Tested on the owner's A54 (Expo Go, `/dev/theme-check`): the fonts render (Russo One and Handjet); "Hold me": the cyan ring shows while pressed and the line says "press: pressed" (this is the press-without-focus path the browser tests could not prove); the thin-views scanlines work. SVG tests on the phone, each shown separately: a plain rect, a pattern and a class-coloured (`text-primary`) SVG all drew correctly, so `react-native-svg` works in Expo Go. Two earlier SVG versions of the phone `Scanlines` closed Expo Go (both used a see-through colour, `text-foreground/5`, and full-window sizes); the cause was not pinned down. A third SVG version (solid colour plus `opacity-5` on the wrapper) was never tried on the phone, because the views version was chosen.
- Evidence:
  - `npx nx run-many -t lint typecheck check-meta test --skip-nx-cache` → exit 0 for 4 projects (app: 64 tests; i18n: 14; languages: 1). `npx prettier --check .` → exit 0. `npm ci --dry-run` → exit 0.
  - `npx nx run @daily-chunk/app:build-storybook` → exit 0; `npx nx run @daily-chunk/app:export:web` → exit 0; `npx expo export --platform android` → exit 0 (this bundles the phone `Scanlines.tsx`).
  - Story tests (Chromium): `HardShadow`: the block is exactly 0.25rem right and down of the child, same size, own colour, ignores touches. `PressableFocus`: Idle is at least 3rem high and wide with no ring; Focused (real Tab): ring 0.125rem thick, 0.25rem outside the element, same colour as `border-ring`, no browser outline, Enter calls `onPress`, ring gone after blur; MouseDown (mouse button held; it also focuses the button, so it does not prove the press-only path, which was proven on the phone): the same ring and no browser outline, and the ring is gone after release and blur. `Scanlines` (web file): gradient with a 0.0625rem line every 0.25rem, colour alpha 0.05, ignores touches. `Screen`: padding in rem for the viewport the story runs in, in two stories: `WithContent` (desktop width, so the desktop values) and `MobileWidth` (a phone viewport, so 3.5 / 1.5 / 1 rem); exactly one scanline layer, and it is the first child.
  - Comparison with the screens at 390 px (Playwright, computed styles, story vs `.dc.html`): `Screen` padding 3.5 / 1.5 / 1 / 1.5 rem = `Main` root padding; scanlines `repeating-linear-gradient(0deg, …)` with a 1px line every 4px = the screen; colour = `foreground`, opacity 0.05 vs the screen's 0.04 (owner's decision); ground `rgb(18, 14, 36)` = the screen. `HardShadow` offset 4px / 4px and colour `rgb(255, 61, 139)` = the `Confirm` button's `box-shadow: 4px 4px 0 #FF3D8B`.
  - Zoomed screenshots with a real Tab and a real mouse press: one single 2px cyan ring, the same in both cases. Dev route in a real browser with a real mouse: no console errors, mouse down changes the line to "press: pressed" and mouse up back.
- Problems found and fixed on the way:
  - Storybook (Vite 8 with rolldown) cannot pre-bundle `react-native-svg`. Five attempts in `.storybook/main.ts` failed and were reverted; the owner chose the platform split.
  - The phone `Scanlines` as an SVG closed Expo Go (see above); replaced by thin views, which work on the phone.
  - The meta check demanded a second meta for `Scanlines.web.tsx`; fixed in the check (see Guard change).
  - The focus ring looked doubled and too thick with Tab (owner's report): the browser's default outline was drawn together with our ring. Fixed with `outline-none`; the ring also shows on press. The purple border the owner saw on the dev route demo button was the demo's own `border-border`, removed.
  - A running Storybook dev server kept failing with "Failed to fetch dynamically imported module" for `Screen` and `Scanlines` after `Scanlines.web.tsx` was added, because Vite had cached the old resolution; a restart fixed it (owner confirmed). Restart Storybook after adding a platform file.
  - The first `Pressed` story (now `MouseDown`) would pass even without the press logic, because a mouse-down also focuses the button, and the test tool's synthetic mouse-down never reaches React Native Web's press handler. The story now claims only what it can prove; the press path was then confirmed on the phone and with a real mouse.
  - The `Screen` story looked broken (owner's report): it sat in a box only 22.5rem tall, so the rest of the canvas was white. It now fills the canvas (`h-screen`).
- Caveats:
  - `Screen` has no tab bar slot yet (step 1.11) and does not centre the tablet or desktop column. `PressableFocus` does not centre its content (`Button`, step 1.6, will).
  - `DESIGN.md` §7.6 said 4% opacity; the owner approved 5% and §7.6 was updated to match the code.
  - The phone `Scanlines` draws as many lines as the window height needs. In a container taller than the window, or on Android with edge-to-edge where the window height may leave out a system bar, the lines can stop a few dp short. In a container smaller than the window (the dev route box) extra lines are built and clipped. Every mounted `Screen` carries about 211 views, and navigation stacks keep screens mounted; not measured, check for jank on the A54 when there are several screens. The phone file is covered only by the Android bundle build and the owner's A54 test, not by Storybook.
  - The ring shows after a mouse click on web too (by design, same as focus). `disabled` is not handled in the ring logic: a focused button that becomes disabled keeps its ring until blur (harmless).
  - `shadow-hard` and `shadow-hard-lg` are named in `DESIGN.md` §7.4 and `tokens.ts` but not defined in `tailwind.config.js`; `HardShadow` does not use them (it uses `translate-x-1`). `HardShadow` has no "no shadow when pressed" state yet; `Button` (step 1.6) will decide.
  - For step 1.5 (icons): SVG with solid colours works in Expo Go; avoid see-through colour strings (`/5`-style) on SVG until that is understood.
- Questions for the owner:
  1. None open. (`DESIGN.md` §7.6 was changed to 5% with the owner's approval.)
- Owner actions: open Storybook (`npm run storybook`): `Primitives/PressableFocus` (press Tab, click and hold), `Primitives/HardShadow`, `Primitives/Screen`, `Primitives/Scanlines`; read `docs/learn/layout-primitives.md`; answer the question.
- Review: first pass (before the phone tests) found 0 blocking, 1 medium, 4 low, all fixed (the `Pressed` story, a phone-width `Screen` story, the `HardShadow` and `PressableFocus` metas). Second pass over the later changes (views `Scanlines`, dev route, dependency removal): 0 blocking, 0 medium, 4 low. Fixed: the `Pressed` story is renamed `MouseDown` (it cannot tell the press path from focus); `Screen.meta.ts` no longer lists `foreground` (only `Scanlines` uses it); the learn note no longer guesses a cause. Noted as caveats: the line count follows the window height, not the container, and the phone `Scanlines` has no automated test.

### 1.5 Icons

- Result: `Icon` with 15 icons (later 14, see 1.5b): back, close, cross, check, play, pause, mic, speaker, pencil, menu, lock, home, book, trophy, chart. Owner's decisions after the questions: 1A (the 13 icons the screens draw for the core loop, plus check and cross; the menu icons and stop, search, flip, plus, heart are added in the step that first needs them) and 2A (the `DESIGN.md` §12 style for every stroke icon, and play and pause filled).
- Documents changed with the owner's approval: `DESIGN.md` §12 (the set of 15, "play and pause are the only filled icons", and the platform wording) and `plan.md` §5 and step 1.5 (the list of 15 instead of 17).
- Added: `src/components/Icon` (`icon-shapes.ts` = the paths of all icons plus the constants viewBox 24, stroke 2 and size 1.5rem; `icon-props.ts` = the props type: either `label` or `decorative`; `Icon.web.tsx` = a plain `<svg>` for web and Storybook; `Icon.tsx` = `react-native-svg` for phones; `Icon.meta.ts`; `Icon.stories.tsx`), an "Icons" block in the dev route `app/dev/theme-check.tsx` (all 15 icons with names, and four labelled icons in solid colours), dependency `react-native-svg` 15.16.0 (`expo install`), `docs/learn/icons.md`.
- How the colour works: the icon uses `currentColor`. On web it follows the CSS colour of the text around it. On phones nothing is inherited, so `Icon` merges the classes of `TextClassContext` (the context `Button` will use) with its own `className`, and `cssInterop` on `Svg` passes the colour from the class to the SVG's `color` prop (without it the icons were black on the phone, because react-native-svg does not read the colour from the style). Solid colours only.
- Evidence:
  - `npx nx run-many -t lint typecheck check-meta test --skip-nx-cache` → exit 0 for 4 projects (app: 67 tests, of which 3 are new `Icon` stories in headless Chromium; i18n: 14; languages: 1). `npx prettier --check .` → exit 0. `npm ci --dry-run` → exit 0.
  - `npx nx run @daily-chunk/app:build-storybook` → exit 0; `npx nx run @daily-chunk/app:export:web` → exit 0; `npx expo export --platform android` → exit 0 (this bundles the phone `Icon.tsx` with `react-native-svg`).
  - Story tests: `AllIcons`: 15 SVGs, each hidden from screen readers, exactly 1.5rem wide and high, and only play and pause are filled. `WithLabel`: the SVG has role `img` and the name "Correct", and its colour equals the `success` colour of a reference swatch. `ColourFromTextContext`: inside `TextClassContext` with `text-ring` the icon takes the `ring` colour.
  - Comparison with the screens (a Playwright image with the screen's SVG and ours side by side, 13 icons): same shapes and proportions; the screens draw them at different view boxes (16, 20, 24) and sizes; ours are all on the 24 grid with stroke 2 at 1.5rem (`DESIGN.md` §12 wins). The screen's close X is drawn larger in its box; ours was widened from 58% to 67% of the grid to match.
  - A Storybook story screenshot at 390 px shows all 15 icons with their names; no page errors.
- Tested on the owner's A54 (Expo Go, `/dev/theme-check`): first the icons were black; after the `cssInterop` fix all draw and the coloured ones have their colours (owner confirmed). Still open: an icon inside a `Button` (step 1.6).
- Caveats:
  - `check` is the agent's own drawing (no screen has a check icon; the screens write the text character ✓), in the same style. `cross` and `close` share one shape; `cross` is the wrong-answer mark and `close` the dismiss control.
  - `lock` is drawn but no Phase 1 component uses it yet (it is in the Lessons screen for locked lessons).
  - `DESIGN.md` §12 says icons are rendered "inside a `touch` target"; `Icon` itself is 1.5rem and the target comes from `PressableFocus`.
  - The screens hard-code a colour in two icons (`#2EE6D6`, `#FF3D8B`); ours always follow the text colour.
- Questions for the owner: none open.
- Owner actions: look at Storybook `Primitives/Icon`; read `docs/learn/icons.md`; tell me if you want a different check mark.
- Review: fresh reviewer found 0 blocking, 0 medium, 3 low. Fixed: low 3 (the meta now lists `success` and `highlight`). Left on purpose: low 1 (`label=""` compiles; TypeScript cannot cheaply require a non-empty string); low 2 (the whole `TextClassContext` string, including font classes, is merged into the icon; harmless on web, unverified on a phone) goes to step 1.6: test `Button` + `Icon` on the A54, or filter the context to the colour class. The reviewer did not run the phone `Icon.tsx` and did not compare back, close, pencil, menu, book, lock and pause with the screens (the agent did, see above).

### 1.5b Storybook controls for Icon

- Result: the Icon stories follow the new pattern (owner's request: use Storybook fully). `Default` is the interactive story (controls: name, label, decorative, className; a swatch and a "Screen readers say" line make the invisible parts visible), then `Gallery`, `Decorative` and `InheritsColour` (a `WithLabel` story was dropped: `Default` covers it) (extra control `parentTextClass`). A story shows only the controls it uses. The old `Colours` story is folded into the `Default` test.
- Owner's decisions: remove the `close` icon and use `cross` for both the wrong-answer mark and the dismiss control (`DESIGN.md` §12 and `plan.md` §5 changed with the owner's approval: 14 icons now).
- Added: `@storybook/addon-docs` (Docs tab, `tags: ['autodocs']`), registered in `.storybook/main.ts`.
- Evidence: `npx nx run-many -t lint typecheck check-meta test --skip-nx-cache` → exit 0; `npx prettier --check .` → exit 0; `build-storybook` → exit 0.
- Applied to every existing component (`Text`, `HardShadow`, `Scanlines`, `Screen`, `PressableFocus`, `Icon`): an Overview page generated from the meta (`src/lib/meta-to-markdown.ts`), `Default` first, typed controls where a component has props. Renames: `AllVariantsEnglish/Russian` → one `Gallery` with an `appLanguage` control (plus a new interactive `Text` `Default` with the same control), `DefaultOffset`/`OnScreenGround`/`WithContent`/`Idle` → `Default`, `MouseDown` → `Pressed`. The Storybook page is called Overview (`docs: { defaultName }` in `.storybook/main.ts`).
- Rule added (owner's request): the story pattern is now in `CLAUDE.md` (Workflow) and `plan.md` §2d "Done when".
- Caveats: the `parentTextClass` control is not a real prop of `Icon` (it sets the `TextClassContext` value in the story); it needs a type cast in the story. `Text` stories are not rebuilt yet.
- Owner actions: look at Storybook `Primitives/Icon`.
