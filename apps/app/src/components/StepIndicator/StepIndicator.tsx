import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { Text } from '../ui/text';

type StepIndicatorProps = {
  steps: string[];
  current: number;
  label: string;
  className?: string;
};

function StepIndicator({
  steps,
  current,
  label,
  className,
}: StepIndicatorProps) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      aria-valuemin={1}
      aria-valuemax={steps.length}
      aria-valuenow={current}
      className={cn('flex-row border-2 border-border', className)}
    >
      {steps.map((step, index) => (
        <View
          key={step}
          className={cn(
            'min-h-touch flex-1 items-center justify-center',
            index + 1 === current && 'bg-popover',
          )}
        >
          <Text
            variant="ui"
            className={cn(
              'uppercase',
              index + 1 === current ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {`${index + 1} · ${step}`}
          </Text>
        </View>
      ))}
    </View>
  );
}

export { StepIndicator };
export type { StepIndicatorProps };
