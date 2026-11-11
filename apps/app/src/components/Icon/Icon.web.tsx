import { useContext } from 'react';

import { cn } from '../../lib/utils';
import { TextClassContext } from '../ui/text';
import type { IconProps } from './icon-props';
import { iconShapes, iconStrokeWidth, iconViewBox } from './icon-shapes';

function Icon({ name, label, decorative, className }: IconProps) {
  const parentTextClass = useContext(TextClassContext);
  const shape = iconShapes[name];
  const isFilled = 'isFilled' in shape;

  return (
    <svg
      viewBox={iconViewBox}
      className={cn('size-6 shrink-0', parentTextClass, className)}
      fill={isFilled ? 'currentColor' : 'none'}
      stroke={isFilled ? 'none' : 'currentColor'}
      strokeWidth={iconStrokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
    >
      {shape.paths.map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}

export { Icon };
