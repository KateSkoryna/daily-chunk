import { View, type ViewProps } from 'react-native';

import { cn } from '../../lib/utils';
import { Scanlines } from '../../theme/Scanlines/Scanlines';

type ScreenProps = ViewProps & { className?: string };

function Screen({ children, className, ...props }: ScreenProps) {
  return (
    <View className="flex-1 bg-background" {...props}>
      <Scanlines />
      <View
        className={cn(
          'flex-1 px-gutter pb-screen-bottom pt-screen-top tablet:px-gutter-tablet desktop:px-gutter-desktop desktop:pt-16',
          className,
        )}
      >
        {children}
      </View>
    </View>
  );
}

export { Screen };
export type { ScreenProps };
