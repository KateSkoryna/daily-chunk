import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/icon-shapes';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { TextClassContext } from '../ui/text';

type TopBarProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  className?: string;
};

function TopBar({ left, center, right, className }: TopBarProps) {
  return (
    <View className={cn('flex-row items-center justify-between', className)}>
      <View className="flex-row items-center">{left}</View>
      {center}
      <View className="flex-row items-center">{right}</View>
    </View>
  );
}

type TopBarButtonVariant = 'default' | 'record';

const buttonClasses = {
  default: 'border-input',
  record: 'border-highlight bg-background',
} satisfies Record<TopBarButtonVariant, string>;

const iconClasses = {
  default: 'text-foreground',
  record: 'text-highlight',
} satisfies Record<TopBarButtonVariant, string>;

type TopBarButtonProps = {
  variant?: TopBarButtonVariant;
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
};

function TopBarButton({
  variant = 'default',
  icon,
  onPress,
  accessibilityLabel,
}: TopBarButtonProps) {
  return (
    <TextClassContext.Provider value={iconClasses[variant]}>
      <PressableFocus
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        className={cn(
          'items-center justify-center border-2',
          buttonClasses[variant],
        )}
      >
        <Icon name={icon} decorative />
      </PressableFocus>
    </TextClassContext.Provider>
  );
}

TopBar.Button = TopBarButton;

export { TopBar };
export type { TopBarButtonProps, TopBarButtonVariant, TopBarProps };
