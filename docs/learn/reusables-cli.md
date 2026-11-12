# React Native Reusables and its CLI

## What it is

React Native Reusables is the phone version of shadcn/ui: a catalogue of ready-made components (button, dialog, input...). It is not a package you import. The CLI **copies the component's source file into your project**, and from then on the file is yours to restyle. Storybook is a different tool: it only shows components, it never creates them.

## When we use it

Only for components with real behaviour: dialogs, select, switch, toggle group, tabs (focus handling, keyboard, screen-reader roles, overlays). Simple components (`Button`, `Text`, chips, cards) are written by hand in the same style: a table of class strings per variant, and the label style through `TextClassContext`. `Button` was first generated and then rewritten; the CLI added nothing we kept, which is why this rule exists.

## How we use it

```
cd apps/app
npx @react-native-reusables/cli@0.7.1 add button
```

The CLI reads `apps/app/components.json` (where `ui/` files go, which alias to use), installs what the component needs (the CLI added `@rn-primitives/slot` for `Button`; our restyled `Button` does not use it, so we removed it) and writes `src/components/ui/button.tsx`. Then we restyle or rewrite that file once so it follows `DESIGN.md` §9, and add its meta and stories. Never restyle per screen.

## Things that went wrong the first time

- **It waits for a yes/no and looks frozen.** `components.json` needs `style`, `rsc`, `tsx` and `aliases.utils`; without them the CLI asks to rewrite the file. We fixed the file, so this does not happen again.
- **It asks before overwriting.** `Text` (`ui/text.tsx`) is ours and the CLI also ships a `text`. Answer "no" so ours is kept.
- **The alias `@/`.** The CLI writes imports like `@/lib/utils`. `tsconfig.json` maps `@/*` to `src/*`; Metro (phone and web) and Storybook read that mapping.

## What we change in every generated component

Remove shadows and rounded corners, use the `touch` / `control` / `button` heights, take colours only from semantic tokens, wrap in `PressableFocus` for the focus ring, and set the label style through `TextClassContext` so a child `Text` needs no colour of its own.
