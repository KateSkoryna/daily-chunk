import {
  getTargetLanguagePack,
  type GenderRole,
  type TargetLanguage,
} from '@daily-chunk/languages';
import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { Text } from '../ui/text';

const chipClasses = {
  masc: 'bg-gender-masc',
  fem: 'bg-gender-fem',
  neut: 'bg-gender-neut',
  plural: 'border-2 border-dashed border-gender-plural',
} satisfies Record<GenderRole, string>;

const labelClasses = {
  masc: 'text-gender-foreground',
  fem: 'text-gender-foreground',
  neut: 'text-gender-foreground',
  plural: 'text-gender-plural',
} satisfies Record<GenderRole, string>;

type ArticleChipProps = {
  gender: GenderRole;
  targetLanguage: TargetLanguage;
  className?: string;
};

function ArticleChip({ gender, targetLanguage, className }: ArticleChipProps) {
  const { articles, pluralTagLabel } = getTargetLanguagePack(targetLanguage);
  const label = gender === 'plural' ? pluralTagLabel : articles[gender];

  return (
    <View
      className={cn(
        'h-8 items-center justify-center self-start px-2.5',
        chipClasses[gender],
        className,
      )}
    >
      <Text variant="chip" className={labelClasses[gender]}>
        {label}
      </Text>
    </View>
  );
}

export { ArticleChip };
export type { ArticleChipProps };
