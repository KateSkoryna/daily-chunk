import { useState } from 'react';
import { Pressable, View, type PressableProps } from 'react-native';

import { hasKeyboardFocus } from '../../lib/has-keyboard-focus';
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
  ...props
}: PressableFocusProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Pressable
      className={cn('min-h-touch min-w-touch outline-none', className)}
      onFocus={(event) => {
        setIsFocused(hasKeyboardFocus(event.target));
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setIsFocused(false);
        onBlur?.(event);
      }}
      {...props}
    >
      {isFocused ? (
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
