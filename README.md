# Daily Chunk

Mobile-first vocabulary trainer. You add the German words you met today, the app turns them into a 6-task lesson and then schedules reviews. Runs on Android, iOS and web.

## Requirements

- Node 24 (`.nvmrc`)
- Expo Go from the Play Store (it opens SDK 58 apps), to try the app on an Android phone without building it

## Run the app

```bash
npm ci
npm start
```

Scan the QR code with Expo Go (phone and laptop on the same Wi-Fi). If it can't connect, run `npx expo start --tunnel` inside `apps/app`.

| Command                                        | What it does                                                   |
| ---------------------------------------------- | -------------------------------------------------------------- |
| `npm start`                                    | Dev server, QR code for Expo Go                                |
| `npm run web`                                  | Open the app in the browser                                    |
| `npm run android`                              | Open on an Android emulator or device                          |
| `npm run storybook`                            | Open Storybook (component workshop) on port 6006               |
| `npm test`                                     | Run all tests (packages in Node, stories in headless Chromium) |
| `npx nx run-many -t lint typecheck check-meta` | Lint, typecheck and component meta check                       |
| `npx nx run @daily-chunk/app:export:web`       | Build the web version into `apps/app/dist`                     |
| `npm run format`                               | Format all files with Prettier                                 |

## Repo layout

```
apps/app/            Expo app (Android, iOS, web)
packages/core/       domain types and logic shared by all projects
packages/languages/  language rules (German target; Russian, English native)
packages/i18n/       UI strings
docs/                learning notes, tasks, progress
```

## Docs

- [`plan.md`](plan.md): decisions, phases and steps
- [`DESIGN.md`](DESIGN.md): design system
- [`docs/progress.md`](docs/progress.md): status of every step
- [`CLAUDE.md`](CLAUDE.md): project rules
