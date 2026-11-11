export const iconViewBox = '0 0 24 24';
export const iconStrokeWidth = 2;
export const iconSizeInRem = 1.5;

export const iconShapes = {
  back: { paths: ['M15 3 L6 12 L15 21'] },
  cross: { paths: ['M4 4 L20 20 M20 4 L4 20'] },
  check: { paths: ['M5 13 L10 18 L19 7'] },
  play: { paths: ['M7 4 L20 12 L7 20 Z'], isFilled: true },
  pause: {
    paths: ['M6 5 H10 V19 H6 Z M14 5 H18 V19 H14 Z'],
    isFilled: true,
  },
  mic: {
    paths: [
      'M9 6 A3 3 0 0 1 15 6 V12 A3 3 0 0 1 9 12 Z',
      'M5 11 a7 7 0 0 0 14 0 M12 18 v3',
    ],
  },
  speaker: {
    paths: ['M4 9 h4 l5 -4 v14 l-5 -4 H4 z', 'M17 9 a4 4 0 0 1 0 6'],
  },
  pencil: { paths: ['M4 20 h4 L19 9 l-4 -4 L4 16 z'] },
  menu: { paths: ['M4 7 H20 M4 12 H20 M4 17 H20'] },
  lock: { paths: ['M5 11 H19 V21 H5 Z', 'M8 11 V7 a4 4 0 0 1 8 0 V11'] },
  home: { paths: ['M3 11 L12 4 L21 11 V20 H3 Z M10 20 V14 H14 V20'] },
  book: {
    paths: [
      'M3 5 H10 a2 2 0 0 1 2 2 V20 a2 2 0 0 0 -2 -2 H3 Z M21 5 H14 a2 2 0 0 0 -2 2 V20 a2 2 0 0 1 2 -2 H21 Z',
    ],
  },
  trophy: {
    paths: [
      'M7 4 H17 V10 a5 5 0 0 1 -10 0 Z M7 6 H4 V8 a3 3 0 0 0 3 3 M17 6 H20 V8 a3 3 0 0 1 -3 3 M12 15 V19 M8 20 H16',
    ],
  },
  chart: { paths: ['M5 20 V13 M11 20 V6 M17 20 V10 M2 21 H22'] },
} satisfies Record<string, { paths: string[]; isFilled?: boolean }>;

export type IconName = keyof typeof iconShapes;

export const iconNames = Object.keys(iconShapes) as IconName[];
