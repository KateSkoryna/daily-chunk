import { useTranslation } from '@daily-chunk/i18n';
import { View } from 'react-native';

import type {
  CrosswordCellLook,
  CrosswordCursor,
  CrosswordGridCell,
} from '../../lib/crossword-grid';
import { cn } from '../../lib/utils';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { Text } from '../ui/text';

const cellClasses = {
  open: 'border-input bg-card',
  given: 'border-input bg-popover',
  active: 'border-ring bg-popover',
  solved: 'border-success bg-card',
  'link-solved': 'border-border bg-card',
} satisfies Record<CrosswordCellLook, string>;

const letterClasses = {
  open: 'text-foreground',
  given: 'text-foreground',
  active: 'text-foreground',
  solved: 'text-success',
  'link-solved': 'text-muted-foreground',
} satisfies Record<CrosswordCellLook, string>;

const cursorClasses = {
  none: 'border-2',
  next: 'border-3 border-primary',
  wrong: 'border-3 border-destructive',
} satisfies Record<CrosswordCursor, string>;

type CrosswordProps = {
  rows: (CrosswordGridCell | null)[][];
  onCellPress: (key: string) => void;
};

function Crossword({ rows, onCellPress }: CrosswordProps) {
  const { t } = useTranslation();

  function cellLabel(cell: CrosswordGridCell) {
    const words = cell.words.map((word) =>
      t('crossword.cellWord', {
        number: word.number,
        position: word.position,
        direction: t(
          word.direction === 'down'
            ? 'crossword.directionDown'
            : 'crossword.directionAcross',
        ),
      }),
    );
    const named =
      words.length > 1
        ? t('crossword.cellWords', { first: words[0], second: words[1] })
        : (words[0] ?? '');
    return cell.letter
      ? t('crossword.cellLetter', { words: named, letter: cell.letter })
      : t('crossword.cellEmpty', { words: named });
  }

  return (
    <View
      role="group"
      accessibilityLabel={t('crossword.grid')}
      className="w-full max-w-flashcard gap-1 self-center desktop:max-w-none"
    >
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row gap-1">
          {row.map((cell, columnIndex) =>
            cell ? (
              <View key={cell.key} className="aspect-square flex-1">
                <PressableFocus
                  accessibilityRole="button"
                  accessibilityLabel={cellLabel(cell)}
                  accessibilityState={{ disabled: !cell.isPressable }}
                  aria-current={cell.look === 'active' ? 'true' : undefined}
                  disabled={!cell.isPressable}
                  onPress={() => onCellPress(cell.key)}
                  className={cn(
                    'absolute inset-0 min-h-0 min-w-0',
                    cellClasses[cell.look],
                    cursorClasses[cell.cursor],
                    cell.isFilledIn && 'border-dashed',
                  )}
                />
                <View
                  aria-hidden
                  pointerEvents="none"
                  className="absolute inset-0 items-center justify-center"
                >
                  {cell.number !== undefined && (
                    <Text variant="label-xs" className="absolute left-1 top-1">
                      {cell.number}
                    </Text>
                  )}
                  <Text variant="option" className={letterClasses[cell.look]}>
                    {cell.letter ?? ''}
                  </Text>
                </View>
              </View>
            ) : (
              <View
                key={`${rowIndex},${columnIndex}`}
                aria-hidden
                className="aspect-square flex-1"
              />
            ),
          )}
        </View>
      ))}
    </View>
  );
}

export { Crossword };
export type { CrosswordProps };
