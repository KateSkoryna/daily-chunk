import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { Icon } from '../Icon/Icon';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { Text } from '../ui/text';

type SentenceTileStatus = 'wrong' | 'hint';

type SentenceTile = {
  id: string;
  text: string;
  status?: SentenceTileStatus;
  label?: string;
};

type SentenceBuilderProps = {
  answer: SentenceTile[];
  pool: SentenceTile[];
  onAdd: (id: string) => void;
  onRemove?: (id: string) => void;
  answerLabel: string;
};

const tileStatusClasses = {
  wrong: 'border-destructive',
  hint: 'border-field',
} satisfies Record<SentenceTileStatus, string>;

const tileStatusIcons = {
  wrong: 'cross',
  hint: 'lamp',
} as const satisfies Record<SentenceTileStatus, 'cross' | 'lamp'>;

const tileClasses =
  'h-touch flex-row items-center justify-center gap-1.5 border-2 bg-muted px-3.5';

function Tile({ tile, onPress }: { tile: SentenceTile; onPress?: () => void }) {
  const className = cn(
    tileClasses,
    tile.status ? tileStatusClasses[tile.status] : 'border-input',
  );
  const content = (
    <>
      {tile.status && <Icon name={tileStatusIcons[tile.status]} decorative />}
      <Text variant="option">{tile.text}</Text>
    </>
  );

  if (!onPress) return <View className={className}>{content}</View>;
  return (
    <PressableFocus
      accessibilityRole="button"
      accessibilityLabel={tile.label}
      onPress={onPress}
      className={className}
    >
      {content}
    </PressableFocus>
  );
}

function SentenceBuilder({
  answer,
  pool,
  onAdd,
  onRemove,
  answerLabel,
}: SentenceBuilderProps) {
  return (
    <View className="gap-4">
      <View
        role="group"
        accessibilityLabel={answerLabel}
        className="min-h-28 flex-row flex-wrap content-start gap-2 border-2 border-field bg-muted p-3"
      >
        {answer.map((tile) => (
          <Tile
            key={tile.id}
            tile={tile}
            onPress={onRemove && (() => onRemove(tile.id))}
          />
        ))}
      </View>
      <View className="flex-row flex-wrap gap-2">
        {pool.map((tile) => (
          <Tile key={tile.id} tile={tile} onPress={() => onAdd(tile.id)} />
        ))}
      </View>
    </View>
  );
}

export { SentenceBuilder };
export type { SentenceBuilderProps, SentenceTile, SentenceTileStatus };
