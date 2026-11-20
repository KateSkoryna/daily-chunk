import { isNewWord } from '@daily-chunk/core';
import { useRouter } from 'expo-router';

import { ConfirmScreen } from '../src/features/words/ConfirmScreen';
import { useAppStore, useStartAppStore } from '../src/state/use-app-store';

export default function ConfirmRoute() {
  useStartAppStore();
  const router = useRouter();
  const profile = useAppStore((state) => state.profile);
  const words = useAppStore((state) => state.words);
  const pluralInput = useAppStore((state) => state.pluralInput);

  if (!profile) return null;

  function goHome() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  return (
    <ConfirmScreen
      words={words.filter(isNewWord)}
      nativeLanguage={profile.languages.nativeLanguage}
      pluralInput={pluralInput}
      onBack={goHome}
      onEditWord={() => undefined}
      onStartLesson={() => router.push('/lesson/flashcards')}
      onAddMore={goHome}
    />
  );
}
