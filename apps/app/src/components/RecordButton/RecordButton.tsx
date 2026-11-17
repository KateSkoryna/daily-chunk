import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/icon-shapes';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { TextClassContext } from '../ui/text';

type RecordButtonState = 'idle' | 'recording' | 'done';
type RecordButtonSize = 'default' | 'small';

const stateClasses = {
  idle: 'border-highlight bg-background',
  recording: 'border-highlight bg-highlight',
  done: 'border-success bg-background',
} satisfies Record<RecordButtonState, string>;

const iconColourClasses = {
  idle: 'text-highlight',
  recording: 'text-primary-foreground',
  done: 'text-success',
} satisfies Record<RecordButtonState, string>;

const iconNames = {
  idle: 'mic',
  recording: 'stop',
  done: 'play',
} satisfies Record<RecordButtonState, IconName>;

const sizeClasses = {
  default: 'size-record',
  small: 'size-button',
} satisfies Record<RecordButtonSize, string>;

type RecordButtonProps = {
  state: RecordButtonState;
  onPress: () => void;
  accessibilityLabel: string;
  size?: RecordButtonSize;
};

function RecordButton({
  state,
  onPress,
  accessibilityLabel,
  size = 'default',
}: RecordButtonProps) {
  return (
    <TextClassContext.Provider value={iconColourClasses[state]}>
      <PressableFocus
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        className={cn(
          'items-center justify-center rounded-full border-3',
          sizeClasses[size],
          stateClasses[state],
        )}
      >
        <View pointerEvents="none">
          <Icon name={iconNames[state]} decorative />
        </View>
      </PressableFocus>
    </TextClassContext.Provider>
  );
}

export { RecordButton };
export type { RecordButtonProps, RecordButtonSize, RecordButtonState };
