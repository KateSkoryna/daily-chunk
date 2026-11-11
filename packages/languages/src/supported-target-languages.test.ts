import { describe, expect, it } from 'vitest';

import { supportedTargetLanguages } from './supported-target-languages';

describe('supportedTargetLanguages', () => {
  it('lists German as the only target language', () => {
    expect(supportedTargetLanguages).toEqual(['de']);
  });
});
