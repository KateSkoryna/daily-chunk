import { isNewWord } from '@daily-chunk/core';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { ConfirmScreen } from '../src/features/words/ConfirmScreen';
import { useAppStore, useStartAppStore } from '../src/state/use-app-store';

export default function ConfirmRoute() {
  useStartAppStore();
  const router = useRouter();
  const status = useAppStore((state) => state.status);
  const profile = useAppStore((state) => state.profile);
  const words = useAppStore((state) => state.words);
  const pluralInput = useAppStore((state) => state.pluralInput);
  const startLesson = useAppStore((state) => state.startLesson);
  const isStarting = useRef(false);
  const newWords = words.filter(isNewWord);

  useEffect(() => {
    if (status === 'ready' && newWords.length === 0) router.replace('/');
  }, [status, newWords.length, router]);

  if (!profile || newWords.length === 0) return null;

  function goHome() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  async function beginLesson() {
    if (isStarting.current) return;
    isStarting.current = true;
    try {
      await startLesson();
      router.push('/lesson/flashcards');
    } finally {
      isStarting.current = false;
    }
  }

  return (
    <ConfirmScreen
      words={newWords}
      nativeLanguage={profile.languages.nativeLanguage}
      pluralInput={pluralInput}
      onBack={goHome}
      onStartLesson={beginLesson}
      onAddMore={goHome}
    />
  );
}
