# Design guards: lint rule, meta files, token lists

**What:** two automatic checks that keep the code on the design system. They fail the build instead of relying on memory.

**1. Lint rule: no hex, rgb() or px in `src/`.** `apps/app/eslint.design-rules.mjs` uses ESLint's `no-restricted-syntax` with patterns for `#FFD23F`, `rgb(...)` and `24px`. It checks strings, JSX attribute values, JSX text and template strings under `apps/app/src/`. Colours and sizes must come from token classes (`bg-primary`, `px-gutter`). It runs with `npm run lint`. Limits: a bare number such as `{ width: 24 }` is not caught, and a word like `#123` in a string looks like a colour, so it is flagged too (write it differently).

**2. Meta check: every component has a meta file.** Each component `Name.tsx` anywhere under `apps/app/src/` needs `Name.meta.ts` next to it (DESIGN.md §14). `npm run check-meta` (in `apps/app`) fails when a meta file is missing, when a meta has no component next to it, or when it names a token that does not exist. Stories, tests, specs and `index.tsx` are not components.

**Token lists** live in `apps/app/src/components/tokens.ts`: `semanticTokens`, `textVariants`, `spacingTokens`, `otherTokens`. The `ComponentMeta` type in `src/components/meta.ts` uses them, so a wrong name fails type-checking as well. A test (`tests/design-tokens.test.ts`) compares the lists with `tailwind.config.js`, so they cannot drift from the real theme.

**Proof that the guards work:** `tests/design-guards.test.ts` feeds bad code and bad metas (fixtures in `tests/fixtures/meta-check/`) and expects the failures. If a guard stops working, these tests go red.

**In CI:** the `lint-typecheck` job runs `lint`, `typecheck` and `check-meta`; the `test` job runs the fixture tests.

**When you change a token** in `DESIGN.md` and `tailwind.config.js`, update `tokens.ts` in the same branch. The comparison test tells you if you forgot.
