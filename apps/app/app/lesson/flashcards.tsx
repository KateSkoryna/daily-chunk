import {
  createFlashcardSession,
  goToFlashcard,
  flashcardResult,
  isFirstFlashcard,
  isLastFlashcard,
  nextFlashcard,
  previousFlashcard,
  type Lesson,
  type Word,
} from '@daily-chunk/core';
import type { NativeLanguage } from '@daily-chunk/languages';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { FlashcardsScreen } from '../../src/features/lesson/FlashcardsScreen';
import { displayedWord } from '../../src/lib/displayed-word';
import { useLessonNavigation } from '../../src/lib/use-lesson-navigation';
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
  const navigation = useLessonNavigation({
    currentStep: 1,
    nativeLanguage,
    targetLanguage: words[0]?.targetLanguage ?? 'de',
  });
  const isMoving = useRef(false);
  const hasFinished = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!hasFinished.current) return;
      hasFinished.current = false;
      setSession(createFlashcardSession(lesson.wordIds));
      setIsFlipped(false);
    }, [lesson.wordIds]),
  );

  const word = words.find(
    (candidate) => candidate.id === session.wordIds[session.index],
  );

  if (!word) return null;

  function showCard(nextSession: typeof session) {
    setSession(nextSession);
    setIsFlipped(false);
  }

  async function goNextSection() {
    if (isMoving.current) return;
    isMoving.current = true;
    try {
      await saveTaskResult('flashcards', flashcardResult(session));
      hasFinished.current = true;
      router.push('/lesson/listen');
    } catch {
      return;
    } finally {
      isMoving.current = false;
    }
  }

  return (
    <FlashcardsScreen
      lessonNumber={lesson.number}
      xp={lesson.xpEarned}
      word={word}
      cardNumber={session.index + 1}
      cardTotal={session.wordIds.length}
      isFirstCard={isFirstFlashcard(session)}
      isFlipped={isFlipped}
      nativeLanguage={nativeLanguage}
      onFlip={() => setIsFlipped(!isFlipped)}
      onListen={() =>
        speakWord(
          isFlipped ? word.sentence : displayedWord(word),
          word.targetLanguage,
        )
      }
      onCardSelect={(card) => showCard(goToFlashcard(session, card - 1))}
      onPrevious={() => showCard(previousFlashcard(session))}
      isLastCard={isLastFlashcard(session)}
      onNext={() => showCard(nextFlashcard(session))}
      onNextSection={goNextSection}
      taskNames={navigation.stepNames}
      onTaskSelect={navigation.goToStep}
      onBack={navigation.goBack}
      onClose={() => router.replace('/')}
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
