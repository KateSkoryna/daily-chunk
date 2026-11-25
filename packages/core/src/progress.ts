import type { LessonTaskType } from './lesson';
import type { Profile } from './profile';

export const lessonXp = 100;

export const placeholderTaskBonusXp: Readonly<Record<LessonTaskType, number>> =
  {
    flashcards: 20,
    listen: 20,
    read: 20,
    answer: 20,
    'gap-fill': 30,
    translate: 40,
  };

export const streakBonusXp: Readonly<Record<number, number>> = {
  3: 30,
  7: 60,
  14: 100,
  21: 200,
  50: 300,
  100: 500,
};

export type ProgressAfterLesson = Pick<
  Profile,
  'xp' | 'currentStreak' | 'longestStreak' | 'lastStudyDate'
> & { xpEarned: number };

const millisecondsPerDay = 24 * 60 * 60 * 1000;

function daysBetween(earlierDate: string, laterDate: string): number {
  return Math.round(
    (Date.parse(laterDate) - Date.parse(earlierDate)) / millisecondsPerDay,
  );
}

function nextStreak(profile: Profile, today: string): number {
  if (profile.lastStudyDate === null) return 1;
  const daysSinceLastLesson = daysBetween(profile.lastStudyDate, today);
  if (daysSinceLastLesson <= 0) return Math.max(profile.currentStreak, 1);
  return daysSinceLastLesson === 1 ? profile.currentStreak + 1 : 1;
}

export function progressAfterLesson(
  profile: Profile,
  today: string,
): ProgressAfterLesson {
  const currentStreak = nextStreak(profile, today);
  const isNewStudyDay = profile.lastStudyDate !== today;
  const bonus = isNewStudyDay ? (streakBonusXp[currentStreak] ?? 0) : 0;
  const xpEarned = lessonXp + bonus;
  return {
    xp: profile.xp + xpEarned,
    currentStreak,
    longestStreak: Math.max(profile.longestStreak, currentStreak),
    lastStudyDate: today,
    xpEarned,
  };
}
