import { useState } from 'react';
import { Pressable, View, type PressableProps } from 'react-native';

import { cn } from '../../lib/utils';

type PressableFocusProps = Omit<PressableProps, 'children'> & {
  children?: React.ReactNode;
  className?: string;
};

function PressableFocus({
  children,
  className,
  onFocus,
  onBlur,
  onPressIn,
  onPressOut,
  ...props
}: PressableFocusProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      className={cn('min-h-touch min-w-touch outline-none', className)}
      onFocus={(event) => {
        setIsFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setIsFocused(false);
        onBlur?.(event);
      }}
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
      {isFocused || isPressed ? (
        <View
          className="absolute -inset-1 border-2 border-ring"
          pointerEvents="none"
        />
      ) : null}
      {children}
    </Pressable>
  );
}

export { PressableFocus };
export type { PressableFocusProps };
