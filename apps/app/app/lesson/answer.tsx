import {
  answerResult,
  answerTiles,
  createAnswerSession,
  expectedAnswerWord,
  isLastAnswerExercise,
  nextAnswerExercise,
  recordAnswerTap,
  shouldHintAnswerWord,
  type AnswerExercise,
  type AnswerTile,
  type Lesson,
} from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import type { NativeLanguage } from '@daily-chunk/languages';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Notice } from '../../src/components/Notice/Notice';
import { Screen } from '../../src/components/Screen/Screen';
import { TopBar } from '../../src/components/TopBar/TopBar';
import { AnswerScreen } from '../../src/features/lesson/AnswerScreen';
import { useLessonNavigation } from '../../src/lib/use-lesson-navigation';
import { useAppStore, useStartAppStore } from '../../src/state/use-app-store';

type AnswerTaskProps = {
  lesson: Lesson;
  exercises: AnswerExercise[];
  nativeLanguage: NativeLanguage;
};

function LoadedAnswerTask({
  lesson,
  exercises,
  nativeLanguage,
}: AnswerTaskProps) {
  const router = useRouter();
  const saveTaskResult = useAppStore((state) => state.saveTaskResult);
  const [session, setSession] = useState(() =>
    createAnswerSession(exercises.length),
  );
  const [placed, setPlaced] = useState<AnswerTile[]>([]);
  const [wrongTileId, setWrongTileId] = useState<string>();
  const navigation = useLessonNavigation({
    currentStep: 4,
    nativeLanguage,
    targetLanguage: 'de',
  });
  const isMoving = useRef(false);
  const hasFinished = useRef(false);
  const exercise = exercises[session.index];
  const tiles = useMemo(
    () =>
      exercise
        ? answerTiles(exercise.answer, `${lesson.id}:${session.index}`)
        : [],
    [exercise, lesson.id, session.index],
  );
  const pool = tiles.filter(
    (tile) => !placed.some((placedTile) => placedTile.id === tile.id),
  );

  useFocusEffect(
    useCallback(() => {
      if (!hasFinished.current) return;
      hasFinished.current = false;
      setSession(createAnswerSession(exercises.length));
      setPlaced([]);
      setWrongTileId(undefined);
    }, [exercises.length]),
  );

  if (!exercise) return null;

  const expectedWord = expectedAnswerWord(exercise.answer, placed.length);
  const hintTileId = shouldHintAnswerWord(session)
    ? pool.find((tile) => tile.text === expectedWord)?.id
    : undefined;

  function pressTile(id: string) {
    const tile = pool.find((candidate) => candidate.id === id);
    if (!tile) return;
    const isRight = tile.text === expectedWord;
    setSession((current) => recordAnswerTap(current, isRight));
    if (isRight) {
      setPlaced((current) => [...current, tile]);
      setWrongTileId(undefined);
    } else {
      setWrongTileId(id);
    }
  }

  async function goNext() {
    if (isMoving.current) return;
    if (!isLastAnswerExercise(session)) {
      setSession(nextAnswerExercise(session));
      setPlaced([]);
      setWrongTileId(undefined);
      return;
    }
    isMoving.current = true;
    try {
      await saveTaskResult('answer', answerResult(session));
      hasFinished.current = true;
      router.push('/lesson/gap-fill');
    } catch {
      return;
    } finally {
      isMoving.current = false;
    }
  }

  return (
    <AnswerScreen
      lessonNumber={lesson.number}
      xp={lesson.xpEarned}
      question={exercise.question}
      questionNumber={session.index + 1}
      questionCount={exercises.length}
      placed={placed}
      pool={pool}
      wrongTileId={wrongTileId}
      hintTileId={hintTileId}
      rightAnswer={exercise.answer}
      translation={exercise.translation}
      isLast={isLastAnswerExercise(session)}
      taskNames={navigation.stepNames}
      onTaskSelect={navigation.goToStep}
      onTilePress={pressTile}
      onNext={goNext}
      onBack={navigation.goBack}
      onClose={() => router.replace('/')}
    />
  );
}

function ExercisesFailed({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();

  return (
    <Screen className="gap-4">
      <TopBar.Action icon="back" label={t('common.back')} onPress={onBack} />
      <Notice>{t('lesson.somethingFailed')}</Notice>
    </Screen>
  );
}

export default function AnswerRoute() {
  useStartAppStore();
  const router = useRouter();
  const status = useAppStore((state) => state.status);
  const profile = useAppStore((state) => state.profile);
  const lessons = useAppStore((state) => state.lessons);
  const exercisesByLesson = useAppStore((state) => state.answerExercises);
  const loadAnswerExercises = useAppStore((state) => state.loadAnswerExercises);
  const lesson = lessons.find((candidate) => candidate.completedAt === null);
  const [hasFailed, setHasFailed] = useState(false);
  const hasNoLesson = status === 'ready' && !lesson;
  const lessonId = lesson?.id;
  const exercises = lessonId ? exercisesByLesson[lessonId] : undefined;

  useEffect(() => {
    if (hasNoLesson) router.replace('/');
  }, [hasNoLesson, router]);

  useEffect(() => {
    if (!lessonId) return;
    let isCancelled = false;
    loadAnswerExercises(lessonId).catch(() => {
      if (!isCancelled) setHasFailed(true);
    });
    return () => {
      isCancelled = true;
    };
  }, [lessonId, loadAnswerExercises]);

  const isEmpty = exercises !== undefined && exercises.length === 0;

  if (hasFailed || isEmpty) {
    return <ExercisesFailed onBack={() => router.replace('/lesson/read')} />;
  }
  if (!profile || !lesson || !exercises) return null;

  return (
    <LoadedAnswerTask
      key={lesson.id}
      lesson={lesson}
      exercises={exercises}
      nativeLanguage={profile.languages.nativeLanguage}
    />
  );
}
