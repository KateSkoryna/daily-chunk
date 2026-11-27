import {
  areLessonWordsFound,
  wrongTriesLeft,
  type CrosswordEntry,
  type CrosswordPuzzle,
  type CrosswordSession,
} from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import type { TargetLanguage } from '@daily-chunk/languages';
import { Platform, View } from 'react-native';

import { Crossword } from '../../components/Crossword/Crossword';
import { Icon } from '../../components/Icon/Icon';
import { LessonHeader } from '../../components/LessonHeader/LessonHeader';
import { LetterKeyboard } from '../../components/LetterKeyboard/LetterKeyboard';
import { Noun } from '../../components/Noun/Noun';
import { Screen } from '../../components/Screen/Screen';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import { TopBar } from '../../components/TopBar/TopBar';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';
import { crosswordGrid } from '../../lib/crossword-grid';
import { lessonStep } from '../../lib/lesson-step';
import { useIsDesktop } from '../../lib/use-is-desktop';
import { cn } from '../../lib/utils';

type CrosswordScreenProps = {
  lessonNumber: number;
  xp: number;
  puzzle: CrosswordPuzzle;
  session: CrosswordSession;
  keyboardRows: readonly string[];
  targetLanguage: TargetLanguage;
  taskNames: string[];
  onTaskSelect: (step: number) => void;
  onCellPress: (key: string) => void;
  onKeyPress: (letter: string) => void;
  onHint: () => void;
  onCloseClue: () => void;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
};

type FeedbackTone = 'quiet' | 'wrong' | 'right';

const taskColumnShareInGridColumns = 9;

function shareOfRow(share: number) {
  return { flexGrow: share, flexShrink: 1, flexBasis: 0, minWidth: 0 };
}

const toneClasses = {
  quiet: 'text-muted-foreground',
  wrong: 'text-destructive',
  right: 'text-success',
} satisfies Record<FeedbackTone, string>;

function SolvedWord({
  entry,
  targetLanguage,
}: {
  entry: CrosswordEntry;
  targetLanguage: TargetLanguage;
}) {
  return entry.gender ? (
    <Noun gender={entry.gender} targetLanguage={targetLanguage} variant="body">
      {entry.lemma}
    </Noun>
  ) : (
    <Text variant="body">{entry.lemma}</Text>
  );
}

function CrosswordScreen({
  lessonNumber,
  xp,
  puzzle,
  session,
  keyboardRows,
  targetLanguage,
  taskNames,
  onTaskSelect,
  onCellPress,
  onKeyPress,
  onHint,
  onCloseClue,
  onNext,
  onBack,
  onClose,
}: CrosswordScreenProps) {
  const { t } = useTranslation();
  const step = lessonStep('crossword');
  const isDesktop = useIsDesktop();
  const activeIndex = session.activeIndex;
  const activeEntry =
    activeIndex === null ? undefined : puzzle.entries[activeIndex];
  const areWordsFound = areLessonWordsFound(puzzle, session);
  const isTypingOnPhone = Platform.OS !== 'web' && activeEntry !== undefined;
  const solvedEntry =
    session.lastEvent === 'solved' && session.lastSolvedIndex !== null
      ? puzzle.entries[session.lastSolvedIndex]
      : undefined;
  const isHinted =
    activeIndex !== null && session.hintedIndexes.includes(activeIndex);

  function feedback(entry: CrosswordEntry): {
    tone: FeedbackTone;
    text: string;
  } {
    if (session.lastEvent === 'wrong') {
      return {
        tone: 'wrong',
        text: t('crossword.wrong', {
          letter: session.lastWrongLetter,
          count: wrongTriesLeft(puzzle, session),
        }),
      };
    }
    if (session.lastEvent === 'filled') {
      return { tone: 'right', text: t('crossword.filled') };
    }
    if (isHinted) {
      return {
        tone: 'quiet',
        text: t('crossword.hint', { translation: entry.translation }),
      };
    }
    return {
      tone: 'quiet',
      text:
        entry.wordId === null
          ? t('crossword.linkWordInfo')
          : t('crossword.lessonWordInfo', { count: [...entry.answer].length }),
    };
  }

  function clueLabel(entry: CrosswordEntry) {
    const label = t(
      entry.direction === 'down' ? 'crossword.down' : 'crossword.across',
      { number: entry.number },
    );
    return entry.wordId === null ? t('crossword.linkClue', { label }) : label;
  }

  const activeFeedback = activeEntry ? feedback(activeEntry) : undefined;

  return (
    <Screen className="gap-3">
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
          step: step.label,
          task: t('lesson.tasks.crossword'),
        })}
        xpLabel={t('lesson.xpEarned', { count: xp })}
        stepCount={step.count}
        currentStep={step.current}
        stepNames={taskNames}
        onStepSelect={onTaskSelect}
      />
      <SectionLabel>{t('crossword.title')}</SectionLabel>
      <View className="gap-3 desktop:flex-row desktop:items-start desktop:gap-8">
        <View style={isDesktop ? shareOfRow(puzzle.columns) : undefined}>
          <Crossword
            rows={crosswordGrid(puzzle, session)}
            onCellPress={onCellPress}
          />
        </View>
        <View
          className="gap-3"
          style={
            isDesktop ? shareOfRow(taskColumnShareInGridColumns) : undefined
          }
        >
          {activeEntry && activeFeedback ? (
            <View
              className={cn(
                'gap-2 border-2 bg-card p-2',
                activeEntry.wordId === null ? 'border-border' : 'border-ring',
              )}
            >
              <View className="flex-row items-start gap-2">
                <View className="min-w-0 flex-1 gap-1">
                  <Text variant="label-sm">{clueLabel(activeEntry)}</Text>
                  <Text variant="body">{activeEntry.clue}</Text>
                </View>
                <TopBar.Button
                  icon="cross"
                  accessibilityLabel={t('crossword.closeKeyboard')}
                  onPress={onCloseClue}
                />
              </View>
              <View className="flex-row items-end gap-2">
                <View
                  role="status"
                  accessibilityLiveRegion="polite"
                  className="min-h-touch flex-1 flex-row items-end gap-1"
                >
                  {activeFeedback.tone === 'wrong' && (
                    <Icon
                      name="cross"
                      decorative
                      className={toneClasses.wrong}
                    />
                  )}
                  <Text
                    variant="caption"
                    className={cn('flex-1', toneClasses[activeFeedback.tone])}
                  >
                    {activeFeedback.text}
                  </Text>
                </View>
                <TopBar.Button
                  variant="tip"
                  icon="lamp"
                  accessibilityLabel={
                    isHinted ? t('crossword.hintUsed') : t('crossword.showHint')
                  }
                  disabled={isHinted}
                  onPress={onHint}
                />
              </View>
            </View>
          ) : (
            <View
              role="status"
              accessibilityLiveRegion="polite"
              className="flex-row items-center gap-2 border-2 border-dashed border-border p-3"
            >
              {areWordsFound || solvedEntry ? (
                <Icon name="check" decorative className={toneClasses.right} />
              ) : (
                <Icon name="lamp" decorative className="text-ring" />
              )}
              {areWordsFound ? (
                <Text variant="caption" className={toneClasses.right}>
                  {t('crossword.allSolved')}
                </Text>
              ) : solvedEntry ? (
                <View className="flex-1 flex-row flex-wrap items-baseline gap-x-2">
                  <SolvedWord
                    entry={solvedEntry}
                    targetLanguage={targetLanguage}
                  />
                  <Text variant="caption" className={toneClasses.right}>
                    {t('crossword.solved')}
                  </Text>
                </View>
              ) : (
                <Text variant="caption" className="flex-1 text-foreground">
                  {t('crossword.start')}
                </Text>
              )}
            </View>
          )}
          {activeEntry && (
            <LetterKeyboard
              rows={keyboardRows}
              label={t('crossword.keyboard')}
              onKeyPress={onKeyPress}
              onDismiss={onCloseClue}
            />
          )}
        </View>
      </View>
      {isTypingOnPhone ? null : (
        <View className="mt-auto">
          <Button disabled={!areWordsFound} onPress={onNext}>
            <Text>{t('lesson.nextSection')}</Text>
          </Button>
        </View>
      )}
    </Screen>
  );
}

export { CrosswordScreen };
export type { CrosswordScreenProps };
