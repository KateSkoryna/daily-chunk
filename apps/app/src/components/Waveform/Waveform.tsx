import { View } from 'react-native';

import { cn } from '../../lib/utils';

type WaveformProps = {
  bars: number[];
  progress: number;
  accessibilityLabel: string;
  className?: string;
};

function Waveform({
  bars,
  progress,
  accessibilityLabel,
  className,
}: WaveformProps) {
  const playedBars = Math.floor(
    bars.length * Math.min(Math.max(progress, 0), 1),
  );

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      className={cn('h-12 flex-row items-center gap-1', className)}
    >
      {bars.map((height, index) => (
        <View
          key={index}
          testID={index < playedBars ? 'bar-played' : 'bar-unplayed'}
          className={cn('flex-1', index < playedBars ? 'bg-ring' : 'bg-border')}
          style={{ height: `${height}%` }}
        />
      ))}
    </View>
  );
}

export { Waveform };
export type { WaveformProps };
