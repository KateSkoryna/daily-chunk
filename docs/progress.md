# Progress

Written by the agent while running steps (plan.md §2d). The owner reads this to check results.

Statuses: `TODO` · `IN-PROGRESS` · `DONE` · `WAITING-REVIEW` (built and verified, uncommitted, waiting for the owner's OK) · `WAITING-OWNER` (needs an owner action) · `BLOCKED` (question below)

## Open learning tasks

None.

## Phase 0: project setup

| Step                                                 | Status | Branch                    |
| ---------------------------------------------------- | ------ | ------------------------- |
| 0.1 Workspace and shared packages                    | DONE   | `chore/workspace`         |
| 0.2 Expo app with Expo Router                        | TODO   | `chore/expo-app`          |
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
