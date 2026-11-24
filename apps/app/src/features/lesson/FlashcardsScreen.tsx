import type { Word } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import {
  getTargetLanguagePack,
  type NativeLanguage,
} from '@daily-chunk/languages';
import { View } from 'react-native';

import { ArticleChip } from '../../components/ArticleChip/ArticleChip';
import { Icon } from '../../components/Icon/Icon';
import { CardNavigator } from '../../components/CardNavigator/CardNavigator';
import { ItemDots } from '../../components/ItemDots/ItemDots';
import { LessonHeader } from '../../components/LessonHeader/LessonHeader';
import { PartOfSpeechChip } from '../../components/PartOfSpeechChip/PartOfSpeechChip';
import { displayedWord } from '../../lib/displayed-word';
import { Screen } from '../../components/Screen/Screen';
import { TopBar } from '../../components/TopBar/TopBar';
import { TipButton } from '../../components/TipButton/TipButton';
import { TipCard } from '../../components/TipCard/TipCard';
import { WordCard } from '../../components/WordCard/WordCard';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';

type FlashcardsScreenProps = {
  lessonNumber: number;
  xp: number;
  word: Word;
  cardNumber: number;
  cardTotal: number;
  isFirstCard: boolean;
  isLastCard: boolean;
  isFlipped: boolean;
  isTipOpen: boolean;
  nativeLanguage: NativeLanguage;
  onFlip: () => void;
  onTipToggle: () => void;
  onListen: () => void;
  onCardSelect: (card: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onNextSection: () => void;
  taskNames: string[];
  onTaskSelect: (step: number) => void;
  onBack: () => void;
  onClose: () => void;
};

// h-9 is the height of the tallest letters of the word and mb-2.5 lifts the box from the bottom of the word's line to its baseline
const articleBoxClasses = 'mb-2.5 h-9 self-end';

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
      <View className="flex-row flex-wrap items-end gap-3">
        {word.gender ? (
          <ArticleChip
            gender={word.gender}
            targetLanguage={word.targetLanguage}
            className={articleBoxClasses}
          />
        ) : (
          <PartOfSpeechChip
            label={t(`partOfSpeech.short.${word.partOfSpeech}`)}
            className={articleBoxClasses}
          />
        )}
        <Text variant="word-xl">{word.lemma}</Text>
      </View>
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
  word,
  cardNumber,
  cardTotal,
  isFirstCard,
  isLastCard,
  isFlipped,
  isTipOpen,
  nativeLanguage,
  onFlip,
  onTipToggle,
  onListen,
  onCardSelect,
  onPrevious,
  onNext,
  onNextSection,
  taskNames,
  onTaskSelect,
  onBack,
  onClose,
}: FlashcardsScreenProps) {
  const { t } = useTranslation();
  const tip = word.tip?.[nativeLanguage];

  return (
    <Screen className="gap-4">
      <LessonHeader
        left={
          <TopBar.Action
            icon="back"
            label={t('common.back')}
            onPress={onBack}
          />
        }
        stepNames={taskNames}
        onStepSelect={onTaskSelect}
        right={
          <TopBar.Action
            icon="cross"
            iconPosition="end"
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
      <View>
        <Text variant="caption" className="uppercase">
          {t('flashcards.cardCount', {
            current: cardNumber,
            total: cardTotal,
          })}
        </Text>
        <ItemDots
          labels={Array.from({ length: cardTotal }, (_, index) =>
            t('flashcards.goToCard', { number: index + 1 }),
          )}
          current={cardNumber}
          groupLabel={t('flashcards.cards')}
          onSelect={onCardSelect}
        />
      </View>
      <CardNavigator
        isFirst={isFirstCard}
        isLast={isLastCard}
        previousLabel={t('flashcards.previousCard')}
        nextLabel={t('flashcards.nextCard')}
        swipeHint={t('flashcards.swipeHint')}
        onPrevious={onPrevious}
        onNext={onNext}
      >
        <WordCard
          isFlipped={isFlipped}
          onFlip={onFlip}
          front={<CardFront word={word} nativeLanguage={nativeLanguage} />}
          back={<CardBack word={word} nativeLanguage={nativeLanguage} />}
          overlay={tip && isTipOpen && <TipCard tip={tip} />}
          corner={
            tip && (
              <TipButton
                word={displayedWord(word)}
                isOpen={isTipOpen}
                onToggle={onTipToggle}
              />
            )
          }
        />
      </CardNavigator>
      <View className="items-center">
        <Button variant="secondary" onPress={onListen}>
          <Icon name="speaker" decorative />
          <Text>{t('common.listen')}</Text>
        </Button>
      </View>
      <View className="mt-auto">
        <Button onPress={onNextSection}>
          <Text>{t('lesson.nextSection')}</Text>
        </Button>
      </View>
    </Screen>
  );
}

export { FlashcardsScreen };
export type { FlashcardsScreenProps };
