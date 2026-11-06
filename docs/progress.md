# Progress

Written by the agent while running steps (plan.md §2d). The owner reads this to check results.

Statuses: `TODO` · `IN-PROGRESS` · `DONE` · `WAITING-REVIEW` (built and verified, uncommitted, waiting for the owner's OK) · `WAITING-OWNER` (needs an owner action) · `BLOCKED` (question below)

## Open learning tasks

- Task 1 (`docs/tasks/01-structure.md`): open

## Phase 0: project setup

| Step                                                 | Status | Branch                    |
| ---------------------------------------------------- | ------ | ------------------------- |
| 0.1 Workspace and shared packages                    | DONE   | `chore/workspace`         |
| 0.2 Expo app with Expo Router                        | DONE   | `chore/expo-app`          |
| 0.3 Theme: NativeWind, React Native Reusables, fonts | TODO   | `chore/theme-setup`       |
| 0.4 Web storage check                                | TODO   | `chore/web-storage-check` |
| 0.5 Storybook and Vitest                             | TODO   | `chore/storybook-vitest`  |
| 0.6 CI on GitHub Actions                             | TODO   | `chore/ci`                |
| 0.7 EAS project and hosted Storybook                 | TODO   | `chore/eas`               |
| 0.8 Phase 0 wrap-up                                  | TODO   | `chore/phase-0-wrap-up`   |

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
