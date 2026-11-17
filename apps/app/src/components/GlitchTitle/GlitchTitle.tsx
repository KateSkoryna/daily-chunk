import { View } from 'react-native';

import { Text } from '../ui/text';

type GlitchTitleVariant = 'display-xl' | 'display-l';

type GlitchTitleProps = {
  variant?: GlitchTitleVariant;
  children: string;
};

function GlitchTitle({ variant = 'display-xl', children }: GlitchTitleProps) {
  return (
    <View>
      <View
        aria-hidden
        pointerEvents="none"
        className="absolute inset-0 translate-x-glitch select-none"
      >
        <Text variant={variant} className="text-highlight">
          {children}
        </Text>
      </View>
      <View
        aria-hidden
        pointerEvents="none"
        className="absolute inset-0 -translate-x-glitch select-none"
      >
        <Text variant={variant} className="text-ring">
          {children}
        </Text>
      </View>
      <Text variant={variant} accessibilityRole="header">
        {children}
      </Text>
    </View>
  );
}

export { GlitchTitle };
export type { GlitchTitleProps, GlitchTitleVariant };
