import { describe, expect, it } from 'vitest';

import { supportedTargetLangs } from './supported-target-langs';

describe('supportedTargetLangs', () => {
  it('lists German as the only target language', () => {
    expect(supportedTargetLangs).toEqual(['de']);
  });
});
