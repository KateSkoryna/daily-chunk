import {
  answerFlashcard,
  createFlashcardSession,
  flashcardResult,
  flashcardsDone,
  isFlashcardSessionDone,
  type Lesson,
  type Word,
} from '@daily-chunk/core';
import { useRouter } from 'expo-router';
import type { NativeLanguage } from '@daily-chunk/languages';
import { useEffect, useRef, useState } from 'react';

import { FlashcardsScreen } from '../../src/features/lesson/FlashcardsScreen';
import { displayedWord } from '../../src/lib/displayed-word';
import { speakWord } from '../../src/lib/speak-word';
import { useAppStore, useStartAppStore } from '../../src/state/use-app-store';

type FlashcardsTaskProps = {
  lesson: Lesson;
  words: Word[];
  nativeLanguage: NativeLanguage;
};

function FlashcardsTask({
  lesson,
  words,
  nativeLanguage,
}: FlashcardsTaskProps) {
  const router = useRouter();
  const saveTaskResult = useAppStore((state) => state.saveTaskResult);
  const [session, setSession] = useState(() =>
    createFlashcardSession(lesson.wordIds),
  );
  const [isFlipped, setIsFlipped] = useState(false);
  const isAnswering = useRef(false);
  const word = words.find((candidate) => candidate.id === session.queue[0]);

  if (!word) return null;

  async function answer(isKnown: boolean) {
    if (isAnswering.current) return;
    isAnswering.current = true;
    const nextSession = answerFlashcard(session, isKnown);
    try {
      if (isFlashcardSessionDone(nextSession)) {
        await saveTaskResult('flashcards', flashcardResult(nextSession));
        router.push('/lesson/listen');
      } else {
        setSession(nextSession);
        setIsFlipped(false);
      }
    } catch {
      return;
    } finally {
      isAnswering.current = false;
    }
  }

  return (
    <FlashcardsScreen
      lessonNumber={lesson.number}
      xp={lesson.xpEarned}
      word={word}
      cardNumber={flashcardsDone(session) + 1}
      cardTotal={session.total}
      isFlipped={isFlipped}
      nativeLanguage={nativeLanguage}
      onFlip={() => setIsFlipped(!isFlipped)}
      onListen={() =>
        speakWord(
          isFlipped ? word.sentence : displayedWord(word),
          word.targetLanguage,
        )
      }
      onAgain={() => answer(false)}
      onNext={() => answer(true)}
      onClose={() => (router.canGoBack() ? router.back() : router.replace('/'))}
    />
  );
}

export default function FlashcardsRoute() {
  useStartAppStore();
  const router = useRouter();
  const status = useAppStore((state) => state.status);
  const profile = useAppStore((state) => state.profile);
  const words = useAppStore((state) => state.words);
  const lessons = useAppStore((state) => state.lessons);
  const lesson = lessons.find((candidate) => candidate.completedAt === null);

  const hasNoLesson = status === 'ready' && !lesson;

  useEffect(() => {
    if (hasNoLesson) router.replace('/');
  }, [hasNoLesson, router]);

  if (!profile || !lesson) return null;

  return (
    <FlashcardsTask
      key={lesson.id}
      lesson={lesson}
      words={words}
      nativeLanguage={profile.languages.nativeLanguage}
    />
  );
}
