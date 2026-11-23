import { lessonTaskTypes, placeholderTaskBonusXp } from '@daily-chunk/core';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { LessonOverviewScreen } from '../../src/features/lesson/LessonOverviewScreen';
import { lessonTaskRoute } from '../../src/lib/use-lesson-navigation';
import { useAppStore, useStartAppStore } from '../../src/state/use-app-store';

export default function LessonOverviewRoute() {
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

  const completedTasks = lessonTaskTypes.filter(
    (task) => lesson.taskResults[task],
  );
  const firstOpenTask =
    lessonTaskTypes.find((task) => !lesson.taskResults[task]) ??
    lessonTaskTypes[0];

  return (
    <LessonOverviewScreen
      lessonNumber={lesson.number}
      completedTasks={completedTasks}
      earnedXp={Object.fromEntries(
        completedTasks.map((task) => [task, placeholderTaskBonusXp[task]]),
      )}
      nativeLanguage={profile.languages.nativeLanguage}
      targetLanguage={words[0]?.targetLanguage ?? 'de'}
      onOpenTask={(task) => router.replace(lessonTaskRoute(task))}
      onStart={() => router.replace(lessonTaskRoute(firstOpenTask))}
      onClose={() => router.replace('/')}
    />
  );
}
