import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/icon-shapes';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { Button } from '../ui/button';
import { Text, TextClassContext } from '../ui/text';

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

type TopBarButtonVariant = 'default' | 'record' | 'tip';

const buttonClasses = {
  default: 'border-input',
  record: 'border-highlight bg-background',
  tip: 'border-ring',
} satisfies Record<TopBarButtonVariant, string>;

const iconClasses = {
  default: 'text-foreground',
  record: 'text-highlight',
  tip: 'text-ring',
} satisfies Record<TopBarButtonVariant, string>;

type TopBarButtonProps = {
  variant?: TopBarButtonVariant;
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  disabled?: boolean;
};

function TopBarButton({
  variant = 'default',
  icon,
  onPress,
  accessibilityLabel,
  disabled = false,
}: TopBarButtonProps) {
  return (
    <TextClassContext.Provider
      value={disabled ? 'text-muted-foreground' : iconClasses[variant]}
    >
      <PressableFocus
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        className={cn(
          'items-center justify-center border-2',
          disabled ? 'border-border' : buttonClasses[variant],
        )}
      >
        <Icon name={icon} decorative />
      </PressableFocus>
    </TextClassContext.Provider>
  );
}

type TopBarActionProps = {
  icon: IconName;
  label: string;
  iconPosition?: 'start' | 'end';
  onPress: () => void;
};

// the icons are drawn inside their box, so the margins pull the drawn edge onto the screen's text edge
function TopBarAction({
  icon,
  label,
  iconPosition = 'start',
  onPress,
}: TopBarActionProps) {
  return (
    <Button
      variant="ghost"
      accessibilityLabel={label}
      onPress={onPress}
      className={cn(
        'px-0',
        iconPosition === 'end'
          ? '-mr-1'
          : icon === 'back'
            ? '-ml-1.5'
            : '-ml-1',
      )}
    >
      {iconPosition === 'start' && <Icon name={icon} decorative />}
      <Text>{label}</Text>
      {iconPosition === 'end' && <Icon name={icon} decorative />}
    </Button>
  );
}

TopBar.Button = TopBarButton;
TopBar.Action = TopBarAction;

export { TopBar };
export type {
  TopBarActionProps,
  TopBarButtonProps,
  TopBarButtonVariant,
  TopBarProps,
};
