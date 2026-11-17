import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { Text } from '../ui/text';

type NoticeProps = {
  children: string;
  className?: string;
};

function Notice({ children, className }: NoticeProps) {
  return (
    <View
      role="status"
      accessibilityLiveRegion="polite"
      className={cn(
        'border-2 border-dashed border-gender-plural px-3 py-2.5',
        className,
      )}
    >
      <Text variant="label-sm" className="text-gender-plural">
        {children}
      </Text>
    </View>
  );
}

export { Notice };
export type { NoticeProps };
