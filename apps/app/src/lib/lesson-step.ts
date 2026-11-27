import { lessonTaskTypes, type LessonTaskType } from '@daily-chunk/core';

export function lessonStep(task: LessonTaskType) {
  const current = lessonTaskTypes.indexOf(task) + 1;
  return {
    current,
    count: lessonTaskTypes.length,
    label: String(current).padStart(2, '0'),
  };
}
