import { View } from 'react-native';

import { cn } from '../../lib/utils';
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
        accessibilityRole="progressbar"
        accessibilityLabel={label}
        aria-valuemin={variant === 'progress' ? 0 : 1}
        aria-valuemax={total}
        aria-valuenow={current}
        className="flex-row gap-1"
      >
        {positions.map((position) => (
          <View
            key={position}
            testID={`segment-${statusOf(position, current, variant)}`}
            className={cn(
              'h-2 flex-1 rounded-segment',
              segmentClasses[statusOf(position, current, variant)],
            )}
          />
        ))}
      </View>
    </View>
  );
}

export { LessonStepper };
export type { LessonStepperProps, LessonStepperVariant };
