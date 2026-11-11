import type { IconName } from './icon-shapes';

type IconAccessibility =
  { label: string; decorative?: never } | { decorative: true; label?: never };

export type IconProps = {
  name: IconName;
  className?: string;
} & IconAccessibility;
