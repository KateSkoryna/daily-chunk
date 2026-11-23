import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { Text } from '../ui/text';

type StepIndicatorProps = {
  steps: string[];
  current: number;
  label: string;
  onSelect?: (step: number) => void;
  className?: string;
};

function StepIndicator({
  steps,
  current,
  label,
  onSelect,
  className,
}: StepIndicatorProps) {
  const partContent = (step: string, index: number) => (
    <Text
      variant="ui"
      className={cn(
        'uppercase',
        index + 1 === current ? 'text-primary' : 'text-muted-foreground',
      )}
    >
      {`${index + 1} · ${step}`}
    </Text>
  );
  const partClasses = (index: number) =>
    cn(
      'min-h-touch flex-1 items-center justify-center',
      index + 1 === current && 'bg-popover',
    );

  if (onSelect) {
    return (
      <View
        accessibilityRole="tablist"
        accessibilityLabel={label}
        className={cn('flex-row border-2 border-border', className)}
      >
        {steps.map((step, index) => (
          <PressableFocus
            key={step}
            accessibilityRole="tab"
            aria-selected={index + 1 === current}
            onPress={() => onSelect(index + 1)}
            className={partClasses(index)}
          >
            {partContent(step, index)}
          </PressableFocus>
        ))}
      </View>
    );
  }

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
        <View key={step} className={partClasses(index)}>
          {partContent(step, index)}
        </View>
      ))}
    </View>
  );
}

export { StepIndicator };
export type { StepIndicatorProps };
