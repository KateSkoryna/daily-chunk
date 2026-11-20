import {
  createInitialProfile,
  createWordFromNormalised,
  isNewWord,
  startLesson as buildLesson,
  wordIdFor,
  type AiService,
  type Lesson,
  type Profile,
  type Storage,
  type Word,
} from '@daily-chunk/core';
import type { AppLanguage } from '@daily-chunk/i18n';
import { createStore } from 'zustand/vanilla';

export type PluralInput = { typed: string; savedWordId: string };

export type AppState = {
  status: 'idle' | 'loading' | 'ready' | 'error';
  profile: Profile | undefined;
  words: Word[];
  lessons: Lesson[];
  pluralInput: PluralInput | undefined;
  load: (appLanguage: AppLanguage) => Promise<void>;
  addTypedWords: (typedText: string) => Promise<number>;
  startLesson: () => Promise<Lesson>;
};

type AppStoreDependencies = {
  getStorage: () => Promise<Storage>;
  ai: AiService;
  now: () => Date;
};

export function createAppStore({ getStorage, ai, now }: AppStoreDependencies) {
  return createStore<AppState>((set, get) => ({
    status: 'idle',
    profile: undefined,
    words: [],
    lessons: [],
    pluralInput: undefined,

    load: async (appLanguage) => {
      if (get().status !== 'idle') return;
      set({ status: 'loading' });
      try {
        const storage = await getStorage();
        const savedProfile = await storage.profile.get();
        const profile =
          savedProfile ??
          createInitialProfile(
            { targetLanguage: 'de', nativeLanguage: appLanguage },
            appLanguage,
            now(),
          );
        if (!savedProfile) await storage.profile.save(profile);
        set({
          status: 'ready',
          profile,
          words: await storage.words.list(),
          lessons: await storage.lessons.list(),
        });
      } catch {
        set({ status: 'error' });
      }
    },

    addTypedWords: async (typedText) => {
      const { profile } = get();
      if (!profile) return 0;
      const { languages } = profile;
      const { words: normalisedWords } = await ai.normaliseWords({
        languages,
        typedText,
      });
      const typedWordIds = new Set(
        normalisedWords.map((normalisedWord) =>
          wordIdFor(languages.targetLanguage, normalisedWord.lemma),
        ),
      );
      const knownIds = new Set(get().words.map((word) => word.id));
      const createdWords = new Map(
        normalisedWords.map((normalisedWord) => {
          const word = createWordFromNormalised(
            normalisedWord,
            languages.targetLanguage,
            now(),
          );
          return [word.id, word] as const;
        }),
      );
      const newWords = [...createdWords.values()].filter(
        (word) => !knownIds.has(word.id),
      );
      const storage = await getStorage();
      await storage.words.saveMany(newWords);
      const pluralWord = normalisedWords.find(
        (normalisedWord) => normalisedWord.wasPluralised,
      );
      set((state) => {
        const savedIds = new Set(state.words.map((word) => word.id));
        return {
          words: [
            ...state.words,
            ...newWords.filter((word) => !savedIds.has(word.id)),
          ],
          pluralInput: pluralWord && {
            typed: pluralWord.typedText,
            savedWordId: wordIdFor(languages.targetLanguage, pluralWord.lemma),
          },
        };
      });
      return get().words.filter(
        (word) => typedWordIds.has(word.id) && isNewWord(word),
      ).length;
    },

    startLesson: async () => {
      const { words, lessons } = get();
      const lesson = buildLesson(lessons, words.filter(isNewWord), now());
      if (lesson.wordIds.length === 0) {
        throw new Error('A lesson needs at least one word');
      }
      const storage = await getStorage();
      await storage.lessons.save(lesson);
      set((state) => ({
        lessons: [
          ...state.lessons.filter((saved) => saved.id !== lesson.id),
          lesson,
        ],
      }));
      return lesson;
    },
  }));
}
