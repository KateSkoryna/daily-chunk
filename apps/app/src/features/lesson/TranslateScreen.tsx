import type { Word } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import type { NativeLanguage, TargetLanguage } from '@daily-chunk/languages';
import { View } from 'react-native';

import { AnswerFeedback } from '../../components/AnswerFeedback/AnswerFeedback';
import { ArticleChip } from '../../components/ArticleChip/ArticleChip';
import { CorrectionSentence } from '../../components/CorrectionSentence/CorrectionSentence';
import { Icon } from '../../components/Icon/Icon';
import { LessonHeader } from '../../components/LessonHeader/LessonHeader';
import { PartOfSpeechChip } from '../../components/PartOfSpeechChip/PartOfSpeechChip';
import { Screen } from '../../components/Screen/Screen';
import { Textarea } from '../../components/Textarea/Textarea';
import { TopBar } from '../../components/TopBar/TopBar';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';
import { splitAroundWord } from '../../lib/split-around-word';

type TranslateFeedback =
  | { status: 'correct' }
  | {
      status: 'almost';
      wrongWord: string;
      rightWord: string;
      explanation: string;
    };

type TranslateScreenProps = {
  lessonNumber: number;
  xp: number;
  nativeLanguage: NativeLanguage;
  targetLanguage: TargetLanguage;
  prompt: string;
  wordsToUse: Word[];
  answer: string;
  feedback: TranslateFeedback | null;
  onAnswerChange: (text: string) => void;
  onDictate: () => void;
  onBack: () => void;
  onCheck: () => void;
  onTryAgain: () => void;
  onContinue: () => void;
};

function WordToUse({ word }: { word: Word }) {
  const { t } = useTranslation();

  return (
    <View className="flex-row items-center gap-2">
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
      <Text variant="option">{word.lemma}</Text>
    </View>
  );
}

function Feedback({
  feedback,
  answer,
}: {
  feedback: TranslateFeedback;
  answer: string;
}) {
  const { t } = useTranslation();

  if (feedback.status === 'correct') {
    return (
      <AnswerFeedback
        status="correct"
        tabLabel={t('translate.verdict.correct')}
      >
        <Text>{answer}</Text>
      </AnswerFeedback>
    );
  }

  const { wrongWord, rightWord, explanation } = feedback;
  const parts = splitAroundWord(answer, wrongWord);

  return (
    <AnswerFeedback status="almost" tabLabel={t('translate.verdict.almost')}>
      {parts ? (
        <CorrectionSentence
          before={parts.before}
          wrongWord={wrongWord}
          rightWord={rightWord}
          after={parts.after}
          accessibilityLabel={t('translate.correctionLabel', {
            sentence: `${parts.before}${rightWord}${parts.after}`,
            wrong: wrongWord,
            right: rightWord,
          })}
        />
      ) : (
        <Text>{answer}</Text>
      )}
      <Text variant="caption">{explanation}</Text>
    </AnswerFeedback>
  );
}

function TranslateScreen({
  lessonNumber,
  xp,
  nativeLanguage,
  targetLanguage,
  prompt,
  wordsToUse,
  answer,
  feedback,
  onAnswerChange,
  onDictate,
  onBack,
  onCheck,
  onTryAgain,
  onContinue,
}: TranslateScreenProps) {
  const { t } = useTranslation();

  return (
    <Screen className="gap-3.5">
      <LessonHeader
        left={
          <Button variant="ghost" onPress={onBack}>
            <Icon name="back" decorative />
            <Text>{t('common.back')}</Text>
          </Button>
        }
        lessonLabel={t('lesson.title', { number: lessonNumber })}
        stepLabel={t('lesson.stepLabel', {
          step: '06',
          task: t('lesson.tasks.translate', {
            from: nativeLanguage.toUpperCase(),
            to: targetLanguage.toUpperCase(),
          }),
        })}
        xpLabel={t('lesson.xpEarned', { count: xp })}
        stepCount={6}
        currentStep={6}
      />
      <View className="border-2 border-border bg-card p-3.5">
        <Text variant="reading">{prompt}</Text>
      </View>
      <View className="flex-row flex-wrap items-center gap-2">
        <Text variant="ui" className="text-muted-foreground">
          {t('translate.use')}
        </Text>
        {wordsToUse.map((word) => (
          <WordToUse key={word.id} word={word} />
        ))}
      </View>
      <Textarea
        value={answer}
        onChangeText={onAnswerChange}
        accessibilityLabel={t('translate.answerLabel')}
        trailing={
          <TopBar.Button
            variant="record"
            icon="mic"
            accessibilityLabel={t('translate.dictate')}
            onPress={onDictate}
          />
        }
      />
      {feedback ? <Feedback feedback={feedback} answer={answer} /> : null}
      <View className="mt-auto flex-row gap-3">
        {feedback === null ? (
          <Button disabled={answer.trim() === ''} onPress={onCheck}>
            <Text>{t('translate.check')}</Text>
          </Button>
        ) : (
          <>
            {feedback.status === 'almost' ? (
              <View className="flex-1">
                <Button variant="again" onPress={onTryAgain}>
                  <Text>{t('translate.tryAgain')}</Text>
                </Button>
              </View>
            ) : null}
            <View className="flex-1">
              <Button onPress={onContinue}>
                <Text>{t('common.next')}</Text>
              </Button>
            </View>
          </>
        )}
      </View>
    </Screen>
  );
}

export { TranslateScreen };
export type { TranslateFeedback, TranslateScreenProps };
