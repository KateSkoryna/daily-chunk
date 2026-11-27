import {
  closeCrosswordEntry,
  createCrosswordSession,
  crosswordEntryAt,
  crosswordResult,
  selectCrosswordEntry,
  showCrosswordHint,
  typeCrosswordLetter,
  type CrosswordPuzzle,
  type LanguagePair,
  type Lesson,
} from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import { getTargetLanguagePack } from '@daily-chunk/languages';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Notice } from '../../src/components/Notice/Notice';
import { Screen } from '../../src/components/Screen/Screen';
import { TopBar } from '../../src/components/TopBar/TopBar';
import { CrosswordScreen } from '../../src/features/lesson/CrosswordScreen';
import { useLessonNavigation } from '../../src/lib/use-lesson-navigation';
import { useAppStore, useStartAppStore } from '../../src/state/use-app-store';

type CrosswordTaskProps = {
  lesson: Lesson;
  puzzle: CrosswordPuzzle;
  languages: LanguagePair;
};

function LoadedCrosswordTask({
  lesson,
  puzzle,
  languages,
}: CrosswordTaskProps) {
  const router = useRouter();
  const saveTaskResult = useAppStore((state) => state.saveTaskResult);
  const [session, setSession] = useState(() => createCrosswordSession(puzzle));
  const navigation = useLessonNavigation({
    task: 'crossword',
    nativeLanguage: languages.nativeLanguage,
    targetLanguage: languages.targetLanguage,
  });
  const isMoving = useRef(false);
  const hasFinished = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!hasFinished.current) return;
      hasFinished.current = false;
      setSession(createCrosswordSession(puzzle));
    }, [puzzle]),
  );

  function pressCell(key: string) {
    setSession((current) => {
      const index = crosswordEntryAt(puzzle, current, key);
      return index === undefined
        ? current
        : selectCrosswordEntry(current, index);
    });
  }

  async function goNext() {
    if (isMoving.current) return;
    isMoving.current = true;
    try {
      await saveTaskResult('crossword', crosswordResult(puzzle, session));
      hasFinished.current = true;
      router.push('/lesson/listen');
    } catch {
      return;
    } finally {
      isMoving.current = false;
    }
  }

  return (
    <CrosswordScreen
      lessonNumber={lesson.number}
      xp={lesson.xpEarned}
      puzzle={puzzle}
      session={session}
      keyboardRows={
        getTargetLanguagePack(languages.targetLanguage).keyboardRows
      }
      targetLanguage={languages.targetLanguage}
      taskNames={navigation.stepNames}
      onTaskSelect={navigation.goToStep}
      onCellPress={pressCell}
      onKeyPress={(letter) =>
        setSession((current) => typeCrosswordLetter(puzzle, current, letter))
      }
      onHint={() => setSession(showCrosswordHint)}
      onCloseClue={() => setSession(closeCrosswordEntry)}
      onNext={goNext}
      onBack={navigation.goBack}
      onClose={() => router.replace('/')}
    />
  );
}

function CrosswordFailed({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();

  return (
    <Screen className="gap-4">
      <TopBar.Action icon="back" label={t('common.back')} onPress={onBack} />
      <Notice>{t('lesson.somethingFailed')}</Notice>
    </Screen>
  );
}

export default function CrosswordRoute() {
  useStartAppStore();
  const router = useRouter();
  const status = useAppStore((state) => state.status);
  const profile = useAppStore((state) => state.profile);
  const lessons = useAppStore((state) => state.lessons);
  const crosswords = useAppStore((state) => state.crosswords);
  const loadCrossword = useAppStore((state) => state.loadCrossword);
  const lesson = lessons.find((candidate) => candidate.completedAt === null);
  const [hasFailed, setHasFailed] = useState(false);
  const hasNoLesson = status === 'ready' && !lesson;
  const lessonId = lesson?.id;
  const puzzle = lessonId ? crosswords[lessonId] : undefined;

  useEffect(() => {
    if (hasNoLesson) router.replace('/');
  }, [hasNoLesson, router]);

  useEffect(() => {
    if (!lessonId) return;
    let isCancelled = false;
    loadCrossword(lessonId).catch(() => {
      if (!isCancelled) setHasFailed(true);
    });
    return () => {
      isCancelled = true;
    };
  }, [lessonId, loadCrossword]);

  const isEmpty = puzzle !== undefined && puzzle.entries.length === 0;

  if (hasFailed || isEmpty) {
    return (
      <CrosswordFailed onBack={() => router.replace('/lesson/flashcards')} />
    );
  }
  if (!profile || !lesson || !puzzle) return null;

  return (
    <LoadedCrosswordTask
      key={lesson.id}
      lesson={lesson}
      puzzle={puzzle}
      languages={profile.languages}
    />
  );
}
