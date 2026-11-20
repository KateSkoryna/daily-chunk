import {
  getTargetLanguagePack,
  type TargetLanguage,
} from '@daily-chunk/languages';
import * as Speech from 'expo-speech';

export function speakWord(text: string, targetLanguage: TargetLanguage) {
  Speech.stop();
  Speech.speak(text, {
    language: getTargetLanguagePack(targetLanguage).speechLocale,
  });
}
