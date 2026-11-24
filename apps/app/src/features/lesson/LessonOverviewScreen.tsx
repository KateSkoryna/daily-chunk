import { lessonTaskTypes, type LessonTaskType } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import type { NativeLanguage, TargetLanguage } from '@daily-chunk/languages';
import { Platform, View } from 'react-native';

import { GlitchTitle } from '../../components/GlitchTitle/GlitchTitle';
import { Icon } from '../../components/Icon/Icon';
import { ListGroup } from '../../components/ListGroup/ListGroup';
import { Screen } from '../../components/Screen/Screen';
import { TopBar } from '../../components/TopBar/TopBar';
import { Button } from '../../components/ui/button';
import { Text, TextClassContext } from '../../components/ui/text';

const isWeb = Platform.OS === 'web';

type LessonOverviewScreenProps = {
  lessonNumber: number;
  completedTasks: LessonTaskType[];
  earnedXp: Partial<Record<LessonTaskType, number>>;
  nativeLanguage: NativeLanguage;
  targetLanguage: TargetLanguage;
  onOpenTask: (task: LessonTaskType) => void;
  onStart: () => void;
  onClose: () => void;
};

function LessonOverviewScreen({
  lessonNumber,
  completedTasks,
  earnedXp,
  nativeLanguage,
  targetLanguage,
  onOpenTask,
  onStart,
  onClose,
}: LessonOverviewScreenProps) {
  const { t } = useTranslation();

  return (
    <Screen className="gap-4">
      <TopBar
        right={
          <TopBar.Action
            icon="cross"
            iconPosition="end"
            label={t('lesson.quit')}
            onPress={onClose}
          />
        }
      />
      <GlitchTitle variant="display-l">
        {t('lesson.title', { number: lessonNumber })}
      </GlitchTitle>
      <Text variant="body-sm">{t('lesson.overviewIntro')}</Text>
      <ListGroup>
        {lessonTaskTypes.map((task, index) => {
          const isDone = completedTasks.includes(task);
          const name = t(`lesson.tasks.${task}`, {
            from: nativeLanguage.toUpperCase(),
            to: targetLanguage.toUpperCase(),
          });

          const xpLabel =
            isDone && earnedXp[task] ? (
              <Text variant="ui" className="text-success">
                {t('lesson.xpEarned', { count: earnedXp[task] })}
              </Text>
            ) : null;

          return (
            <ListGroup.Row
              key={task}
              right={isWeb ? xpLabel : undefined}
              onPress={() => onOpenTask(task)}
              left={
                <View
                  className={
                    isDone
                      ? 'size-9 items-center justify-center border-2 border-success'
                      : 'size-9 items-center justify-center border-2 border-border'
                  }
                >
                  {isDone ? (
                    <TextClassContext.Provider value="text-success">
                      <Icon name="check" decorative />
                    </TextClassContext.Provider>
                  ) : (
                    <Text variant="chip">{index + 1}</Text>
                  )}
                </View>
              }
            >
              <View className="flex-row items-baseline justify-between gap-2">
                <Text variant="option" className="min-w-0 flex-1">
                  {name}
                </Text>
                {!isWeb && xpLabel}
              </View>
              <Text variant="body-sm">
                {isDone
                  ? t('lesson.taskDone')
                  : t(`lesson.taskDescriptions.${task}`)}
              </Text>
            </ListGroup.Row>
          );
        })}
      </ListGroup>
      <View className="mt-auto">
        <Button onPress={onStart}>
          <Text>{t('lesson.overviewStart')}</Text>
        </Button>
      </View>
    </Screen>
  );
}

export { LessonOverviewScreen };
export type { LessonOverviewScreenProps };
