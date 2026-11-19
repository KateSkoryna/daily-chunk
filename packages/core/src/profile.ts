import type { AppLanguage } from '@daily-chunk/i18n';

import type { LanguagePair } from './language-pair';

export type Profile = {
  id: string;
  languages: LanguagePair;
  appLanguage: AppLanguage;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  createdAt: string;
  updatedAt: string;
};
