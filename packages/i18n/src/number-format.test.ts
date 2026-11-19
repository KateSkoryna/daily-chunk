import { describe, expect, it } from 'vitest';
import { createI18n } from './create-i18n';

describe('numbers in strings', () => {
  it('writes the speed with a decimal point in English and a comma in Russian', () => {
    expect(createI18n('en').t('listen.speed', { speed: 0.75 })).toBe('0.75×');
    expect(createI18n('ru').t('listen.speed', { speed: 0.75 })).toBe('0,75×');
  });

  it('writes seconds with one decimal in the waveform text', () => {
    const values = { played: 1.4, total: 3 };

    expect(createI18n('en').t('listen.waveform', values)).toBe(
      'Audio waveform, 1.4 of 3.0 seconds played',
    );
    expect(createI18n('ru').t('listen.waveform', values)).toBe(
      'Аудио, воспроизведено 1,4 из 3,0 с',
    );
  });
});
