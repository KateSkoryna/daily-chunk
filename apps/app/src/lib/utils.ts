import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

import { textVariants } from '../components/tokens';

const desktopTextSizes = ['display-xl-desktop', 'display-l-desktop'];

const sizeNames = [
  'touch',
  'control',
  'button',
  'record',
  'tabbar',
  'rail',
  'flashcard',
];

const mergeClassNames = extendTailwindMerge({
  extend: {
    theme: { spacing: sizeNames },
    classGroups: {
      'font-size': [{ text: [...textVariants, ...desktopTextSizes] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return mergeClassNames(clsx(inputs));
}
