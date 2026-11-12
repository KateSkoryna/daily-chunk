import {
  PressableFocus,
  type PressableFocusProps,
} from '@/components/PressableFocus/PressableFocus';
import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { HardShadow } from '@/theme/HardShadow/HardShadow';
import { cva } from 'class-variance-authority';
import { useState } from 'react';

type ButtonVariant = 'default' | 'secondary' | 'ghost' | 'destructive';

const buttonVariants = cva('flex-row items-center justify-center gap-2', {
  variants: {
    variant: {
      default: 'h-button w-full bg-primary',
      secondary: 'h-control border-2 border-ring px-5',
      ghost: 'h-touch px-5',
      destructive: 'h-control bg-destructive px-5',
    },
    isDisabled: { true: '', false: '' },
  },
  compoundVariants: [
    { isDisabled: true, className: 'bg-popover' },
    { variant: 'secondary', isDisabled: true, className: 'border-popover' },
  ],
  defaultVariants: { variant: 'default', isDisabled: false },
});

const buttonTextVariants = cva('', {
  variants: {
    variant: {
      default:
        'font-display text-display-btn uppercase text-primary-foreground',
      secondary: 'font-display text-display-btn-sm uppercase text-ring',
      ghost: 'font-pixel text-label uppercase text-muted-foreground',
      destructive:
        'font-display text-display-btn-sm uppercase text-destructive-foreground',
    },
    isDisabled: { true: '', false: '' },
  },
  compoundVariants: [{ isDisabled: true, className: 'text-muted-foreground' }],
  defaultVariants: { variant: 'default', isDisabled: false },
});

type ButtonProps = Omit<PressableFocusProps, 'accessibilityRole'> & {
  variant?: ButtonVariant;
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
  const isDisabled = Boolean(disabled);
  const isPressedDown = isPressed && !isDisabled;

  const pressable = (
    <PressableFocus
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      className={cn(buttonVariants({ variant, isDisabled }), className)}
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
      value={buttonTextVariants({ variant, isDisabled })}
    >
      {variant === 'default' ? (
        <HardShadow
          isShadowHidden={isDisabled || isPressedDown}
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

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps, ButtonVariant };
