import {
  createInitialProfile,
  createWordFromNormalised,
  isNewWord,
  placeholderTaskBonusXp,
  startLesson as buildLesson,
  wordIdFor,
  type AiService,
  type Lesson,
  type LessonTaskType,
  type TaskResult,
  type Profile,
  type Storage,
  type StoryResponse,
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
  stories: Record<string, StoryResponse>;
  pluralInput: PluralInput | undefined;
  typedWordIds: string[];
  load: (appLanguage: AppLanguage) => Promise<void>;
  addTypedWords: (typedText: string) => Promise<number>;
  abandonLesson: () => Promise<void>;
  startLesson: () => Promise<Lesson>;
  saveTaskResult: (task: LessonTaskType, result: TaskResult) => Promise<void>;
  loadStory: (lessonId: string) => Promise<void>;
};

type AppStoreDependencies = {
  getStorage: () => Promise<Storage>;
  ai: AiService;
  now: () => Date;
};

export function createAppStore({ getStorage, ai, now }: AppStoreDependencies) {
  const pendingStories = new Map<string, Promise<void>>();

  return createStore<AppState>((set, get) => ({
    status: 'idle',
    profile: undefined,
    words: [],
    lessons: [],
    stories: {},
    pluralInput: undefined,
    typedWordIds: [],

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
      const staleWords = get().words.filter(
        (word) =>
          isNewWord(word) &&
          !typedWordIds.has(word.id) &&
          !get().typedWordIds.includes(word.id),
      );
      const storage = await getStorage();
      for (const staleWord of staleWords) {
        await storage.words.remove(staleWord.id);
      }
      await storage.words.saveMany(newWords);
      const pluralWord = normalisedWords.find(
        (normalisedWord) => normalisedWord.wasPluralised,
      );
      set((state) => {
        const savedIds = new Set(state.words.map((word) => word.id));
        return {
          words: [
            ...state.words.filter((word) => !staleWords.includes(word)),
            ...newWords.filter((word) => !savedIds.has(word.id)),
          ],
          typedWordIds: [...new Set([...state.typedWordIds, ...typedWordIds])],
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

    abandonLesson: async () => {
      const { lessons, words } = get();
      const openLesson = lessons.find((lesson) => lesson.completedAt === null);
      const newWords = words.filter(isNewWord);
      const storage = await getStorage();
      if (openLesson) await storage.lessons.remove(openLesson.id);
      for (const word of newWords) await storage.words.remove(word.id);
      set({
        lessons: lessons.filter((lesson) => lesson.id !== openLesson?.id),
        words: words.filter((word) => !isNewWord(word)),
        stories: {},
        typedWordIds: [],
        pluralInput: undefined,
      });
    },

    startLesson: async () => {
      const { words, lessons } = get();
      const { typedWordIds } = get();
      const lessonWords = words.filter(
        (word) =>
          isNewWord(word) &&
          (typedWordIds.length === 0 || typedWordIds.includes(word.id)),
      );
      const lesson = buildLesson(lessons, lessonWords, now());
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

    saveTaskResult: async (task, result) => {
      const openLesson = get().lessons.find(
        (lesson) => lesson.completedAt === null,
      );
      if (!openLesson) throw new Error('There is no open lesson');
      const bonusXp = openLesson.taskResults[task]
        ? 0
        : placeholderTaskBonusXp[task];
      const updatedLesson: Lesson = {
        ...openLesson,
        taskResults: { ...openLesson.taskResults, [task]: result },
        xpEarned: openLesson.xpEarned + bonusXp,
      };
      const storage = await getStorage();
      await storage.lessons.save(updatedLesson);
      set((state) => ({
        lessons: state.lessons.map((lesson) =>
          lesson.id === updatedLesson.id ? updatedLesson : lesson,
        ),
      }));
    },

    loadStory: (lessonId) => {
      const { profile, lessons, words, stories } = get();
      const lesson = lessons.find((candidate) => candidate.id === lessonId);
      if (!profile || !lesson || stories[lessonId]) return Promise.resolve();
      const pendingStory = pendingStories.get(lessonId);
      if (pendingStory) return pendingStory;
      const lessonWords = lesson.wordIds.flatMap((wordId) =>
        words.filter((word) => word.id === wordId),
      );
      const request = ai
        .generateStory({ languages: profile.languages, words: lessonWords })
        .then((story) => {
          const isLessonOpen = get().lessons.some(
            (candidate) => candidate.id === lessonId,
          );
          if (isLessonOpen) {
            set((state) => ({
              stories: { ...state.stories, [lessonId]: story },
            }));
          }
        })
        .finally(() => pendingStories.delete(lessonId));
      pendingStories.set(lessonId, request);
      return request;
    },
  }));
}
