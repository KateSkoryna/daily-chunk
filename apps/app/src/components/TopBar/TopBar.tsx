import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/icon-shapes';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { TextClassContext } from '../ui/text';

type TopBarProps = {
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
};

function TopBar({ left, right, className }: TopBarProps) {
  return (
    <View className={cn('flex-row items-center justify-between', className)}>
      <View className="flex-row items-center">{left}</View>
      <View className="flex-row items-center">{right}</View>
    </View>
  );
}

type TopBarButtonProps = {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
};

function TopBarButton({
  icon,
  onPress,
  accessibilityLabel,
}: TopBarButtonProps) {
  return (
    <TextClassContext.Provider value="text-foreground">
      <PressableFocus
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        className="items-center justify-center border-2 border-input"
      >
        <Icon name={icon} decorative />
      </PressableFocus>
    </TextClassContext.Provider>
  );
}

TopBar.Button = TopBarButton;

export { TopBar };
export type { TopBarButtonProps, TopBarProps };
