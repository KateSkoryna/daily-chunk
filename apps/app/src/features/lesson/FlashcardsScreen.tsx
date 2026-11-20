import type { Word } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import {
  getTargetLanguagePack,
  type NativeLanguage,
} from '@daily-chunk/languages';
import { View } from 'react-native';

import { ArticleChip } from '../../components/ArticleChip/ArticleChip';
import { Icon } from '../../components/Icon/Icon';
import { LessonHeader } from '../../components/LessonHeader/LessonHeader';
import { PartOfSpeechChip } from '../../components/PartOfSpeechChip/PartOfSpeechChip';
import { Screen } from '../../components/Screen/Screen';
import { TopBar } from '../../components/TopBar/TopBar';
import { WordCard } from '../../components/WordCard/WordCard';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';
import { displayedWord } from '../../lib/displayed-word';

type FlashcardsScreenProps = {
  lessonNumber: number;
  xp: number;
  cards: Word[];
  cardIndex: number;
  isFlipped: boolean;
  nativeLanguage: NativeLanguage;
  onFlip: () => void;
  onListen: () => void;
  onAgain: () => void;
  onKnewIt: () => void;
  onClose: () => void;
};

function CardFront({
  word,
  nativeLanguage,
}: {
  word: Word;
  nativeLanguage: NativeLanguage;
}) {
  const { t } = useTranslation();
  const { pluralCaption } = getTargetLanguagePack(word.targetLanguage);

  return (
    <View className="flex-1 justify-center gap-2">
      {word.gender ? (
        <ArticleChip
          gender={word.gender}
          targetLanguage={word.targetLanguage}
        />
      ) : (
        <PartOfSpeechChip
          label={t(`partOfSpeech.short.${word.partOfSpeech}`)}
        />
      )}
      <Text variant="word-xl">{displayedWord(word)}</Text>
      {word.forms && (
        <View className="flex-row items-baseline gap-2">
          <Text variant="word-l" className="text-gender-plural">
            {word.forms}
          </Text>
          <Text variant="body-sm">{pluralCaption}</Text>
        </View>
      )}
      <Text variant="body" className="text-muted-foreground">
        {word.translations[nativeLanguage]}
      </Text>
    </View>
  );
}

function CardBack({
  word,
  nativeLanguage,
}: {
  word: Word;
  nativeLanguage: NativeLanguage;
}) {
  return (
    <View className="flex-1 justify-center gap-2">
      <Text variant="word-l">{word.sentence}</Text>
      <Text variant="reading" className="text-muted-foreground">
        {word.sentenceTranslations[nativeLanguage]}
      </Text>
    </View>
  );
}

function FlashcardsScreen({
  lessonNumber,
  xp,
  cards,
  cardIndex,
  isFlipped,
  nativeLanguage,
  onFlip,
  onListen,
  onAgain,
  onKnewIt,
  onClose,
}: FlashcardsScreenProps) {
  const { t } = useTranslation();
  const word = cards[cardIndex]!;

  return (
    <Screen className="gap-4">
      <LessonHeader
        left={
          <TopBar.Action
            icon="cross"
            label={t('lesson.quit')}
            onPress={onClose}
          />
        }
        lessonLabel={t('lesson.title', { number: lessonNumber })}
        stepLabel={t('lesson.stepLabel', {
          step: '01',
          task: t('lesson.tasks.flashcards'),
        })}
        xpLabel={t('lesson.xpEarned', { count: xp })}
        stepCount={6}
        currentStep={1}
      />
      <Text variant="caption" className="uppercase">
        {t('flashcards.cardCount', {
          current: cardIndex + 1,
          total: cards.length,
        })}
      </Text>
      <WordCard
        isFlipped={isFlipped}
        onFlip={onFlip}
        front={<CardFront word={word} nativeLanguage={nativeLanguage} />}
        back={<CardBack word={word} nativeLanguage={nativeLanguage} />}
      />
      <View className="items-center">
        <Button variant="secondary" onPress={onListen}>
          <Icon name="speaker" decorative />
          <Text>{t('common.listen')}</Text>
        </Button>
      </View>
      <View className="mt-auto flex-row gap-3">
        <View className="flex-1">
          <Button variant="again" onPress={onAgain}>
            <Text>{t('flashcards.again')}</Text>
          </Button>
        </View>
        <View className="flex-1">
          <Button onPress={onKnewIt}>
            <Text>{t('flashcards.knewIt')}</Text>
          </Button>
        </View>
      </View>
    </Screen>
  );
}

export { FlashcardsScreen };
export type { FlashcardsScreenProps };
