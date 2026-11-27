import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { Text } from '../ui/text';
import type { LetterKeyboardProps } from './letter-keyboard-props';

function LetterKeyboard({
  rows,
  label,
  onKeyPress,
  className,
}: LetterKeyboardProps) {
  const longestRow = Math.max(...rows.map((row) => [...row].length));

  return (
    <View
      role="group"
      accessibilityLabel={label}
      className={cn('gap-1', className)}
    >
      {rows.map((row) => {
        const spacerGrow = (longestRow - [...row].length) / 2;
        return (
          <View key={row} className="flex-row gap-1">
            {spacerGrow > 0 && <View style={{ flexGrow: spacerGrow }} />}
            {[...row].map((letter) => (
              <PressableFocus
                key={letter}
                accessibilityRole="button"
                accessibilityLabel={letter}
                onPress={() => onKeyPress(letter)}
                className="min-w-0 flex-1 items-center justify-center border-2 border-input bg-card"
              >
                <Text variant="chip">{letter}</Text>
              </PressableFocus>
            ))}
            {spacerGrow > 0 && <View style={{ flexGrow: spacerGrow }} />}
          </View>
        );
      })}
    </View>
  );
}

export { LetterKeyboard };
export type { LetterKeyboardProps };
