import type { Lesson, Profile, Storage, Word } from '@daily-chunk/core';
import { describe, expect, it, vi } from 'vitest';

import { createMockAiService } from '../src/ai/mock-ai-service';
import { createAppStore } from '../src/state/app-store';

function createFakeStorage(
  initial: { profile?: Profile; words?: Word[]; lessons?: Lesson[] } = {},
) {
  let profile = initial.profile;
  const words = new Map((initial.words ?? []).map((word) => [word.id, word]));
  const lessons = new Map(
    (initial.lessons ?? []).map((lesson) => [lesson.id, lesson]),
  );
  const storage: Storage = {
    profile: {
      get: async () => profile,
      save: async (next) => {
        profile = next;
      },
    },
    words: {
      list: async () => [...words.values()],
      saveMany: async (next) => {
        next.forEach((word) => words.set(word.id, word));
      },
      remove: async (wordId) => {
        words.delete(wordId);
      },
    },
    lessons: {
      list: async () => [...lessons.values()],
      save: async (lesson) => {
        lessons.set(lesson.id, lesson);
      },
      remove: async (lessonId) => {
        lessons.delete(lessonId);
      },
    },
  };
  return { storage, savedWords: words, savedLessons: lessons };
}

function createStoreWith(initial?: Parameters<typeof createFakeStorage>[0]) {
  const { storage, savedWords, savedLessons } = createFakeStorage(initial);
  const store = createAppStore({
    getStorage: async () => storage,
    ai: createMockAiService(),
    now: () => new Date('2026-11-20T10:00:00.000Z'),
  });
  return { store, storage, savedWords, savedLessons };
}

describe('app store', () => {
  it('creates and saves a profile on the first start, in the app language', async () => {
    const { store, storage } = createStoreWith();

    await store.getState().load('ru');

    expect(store.getState().status).toBe('ready');
    expect(store.getState().profile).toMatchObject({
      id: 'profile-local',
      languages: { targetLanguage: 'de', nativeLanguage: 'ru' },
      xp: 0,
    });
    expect(await storage.profile.get()).toEqual(store.getState().profile);
  });

  it('keeps the saved profile and words on a later start', async () => {
    const first = createStoreWith();
    await first.store.getState().load('en');
    await first.store.getState().addTypedWords('Gleis');

    const second = createAppStore({
      getStorage: async () => first.storage,
      ai: createMockAiService(),
      now: () => new Date('2026-11-21T10:00:00.000Z'),
    });
    await second.getState().load('ru');

    expect(second.getState().profile?.languages.nativeLanguage).toBe('en');
    expect(second.getState().words.map((word) => word.lemma)).toEqual([
      'Gleis',
    ]);
  });

  it('loads only once', async () => {
    const getStorage = vi.fn(async () => createFakeStorage().storage);
    const store = createAppStore({
      getStorage,
      ai: createMockAiService(),
      now: () => new Date(),
    });

    await Promise.all([
      store.getState().load('en'),
      store.getState().load('en'),
    ]);

    expect(getStorage).toHaveBeenCalledTimes(1);
  });

  it('shows an error when the storage fails', async () => {
    const store = createAppStore({
      getStorage: async () => {
        throw new Error('database closed');
      },
      ai: createMockAiService(),
      now: () => new Date(),
    });

    await store.getState().load('en');

    expect(store.getState().status).toBe('error');
  });

  it('saves the typed words as new words in the profile native language', async () => {
    const { store, savedWords } = createStoreWith();
    await store.getState().load('en');

    const count = await store.getState().addTypedWords('Bahnhof\nGleis');

    expect(count).toBe(2);
    expect([...savedWords.keys()]).toEqual([
      'word-de-bahnhof',
      'word-de-gleis',
    ]);
    expect(store.getState().words[0]).toMatchObject({
      lemma: 'Bahnhof',
      reviewStage: 0,
      translations: { en: 'station' },
    });
  });

  it('drops new words from an earlier session when words are typed', async () => {
    const { store, savedWords, storage } = createStoreWith();
    await store.getState().load('en');
    await store.getState().addTypedWords('Gleis');

    const nextSession = createAppStore({
      getStorage: async () => storage,
      ai: createMockAiService(),
      now: () => new Date('2026-11-22T10:00:00.000Z'),
    });
    await nextSession.getState().load('en');
    await nextSession.getState().addTypedWords('Fahrkarte');

    expect(nextSession.getState().words.map((word) => word.lemma)).toEqual([
      'Fahrkarte',
    ]);
    expect([...savedWords.keys()]).toEqual(['word-de-fahrkarte']);
  });

  it('keeps the words typed in several rounds of this session', async () => {
    const { store } = createStoreWith();
    await store.getState().load('en');
    await store.getState().addTypedWords('Gleis');
    await store.getState().addTypedWords('Fahrkarte');

    expect(store.getState().words).toHaveLength(2);
    expect(store.getState().typedWordIds).toEqual([
      'word-de-gleis',
      'word-de-fahrkarte',
    ]);
  });

  it('starts a lesson with the typed words only', async () => {
    const { store } = createStoreWith();
    await store.getState().load('en');
    await store.getState().addTypedWords('Gleis\nFahrkarte\nbahnhof');
    const lesson = await store.getState().startLesson();

    expect(lesson.wordIds).toEqual([
      'word-de-gleis',
      'word-de-fahrkarte',
      'word-de-bahnhof',
    ]);
  });

  it('clears the open lesson and the new words when the lesson is abandoned', async () => {
    const { store } = createStoreWith();
    await store.getState().load('en');
    await store.getState().addTypedWords('Gleis\nFahrkarte');
    await store.getState().startLesson();

    await store.getState().abandonLesson();

    expect(store.getState().lessons).toEqual([]);
    expect(store.getState().words).toEqual([]);
    expect(store.getState().typedWordIds).toEqual([]);
  });

  it('remembers a typed plural for the Confirm notice', async () => {
    const { store } = createStoreWith();
    await store.getState().load('ru');

    await store.getState().addTypedWords('Bahnhöfe');

    expect(store.getState().pluralInput).toEqual({
      typed: 'Bahnhöfe',
      savedWordId: 'word-de-bahnhof',
    });
  });

  it('does not overwrite a word that is already saved', async () => {
    const { store, savedWords } = createStoreWith();
    await store.getState().load('en');
    await store.getState().addTypedWords('Gleis');
    const scheduled = {
      ...savedWords.get('word-de-gleis')!,
      reviewStage: 2 as const,
    };
    savedWords.set(scheduled.id, scheduled);

    await store.getState().addTypedWords('Gleis');

    expect(savedWords.get('word-de-gleis')?.reviewStage).toBe(2);
    expect(store.getState().words).toHaveLength(1);
  });

  it('saves a word typed twice once', async () => {
    const { store, savedWords } = createStoreWith();
    await store.getState().load('en');

    const count = await store.getState().addTypedWords('Bahnhof\nBahnhöfe');

    expect(count).toBe(1);
    expect(store.getState().words).toHaveLength(1);
    expect(savedWords.size).toBe(1);
  });

  it('keeps the words of overlapping calls', async () => {
    const { store } = createStoreWith();
    await store.getState().load('en');

    await Promise.all([
      store.getState().addTypedWords('Bahnhof'),
      store.getState().addTypedWords('Gleis'),
    ]);

    expect(
      store
        .getState()
        .words.map((word) => word.lemma)
        .sort(),
    ).toEqual(['Bahnhof', 'Gleis']);
  });

  it('counts only words that are still new', async () => {
    const first = createStoreWith();
    await first.store.getState().load('en');
    await first.store.getState().addTypedWords('Gleis');
    const reviewed = {
      ...first.savedWords.get('word-de-gleis')!,
      reviewStage: 1 as const,
    };
    first.savedWords.set(reviewed.id, reviewed);
    const second = createAppStore({
      getStorage: async () => first.storage,
      ai: createMockAiService(),
      now: () => new Date(),
    });
    await second.getState().load('en');

    expect(await second.getState().addTypedWords('Gleis')).toBe(0);
  });

  it('adds nothing for text it cannot normalise', async () => {
    const { store } = createStoreWith();
    await store.getState().load('en');

    expect(await store.getState().addTypedWords('Unbekannt')).toBe(0);
    expect(store.getState().words).toEqual([]);
  });

  it('adds nothing before the profile is loaded', async () => {
    const { store } = createStoreWith();

    expect(await store.getState().addTypedWords('Gleis')).toBe(0);
  });

  it('starts lesson 1 with the new words and saves it', async () => {
    const { store, savedLessons } = createStoreWith();
    await store.getState().load('en');
    await store.getState().addTypedWords('Bahnhof\nFahrkarte\nGleis');

    const lesson = await store.getState().startLesson();

    expect(lesson).toMatchObject({
      id: 'lesson-1',
      number: 1,
      wordIds: ['word-de-bahnhof', 'word-de-fahrkarte', 'word-de-gleis'],
      completedAt: null,
    });
    expect(savedLessons.get('lesson-1')).toEqual(lesson);
    expect(store.getState().lessons).toEqual([lesson]);
  });

  it('keeps one open lesson when the lesson is started twice', async () => {
    const { store, savedLessons } = createStoreWith();
    await store.getState().load('en');
    await store.getState().addTypedWords('Bahnhof\nFahrkarte');
    await store.getState().startLesson();
    await store.getState().addTypedWords('Gleis');

    const lesson = await store.getState().startLesson();

    expect(savedLessons.size).toBe(1);
    expect(lesson.wordIds).toHaveLength(3);
    expect(store.getState().lessons).toHaveLength(1);
  });

  it('loads the saved lessons on a later start', async () => {
    const first = createStoreWith();
    await first.store.getState().load('en');
    await first.store.getState().addTypedWords('Gleis');
    await first.store.getState().startLesson();
    const second = createAppStore({
      getStorage: async () => first.storage,
      ai: createMockAiService(),
      now: () => new Date(),
    });

    await second.getState().load('en');

    expect(second.getState().lessons.map((lesson) => lesson.id)).toEqual([
      'lesson-1',
    ]);
  });

  it('does not start a lesson without words', async () => {
    const { store, savedLessons } = createStoreWith();
    await store.getState().load('en');

    await expect(store.getState().startLesson()).rejects.toThrow(
      'A lesson needs at least one word',
    );
    expect(savedLessons.size).toBe(0);
  });

  it('saves a task result on the open lesson', async () => {
    const { store, savedLessons } = createStoreWith();
    await store.getState().load('en');
    await store.getState().addTypedWords('Bahnhof\nFahrkarte\nGleis');
    await store.getState().startLesson();

    await store
      .getState()
      .saveTaskResult('flashcards', { correct: 2, total: 3 });

    expect(savedLessons.get('lesson-1')?.taskResults).toEqual({
      flashcards: { correct: 2, total: 3 },
    });
    expect(store.getState().lessons[0]?.taskResults.flashcards).toEqual({
      correct: 2,
      total: 3,
    });
  });

  it('keeps the other task results when one is saved', async () => {
    const { store } = createStoreWith();
    await store.getState().load('en');
    await store.getState().addTypedWords('Gleis');
    await store.getState().startLesson();
    await store
      .getState()
      .saveTaskResult('flashcards', { correct: 1, total: 1 });

    await store.getState().saveTaskResult('listen', { correct: 3, total: 4 });

    expect(store.getState().lessons[0]?.taskResults).toEqual({
      flashcards: { correct: 1, total: 1 },
      listen: { correct: 3, total: 4 },
    });
  });

  it('refuses a task result when no lesson is open', async () => {
    const { store } = createStoreWith();
    await store.getState().load('en');

    await expect(
      store.getState().saveTaskResult('flashcards', { correct: 1, total: 1 }),
    ).rejects.toThrow('There is no open lesson');
  });

  it('loads the crossword of the open lesson once, with its words', async () => {
    const { store } = createStoreWith();
    await store.getState().load('ru');
    await store.getState().addTypedWords('Bahnhof\nFahrkarte\nGleis');
    const lesson = await store.getState().startLesson();

    await Promise.all([
      store.getState().loadCrossword(lesson.id),
      store.getState().loadCrossword(lesson.id),
    ]);
    const puzzle = store.getState().crosswords[lesson.id];

    expect(
      puzzle?.entries
        .filter((entry) => entry.wordId)
        .map((entry) => entry.wordId),
    ).toEqual(['word-de-bahnhof', 'word-de-gleis', 'word-de-fahrkarte']);
    expect(puzzle?.entries[0]?.translation).toBe('вокзал');
  });

  it('forgets the crossword when the lesson is abandoned', async () => {
    const { store } = createStoreWith();
    await store.getState().load('en');
    await store.getState().addTypedWords('Gleis');
    const lesson = await store.getState().startLesson();
    await store.getState().loadCrossword(lesson.id);

    await store.getState().abandonLesson();

    expect(store.getState().crosswords).toEqual({});
  });
});
