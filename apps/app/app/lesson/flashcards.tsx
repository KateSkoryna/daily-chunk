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
import { useListening } from '../../src/lib/use-listening';
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
  const [isTipOpen, setIsTipOpen] = useState(false);
  const targetLanguage = words[0]?.targetLanguage ?? 'de';
  const listening = useListening(targetLanguage);
  const navigation = useLessonNavigation({
    task: 'flashcards',
    nativeLanguage,
    targetLanguage,
  });
  const isMoving = useRef(false);
  const hasFinished = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!hasFinished.current) return;
      hasFinished.current = false;
      setSession(createFlashcardSession(lesson.wordIds));
      setIsFlipped(false);
      setIsTipOpen(false);
    }, [lesson.wordIds]),
  );

  const word = words.find(
    (candidate) => candidate.id === session.wordIds[session.index],
  );

  if (!word) return null;

  function showCard(nextSession: typeof session) {
    listening.stop();
    setSession(nextSession);
    setIsFlipped(false);
    setIsTipOpen(false);
  }

  async function goNextSection() {
    if (isMoving.current) return;
    isMoving.current = true;
    try {
      await saveTaskResult('flashcards', flashcardResult(session));
      hasFinished.current = true;
      router.push('/lesson/crossword');
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
      isTipOpen={isTipOpen}
      nativeLanguage={nativeLanguage}
      onFlip={() => {
        listening.stop();
        setIsFlipped(!isFlipped);
        setIsTipOpen(false);
      }}
      onTipToggle={() => setIsTipOpen(!isTipOpen)}
      isListening={listening.isListening}
      onListen={() =>
        listening.toggle(isFlipped ? word.sentence : displayedWord(word))
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
