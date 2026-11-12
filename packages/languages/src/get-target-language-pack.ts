import { germanPack } from './de';
import type { TargetLanguagePack } from './target-language-pack';
import type { supportedTargetLanguages } from './supported-target-languages';

type TargetLanguage = (typeof supportedTargetLanguages)[number];

const packs = { de: germanPack } satisfies Record<
  TargetLanguage,
  TargetLanguagePack
>;

export function getTargetLanguagePack(
  targetLanguage: TargetLanguage,
): TargetLanguagePack {
  return packs[targetLanguage];
}

export type { TargetLanguage };
