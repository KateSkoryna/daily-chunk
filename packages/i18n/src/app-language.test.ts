import { describe, expect, it } from 'vitest';
import { createI18n } from './create-i18n';
import { resources } from './resources';
import { defaultAppLanguage, pickAppLanguage } from './app-language';

const pluralSuffixes = /_(zero|one|two|few|many|other)$/;

function collectKeys(node: object, prefix = ''): string[] {
  return Object.entries(node).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null
      ? collectKeys(value, `${prefix}${key}.`)
      : [`${prefix}${key}`.replace(pluralSuffixes, '')],
  );
}

describe('pickAppLanguage', () => {
  it('picks the first supported device language', () => {
    expect(pickAppLanguage(['de', 'ru', 'en'])).toBe('ru');
  });

  it('falls back to the default when nothing is supported', () => {
    expect(pickAppLanguage(['de', 'fr'])).toBe(defaultAppLanguage);
    expect(pickAppLanguage([null, undefined])).toBe(defaultAppLanguage);
    expect(pickAppLanguage([])).toBe(defaultAppLanguage);
  });
});

describe('locale files', () => {
  it('have the same keys in English and Russian', () => {
    const englishKeys = new Set(collectKeys(resources.en.translation));
    const russianKeys = new Set(collectKeys(resources.ru.translation));
    expect([...russianKeys].sort()).toEqual([...englishKeys].sort());
  });
});

describe('plural forms', () => {
  function collectPluralSuffixes(
    node: object,
    prefix = '',
  ): Map<string, string[]> {
    const groups = new Map<string, string[]>();
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === 'object' && value !== null) {
        for (const [groupName, suffixes] of collectPluralSuffixes(
          value,
          `${prefix}${key}.`,
        )) {
          groups.set(groupName, suffixes);
        }
        continue;
      }
      const match = key.match(pluralSuffixes);
      if (!match) continue;
      const groupName = `${prefix}${key.replace(pluralSuffixes, '')}`;
      groups.set(groupName, [...(groups.get(groupName) ?? []), match[1] ?? '']);
    }
    return groups;
  }

  it('gives every Russian plural key the four forms one, few, many, other', () => {
    for (const [groupName, suffixes] of collectPluralSuffixes(
      resources.ru.translation,
    )) {
      expect(suffixes.sort(), groupName).toEqual([
        'few',
        'many',
        'one',
        'other',
      ]);
    }
  });

  it('gives every English plural key the forms one and other', () => {
    for (const [groupName, suffixes] of collectPluralSuffixes(
      resources.en.translation,
    )) {
      expect(suffixes.sort(), groupName).toEqual(['one', 'other']);
    }
  });
});

describe('createI18n', () => {
  it('starts in the requested language', () => {
    expect(createI18n('ru').t('settings.appLanguage')).toBe('Язык приложения');
    expect(createI18n('en').t('settings.appLanguage')).toBe('App language');
  });

  it('returns independent instances', () => {
    const english = createI18n('en');
    const russian = createI18n('ru');
    expect(english.language).toBe('en');
    expect(russian.language).toBe('ru');
  });
});
