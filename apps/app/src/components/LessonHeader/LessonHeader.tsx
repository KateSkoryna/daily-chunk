import type { ReactNode } from 'react';
import { View } from 'react-native';

import { LessonStepper } from '../LessonStepper/LessonStepper';
import { TopBar } from '../TopBar/TopBar';
import { Text } from '../ui/text';

type LessonHeaderProps = {
  left: ReactNode;
  lessonLabel: string;
  stepLabel: string;
  xpLabel: string;
  stepCount: number;
  currentStep: number;
};

function LessonHeader({
  left,
  lessonLabel,
  stepLabel,
  xpLabel,
  stepCount,
  currentStep,
}: LessonHeaderProps) {
  return (
    <View className="gap-4">
      <TopBar
        left={left}
        right={
          <Text variant="ui" className="uppercase text-muted-foreground">
            {lessonLabel}
          </Text>
        }
      />
      <LessonStepper
        total={stepCount}
        current={currentStep}
        label={stepLabel}
        xpLabel={xpLabel}
      />
    </View>
  );
}

export { LessonHeader };
export type { LessonHeaderProps };
