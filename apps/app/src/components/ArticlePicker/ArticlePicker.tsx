import { useTranslation } from '@daily-chunk/i18n';
import {
  getTargetLanguagePack,
  type PickerGender,
  type TargetLanguage,
} from '@daily-chunk/languages';
import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { Icon } from '../Icon/Icon';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { Text } from '../ui/text';

type OptionStatus = 'idle' | 'selected' | 'correct' | 'wrong' | 'revealed';

const genderFillClasses = {
  masc: 'border-gender-masc bg-gender-masc',
  fem: 'border-gender-fem bg-gender-fem',
  neut: 'border-gender-neut bg-gender-neut',
} satisfies Record<PickerGender, string>;

const statusClasses = {
  idle: 'border-input bg-muted',
  selected: '',
  correct: '',
  wrong: 'border-highlight bg-muted',
  revealed: '',
} satisfies Record<OptionStatus, string>;

const filledStatuses: OptionStatus[] = ['selected', 'correct', 'revealed'];

function statusOf(
  gender: PickerGender,
  value: PickerGender | null,
  correctAnswer: PickerGender | undefined,
): OptionStatus {
  if (correctAnswer === undefined) {
    return gender === value ? 'selected' : 'idle';
  }
  if (gender === correctAnswer) {
    return value === correctAnswer ? 'correct' : 'revealed';
  }
  return gender === value ? 'wrong' : 'idle';
}

type ArticlePickerProps = {
  targetLanguage: TargetLanguage;
  value: PickerGender | null;
  onSelect: (gender: PickerGender) => void;
  correctAnswer?: PickerGender;
  accessibilityLabel: string;
};

function ArticlePicker({
  targetLanguage,
  value,
  onSelect,
  correctAnswer,
  accessibilityLabel,
}: ArticlePickerProps) {
  const { t } = useTranslation();
  const { articles, pickerGenders } = getTargetLanguagePack(targetLanguage);
  const isAnswered = correctAnswer !== undefined;

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      className="flex-row gap-2"
    >
      {pickerGenders.map((gender) => {
        const status = statusOf(gender, value, correctAnswer);
        const isFilled = filledStatuses.includes(status);

        return (
          <PressableFocus
            key={gender}
            accessibilityRole="radio"
            aria-checked={gender === value}
            disabled={isAnswered}
            onPress={() => onSelect(gender)}
            className={cn(
              'h-touch min-w-[4.5rem] flex-1 flex-row items-center justify-center gap-1 border-2',
              statusClasses[status],
              isFilled && genderFillClasses[gender],
              status === 'correct' && 'border-success',
            )}
          >
            {status === 'correct' ? (
              <Icon
                name="check"
                label={t('answer.correct')}
                className="text-gender-foreground"
              />
            ) : null}
            {status === 'wrong' ? (
              <Icon
                name="cross"
                label={t('answer.wrong')}
                className="text-highlight"
              />
            ) : null}
            <Text
              variant="chip"
              className={
                status === 'wrong'
                  ? 'text-highlight'
                  : isFilled
                    ? 'text-gender-foreground'
                    : 'text-foreground'
              }
            >
              {articles[gender]}
            </Text>
          </PressableFocus>
        );
      })}
    </View>
  );
}

export { ArticlePicker };
export type { ArticlePickerProps };
