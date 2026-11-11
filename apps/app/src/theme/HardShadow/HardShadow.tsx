import { View, type ViewProps } from 'react-native';

import { cn } from '../../lib/utils';

type HardShadowProps = ViewProps & { className?: string };

function HardShadow({ children, className, ...props }: HardShadowProps) {
  return (
    <View className={cn('relative', className)} {...props}>
      <View
        className="absolute inset-0 translate-x-1 translate-y-1 bg-shadow"
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

export { HardShadow };
export type { HardShadowProps };
