import { View } from 'react-native';

import { Icon } from '../Icon/Icon';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { Text, TextClassContext } from '../ui/text';

type PlaybackControlsProps = {
  speedLabel: string;
  isPlaying: boolean;
  playLabel: string;
  pauseLabel: string;
  onSpeedPress: () => void;
  onTogglePlay: () => void;
};

function PlaybackControls({
  speedLabel,
  isPlaying,
  playLabel,
  pauseLabel,
  onSpeedPress,
  onTogglePlay,
}: PlaybackControlsProps) {
  return (
    <View className="flex-row items-center justify-center gap-6">
      <PressableFocus
        accessibilityRole="button"
        onPress={onSpeedPress}
        className="h-control items-center justify-center border-2 border-input px-4"
      >
        <Text variant="ui">{speedLabel}</Text>
      </PressableFocus>
      <TextClassContext.Provider value="text-primary-foreground">
        <PressableFocus
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? pauseLabel : playLabel}
          onPress={onTogglePlay}
          className="size-record items-center justify-center rounded-full border-3 border-ring bg-ring"
        >
          <Icon name={isPlaying ? 'pause' : 'play'} decorative />
        </PressableFocus>
      </TextClassContext.Provider>
    </View>
  );
}

export { PlaybackControls };
export type { PlaybackControlsProps };
