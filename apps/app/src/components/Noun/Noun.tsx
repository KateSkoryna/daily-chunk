import {
  getTargetLanguagePack,
  type GenderRole,
  type TargetLanguage,
} from '@daily-chunk/languages';
import { Text as NativeText } from 'react-native';

import type { TextVariant } from '../tokens';
import { Text } from '../ui/text';

const articleClasses = {
  masc: 'text-gender-masc',
  fem: 'text-gender-fem',
  neut: 'text-gender-neut',
  plural: 'text-gender-plural',
} satisfies Record<GenderRole, string>;

type NounProps = {
  gender: GenderRole;
  targetLanguage: TargetLanguage;
  variant?: TextVariant;
  children: string;
};

function Noun({
  gender,
  targetLanguage,
  variant = 'word-xl',
  children,
}: NounProps) {
  const { articles } = getTargetLanguagePack(targetLanguage);

  return (
    <Text variant={variant}>
      <NativeText className={articleClasses[gender]}>
        {articles[gender]}
      </NativeText>{' '}
      {children}
    </Text>
  );
}

export { Noun };
export type { NounProps };
