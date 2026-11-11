# Task 2: build one small component with tokens

## Why it matters

Every screen is made of small components that use only the tokens from `DESIGN.md`. This task takes you through the whole loop once: a component with NativeWind classes, a meta file, a story with a test, and the guards that fail when you break the rules.

## Files you touch (the agent won't edit these while the task is open)

- `apps/app/src/components/FeedbackLine/FeedbackLine.tsx`
- `apps/app/src/components/FeedbackLine/FeedbackLine.meta.ts`
- `apps/app/src/components/FeedbackLine/FeedbackLine.stories.tsx`

Branch: `task/02-styles`.

## What to build

`FeedbackLine`: one row with a mark and a short sentence, shown after an answer. It has a `tone` prop (`correct` or `wrong`) and `children` for the sentence.

- The mark is `✓` for correct and `✗` for wrong. Correct and wrong are never shown by colour alone (`DESIGN.md` §1).
- Use the semantic colour for each tone from `DESIGN.md` §4.2.
- All text goes through `Text`. Pick the variant for the sentence from the type scale in §5.2.
- Spacing and colours come from tokens only (`gap-2`, `text-success`...).

## Steps

1. Read `DESIGN.md` §4.2 and §5.2, then `src/components/ui/text.tsx` and `text.meta.ts` as your pattern.
2. Create the component. It is controlled by its props and has no state.
3. Write `FeedbackLine.meta.ts` (format: `DESIGN.md` §14). Names only, never values. Run `cd apps/app && npm run check-meta`.
4. Write the story with one story per tone. Each has a `play` function that checks the mark is on the page.
5. Break it on purpose: put a hex colour in a `className`, then run `npx nx run @daily-chunk/app:lint` and read the error. Put it back.
6. Break the meta on purpose: write a token name that does not exist, run `check-meta`, read the error. Put it back.
7. Run `npx nx run-many -t lint typecheck check-meta test`.

## Hints

- Tokens you can use are listed in `src/components/tokens.ts`.
- A meta file must be plain TypeScript: `import type` is fine, a normal import of another file is not.
- `Text` needs no setup in a story: it does not read the app language.

## Done when

- Lint, typecheck, `check-meta` and tests exit 0.
- Both stories exist and their play tests pass.
- Step 5 made lint fail with the hex rule, and step 6 made `check-meta` fail.
- `FeedbackLine.tsx` contains no hex, `rgb()`, px or string shown to the user other than the mark.

Say "check" in chat when you're done.
