import type { GenderRole } from '@daily-chunk/languages';
import { Fragment, useRef } from 'react';
import { Text as NativeText, View } from 'react-native';

import { cn } from '../../lib/utils';
import { Text } from '../ui/text';

type WordTone = GenderRole | 'none' | 'retry';

type StoryTextMark = {
  word: string;
  tone: WordTone;
};

const underline =
  'underline decoration-2 underline-offset-4 desktop:decoration-auto';

const toneClasses = {
  masc: 'text-gender-masc',
  fem: 'text-gender-fem',
  neut: 'text-gender-neut',
  plural: 'text-gender-plural',
  none: 'text-muted-foreground',
  retry: `${underline} decoration-highlight text-highlight`,
} satisfies Record<WordTone, string>;

type TextLine = {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
};

type WordAnchor = { x: number; bottom: number };

type StoryTextProps = {
  text: string;
  marks: StoryTextMark[];
  activeWord?: string | null;
  onWordPress?: (word: string, anchor: WordAnchor | null) => void;
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
  const parts: { text: string; start: number; mark?: StoryTextMark }[] = [];
  let position = 0;

  for (const { mark, start } of found) {
    if (start < position) continue;
    parts.push({ text: text.slice(position, start), start: position });
    parts.push({ text: mark.word, start, mark });
    position = start + mark.word.length;
  }
  parts.push({ text: text.slice(position), start: position });
  return parts;
}

function anchorOf(
  lines: TextLine[],
  start: number,
  length: number,
): WordAnchor | null {
  let lineStart = 0;
  for (const line of lines) {
    const lineEnd = lineStart + line.text.length;
    if (start < lineEnd) {
      const middle = (start - lineStart + length / 2) / line.text.length;
      return { x: line.x + line.width * middle, bottom: line.y + line.height };
    }
    lineStart = lineEnd;
  }
  return null;
}

type Measurable = {
  getBoundingClientRect: () => {
    left: number;
    top: number;
    bottom: number;
    width: number;
  };
};

function boxAnchorOf(word: unknown, area: unknown): WordAnchor | null {
  const wordBox = (word as Measurable | null)?.getBoundingClientRect?.();
  const areaBox = (area as Measurable | null)?.getBoundingClientRect?.();
  if (!wordBox || !areaBox) return null;
  return {
    x: wordBox.left + wordBox.width / 2 - areaBox.left,
    bottom: wordBox.bottom - areaBox.top,
  };
}

function StoryText({
  text,
  marks,
  activeWord,
  onWordPress,
  className,
}: StoryTextProps) {
  const lines = useRef<TextLine[]>([]);
  const area = useRef<unknown>(null);

  return (
    <View ref={area as never}>
      <Text
        variant="reading"
        className={className}
        onTextLayout={(event) => {
          lines.current = event.nativeEvent.lines;
        }}
      >
        {splitAtMarks(text, marks).map((part, index) => {
          return (
            <Fragment key={index}>
              {part.mark ? (
                <NativeText
                  accessibilityRole={onWordPress ? 'button' : undefined}
                  onPress={
                    onWordPress &&
                    ((event) =>
                      onWordPress(
                        part.mark!.word,
                        anchorOf(lines.current, part.start, part.text.length) ??
                          boxAnchorOf(event.currentTarget, area.current),
                      ))
                  }
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
          );
        })}
      </Text>
    </View>
  );
}

export { StoryText };
export type { StoryTextMark, StoryTextProps, WordAnchor, WordTone };
