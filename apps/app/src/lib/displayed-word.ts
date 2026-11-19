import type { Word } from '@daily-chunk/core';
import { getTargetLanguagePack } from '@daily-chunk/languages';

export function displayedWord(word: Word) {
  if (!word.gender) return word.lemma;
  const { articles } = getTargetLanguagePack(word.targetLanguage);
  return `${articles[word.gender]} ${word.lemma}`;
}
