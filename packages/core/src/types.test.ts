import {
  supportedNativeLanguages,
  supportedTargetLanguages,
} from '@daily-chunk/languages';
import { describe, expect, expectTypeOf, it } from 'vitest';

import type {
  AiRequest,
  AiService,
  GapSentencesRequest,
  NormaliseRequest,
  NormaliseResponse,
  PronunciationRequest,
  StoryRequest,
  StoryResponse,
  TranslationCheckRequest,
  TranslationCheckResponse,
} from './ai';
import { lessonTaskTypes } from './lesson';
import type { LanguagePair } from './language-pair';
import type { Lesson } from './lesson';
import type { Profile } from './profile';
import type { ReviewLog } from './review-log';
import type { Storage } from './storage';
import type { Word } from './word';

describe('LanguagePair', () => {
  it('takes both languages from the language packs', () => {
    expectTypeOf<LanguagePair['targetLanguage']>().toEqualTypeOf<
      (typeof supportedTargetLanguages)[number]
    >();
    expectTypeOf<LanguagePair['nativeLanguage']>().toEqualTypeOf<
      (typeof supportedNativeLanguages)[number]
    >();
  });
});

describe('Word', () => {
  it('keeps one translation per native language', () => {
    const word: Word = {
      id: 'w1',
      targetLanguage: 'de',
      lemma: 'Bahnhof',
      partOfSpeech: 'noun',
      gender: 'masc',
      sentence: 'Der Zug fährt vom Bahnhof ab.',
      sentenceTranslations: { ru: 'Поезд отходит от вокзала.' },
      translations: { ru: 'вокзал', en: 'station' },
      reviewStage: 0,
      nextReviewAt: null,
      learnedAt: null,
      createdAt: '2026-11-17T08:00:00Z',
      updatedAt: '2026-11-17T08:00:00Z',
    };

    expect(word.translations.ru).toBe('вокзал');
    expect(word.translations.en).toBe('station');
  });

  it('allows a translation to be missing for a native language', () => {
    const translations: Word['translations'] = { ru: 'билет' };

    expect(translations.en).toBeUndefined();
  });

  it('has review stages 0 to 5 and a separate learned date', () => {
    expectTypeOf<Word['reviewStage']>().toEqualTypeOf<0 | 1 | 2 | 3 | 4 | 5>();
    expectTypeOf<Word['learnedAt']>().toEqualTypeOf<string | null>();
  });

  it('rejects a translation key that is not a native language', () => {
    // @ts-expect-error de is a target language, not a native one
    const translations: Word['translations'] = { de: 'Bahnhof' };

    expect(translations).toBeDefined();
  });
});

describe('Lesson', () => {
  it('has the seven tasks in lesson order', () => {
    expect(lessonTaskTypes).toEqual([
      'flashcards',
      'crossword',
      'listen',
      'read',
      'answer',
      'gap-fill',
      'translate',
    ]);
  });

  it('stores a result only for a task that was played', () => {
    const lesson: Lesson = {
      id: 'l13',
      number: 13,
      wordIds: ['w1'],
      taskResults: { flashcards: { correct: 4, total: 4 } },
      xpEarned: 0,
      startedAt: null,
      completedAt: null,
    };

    expect(lesson.taskResults.listen).toBeUndefined();
  });

  it('rejects a result for a task that does not exist', () => {
    const taskResults: Lesson['taskResults'] = {
      // @ts-expect-error there is no task called dictation
      dictation: { correct: 1, total: 1 },
    };

    expect(taskResults).toBeDefined();
  });
});

describe('ReviewLog', () => {
  it('records the stage before and after an answer', () => {
    expectTypeOf<ReviewLog['stageBefore']>().toEqualTypeOf<
      Word['reviewStage']
    >();
    expectTypeOf<ReviewLog['stageAfter']>().toEqualTypeOf<
      Word['reviewStage']
    >();
  });
});

describe('Profile', () => {
  it('keeps the app language apart from the language pair', () => {
    const profile: Profile = {
      id: 'p1',
      languages: { targetLanguage: 'de', nativeLanguage: 'ru' },
      appLanguage: 'en',
      level: 'B2',
      xp: 1240,
      currentStreak: 12,
      longestStreak: 12,
      lastStudyDate: null,
      createdAt: '2026-11-01T08:00:00Z',
      updatedAt: '2026-11-17T08:00:00Z',
    };

    expect(profile.appLanguage).not.toBe(profile.languages.nativeLanguage);
  });
});

describe('Storage', () => {
  it('reads and saves the profile with promises', () => {
    expectTypeOf<Storage['profile']['get']>().returns.resolves.toEqualTypeOf<
      Profile | undefined
    >();
    expectTypeOf<Storage['profile']['save']>().parameters.toEqualTypeOf<
      [Profile]
    >();
    expectTypeOf<Storage['profile']['save']>().returns.resolves.toBeVoid();
  });

  it('lists and saves lessons with promises', () => {
    expectTypeOf<Storage['lessons']['list']>().returns.resolves.toEqualTypeOf<
      Lesson[]
    >();
    expectTypeOf<Storage['lessons']['save']>().parameters.toEqualTypeOf<
      [Lesson]
    >();
    expectTypeOf<Storage['lessons']['remove']>().parameters.toEqualTypeOf<
      [string]
    >();
  });

  it('lists words and saves many at once with promises', () => {
    expectTypeOf<Storage['words']['list']>().returns.resolves.toEqualTypeOf<
      Word[]
    >();
    expectTypeOf<Storage['words']['saveMany']>().parameters.toEqualTypeOf<
      [Word[]]
    >();
    expectTypeOf<Storage['words']['remove']>().parameters.toEqualTypeOf<
      [string]
    >();
  });
});

describe('AI requests', () => {
  it('every call carries the language pair', () => {
    expectTypeOf<AiRequest['languages']>().toEqualTypeOf<LanguagePair>();
    expectTypeOf<NormaliseRequest>().toMatchTypeOf<AiRequest>();
    expectTypeOf<StoryRequest>().toMatchTypeOf<AiRequest>();
    expectTypeOf<GapSentencesRequest>().toMatchTypeOf<AiRequest>();
    expectTypeOf<TranslationCheckRequest>().toMatchTypeOf<AiRequest>();
    expectTypeOf<PronunciationRequest>().toMatchTypeOf<AiRequest>();
  });

  it('rejects a request without the language pair', () => {
    // @ts-expect-error languages are required
    const request: NormaliseRequest = { typedText: 'Bahnhof' };

    expect(request.typedText).toBe('Bahnhof');
  });

  it('has one method per AI job, each returning a promise', () => {
    expectTypeOf<
      AiService['normaliseWords']
    >().returns.resolves.toEqualTypeOf<NormaliseResponse>();
    expectTypeOf<
      AiService['generateStory']
    >().returns.resolves.toEqualTypeOf<StoryResponse>();
    expectTypeOf<
      AiService['checkTranslation']
    >().returns.resolves.toEqualTypeOf<TranslationCheckResponse>();
  });

  it('returns one native translation, not one per language', () => {
    expectTypeOf<StoryResponse['translation']>().toEqualTypeOf<string>();
  });
});
