import { View, type ViewProps } from 'react-native';

import { cn } from '../../lib/utils';

type HardShadowProps = ViewProps & {
  className?: string;
  isShadowHidden?: boolean;
};

function HardShadow({
  children,
  className,
  isShadowHidden = false,
  ...props
}: HardShadowProps) {
  return (
    <View className={cn('relative', className)} {...props}>
      {isShadowHidden ? null : (
        <View
          className="absolute inset-0 translate-x-1 translate-y-1 bg-shadow"
          pointerEvents="none"
        />
      )}
      {children}
    </View>
  );
}

export { HardShadow };
export type { HardShadowProps };
