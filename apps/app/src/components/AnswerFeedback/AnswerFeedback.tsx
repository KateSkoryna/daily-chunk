import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { Icon } from '../Icon/Icon';
import { Text, TextClassContext } from '../ui/text';

type AnswerFeedbackStatus = 'correct' | 'almost';

const boxClasses = {
  correct: 'border-success',
  almost: 'border-highlight',
} satisfies Record<AnswerFeedbackStatus, string>;

const tabClasses = {
  correct: 'bg-success',
  almost: 'bg-highlight',
} satisfies Record<AnswerFeedbackStatus, string>;

type AnswerFeedbackProps = {
  status: AnswerFeedbackStatus;
  tabLabel: string;
  children: ReactNode;
};

function AnswerFeedback({ status, tabLabel, children }: AnswerFeedbackProps) {
  return (
    <View
      role="status"
      className={cn(
        'mt-1.5 gap-2.5 border-2 px-3.5 pb-3.5 pt-6',
        boxClasses[status],
      )}
    >
      <TextClassContext.Provider value="text-primary-foreground">
        <View
          className={cn(
            'absolute -top-[0.8125rem] left-3 flex-row items-center gap-1 px-2',
            tabClasses[status],
          )}
        >
          <Icon
            name={status === 'correct' ? 'check' : 'cross'}
            decorative
            className="-my-0.5"
          />
          <Text variant="label-sm">{tabLabel}</Text>
        </View>
      </TextClassContext.Provider>
      {children}
    </View>
  );
}

export { AnswerFeedback };
export type { AnswerFeedbackProps, AnswerFeedbackStatus };
