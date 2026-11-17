import type { Word } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import {
  getTargetLanguagePack,
  type NativeLanguage,
} from '@daily-chunk/languages';
import { View } from 'react-native';

import { ArticleChip } from '../../components/ArticleChip/ArticleChip';
import { GlitchTitle } from '../../components/GlitchTitle/GlitchTitle';
import { Icon } from '../../components/Icon/Icon';
import { ListGroup } from '../../components/ListGroup/ListGroup';
import { Notice } from '../../components/Notice/Notice';
import { PartOfSpeechChip } from '../../components/PartOfSpeechChip/PartOfSpeechChip';
import { Screen } from '../../components/Screen/Screen';
import { TopBar } from '../../components/TopBar/TopBar';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';

type ConfirmScreenProps = {
  words: Word[];
  nativeLanguage: NativeLanguage;
  pluralInput?: { typed: string; savedWordId: string };
  onBack: () => void;
  onEditWord: (wordId: string) => void;
  onStartLesson: () => void;
  onAddMore: () => void;
};

function ConfirmScreen({
  words,
  nativeLanguage,
  pluralInput,
  onBack,
  onEditWord,
  onStartLesson,
  onAddMore,
}: ConfirmScreenProps) {
  const { t } = useTranslation();
  const savedWord = words.find((word) => word.id === pluralInput?.savedWordId);

  return (
    <Screen className="gap-4">
      <TopBar
        left={
          <Button variant="ghost" onPress={onBack}>
            <Icon name="back" decorative />
            <Text>{t('common.back')}</Text>
          </Button>
        }
        right={
          <Text variant="caption" className="uppercase">
            {t('confirm.wordCount', { count: words.length })}
          </Text>
        }
      />
      <GlitchTitle variant="display-l">{t('confirm.title')}</GlitchTitle>
      <Text variant="body-sm">{t('confirm.intro')}</Text>
      <ListGroup>
        {words.map((word) => (
          <ListGroup.Row
            key={word.id}
            onPress={() => onEditWord(word.id)}
            left={<WordTag word={word} />}
            right={<Icon name="pencil" decorative className="text-ring" />}
          >
            <Text variant="word-l">{displayedWord(word)}</Text>
            <Text variant="body-sm">
              {word.gender
                ? t('confirm.pluralForms', { forms: word.forms })
                : t(`partOfSpeech.long.${word.partOfSpeech}`)}
            </Text>
            <Text variant="body-sm" className="text-foreground">
              {word.translations[nativeLanguage]}
            </Text>
          </ListGroup.Row>
        ))}
      </ListGroup>
      {pluralInput && savedWord && (
        <Notice>
          {t('confirm.pluralNotice', {
            written: pluralInput.typed,
            saved: displayedWord(savedWord),
          })}
        </Notice>
      )}
      <View className="mt-auto gap-3">
        <Button onPress={onStartLesson}>
          <Text>{t('confirm.startLesson')}</Text>
        </Button>
        <Button variant="ghost" onPress={onAddMore} className="self-center">
          <Text>{t('confirm.addMore')}</Text>
        </Button>
      </View>
    </Screen>
  );
}

function displayedWord(word: Word) {
  if (!word.gender) return word.lemma;
  const { articles } = getTargetLanguagePack(word.targetLanguage);
  return `${articles[word.gender]} ${word.lemma}`;
}

function WordTag({ word }: { word: Word }) {
  const { t } = useTranslation();

  if (!word.gender) {
    return (
      <PartOfSpeechChip
        label={t(`partOfSpeech.short.${word.partOfSpeech}`)}
        className="min-w-14"
      />
    );
  }
  return (
    <ArticleChip
      gender={word.gender}
      targetLanguage={word.targetLanguage}
      className="min-w-14"
    />
  );
}

export { ConfirmScreen };
export type { ConfirmScreenProps };
