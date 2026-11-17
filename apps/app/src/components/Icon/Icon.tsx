import { rem } from 'nativewind';
import { useContext } from 'react';

import { cn } from '../../lib/utils';
import { TextClassContext } from '../ui/text';
import type { IconProps } from './icon-props';
import { Path, Svg } from './svg-interop';
import {
  iconShapes,
  iconSizeInRem,
  iconStrokeWidth,
  iconViewBox,
} from './icon-shapes';

function Icon({ name, label, decorative, className }: IconProps) {
  const parentTextClass = useContext(TextClassContext);
  const shape = iconShapes[name];
  const isFilled = 'isFilled' in shape;
  const size = iconSizeInRem * rem.get();

  return (
    <Svg
      width={size}
      height={size}
      viewBox={iconViewBox}
      className={cn(parentTextClass, className)}
      accessible={!decorative}
      accessibilityRole={decorative ? undefined : 'image'}
      accessibilityLabel={decorative ? undefined : label}
    >
      {shape.paths.map((path) => (
        <Path
          key={path}
          d={path}
          fill={isFilled ? 'currentColor' : 'none'}
          stroke={isFilled ? 'none' : 'currentColor'}
          strokeWidth={iconStrokeWidth}
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      ))}
    </Svg>
  );
}

export { Icon };
