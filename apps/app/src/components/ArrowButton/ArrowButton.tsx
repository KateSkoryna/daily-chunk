import { View } from 'react-native';

import { Icon } from '../Icon/Icon';
import { Button } from '../ui/button';

type ArrowButtonProps = {
  direction: 'previous' | 'next';
  label: string;
  disabled?: boolean;
  onPress: () => void;
};

function ArrowButton({
  direction,
  label,
  disabled = false,
  onPress,
}: ArrowButtonProps) {
  return (
    <Button
      variant="secondary"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      className="w-control px-0"
    >
      <View
        style={
          direction === 'next' ? { transform: [{ scaleX: -1 }] } : undefined
        }
      >
        <Icon name="back" decorative />
      </View>
    </Button>
  );
}

export { ArrowButton };
export type { ArrowButtonProps };
