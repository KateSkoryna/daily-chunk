import type { StoryQuestion } from '@daily-chunk/core';
import { quizCorrectNeeded } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import { View } from 'react-native';

import { LessonHeader } from '../../components/LessonHeader/LessonHeader';
import { Notice } from '../../components/Notice/Notice';
import { OptionGrid } from '../../components/OptionGrid/OptionGrid';
import { Screen } from '../../components/Screen/Screen';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import { TopBar } from '../../components/TopBar/TopBar';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';

type ReadQuizScreenProps = {
  lessonNumber: number;
  xp: number;
  questions: StoryQuestion[];
  answers: (string | null)[];
  questionIndex: number;
  taskNames: string[];
  onTaskSelect: (step: number) => void;
  onAnswer: (option: string) => void;
  onNextQuestion: () => void;
  onBack: () => void;
  onClose: () => void;
  onContinue: () => void;
};

function ReadQuizScreen({
  lessonNumber,
  xp,
  questions,
  answers,
  questionIndex,
  taskNames,
  onTaskSelect,
  onAnswer,
  onNextQuestion,
  onBack,
  onClose,
  onContinue,
}: ReadQuizScreenProps) {
  const { t } = useTranslation();
  const question = questions[questionIndex];
  const answer = answers[questionIndex] ?? null;
  const isAnswered = answer !== null;
  const isLast = questionIndex === questions.length - 1;
  const correct = questions.filter(
    (candidate, index) => answers[index] === candidate.answer,
  ).length;
  const total = questions.length;
  const needed = quizCorrectNeeded(total);

  if (!question) return null;

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
          step: '03',
          task: t('lesson.tasks.read'),
        })}
        xpLabel={t('lesson.xpEarned', { count: xp })}
        stepCount={6}
        currentStep={3}
        stepNames={taskNames}
        onStepSelect={onTaskSelect}
      />
      <View className="gap-2.5">
        <SectionLabel>
          {`${t('quiz.title')} · ${t('quiz.question', {
            current: questionIndex + 1,
            total,
          })}`}
        </SectionLabel>
        <Text variant="reading">{question.question}</Text>
        <OptionGrid
          key={questionIndex}
          options={question.options}
          value={answer}
          onSelect={onAnswer}
          correctAnswer={isAnswered ? question.answer : undefined}
          columns={1}
          accessibilityLabel={t('quiz.answers')}
        />
      </View>
      <View className="mt-auto gap-2.5">
        {isAnswered && isLast && (
          <Notice>
            {correct >= needed
              ? t('quiz.passed', { correct, total })
              : t('quiz.failed', { correct, total, needed })}
          </Notice>
        )}
        {isAnswered && (
          <Button onPress={isLast ? onContinue : onNextQuestion}>
            <Text>{isLast ? t('lesson.nextSection') : t('quiz.next')}</Text>
          </Button>
        )}
      </View>
    </Screen>
  );
}

export { ReadQuizScreen };
export type { ReadQuizScreenProps };
