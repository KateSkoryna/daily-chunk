import {
  PressableFocus,
  type PressableFocusProps,
} from '@/components/PressableFocus/PressableFocus';
import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { HardShadow } from '@/theme/HardShadow/HardShadow';
import { useState } from 'react';

type ButtonVariant = 'default' | 'secondary' | 'ghost' | 'destructive';

const buttonClasses = {
  default: 'h-button w-full bg-primary',
  secondary: 'h-control border-2 border-ring px-5',
  ghost: 'h-touch px-5',
  destructive: 'h-control bg-destructive px-5',
} satisfies Record<ButtonVariant, string>;

const labelClasses = {
  default: 'font-display text-display-btn uppercase text-primary-foreground',
  secondary: 'font-display text-display-btn-sm uppercase text-ring',
  ghost: 'font-pixel text-label uppercase text-muted-foreground',
  destructive:
    'font-display text-display-btn-sm uppercase text-destructive-foreground',
} satisfies Record<ButtonVariant, string>;

const disabledButtonClasses = 'bg-popover border-popover';
const disabledLabelClasses = 'text-muted-foreground';

type ButtonProps = Omit<PressableFocusProps, 'accessibilityRole'> & {
  variant?: ButtonVariant;
  disabled?: boolean;
};

function Button({
  variant = 'default',
  disabled = false,
  className,
  onPressIn,
  onPressOut,
  children,
  ...props
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const isPrimary = variant === 'default';
  const isPressedDown = isPressed && !disabled;

  const pressable = (
    <PressableFocus
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      className={cn(
        'flex-row items-center justify-center gap-2',
        buttonClasses[variant],
        disabled && disabledButtonClasses,
        className,
      )}
      onPressIn={(event) => {
        setIsPressed(true);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setIsPressed(false);
        onPressOut?.(event);
      }}
      {...props}
    >
      {children}
    </PressableFocus>
  );

  return (
    <TextClassContext.Provider
      value={cn(labelClasses[variant], disabled && disabledLabelClasses)}
    >
      {isPrimary ? (
        <HardShadow
          isShadowHidden={disabled || isPressedDown}
          className={cn(
            'w-full desktop:max-w-button-max',
            isPressedDown && 'translate-x-1 translate-y-1',
          )}
        >
          {pressable}
        </HardShadow>
      ) : (
        pressable
      )}
    </TextClassContext.Provider>
  );
}

export { Button };
export type { ButtonProps, ButtonVariant };
