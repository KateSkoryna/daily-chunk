import { lessonTaskTypes } from '@daily-chunk/core';
import type { NativeLanguage, TargetLanguage } from '@daily-chunk/languages';

import type { Translate } from './story-text';

export function lessonStepNames(
  t: Translate,
  nativeLanguage: NativeLanguage,
  targetLanguage: TargetLanguage,
) {
  return lessonTaskTypes.map((task) =>
    t('lesson.goToTask', {
      task: t(`lesson.tasks.${task}`, {
        from: nativeLanguage.toUpperCase(),
        to: targetLanguage.toUpperCase(),
      }),
    }),
  );
}
