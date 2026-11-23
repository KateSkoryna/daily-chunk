import type { Word } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import type { GenderRole, NativeLanguage } from '@daily-chunk/languages';
import { Text as NativeText, View } from 'react-native';

import { ArticleChip } from '../../components/ArticleChip/ArticleChip';
import { CardNavigator } from '../../components/CardNavigator/CardNavigator';
import { ItemDots } from '../../components/ItemDots/ItemDots';
import { LessonHeader } from '../../components/LessonHeader/LessonHeader';
import { PartOfSpeechChip } from '../../components/PartOfSpeechChip/PartOfSpeechChip';
import { PlaybackControls } from '../../components/PlaybackControls/PlaybackControls';
import type { RecordButtonState } from '../../components/RecordButton/RecordButton';
import { RecordControls } from '../../components/RecordControls/RecordControls';
import { Notice } from '../../components/Notice/Notice';
import { Screen } from '../../components/Screen/Screen';
import { StepIndicator } from '../../components/StepIndicator/StepIndicator';
import { Waveform } from '../../components/Waveform/Waveform';
import { TopBar } from '../../components/TopBar/TopBar';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';
import { cn } from '../../lib/utils';
import { displayedWord } from '../../lib/displayed-word';
import { splitAroundWord } from '../../lib/split-around-word';

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
  onStepSelect: (step: 1 | 2) => void;
  playback: {
    bars: number[];
    playedSeconds: number;
    durationSeconds: number;
    speed: number;
    isPlaying: boolean;
  };
  recordState: RecordButtonState;
  notice?: string;
  phrase: { current: number; total: number };
  repeat: { current: number; total: number };
  taskNames: string[];
  onTaskSelect: (step: number) => void;
  onBack: () => void;
  onClose: () => void;
  onTogglePlay: () => void;
  onSpeedPress: () => void;
  onRecord: () => void;
  onPlayRecording: () => void;
  isFirstPhrase: boolean;
  isLastPhrase: boolean;
  onPhraseSelect: (phrase: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onNextSection: () => void;
};

function ListenScreen({
  lessonNumber,
  xp,
  word,
  highlightedWord,
  nativeLanguage,
  step,
  onStepSelect,
  playback,
  recordState,
  notice,
  phrase,
  repeat,
  taskNames,
  onTaskSelect,
  onBack,
  onClose,
  onTogglePlay,
  onSpeedPress,
  onRecord,
  onPlayRecording,
  isFirstPhrase,
  isLastPhrase,
  onPhraseSelect,
  onPrevious,
  onNext,
  onNextSection,
}: ListenScreenProps) {
  const { t } = useTranslation();
  const parts = splitAroundWord(word.sentence, highlightedWord);
  const underline = word.gender ? underlineClasses[word.gender] : '';

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
          step: '02',
          task: t('lesson.tasks.listen'),
        })}
        xpLabel={t('lesson.xpEarned', { count: xp })}
        stepCount={6}
        currentStep={2}
        stepNames={taskNames}
        onStepSelect={onTaskSelect}
      />
      <StepIndicator
        steps={[t('listen.stepListen'), t('listen.stepRepeat')]}
        current={step}
        label={t('listen.steps')}
        onSelect={(selected) => onStepSelect(selected === 2 ? 2 : 1)}
      />
      <View>
        <Text variant="caption" className="uppercase">
          {t('listen.phraseCount', {
            current: phrase.current,
            total: phrase.total,
            repeat: repeat.current,
            repeatTotal: repeat.total,
          })}
        </Text>
        <ItemDots
          labels={Array.from({ length: phrase.total }, (_, index) =>
            t('listen.goToPhrase', { number: index + 1 }),
          )}
          current={phrase.current}
          groupLabel={t('listen.phrases')}
          onSelect={onPhraseSelect}
        />
      </View>
      <CardNavigator
        isFirst={isFirstPhrase}
        isLast={isLastPhrase}
        previousLabel={t('listen.previousPhrase')}
        nextLabel={t('listen.nextPhrase')}
        swipeHint={t('listen.swipeHint')}
        onPrevious={onPrevious}
        onNext={onNext}
      >
        <View className="min-h-flashcard gap-3.5 desktop:aspect-square desktop:min-h-0 border-2 border-border bg-card p-6">
          <View className="flex-1 justify-center gap-3.5">
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
              {parts ? (
                <>
                  {parts.before}
                  <NativeText className={cn('underline', underline)}>
                    {highlightedWord}
                  </NativeText>
                  {parts.after}
                </>
              ) : (
                word.sentence
              )}
            </Text>
            <Text variant="body-sm">
              {word.sentenceTranslations[nativeLanguage]}
            </Text>
          </View>
          {step === 1 && (
            <Waveform
              className="h-6"
              bars={playback.bars}
              progress={playback.playedSeconds / playback.durationSeconds}
              accessibilityLabel={t('listen.waveform', {
                played: playback.playedSeconds,
                total: playback.durationSeconds,
              })}
            />
          )}
        </View>
      </CardNavigator>
      {step === 1 ? (
        <PlaybackControls
          speedLabel={t('listen.speed', { speed: playback.speed })}
          isPlaying={playback.isPlaying}
          playLabel={t('listen.play')}
          pauseLabel={t('listen.pause')}
          onSpeedPress={onSpeedPress}
          onTogglePlay={onTogglePlay}
        />
      ) : (
        <RecordControls
          state={recordState}
          recordLabel={t('listen.recordRepeat')}
          stopLabel={t('listen.stopRecording')}
          playRecordingLabel={t('listen.playRecording')}
          recordAgainLabel={t('listen.recordAgain')}
          onRecord={onRecord}
          onPlayRecording={onPlayRecording}
        />
      )}
      {notice && <Notice>{notice}</Notice>}
      <View className="mt-auto">
        <Button onPress={onNextSection}>
          <Text>{t('lesson.nextSection')}</Text>
        </Button>
      </View>
    </Screen>
  );
}

export { ListenScreen };
export type { ListenScreenProps };
