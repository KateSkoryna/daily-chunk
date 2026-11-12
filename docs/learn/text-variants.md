# Text variants

## What it is

`Text` (`apps/app/src/components/ui/text.tsx`) is the only way to show text. You write `<Text variant="label">` and it sets font family, size, line height and default colour from `DESIGN.md` §5. Screens never write `font-pixel text-label uppercase` themselves.

## How it is built

- **A table of class strings** (`variantClasses`): one entry per variant, 16 in all, and `Text` picks the entry for its `variant`. One place to change a style. It is a plain object on purpose: no helper library for a lookup.
- **`cn`** (`src/lib/utils.ts`): joins class names and lets a later class win over an earlier one (`clsx` + `tailwind-merge`). We told `tailwind-merge` our custom text sizes (`text-label`, `text-display-xl`...), otherwise it takes `text-label` for a colour and drops it. `tests/class-names.test.ts` guards this.
- **`TextClassContext`**: a parent such as `Button` puts its text classes in the context, and every `Text` inside picks them up. This is how a button sets the label colour without passing classes down.

## Fonts

Three families: Russo One (titles, buttons, numbers), Handjet (labels and UI text) and IBM Plex Sans in two weights (words and sentences). All of them cover both Latin and Cyrillic, so no font depends on the app language and `Text` has no language logic.

On native a font family is one file with no fallback, so each weight is its own family (`font-content` and `font-content-semibold`).

## Where things live

| What                                    | Where                                                            |
| --------------------------------------- | ---------------------------------------------------------------- |
| Component, meta, story                  | `src/components/ui/text.tsx`, `text.meta.ts`, `text.stories.tsx` |
| Specimen text for the story (EN and RU) | `src/mocks/type-specimens.ts`                                    |
| The variants and their sizes            | `DESIGN.md` §5.2, `tailwind.config.js` `fontSize`                |
