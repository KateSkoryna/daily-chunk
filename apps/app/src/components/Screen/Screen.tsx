import { useContext } from 'react';
import { ScrollView, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '../../lib/utils';
import { Scanlines } from '../../theme/Scanlines/Scanlines';
import { KeyboardAvoidingView } from './keyboard-avoiding-interop';
import { ScreenEdgesContext } from './screen-edges';

type ScreenProps = ViewProps & { className?: string };

function Screen({ children, className, ...props }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const edges = useContext(ScreenEdgesContext);

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
          className="flex-1"
          style={{
            paddingTop: edges.top ? insets.top : 0,
            paddingBottom: edges.bottom ? insets.bottom : 0,
          }}
        >
          <View
            className={cn(
              'flex-1 px-gutter pb-screen-bottom pt-screen-top tablet:px-gutter-tablet desktop:px-gutter-desktop desktop:pb-10 desktop:pt-6',
              className,
            )}
          >
            {children}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export { Screen };
export type { ScreenProps };
