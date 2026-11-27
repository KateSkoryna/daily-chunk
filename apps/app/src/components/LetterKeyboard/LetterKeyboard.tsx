import { useEffect } from 'react';
import { Keyboard, Platform, TextInput } from 'react-native';

import { cn } from '../../lib/utils';
import type { LetterKeyboardProps } from './letter-keyboard-props';

function upperCaseLetter(letter: string) {
  const upperCase = letter.toUpperCase();
  return upperCase.length === 1 ? upperCase : letter;
}

function LetterKeyboard({
  label,
  onKeyPress,
  onDismiss,
  className,
}: LetterKeyboardProps) {
  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidHide', onDismiss);
    return () => subscription.remove();
  }, [onDismiss]);

  return (
    <TextInput
      autoFocus
      value=""
      accessibilityLabel={label}
      autoCapitalize="characters"
      autoComplete="off"
      autoCorrect={false}
      spellCheck={false}
      caretHidden
      keyboardType={Platform.OS === 'android' ? 'visible-password' : 'default'}
      onChangeText={(text) => {
        for (const letter of text) {
          if (/\p{L}/u.test(letter)) onKeyPress(upperCaseLetter(letter));
        }
      }}
      className={cn('absolute size-1 opacity-0', className)}
    />
  );
}

export { LetterKeyboard };
export type { LetterKeyboardProps };
