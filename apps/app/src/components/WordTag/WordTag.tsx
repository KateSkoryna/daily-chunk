import type { Word } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';

import { ArticleChip } from '../ArticleChip/ArticleChip';
import { PartOfSpeechChip } from '../PartOfSpeechChip/PartOfSpeechChip';

type WordTagProps = {
  word: Word;
  className?: string;
};

function WordTag({ word, className }: WordTagProps) {
  const { t } = useTranslation();

  if (!word.gender) {
    return (
      <PartOfSpeechChip
        label={t(`partOfSpeech.short.${word.partOfSpeech}`)}
        className={className}
      />
    );
  }
  return (
    <ArticleChip
      gender={word.gender}
      targetLanguage={word.targetLanguage}
      className={className}
    />
  );
}

export { WordTag };
export type { WordTagProps };
