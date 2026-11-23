# Recording your voice and playing a phrase

**Recording (`src/lib/use-voice-recorder.ts`):** `expo-audio` records the microphone. The hook asks for the microphone permission on the first press, starts the recorder, and the next press stops it. The three states are the ones of `RecordButton` (`idle`, `recording`, `done`). The clip stays in memory only; scoring it comes with step 5.6, and the Read aloud task (3.10) reuses this hook. Expo Go and the web both support it. The permission text for iOS is in `app.json` (the `expo-audio` plugin).

**Playing a phrase (`src/lib/use-spoken-phrase.ts`):** the phrase is read by the device voice (`expo-speech`, see `flashcards-and-speech.md`) at 0.75× or 1×. The voice gives no progress, so the waveform moves by a timer over an estimated length (`speech-seconds.ts`: a little over 0.06 seconds per character, divided by the speed). When the voice reports it is done, the bar is full. "Pause" stops the voice; playing again starts the phrase from the beginning, because Android cannot pause speech.

**The waveform is not the real sound:** `waveform-bars.ts` makes the same bars for the same text, so the picture stays steady. The image has a text alternative with the seconds played.

**The task logic (`packages/core/src/listen.ts`):** one phrase per lesson word (its example sentence). Up to three repeats are counted per phrase, and "Next phrase" is always possible. The result saved on the lesson is the phrases repeated at least once out of all phrases (`taskResults.listen`).
