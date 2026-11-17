import type { TextProps } from 'react-native';

import { Text } from '../ui/text';

function SectionLabel(props: Omit<TextProps, 'accessibilityRole'>) {
  return <Text variant="label" accessibilityRole="header" {...props} />;
}

export { SectionLabel };
