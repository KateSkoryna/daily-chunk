# Safe areas: the phone's own bars

**What it is.** The parts of the screen the phone uses itself: the status bar (clock, battery), a notch or camera hole, and the navigation bar or gesture line at the bottom. Their sizes differ on every phone. Expo draws the app behind them (edge to edge), so the app must keep its content clear of them.

**Why not a fixed number.** A fixed top padding (we had 3.5rem) is too big on one phone and too small on another. `react-native-safe-area-context` measures the real sizes, called insets, on every phone and every rotation.

**The rule we follow (the one Expo and React Navigation recommend).**

- Read the insets in one place: `Screen` calls `useSafeAreaInsets()` and pads its content by them, then adds the design spacing (`pt-screen-top`, 1rem). So the header starts 1rem under the phone's bar on every phone.
- Each edge has one owner. On tab screens the `TabBar` adds the bottom inset, so the tabs layout tells `Screen` not to (`ScreenEdgesContext`). Lesson screens have no tab bar, so `Screen` adds it.
- A `Modal` is a separate window on Android: `Drawer` puts its own `SafeAreaProvider` inside it.
- Storybook wraps every story in a `SafeAreaProvider` with zero insets (`.storybook/preview.tsx`), like a browser.
- Not React Native's own `SafeAreaView`: it only works on iOS.

**Where it lives.** `apps/app/src/components/Screen/Screen.tsx`, `screen-edges.ts`, `app/(tabs)/_layout.tsx`, `src/components/Drawer/Drawer.tsx`. Expo Router already puts a `SafeAreaProvider` around the app.
