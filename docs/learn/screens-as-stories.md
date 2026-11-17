# Screens as stories

A **screen** here is a normal component that draws one whole page. It does not know where its data comes from. It gets data and callbacks as props (`words`, `onCheckWords`) and reports what the person does through the callbacks.

Why this way:

- **Phase 2 has no storage and no navigation yet.** A story hands the screen mock data and `fn()` callbacks, so we can look at the page and test it in Storybook.
- **Phase 3 only connects it.** The Expo Router route will read the store, pass the values in and call `router.push` in the callbacks. The screen itself does not change.
- **The tab bar is not in the screen.** In Expo Router the tab bar belongs to the layout around the screens. The story puts a `TabBar` under the screen so the page looks like the design.

Where things live:

- `src/features/<feature>/<Name>Screen.tsx` with its `.meta.ts` and `.stories.tsx` (story title `Screens/<Name>`).
- Texts come from `packages/i18n` through `useTranslation`, the content (words, numbers) from `src/mocks`.
- State that only the page needs (the text typed in the text area) lives in the story's small demo component until the route owns it.

How we check a screen: the story's `play` test uses the buttons the way a person would, a screenshot at 390 × 844 goes next to the screenshot of the design file, and every difference is either fixed or written down.
