import type { Word } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import type { GenderRole, NativeLanguage } from '@daily-chunk/languages';
import { Text as NativeText, View } from 'react-native';

import { ArticleChip } from '../../components/ArticleChip/ArticleChip';
import { Icon } from '../../components/Icon/Icon';
import { LessonHeader } from '../../components/LessonHeader/LessonHeader';
import { PartOfSpeechChip } from '../../components/PartOfSpeechChip/PartOfSpeechChip';
import { PlaybackControls } from '../../components/PlaybackControls/PlaybackControls';
import type { RecordButtonState } from '../../components/RecordButton/RecordButton';
import { Screen } from '../../components/Screen/Screen';
import { StepIndicator } from '../../components/StepIndicator/StepIndicator';
import { Waveform } from '../../components/Waveform/Waveform';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';
import { cn } from '../../lib/utils';
import { displayedWord } from '../../lib/displayed-word';

const underlineClasses = {
  masc: 'decoration-gender-masc',
  fem: 'decoration-gender-fem',
  neut: 'decoration-gender-neut',
  plural: 'decoration-gender-plural',
} satisfies Record<GenderRole, string>;

type ListenScreenProps = {
  lessonNumber: number;
  xp: number;
  word: Word;
  highlightedWord: string;
  nativeLanguage: NativeLanguage;
  step: 1 | 2;
  playback: {
    bars: number[];
    playedSeconds: number;
    durationSeconds: number;
    speed: number;
    isPlaying: boolean;
  };
  recordState: RecordButtonState;
  phrase: { current: number; total: number };
  repeat: { current: number; total: number };
  onBack: () => void;
  onTogglePlay: () => void;
  onSpeedPress: () => void;
  onRecord: () => void;
  onNextPhrase: () => void;
};

function ListenScreen({
  lessonNumber,
  xp,
  word,
  highlightedWord,
  nativeLanguage,
  step,
  playback,
  recordState,
  phrase,
  repeat,
  onBack,
  onTogglePlay,
  onSpeedPress,
  onRecord,
  onNextPhrase,
}: ListenScreenProps) {
  const { t } = useTranslation();
  const highlightStart = word.sentence.indexOf(highlightedWord);
  const before = word.sentence.slice(0, highlightStart);
  const after = word.sentence.slice(highlightStart + highlightedWord.length);
  const underline = word.gender ? underlineClasses[word.gender] : '';

  return (
    <Screen className="gap-4">
      <LessonHeader
        left={
          <Button variant="ghost" onPress={onBack}>
            <Icon name="back" decorative />
            <Text>{t('common.back')}</Text>
          </Button>
        }
        lessonLabel={t('lesson.title', { number: lessonNumber })}
        stepLabel={t('lesson.stepLabel', {
          step: '02',
          task: t('lesson.tasks.listen'),
        })}
        xpLabel={t('lesson.xpEarned', { count: xp })}
        stepCount={6}
        currentStep={2}
      />
      <StepIndicator
        steps={[t('listen.stepListen'), t('listen.stepRepeat')]}
        current={step}
        label={t('listen.steps')}
      />
      <View className="gap-3.5 border-2 border-border bg-card px-4 py-5">
        <View className="flex-row items-center gap-2.5">
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
          <Text variant="word-l">{displayedWord(word)}</Text>
        </View>
        <Text variant="reading">
          {before}
          <NativeText className={cn('underline', underline)}>
            {highlightedWord}
          </NativeText>
          {after}
        </Text>
        <Text variant="body-sm">
          {word.sentenceTranslations[nativeLanguage]}
        </Text>
        <Waveform
          bars={playback.bars}
          progress={playback.playedSeconds / playback.durationSeconds}
          accessibilityLabel={t('listen.waveform', {
            played: playback.playedSeconds,
            total: playback.durationSeconds,
          })}
        />
      </View>
      <PlaybackControls
        speedLabel={t('listen.speed', { speed: playback.speed })}
        isPlaying={playback.isPlaying}
        playLabel={t('listen.play')}
        pauseLabel={t('listen.pause')}
        recordState={recordState}
        recordLabel={t('listen.recordRepeat')}
        onSpeedPress={onSpeedPress}
        onTogglePlay={onTogglePlay}
        onRecord={onRecord}
      />
      <Text variant="caption" className="text-center uppercase">
        {t('listen.phraseCount', {
          current: phrase.current,
          total: phrase.total,
          repeat: repeat.current,
          repeatTotal: repeat.total,
        })}
      </Text>
      <View className="mt-auto">
        <Button onPress={onNextPhrase}>
          <Text>{t('listen.nextPhrase')}</Text>
        </Button>
      </View>
    </Screen>
  );
}

export { ListenScreen };
export type { ListenScreenProps };
