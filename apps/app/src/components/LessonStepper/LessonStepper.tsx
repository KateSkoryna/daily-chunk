import { Fragment } from 'react';
import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { Text } from '../ui/text';

type SegmentStatus = 'done' | 'current' | 'upcoming';

const segmentClasses = {
  done: 'bg-success',
  current: 'bg-primary',
  upcoming: 'bg-popover',
} satisfies Record<SegmentStatus, string>;

type LessonStepperVariant = 'lesson' | 'progress';

type LessonStepperProps = {
  variant?: LessonStepperVariant;
  total: number;
  current: number;
  label: string;
  xpLabel: string;
  segmentLabels?: string[];
  onSelect?: (position: number) => void;
  className?: string;
};

function statusOf(
  position: number,
  current: number,
  variant: LessonStepperVariant,
): SegmentStatus {
  if (variant === 'progress') return position <= current ? 'done' : 'upcoming';
  if (position < current) return 'done';
  if (position === current) return 'current';
  return 'upcoming';
}

function LessonStepper({
  variant = 'lesson',
  total,
  current,
  label,
  xpLabel,
  segmentLabels,
  onSelect,
  className,
}: LessonStepperProps) {
  const positions = Array.from({ length: total }, (_, index) => index + 1);

  return (
    <View className={cn('gap-2', className)}>
      <View className="flex-row justify-between">
        <Text variant="label-sm" className="flex-1">
          {label}
        </Text>
        <Text variant="label-sm" className="text-muted-foreground">
          {xpLabel}
        </Text>
      </View>
      <View
        accessibilityRole={onSelect ? 'toolbar' : 'progressbar'}
        accessibilityLabel={label}
        aria-valuemin={onSelect ? undefined : variant === 'progress' ? 0 : 1}
        aria-valuemax={onSelect ? undefined : total}
        aria-valuenow={onSelect ? undefined : current}
        className="flex-row gap-1"
      >
        {positions.map((position) => {
          const segment = (
            <View
              testID={`segment-${statusOf(position, current, variant)}`}
              className={cn(
                'h-2 rounded-segment',
                !onSelect && 'flex-1',
                segmentClasses[statusOf(position, current, variant)],
              )}
            />
          );

          if (!onSelect) return <Fragment key={position}>{segment}</Fragment>;

          return (
            <PressableFocus
              key={position}
              accessibilityRole="button"
              accessibilityLabel={segmentLabels?.[position - 1]}
              aria-current={position === current ? 'step' : undefined}
              onPress={() => onSelect(position)}
              className="-my-5 flex-1 justify-center"
            >
              {segment}
            </PressableFocus>
          );
        })}
      </View>
    </View>
  );
}

export { LessonStepper };
export type { LessonStepperProps, LessonStepperVariant };
