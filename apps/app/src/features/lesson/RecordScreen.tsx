import { useTranslation } from '@daily-chunk/i18n';
import { View } from 'react-native';

import { Chip } from '../../components/Chip/Chip';
import { Icon } from '../../components/Icon/Icon';
import { LessonHeader } from '../../components/LessonHeader/LessonHeader';
import { RecordButton } from '../../components/RecordButton/RecordButton';
import { Screen } from '../../components/Screen/Screen';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import { StoryText } from '../../components/StoryText/StoryText';
import { TutorQuote } from '../../components/TutorQuote/TutorQuote';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';
import { formatDuration } from '../../lib/format-duration';
import { cn } from '../../lib/utils';

type PronunciationVerdict = 'clear' | 'almost' | 'unclear';

type RecordScreenProps = {
  lessonNumber: number;
  xp: number;
  storyText: string;
  durationSeconds: number;
  scorePercent: number;
  verdict: PronunciationVerdict;
  retryWords: string[];
  pronunciationTip: string;
  onBack: () => void;
  onPlayRecording: () => void;
  onRetryWord: (word: string) => void;
  onRecordAgain: () => void;
  onContinue: () => void;
};

function RecordScreen({
  lessonNumber,
  xp,
  storyText,
  durationSeconds,
  scorePercent,
  verdict,
  retryWords,
  pronunciationTip,
  onBack,
  onPlayRecording,
  onRetryWord,
  onRecordAgain,
  onContinue,
}: RecordScreenProps) {
  const { t } = useTranslation();
  const isUnclear = verdict === 'unclear';

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
          step: '04',
          task: t('lesson.tasks.record'),
        })}
        xpLabel={t('lesson.xpEarned', { count: xp })}
        stepCount={6}
        currentStep={4}
      />
      <View className="border-2 border-border bg-card p-3.5">
        <StoryText
          text={storyText}
          marks={retryWords.map((word) => ({ word, tone: 'retry' }))}
        />
      </View>
      <View className="flex-row items-center gap-5">
        <View className="items-center gap-1.5">
          <RecordButton
            state="done"
            accessibilityLabel={t('record.play')}
            onPress={onPlayRecording}
          />
          <Text variant="caption">{formatDuration(durationSeconds)}</Text>
        </View>
        <View className="flex-1 gap-1">
          <Text
            variant="display-num"
            className={isUnclear ? 'text-destructive' : 'text-success'}
          >
            {`${scorePercent}%`}
          </Text>
          <Text
            variant="ui"
            className={cn(
              'uppercase',
              isUnclear ? 'text-destructive' : 'text-success',
            )}
          >
            {t(`record.verdict.${verdict}`)}
          </Text>
          <Text variant="caption">
            {t('record.wordsToRetry', { count: retryWords.length })}
          </Text>
        </View>
      </View>
      {retryWords.length > 0 && (
        <View className="gap-2">
          <SectionLabel>{t('record.retryThese')}</SectionLabel>
          <View className="flex-row gap-2">
            {retryWords.map((word) => (
              <Chip
                key={word}
                label={word}
                icon="retry"
                accessibilityLabel={t('record.retry', { word })}
                onPress={() => onRetryWord(word)}
              />
            ))}
          </View>
          <Text variant="caption">{pronunciationTip}</Text>
        </View>
      )}
      <TutorQuote
        variant={isUnclear ? 'fail' : 'pass'}
        tabLabel={t(isUnclear ? 'tutor.sighs' : 'tutor.approves')}
      >
        {retryWords.length > 0
          ? t('record.chunkLine', { score: scorePercent, word: retryWords[0] })
          : t('record.chunkLineClean', { score: scorePercent })}
      </TutorQuote>
      <View className="mt-auto flex-row gap-3">
        <View className="flex-1">
          <Button
            variant="secondary"
            onPress={onRecordAgain}
            className="h-button"
          >
            <Text>{t('record.recordAgain')}</Text>
          </Button>
        </View>
        <View className="flex-1">
          <Button onPress={onContinue}>
            <Text>{t('common.continue')}</Text>
          </Button>
        </View>
      </View>
    </Screen>
  );
}

export { RecordScreen };
export type { PronunciationVerdict, RecordScreenProps };
