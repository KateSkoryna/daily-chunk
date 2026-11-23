import type { Lesson } from './lesson';
import type { Profile } from './profile';
import type { Word } from './word';

export type ProfileStorage = {
  get: () => Promise<Profile | undefined>;
  save: (profile: Profile) => Promise<void>;
};

export type WordStorage = {
  list: () => Promise<Word[]>;
  saveMany: (words: Word[]) => Promise<void>;
  remove: (wordId: string) => Promise<void>;
};

export type LessonStorage = {
  list: () => Promise<Lesson[]>;
  save: (lesson: Lesson) => Promise<void>;
  remove: (lessonId: string) => Promise<void>;
};

export type Storage = {
  profile: ProfileStorage;
  words: WordStorage;
  lessons: LessonStorage;
};
