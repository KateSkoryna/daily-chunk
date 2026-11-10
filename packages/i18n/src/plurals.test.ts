import { describe, expect, it } from 'vitest';
import { createI18n } from './create-i18n';

function wordsDue(appLanguage: 'en' | 'ru', count: number) {
  return createI18n(appLanguage).t('home.wordsDue', { count });
}

describe('Russian plurals', () => {
  it('uses the "one" form for 1 and 21', () => {
    expect(wordsDue('ru', 1)).toBe('На сегодня 1 слово');
    expect(wordsDue('ru', 21)).toBe('На сегодня 21 слово');
  });

  it('uses the "few" form for 2, 3, 4 and 22', () => {
    expect(wordsDue('ru', 2)).toBe('На сегодня 2 слова');
    expect(wordsDue('ru', 4)).toBe('На сегодня 4 слова');
    expect(wordsDue('ru', 22)).toBe('На сегодня 22 слова');
  });

  it('uses the "many" form for 5, 11 and 25', () => {
    expect(wordsDue('ru', 5)).toBe('На сегодня 5 слов');
    expect(wordsDue('ru', 11)).toBe('На сегодня 11 слов');
    expect(wordsDue('ru', 25)).toBe('На сегодня 25 слов');
  });
});

describe('English plurals', () => {
  it('uses the singular for 1 and the plural for the rest', () => {
    expect(wordsDue('en', 1)).toBe('1 word is due today');
    expect(wordsDue('en', 2)).toBe('2 words are due today');
    expect(wordsDue('en', 5)).toBe('5 words are due today');
  });
});
