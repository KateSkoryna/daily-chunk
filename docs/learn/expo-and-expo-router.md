# Expo and Expo Router

## What they are

- **React Native**: write an app in React and TypeScript; it runs as a real Android or iOS app.
- **Expo**: a toolkit on top of React Native. It starts the dev server, bundles the code, gives ready-made native modules (`expo-font`, `expo-speech`), and builds and deploys (EAS). One Expo version is called an **SDK**. Each SDK pins exact versions of React Native, React and the native modules.
- **Expo Router**: file-based navigation. A file in `app/` is a screen and its path is the URL.

## What is in this repo

- `apps/app/app/_layout.tsx`: wraps every screen (a `Stack` for now).
- `apps/app/app/index.tsx`: the `/` screen.
- `apps/app/app.json`: app name, icons, plugins.
- The same code runs on Android, iOS and web (`react-native-web` draws React Native components as HTML).

## Why SDK 57

SDK 56 has a memory bug that hits apps using `react-native-reanimated`, which NativeWind and Reusables need. SDK 57 fixes it and changes little otherwise. Details are in `plan.md` D1.

## Commands

- `npm start`: dev server from the repo root; scan the QR code with Expo Go (same Wi-Fi). If it can't connect: `npx expo start --tunnel` in `apps/app`
- `npm run web`: open in the browser
- `npx nx run @daily-chunk/app:export:web`: build the web version into `apps/app/dist`
- `npx expo-doctor` (in `apps/app`): checks that package versions match the SDK

## Expo Go

A ready-made app that opens your project without building it. It only runs one SDK per version, so install the one for SDK 57: https://github.com/expo/expo-go-releases/releases/download/Expo-Go-57.0.9/Expo-Go-57.0.9.apk
