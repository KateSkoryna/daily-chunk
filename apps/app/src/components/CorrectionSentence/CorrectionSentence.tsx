import { Text as NativeText } from 'react-native';

import { Text } from '../ui/text';

type CorrectionSentenceProps = {
  before: string;
  wrongWord: string;
  rightWord: string;
  after: string;
  accessibilityLabel: string;
};

function CorrectionSentence({
  before,
  wrongWord,
  rightWord,
  after,
  accessibilityLabel,
}: CorrectionSentenceProps) {
  return (
    <Text accessibilityLabel={accessibilityLabel}>
      {before}
      <NativeText className="text-highlight line-through">
        {wrongWord}
      </NativeText>{' '}
      <NativeText className="font-content-semibold text-success underline decoration-success">
        {rightWord}
      </NativeText>
      {after}
    </Text>
  );
}

export { CorrectionSentence };
export type { CorrectionSentenceProps };
