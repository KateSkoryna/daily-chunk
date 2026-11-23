import type { ReactNode } from 'react';
import { Platform, View } from 'react-native';

import { LessonStepper } from '../LessonStepper/LessonStepper';
import { Text } from '../ui/text';

const headerGap = Platform.OS === 'web' ? 'gap-4' : 'gap-2 desktop:gap-4';

type LessonHeaderProps = {
  left?: ReactNode;
  lessonLabel?: string;
  right?: ReactNode;
  stepLabel: string;
  xpLabel: string;
  stepCount: number;
  currentStep: number;
  stepNames?: string[];
  onStepSelect?: (step: number) => void;
};

function LessonHeader({
  left,
  lessonLabel,
  right,
  stepLabel,
  xpLabel,
  stepCount,
  currentStep,
  stepNames,
  onStepSelect,
}: LessonHeaderProps) {
  return (
    <View className={headerGap}>
      <View className="min-h-touch flex-row items-center gap-2">
        <View className="flex-1 items-start">{left}</View>
        <Text variant="label" className="text-muted-foreground">
          {lessonLabel}
        </Text>
        <View className="flex-1 items-end">{right}</View>
      </View>
      <LessonStepper
        total={stepCount}
        current={currentStep}
        label={stepLabel}
        xpLabel={xpLabel}
        segmentLabels={stepNames}
        onSelect={onStepSelect}
      />
    </View>
  );
}

export { LessonHeader };
export type { LessonHeaderProps };
