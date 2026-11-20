import { describe, expect, it } from 'vitest';

import { demoProfile } from '../src/mocks/profile';
import { toProfile, toProfileRow } from '../src/storage/profile-row';

describe('profile row', () => {
  it('turns a profile into a row and back without losing anything', () => {
    expect(toProfile(toProfileRow(demoProfile))).toEqual(demoProfile);
  });

  it('keeps a missing last study date as null', () => {
    const newProfile = { ...demoProfile, lastStudyDate: null };

    expect(toProfileRow(newProfile).lastStudyDate).toBeNull();
    expect(toProfile(toProfileRow(newProfile)).lastStudyDate).toBeNull();
  });

  it('flattens the language pair into two columns', () => {
    expect(toProfileRow(demoProfile)).toMatchObject({
      targetLanguage: 'de',
      nativeLanguage: 'ru',
    });
  });
});
