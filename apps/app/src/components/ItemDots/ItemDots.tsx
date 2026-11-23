import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { PressableFocus } from '../PressableFocus/PressableFocus';

type ItemDotsProps = {
  labels: string[];
  current: number;
  groupLabel: string;
  onSelect: (item: number) => void;
  className?: string;
};

function ItemDots({
  labels,
  current,
  groupLabel,
  onSelect,
  className,
}: ItemDotsProps) {
  return (
    <View
      accessibilityRole="toolbar"
      accessibilityLabel={groupLabel}
      className={cn('flex-row flex-wrap justify-center', className)}
    >
      {labels.map((label, index) => (
        <PressableFocus
          key={label}
          accessibilityRole="button"
          accessibilityLabel={label}
          aria-current={index + 1 === current ? 'step' : undefined}
          onPress={() => onSelect(index + 1)}
          className="items-center justify-center"
        >
          <View
            className={cn(
              'size-3 border-2',
              index + 1 === current
                ? 'border-primary bg-primary'
                : 'border-border bg-popover',
            )}
          />
        </PressableFocus>
      ))}
    </View>
  );
}

export { ItemDots };
export type { ItemDotsProps };
