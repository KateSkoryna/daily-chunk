import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { Text } from '../ui/text';

type BlankStatus = 'open' | 'correct' | 'wrong';

const blankClasses = {
  open: 'border-field',
  correct: 'border-success',
  wrong: 'border-highlight',
} satisfies Record<BlankStatus, string>;

const blankTextClasses = {
  open: 'text-foreground',
  correct: 'text-success',
  wrong: 'text-highlight',
} satisfies Record<BlankStatus, string>;

type GapFillProps = {
  before: string;
  after: string;
  answer: string | null;
  status?: BlankStatus;
  blankLabel: string;
  hint?: string;
  children?: ReactNode;
};

function wordsOf(sentence: string) {
  return sentence.split(' ').filter(Boolean);
}

function GapFill({
  before,
  after,
  answer,
  status = 'open',
  blankLabel,
  hint,
  children,
}: GapFillProps) {
  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap items-baseline gap-1">
        {wordsOf(before).map((word, index) => (
          <Text key={`before-${index}`}>{word}</Text>
        ))}
        <View
          testID="gap-fill-blank"
          role="group"
          accessibilityLabel={answer ?? blankLabel}
          className={cn(
            'min-w-[6.875rem] items-center border-b-3',
            blankClasses[status],
          )}
        >
          <Text variant="option" className={blankTextClasses[status]}>
            {answer ?? ' '}
          </Text>
        </View>
        {wordsOf(after).map((word, index) => (
          <Text key={`after-${index}`}>{word}</Text>
        ))}
      </View>
      {hint ? <Text variant="body-sm">{hint}</Text> : null}
      {children}
    </View>
  );
}

export { GapFill };
export type { BlankStatus, GapFillProps };
