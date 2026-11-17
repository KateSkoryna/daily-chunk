import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { Icon } from '../Icon/Icon';
import { Text, TextClassContext } from '../ui/text';

type TutorQuoteVariant = 'start' | 'pass' | 'fail';

const boxClasses = {
  start: 'border-primary',
  pass: 'border-success',
  fail: 'border-destructive',
} satisfies Record<TutorQuoteVariant, string>;

const tabClasses = {
  start: 'bg-primary',
  pass: 'bg-success',
  fail: 'bg-destructive',
} satisfies Record<TutorQuoteVariant, string>;

type TutorQuoteProps = {
  variant?: TutorQuoteVariant;
  tabLabel: string;
  children: ReactNode;
  className?: string;
};

function TutorQuote({
  variant = 'start',
  tabLabel,
  children,
  className,
}: TutorQuoteProps) {
  return (
    <View
      className={cn(
        'border-2 px-3.5 pb-3.5 pt-6',
        boxClasses[variant],
        className,
      )}
    >
      <TextClassContext.Provider value="text-primary-foreground">
        <View
          className={cn(
            'absolute -top-[0.8125rem] left-3 flex-row items-center gap-1 px-2',
            tabClasses[variant],
          )}
        >
          {variant === 'pass' && (
            <Icon name="check" decorative className="-my-0.5" />
          )}
          {variant === 'fail' && (
            <Icon name="cross" decorative className="-my-0.5" />
          )}
          <Text variant="label-sm">{tabLabel}</Text>
        </View>
      </TextClassContext.Provider>
      <Text
        variant="label"
        className="normal-case leading-[1.625rem] text-foreground"
      >
        {children}
      </Text>
    </View>
  );
}

export { TutorQuote };
export type { TutorQuoteProps, TutorQuoteVariant };
