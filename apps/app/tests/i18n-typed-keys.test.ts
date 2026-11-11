import { createI18n } from '@daily-chunk/i18n';
import { describe, expect, it } from 'vitest';

describe('translation keys typed in the app', () => {
  it('translates a key that exists', () => {
    expect(createI18n('en').t('settings.appLanguage')).toBe('App language');
  });

  it('rejects a key that does not exist at compile time', () => {
    // @ts-expect-error unknown key must not type check
    const result = createI18n('en').t('settings.appLangauge');
    expect(result).toBe('settings.appLangauge');
  });
});
