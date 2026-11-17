import { View } from 'react-native';

import { PressableFocus } from '../PressableFocus/PressableFocus';
import { Text } from '../ui/text';

type SentenceTile = { id: string; text: string };

type SentenceBuilderProps = {
  answer: SentenceTile[];
  pool: SentenceTile[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  answerLabel: string;
};

function Tile({ text, onPress }: { text: string; onPress: () => void }) {
  return (
    <PressableFocus
      accessibilityRole="button"
      onPress={onPress}
      className="h-touch items-center justify-center border-2 border-input bg-muted px-3.5"
    >
      <Text variant="option">{text}</Text>
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
            text={tile.text}
            onPress={() => onRemove(tile.id)}
          />
        ))}
      </View>
      <View className="flex-row flex-wrap gap-2">
        {pool.map((tile) => (
          <Tile key={tile.id} text={tile.text} onPress={() => onAdd(tile.id)} />
        ))}
      </View>
    </View>
  );
}

export { SentenceBuilder };
export type { SentenceBuilderProps, SentenceTile };
