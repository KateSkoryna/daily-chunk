import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { HardShadow } from '../../theme/HardShadow/HardShadow';
import { Text, TextClassContext } from '../ui/text';

type StatTileVariant = 'primary' | 'success' | 'highlight';

const tileClasses = {
  primary: 'bg-primary',
  success: 'border-2 border-success',
  highlight: 'border-2 border-highlight',
} satisfies Record<StatTileVariant, string>;

const textClasses = {
  primary: 'text-primary-foreground',
  success: 'text-success',
  highlight: 'text-highlight',
} satisfies Record<StatTileVariant, string>;

type StatTileProps = {
  variant: StatTileVariant;
  value: string;
  label: string;
  className?: string;
};

function StatTile({ variant, value, label, className }: StatTileProps) {
  const tile = (
    <TextClassContext.Provider value={textClasses[variant]}>
      <View
        className={cn(
          'min-h-24 flex-1 items-center justify-center gap-1',
          tileClasses[variant],
          className,
        )}
      >
        <Text variant="display-num">{value}</Text>
        <Text variant="label-sm">{label}</Text>
      </View>
    </TextClassContext.Provider>
  );

  return (
    <HardShadow isShadowHidden={variant !== 'primary'} className="flex-1">
      {tile}
    </HardShadow>
  );
}

export { StatTile };
export type { StatTileProps, StatTileVariant };
