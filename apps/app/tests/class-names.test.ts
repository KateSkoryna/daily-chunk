import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

import { cn } from '../src/lib/utils';

const require = createRequire(import.meta.url);
const { theme } = require('../tailwind.config.js');
const textSizeNames = Object.keys(theme.extend.fontSize);

describe('cn', () => {
  it('keeps a text size and a text colour together', () => {
    expect(cn('text-label text-highlight')).toBe('text-label text-highlight');
  });

  it('keeps the desktop text size next to the base text size', () => {
    expect(cn('text-display-xl desktop:text-display-xl-desktop')).toBe(
      'text-display-xl desktop:text-display-xl-desktop',
    );
  });

  it('lets a later colour replace an earlier colour', () => {
    expect(cn('text-foreground text-primary')).toBe('text-primary');
  });

  it('lets a later font family replace an earlier font family', () => {
    expect(cn('font-display font-pixel')).toBe('font-pixel');
  });

  it('lets a later text size replace an earlier text size', () => {
    expect(cn('text-body text-label')).toBe('text-label');
  });

  it.each(textSizeNames)(
    'keeps text-%s next to a text colour',
    (textSizeName) => {
      const classNames = `text-${textSizeName} text-foreground`;
      expect(cn(classNames)).toBe(classNames);
    },
  );
});
