export type LetterKeyboardProps = {
  rows: readonly string[];
  label: string;
  onKeyPress: (letter: string) => void;
  onDismiss: () => void;
  className?: string;
};
