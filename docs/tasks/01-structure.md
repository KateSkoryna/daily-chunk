# Task 1: share a type between packages

## Why it matters

`packages/core` will hold the types and logic the app, the extension and the backend all use. If the app can't see them, or sees them without checks, bugs hide until runtime. This task makes you wire one type through the whole chain once, so you understand how folders talk to each other.

## Files you touch (the agent won't edit these while the task is open)

- `packages/core/src/` (a new file and `index.ts`)
- `apps/app/package.json` (one line)
- `apps/app/app/index.tsx`

## Steps

1. In `packages/core/src/`, create `language-pair.ts` exporting:
   `LanguagePair = { targetLang: 'de'; nativeLang: 'ru' | 'en' }`
2. Re-export it from `packages/core/src/index.ts`.
3. In `apps/app/package.json`, add `"@daily-chunk/core": "*"` to `dependencies`, then run `npm install` in the repo root.
4. In `apps/app/app/index.tsx`, import the type from `@daily-chunk/core` and use it: make a `const pair: LanguagePair = { targetLang: 'de', nativeLang: 'ru' }` and show `pair.nativeLang` in the screen.
5. Run `npx nx run @daily-chunk/app:typecheck`. It must pass.
6. Break it on purpose: change `nativeLang` to `'fr'`. Run typecheck again and read the error: it should say `'fr'` is not assignable to `'ru' | 'en'`. Change it back.
7. Optional experiment: remove the line from step 3 and run typecheck again. Note what happens, then put it back. The rule stays: every package a project imports is listed in its own `package.json`.

## Hints

- `import type { LanguagePair } from '@daily-chunk/core';`
- The package's `exports` points at `src/index.ts`, so there is no build step. See `docs/learn/monorepo-workspaces-nx.md`.

## Done when

- `npx nx run @daily-chunk/app:typecheck` exits 0 with the correct code.
- With `'fr'` it fails and the error points at `nativeLang` and lists `'ru' | 'en'`.
- `npx nx run-many -t lint typecheck` exits 0.

Say "check" in chat when you're done.
