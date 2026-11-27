import { lessonTaskTypes, type LessonTaskType } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import type { NativeLanguage, TargetLanguage } from '@daily-chunk/languages';
import { useRouter } from 'expo-router';

import { lessonStep } from './lesson-step';
import { lessonStepNames } from './lesson-step-names';

export function lessonTaskRoute(task: LessonTaskType) {
  return `/lesson/${task}` as const;
}

type LessonNavigationInput = {
  task: LessonTaskType;
  nativeLanguage: NativeLanguage;
  targetLanguage: TargetLanguage;
};

export function useLessonNavigation({
  task: currentTask,
  nativeLanguage,
  targetLanguage,
}: LessonNavigationInput) {
  const { t } = useTranslation();
  const router = useRouter();

  const stepNames = lessonStepNames(t, nativeLanguage, targetLanguage);
  const currentStep = lessonStep(currentTask).current;

  function goToStep(step: number) {
    const task = lessonTaskTypes[step - 1];
    if (task && step !== currentStep) router.replace(lessonTaskRoute(task));
  }

  function goBack() {
    const previousTask = lessonTaskTypes[currentStep - 2];
    router.replace(
      previousTask ? lessonTaskRoute(previousTask) : '/lesson/overview',
    );
  }

  return { stepNames, goToStep, goBack };
}
