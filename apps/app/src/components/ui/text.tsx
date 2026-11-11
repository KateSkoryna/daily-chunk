import { cva } from 'class-variance-authority';
import { createContext, useContext } from 'react';
import {
  Text as NativeText,
  type TextProps as NativeTextProps,
} from 'react-native';

import { cn } from '../../lib/utils';
import type { TextVariant } from '../tokens';

const variantClasses = {
  'display-xl':
    'font-display text-display-xl uppercase desktop:text-display-xl-desktop',
  'display-l':
    'font-display text-display-l uppercase desktop:text-display-l-desktop',
  'display-num': 'font-display text-display-num text-primary',
  'display-btn': 'font-display text-display-btn uppercase',
  'display-btn-sm': 'font-display text-display-btn-sm uppercase',
  label: 'font-pixel text-label uppercase text-highlight',
  'label-sm': 'font-pixel text-label-sm uppercase text-highlight',
  ui: 'font-pixel text-ui',
  caption: 'font-pixel text-caption text-muted-foreground',
  'word-xl': 'font-content-semibold text-word-xl',
  'word-l': 'font-content-semibold text-word-l',
  option: 'font-content-semibold text-option',
  chip: 'font-content-semibold text-chip',
  reading: 'font-content text-reading',
  body: 'font-content text-body',
  'body-sm': 'font-content text-body-sm text-muted-foreground',
} satisfies Record<TextVariant, string>;

const textVariantStyles = cva('text-foreground', {
  variants: { variant: variantClasses },
  defaultVariants: { variant: 'body' },
});

const TextClassContext = createContext<string | undefined>(undefined);

type TextProps = NativeTextProps & {
  variant?: TextVariant;
  className?: string;
};

function Text({ variant = 'body', className, ...props }: TextProps) {
  const parentTextClass = useContext(TextClassContext);

  return (
    <NativeText
      className={cn(textVariantStyles({ variant }), parentTextClass, className)}
      {...props}
    />
  );
}

export { Text, TextClassContext, textVariantStyles };
export type { TextProps };
