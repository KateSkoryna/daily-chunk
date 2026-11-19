import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { Text } from '../ui/text';

type PartOfSpeechChipProps = {
  label: string;
  className?: string;
};

function PartOfSpeechChip({ label, className }: PartOfSpeechChipProps) {
  return (
    <View
      className={cn(
        'h-8 items-center justify-center self-start border-2 border-dashed border-muted-foreground px-2.5',
        className,
      )}
    >
      <Text variant="chip" className="text-muted-foreground">
        {label}
      </Text>
    </View>
  );
}

export { PartOfSpeechChip };
export type { PartOfSpeechChipProps };
