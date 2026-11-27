# Moving the screen with the phone keyboard

**What it is.** `react-native-keyboard-controller` is a library with native code (Kotlin and Swift) that tells JavaScript where the phone keyboard is on every frame while it slides in or out.

**Why we use it.** React Native's own `KeyboardAvoidingView` only hears "the keyboard is open" once the keyboard has finished moving, so the screen jumps up in one step. The library's `KeyboardAvoidingView` has the same props but moves the screen together with the keyboard. Reanimated used to have `useAnimatedKeyboard` for this; it is deprecated in favour of this library.

**Where it lives.**

- `apps/app/app/_layout.tsx`: `KeyboardProvider` wraps the whole app; it starts the native listener once.
- `apps/app/src/components/Screen/Screen.tsx`: every screen uses the library's `KeyboardAvoidingView` (`behavior="padding"`), so Home's word fields and the crossword get it without their own code.
- On the web the library does nothing; the browser handles its keyboard.

**Native code means a new build.** A JavaScript change reaches the phone through the dev server, but a new native library has to be compiled into the app: build the development APK again (`eas build --profile development --platform android`) and install it. Plain Expo Go may not include this library.

**Edge to edge.** Expo draws the app behind the Android status bar and navigation bar (they are see-through), and our `Screen` padding keeps the content clear of them. `KeyboardProvider` assumes solid bars unless told otherwise and moves the app below them, so the bare white window showed under the clock and battery. The props `statusBarTranslucent`, `navigationBarTranslucent` and `preserveEdgeToEdge` tell it the bars are see-through.
