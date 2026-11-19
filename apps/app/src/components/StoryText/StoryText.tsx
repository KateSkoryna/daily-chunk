import type { GenderRole } from '@daily-chunk/languages';
import { Fragment } from 'react';
import { Text as NativeText } from 'react-native';

import { cn } from '../../lib/utils';
import { Text } from '../ui/text';

type WordTone = GenderRole | 'none' | 'retry';

type StoryTextMark = {
  word: string;
  tone: WordTone;
};

const toneClasses = {
  masc: 'underline decoration-gender-masc',
  fem: 'underline decoration-gender-fem',
  neut: 'underline decoration-gender-neut',
  plural: 'underline decoration-gender-plural',
  none: 'underline decoration-muted-foreground',
  retry: 'underline decoration-highlight text-highlight',
} satisfies Record<WordTone, string>;

type StoryTextProps = {
  text: string;
  marks: StoryTextMark[];
  activeWord?: string | null;
  onWordPress?: (word: string) => void;
  className?: string;
};

function findWord(text: string, word: string) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.search(new RegExp(`(?<!\\p{L})${escaped}(?!\\p{L})`, 'u'));
}

function splitAtMarks(text: string, marks: StoryTextMark[]) {
  const found = marks
    .map((mark) => ({ mark, start: findWord(text, mark.word) }))
    .filter(({ start }) => start >= 0)
    .sort((first, second) => first.start - second.start);
  const parts: { text: string; mark?: StoryTextMark }[] = [];
  let position = 0;

  for (const { mark, start } of found) {
    if (start < position) continue;
    parts.push({ text: text.slice(position, start) });
    parts.push({ text: mark.word, mark });
    position = start + mark.word.length;
  }
  parts.push({ text: text.slice(position) });
  return parts;
}

function StoryText({
  text,
  marks,
  activeWord,
  onWordPress,
  className,
}: StoryTextProps) {
  return (
    <Text variant="reading" className={className}>
      {splitAtMarks(text, marks).map((part, index) => (
        <Fragment key={index}>
          {part.mark ? (
            <NativeText
              accessibilityRole={onWordPress ? 'button' : undefined}
              onPress={onWordPress && (() => onWordPress(part.mark!.word))}
              className={cn(
                toneClasses[part.mark.tone],
                activeWord === part.mark.word && 'bg-popover',
              )}
            >
              {part.text}
            </NativeText>
          ) : (
            part.text
          )}
        </Fragment>
      ))}
    </Text>
  );
}

export { StoryText };
export type { StoryTextMark, StoryTextProps, WordTone };
