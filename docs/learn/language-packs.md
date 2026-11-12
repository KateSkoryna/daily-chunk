# Language packs

## What it is

Everything that belongs to one language lives in `packages/languages`, never in a component. A **target language pack** (v1: German, `src/de/`) holds what the app needs to teach that language: the article for each gender role (`masc` → der, `fem` → die, `neut` → das, `plural` → die), the label of the plural tag (`die · Pl.`) and which genders a person can pick from.

## Why

Components say `gender="masc"`, never `der`. `ArticleChip` asks the pack: `getTargetLanguagePack('de').articles.masc`. A language with two genders (French, Spanish) later gets its own pack with `masc` and `fem` only; no component changes. The rule is in `CLAUDE.md` (Language rules) and `plan.md` §2a.

## How to read it

- `gender.ts`: the four roles (`GenderRole`).
- `target-language-pack.ts`: the shape every pack must have (`TargetLanguagePack`).
- `de/index.ts`: the German pack, written as `satisfies TargetLanguagePack`, so a missing field fails type-checking.
- `get-target-language-pack.ts`: `getTargetLanguagePack('de')` returns the pack for a supported target language.

## What it is not

Not the interface strings. Buttons, labels and Chunk's lines are in `packages/i18n` (`en.json`, `ru.json`) and follow the **app** language; a pack follows the **target** language. A screen reader name like "Correct" is an interface string, the article `der` is pack content.
