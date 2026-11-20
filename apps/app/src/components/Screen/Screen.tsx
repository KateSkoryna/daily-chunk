import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  type ViewProps,
} from 'react-native';

import { cn } from '../../lib/utils';
import { Scanlines } from '../../theme/Scanlines/Scanlines';

type ScreenProps = ViewProps & { className?: string };

function Screen({ children, className, ...props }: ScreenProps) {
  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-background"
      {...props}
    >
      <Scanlines />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        contentContainerClassName="grow"
      >
        <View
          className={cn(
            'flex-1 px-gutter pb-screen-bottom pt-screen-top tablet:px-gutter-tablet desktop:px-gutter-desktop desktop:pt-16',
            className,
          )}
        >
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export { Screen };
export type { ScreenProps };
