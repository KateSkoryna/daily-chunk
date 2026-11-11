import { supportedTargetLanguages } from '@daily-chunk/languages';
import { describe, expect, it } from 'vitest';

describe('supportedTargetLanguages imported from the languages package', () => {
  it('lists German as the only target language', () => {
    expect(supportedTargetLanguages).toEqual(['de']);
  });
});
