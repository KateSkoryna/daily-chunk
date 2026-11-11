import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

import { textVariants } from '../components/tokens';

const desktopTextSizes = ['display-xl-desktop', 'display-l-desktop'];

const mergeClassNames = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...textVariants, ...desktopTextSizes] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return mergeClassNames(clsx(inputs));
}
