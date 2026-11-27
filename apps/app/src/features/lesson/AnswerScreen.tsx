import { useTranslation } from '@daily-chunk/i18n';
import { View } from 'react-native';

import { AnswerFeedback } from '../../components/AnswerFeedback/AnswerFeedback';
import { LessonHeader } from '../../components/LessonHeader/LessonHeader';
import { Notice } from '../../components/Notice/Notice';
import { Screen } from '../../components/Screen/Screen';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import {
  SentenceBuilder,
  type SentenceTile,
} from '../../components/SentenceBuilder/SentenceBuilder';
import { TopBar } from '../../components/TopBar/TopBar';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';
import { lessonStep } from '../../lib/lesson-step';

type AnswerTile = Pick<SentenceTile, 'id' | 'text'>;

type AnswerScreenProps = {
  lessonNumber: number;
  xp: number;
  question: string;
  questionNumber: number;
  questionCount: number;
  placed: AnswerTile[];
  pool: AnswerTile[];
  wrongTileId?: string;
  hintTileId?: string;
  rightAnswer: string;
  translation: string;
  isLast: boolean;
  taskNames: string[];
  onTaskSelect: (step: number) => void;
  onTilePress: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
};

function AnswerScreen({
  lessonNumber,
  xp,
  question,
  questionNumber,
  questionCount,
  placed,
  pool,
  wrongTileId,
  hintTileId,
  rightAnswer,
  translation,
  isLast,
  taskNames,
  onTaskSelect,
  onTilePress,
  onNext,
  onBack,
  onClose,
}: AnswerScreenProps) {
  const { t } = useTranslation();
  const step = lessonStep('answer');
  const isDone = pool.length === 0;
  const markedPool: SentenceTile[] = pool.map((tile) => {
    if (tile.id === hintTileId) {
      return {
        ...tile,
        status: 'hint',
        label: t('answer.hintTile', { word: tile.text }),
      };
    }
    if (tile.id === wrongTileId) {
      return {
        ...tile,
        status: 'wrong',
        label: t('answer.wrongTile', { word: tile.text }),
      };
    }
    return tile;
  });

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
          step: step.label,
          task: t('lesson.tasks.answer'),
        })}
        xpLabel={t('lesson.xpEarned', { count: xp })}
        stepCount={step.count}
        currentStep={step.current}
        stepNames={taskNames}
        onStepSelect={onTaskSelect}
      />
      <View className="gap-2.5">
        <SectionLabel>
          {t('answer.question', {
            current: questionNumber,
            total: questionCount,
          })}
        </SectionLabel>
        <View className="border-2 border-border bg-card p-3.5">
          <Text variant="reading">{question}</Text>
        </View>
      </View>
      <SentenceBuilder
        answer={placed}
        pool={markedPool}
        onAdd={onTilePress}
        answerLabel={t('sentenceBuilder.answer')}
      />
      {hintTileId ? (
        <Notice>{t('answer.hint')}</Notice>
      ) : wrongTileId ? (
        <Notice>{t('answer.notThis')}</Notice>
      ) : null}
      {isDone && (
        <AnswerFeedback status="correct" tabLabel={t('answer.right')}>
          <Text variant="reading">{rightAnswer}</Text>
          <Text variant="caption">{translation}</Text>
        </AnswerFeedback>
      )}
      <View className="mt-auto">
        {isDone && (
          <Button onPress={onNext}>
            <Text>{isLast ? t('lesson.nextSection') : t('answer.next')}</Text>
          </Button>
        )}
      </View>
    </Screen>
  );
}

export { AnswerScreen };
export type { AnswerScreenProps, AnswerTile };
