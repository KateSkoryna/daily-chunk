import { useTranslation } from '@daily-chunk/i18n';
import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { Icon } from '../Icon/Icon';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { Text } from '../ui/text';

type OptionStatus = 'idle' | 'selected' | 'correct' | 'wrong' | 'revealed';

const optionClasses = {
  idle: 'border-input bg-muted',
  selected: 'border-field bg-muted',
  correct: 'border-success bg-muted',
  wrong: 'border-highlight bg-muted',
  revealed: 'border-dashed border-success bg-muted',
} satisfies Record<OptionStatus, string>;

const labelClasses = {
  idle: 'text-foreground',
  selected: 'text-foreground',
  correct: 'text-success',
  wrong: 'text-highlight',
  revealed: 'text-success',
} satisfies Record<OptionStatus, string>;

function statusOf(
  option: string,
  value: string | null,
  correctAnswer: string | undefined,
): OptionStatus {
  if (correctAnswer === undefined) {
    return option === value ? 'selected' : 'idle';
  }
  if (option === correctAnswer) {
    return value === correctAnswer ? 'correct' : 'revealed';
  }
  return option === value ? 'wrong' : 'idle';
}

type OptionGridProps = {
  options: string[];
  value: string | null;
  onSelect: (option: string) => void;
  correctAnswer?: string;
  columns?: 1 | 2 | 3;
  accessibilityLabel: string;
};

function OptionGrid({
  options,
  value,
  onSelect,
  correctAnswer,
  columns = 2,
  accessibilityLabel,
}: OptionGridProps) {
  const { t } = useTranslation();
  const isAnswered = correctAnswer !== undefined;

  const rows = Array.from(
    { length: Math.ceil(options.length / columns) },
    (_, index) => options.slice(index * columns, (index + 1) * columns),
  );

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      className="gap-2"
    >
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row gap-2">
          {row.map((option) => {
            const status = statusOf(option, value, correctAnswer);

            return (
              <PressableFocus
                key={option}
                accessibilityRole="radio"
                aria-checked={option === value}
                disabled={isAnswered}
                onPress={() => onSelect(option)}
                className={cn(
                  'h-control flex-1 flex-row items-center justify-center gap-1 border-2',
                  optionClasses[status],
                )}
              >
                {status === 'correct' ? (
                  <Icon
                    name="check"
                    label={t('answer.correct')}
                    className={labelClasses[status]}
                  />
                ) : null}
                {status === 'wrong' ? (
                  <Icon
                    name="cross"
                    label={t('answer.wrong')}
                    className={labelClasses[status]}
                  />
                ) : null}
                <Text variant="option" className={labelClasses[status]}>
                  {option}
                </Text>
              </PressableFocus>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export { OptionGrid };
export type { OptionGridProps };
