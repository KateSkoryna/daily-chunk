import { supportedTargetLangs } from '@daily-chunk/languages';
import { describe, expect, it } from 'vitest';

describe('supportedTargetLangs imported from the languages package', () => {
  it('lists German as the only target language', () => {
    expect(supportedTargetLangs).toEqual(['de']);
  });
});
