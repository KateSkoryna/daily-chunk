import type { Profile, Storage, Word } from '@daily-chunk/core';
import { describe, expect, it, vi } from 'vitest';

import { createMockAiService } from '../src/ai/mock-ai-service';
import { createAppStore } from '../src/state/app-store';

function createFakeStorage(
  initial: { profile?: Profile; words?: Word[] } = {},
) {
  let profile = initial.profile;
  const words = new Map((initial.words ?? []).map((word) => [word.id, word]));
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
    },
  };
  return { storage, savedWords: words };
}

function createStoreWith(initial?: Parameters<typeof createFakeStorage>[0]) {
  const { storage, savedWords } = createFakeStorage(initial);
  const store = createAppStore({
    getStorage: async () => storage,
    ai: createMockAiService(),
    now: () => new Date('2026-11-20T10:00:00.000Z'),
  });
  return { store, storage, savedWords };
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
});
