# Navigation shell: tabs, drawer, leaving a lesson

## What it is

The frame around the screens: the tab bar at the bottom, the burger menu (drawer) and the lesson flow. Each route already exists and shows a `PlaceholderScreen` until its real screen is built.

## Where it lives

- `apps/app/app/(tabs)/_layout.tsx`: Expo Router `Tabs` with our `TabBar` as its bar, and the `Drawer`. A folder in parentheses is a **group**: it shares a layout but is not part of the URL (`/lessons`, not `/(tabs)/lessons`).
- `apps/app/app/[page].tsx`: one file for `/account`, `/review`, `/word-bank`, `/boss`, `/settings`, `/confirm` (a **dynamic route**: the name in brackets is a parameter). Same for `app/lesson/[task].tsx`. A real screen replaces a placeholder by adding a file with its own name, for example `app/lesson/read.tsx`; the exact name wins over the bracket.
- `apps/app/app/lesson/_layout.tsx`: the lesson stack and the leave guard.
- `src/components/Drawer`, `src/features/navigation/`: the drawer, the leave dialog, the placeholder.

## How leaving a lesson is stopped

`usePreventRemove(true, callback)` tells the router "do not remove this screen". When someone presses back, swipes or closes the page, the router calls our callback with the action it paused. We keep it, show `LeaveLessonDialog`, and if they press Leave we dispatch the kept action. The Done screen turns the guard off because nothing is lost there.

## How it is tested

`npm run e2e` (in `apps/app`) exports the web app, serves `dist`, and drives it with Playwright: every tab, every drawer item, Escape, and the leave prompt.
