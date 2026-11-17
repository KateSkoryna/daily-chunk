import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Path, Svg } from '../Icon/svg-interop';

const shadowStar =
  'M13 2 L15.94 8.95 L23.46 9.6 L17.76 14.55 L19.47 21.9 L13 18 L6.53 21.9 L8.24 14.55 L2.54 9.6 L10.06 8.95 Z';
const star =
  'M12 1 L14.94 7.95 L22.46 8.6 L16.76 13.55 L18.47 20.9 L12 17 L5.53 20.9 L7.24 13.55 L1.54 8.6 L9.06 7.95 Z';
const tipPositions = [
  [12, 1.2],
  [22.3, 8.6],
  [18.4, 20.8],
  [5.6, 20.8],
  [1.7, 8.6],
] as const;
const tips = tipPositions
  .map(
    ([x, y]) => `M${x - 1.1} ${y} a1.1 1.1 0 1 0 2.2 0 a1.1 1.1 0 1 0 -2.2 0 Z`,
  )
  .join(' ');
const disc = 'M7.4 12.4 a4.6 4.6 0 1 0 9.2 0 a4.6 4.6 0 1 0 -9.2 0 Z';
const letters =
  'M8.8 10.2 V14.6 H10.3 L11.5 13.4 V11.4 L10.3 10.2 Z M15.9 10.8 L15.1 10.2 H13.9 L12.9 11.2 V13.6 L13.9 14.6 H15.1 L15.9 14';

type LogoBadgeProps = {
  accessibilityLabel: string;
};

function Layer({
  colourClass,
  children,
}: {
  colourClass: string;
  children: ReactNode;
}) {
  return (
    <Svg
      viewBox="0 0 24 24"
      className={`absolute inset-0 size-full ${colourClass}`}
    >
      {children}
    </Svg>
  );
}

function LogoBadge({ accessibilityLabel }: LogoBadgeProps) {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      className="size-10"
    >
      <Layer colourClass="text-highlight">
        <Path d={shadowStar} fill="currentColor" />
      </Layer>
      <Layer colourClass="text-primary">
        <Path d={`${star} ${tips}`} fill="currentColor" />
      </Layer>
      <Layer colourClass="text-background">
        <Path d={disc} fill="currentColor" />
      </Layer>
      <Layer colourClass="text-foreground">
        <Path
          d={letters}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinejoin="miter"
        />
      </Layer>
    </View>
  );
}

export { LogoBadge };
export type { LogoBadgeProps };
