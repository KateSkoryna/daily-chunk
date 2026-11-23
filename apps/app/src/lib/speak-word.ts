import {
  getTargetLanguagePack,
  type TargetLanguage,
} from '@daily-chunk/languages';
import * as Speech from 'expo-speech';

type SpeakOptions = {
  rate?: number;
  onDone?: () => void;
  onStopped?: () => void;
  onError?: () => void;
};

export function speakWord(
  text: string,
  targetLanguage: TargetLanguage,
  options: SpeakOptions = {},
) {
  Speech.stop();
  Speech.speak(text, {
    language: getTargetLanguagePack(targetLanguage).speechLocale,
    ...options,
  });
}

export function stopSpeaking() {
  Speech.stop();
}
