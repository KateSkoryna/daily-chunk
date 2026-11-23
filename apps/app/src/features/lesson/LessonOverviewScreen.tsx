import { lessonTaskTypes, type LessonTaskType } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import type { NativeLanguage, TargetLanguage } from '@daily-chunk/languages';
import { View } from 'react-native';

import { GlitchTitle } from '../../components/GlitchTitle/GlitchTitle';
import { Icon } from '../../components/Icon/Icon';
import { ListGroup } from '../../components/ListGroup/ListGroup';
import { Screen } from '../../components/Screen/Screen';
import { TopBar } from '../../components/TopBar/TopBar';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';

type LessonOverviewScreenProps = {
  lessonNumber: number;
  completedTasks: LessonTaskType[];
  nativeLanguage: NativeLanguage;
  targetLanguage: TargetLanguage;
  onOpenTask: (task: LessonTaskType) => void;
  onStart: () => void;
  onClose: () => void;
};

function LessonOverviewScreen({
  lessonNumber,
  completedTasks,
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

          return (
            <ListGroup.Row
              key={task}
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
                    <Icon name="check" decorative />
                  ) : (
                    <Text variant="chip">{index + 1}</Text>
                  )}
                </View>
              }
            >
              <Text variant="option">{name}</Text>
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
