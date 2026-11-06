# Monorepo: npm workspaces and Nx

## What it is

One git repo holding several projects: the app (`apps/`) and shared code (`packages/`).

- **npm workspaces**: the root `package.json` lists `"workspaces": ["apps/*", "packages/*"]`. One `npm ci` installs everything, and npm links each package into `node_modules/@daily-chunk/*` so projects can import each other by name.
- **Nx** (task runner only): runs the same script (`lint`, `typecheck`, `test`) in every project, and skips work whose inputs haven't changed (cache). Config: `nx.json`.

## Why we use it

Shared packages (`core`, `languages`, `i18n`) are used by the app now and by the browser extension and backend later. One place, one version.

## Where it lives

- `package.json` (root): workspaces, shared dev tools
- `nx.json`: which tasks are cached
- `tsconfig.base.json`: TypeScript rules every project extends
- `packages/*/package.json`: `exports` points at `src/index.ts`, so consumers read TypeScript source directly (no build step). A consumer must list the package in its own `package.json`, otherwise it is invisible to it.

## Useful commands

- `npx nx show projects`: list projects
- `npx nx run-many -t typecheck`: run a task everywhere
- `npx nx run-many -t typecheck` again: shows "existing outputs match the cache"
