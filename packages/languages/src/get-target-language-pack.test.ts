import { describe, expect, it } from 'vitest';

import { genderRoles } from './gender';
import { getTargetLanguagePack } from './get-target-language-pack';
import { supportedTargetLanguages } from './supported-target-languages';

describe('getTargetLanguagePack', () => {
  it('has a pack for every supported target language', () => {
    for (const targetLanguage of supportedTargetLanguages) {
      expect(getTargetLanguagePack(targetLanguage)).toBeDefined();
    }
  });

  it('maps every gender role to a German article', () => {
    const { articles } = getTargetLanguagePack('de');

    expect(Object.keys(articles).sort()).toEqual([...genderRoles].sort());
    expect(articles).toEqual({
      masc: 'der',
      fem: 'die',
      neut: 'das',
      plural: 'die',
    });
  });

  it('lets a person pick between three genders, never the plural', () => {
    const { pickerGenders } = getTargetLanguagePack('de');

    expect(pickerGenders).toEqual(['masc', 'fem', 'neut']);
  });

  it('writes the plural tag label with the article and Pl.', () => {
    expect(getTargetLanguagePack('de').pluralTagLabel).toBe('die · Pl.');
  });

  it('captions a plural form with (Pl.)', () => {
    expect(getTargetLanguagePack('de').pluralCaption).toBe('(Pl.)');
  });
});
