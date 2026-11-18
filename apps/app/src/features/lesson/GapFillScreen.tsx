import { useTranslation } from '@daily-chunk/i18n';
import { View } from 'react-native';

import { GapFill } from '../../components/GapFill/GapFill';
import { Icon } from '../../components/Icon/Icon';
import { LessonHeader } from '../../components/LessonHeader/LessonHeader';
import { OptionGrid } from '../../components/OptionGrid/OptionGrid';
import { Screen } from '../../components/Screen/Screen';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';

type GapFillExercise = {
  before: string;
  after: string;
  answer: string;
  options: string[];
  hint: string;
};

type GapFillScreenProps = {
  lessonNumber: number;
  xp: number;
  article: GapFillExercise;
  word: GapFillExercise;
  articleChoice: string | null;
  wordChoice: string | null;
  isChecked: boolean;
  onArticleChoose: (option: string) => void;
  onWordChoose: (option: string) => void;
  onBack: () => void;
  onCheck: () => void;
  onContinue: () => void;
};

type ExerciseProps = {
  exercise: GapFillExercise;
  choice: string | null;
  isChecked: boolean;
  groupLabel: string;
  columns: 2 | 3;
  onChoose: (option: string) => void;
};

function Exercise({
  exercise,
  choice,
  isChecked,
  groupLabel,
  columns,
  onChoose,
}: ExerciseProps) {
  const { t } = useTranslation();
  const blankStatus = !isChecked
    ? 'open'
    : choice === exercise.answer
      ? 'correct'
      : 'wrong';

  return (
    <GapFill
      before={exercise.before}
      after={exercise.after}
      answer={choice}
      status={blankStatus}
      blankLabel={t('gapFill.blank')}
      hint={exercise.hint}
    >
      <OptionGrid
        options={exercise.options}
        value={choice}
        onSelect={onChoose}
        correctAnswer={isChecked ? exercise.answer : undefined}
        columns={columns}
        accessibilityLabel={groupLabel}
      />
    </GapFill>
  );
}

function GapFillScreen({
  lessonNumber,
  xp,
  article,
  word,
  articleChoice,
  wordChoice,
  isChecked,
  onArticleChoose,
  onWordChoose,
  onBack,
  onCheck,
  onContinue,
}: GapFillScreenProps) {
  const { t } = useTranslation();
  const isAnswered = articleChoice !== null && wordChoice !== null;

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
          step: '05',
          task: t('lesson.tasks.gap-fill'),
        })}
        xpLabel={t('lesson.xpEarned', { count: xp })}
        stepCount={6}
        currentStep={5}
      />
      <View className="gap-2.5">
        <SectionLabel>{t('gapFill.articleSection')}</SectionLabel>
        <Exercise
          exercise={article}
          choice={articleChoice}
          isChecked={isChecked}
          groupLabel={t('gapFill.pickArticle')}
          columns={3}
          onChoose={onArticleChoose}
        />
      </View>
      <View className="gap-2.5 border-t-2 border-border pt-4">
        <SectionLabel>{t('gapFill.wordSection')}</SectionLabel>
        <Exercise
          exercise={word}
          choice={wordChoice}
          isChecked={isChecked}
          groupLabel={t('gapFill.pickWord')}
          columns={2}
          onChoose={onWordChoose}
        />
      </View>
      <View className="mt-auto">
        {isChecked ? (
          <Button onPress={onContinue}>
            <Text>{t('common.next')}</Text>
          </Button>
        ) : (
          <Button disabled={!isAnswered} onPress={onCheck}>
            <Text>{t('gapFill.check')}</Text>
          </Button>
        )}
      </View>
    </Screen>
  );
}

export { GapFillScreen };
export type { GapFillExercise, GapFillScreenProps };
