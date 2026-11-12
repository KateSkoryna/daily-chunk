import type { TargetLanguagePack } from '../target-language-pack';

export const germanPack = {
  articles: { masc: 'der', fem: 'die', neut: 'das', plural: 'die' },
  pluralTagLabel: 'die · Pl.',
  pluralCaption: '(Pl.)',
  pickerGenders: ['masc', 'fem', 'neut'],
} satisfies TargetLanguagePack;
