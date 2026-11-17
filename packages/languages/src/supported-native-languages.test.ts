import { describe, expect, it } from 'vitest';

import { supportedNativeLanguages } from './supported-native-languages';

describe('supportedNativeLanguages', () => {
  it('lists Russian and English', () => {
    expect(supportedNativeLanguages).toEqual(['ru', 'en']);
  });
});
