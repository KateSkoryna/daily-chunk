import { useTranslation } from '@daily-chunk/i18n';
import { useRef, type ComponentRef, type ReactNode } from 'react';
import { TextInput, View } from 'react-native';

import { placeholderProps } from '../../lib/text-input-interop';
import { cn } from '../../lib/utils';
import {
  applyWordInput,
  commitDraft,
  editWord,
  removeWord,
  type WordChipsState,
} from '../../lib/word-chips';
import { Icon } from '../Icon/Icon';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { Text } from '../ui/text';

type WordChipsChange = { words: string[]; draft: string };

type WordChipProps = {
  word: string;
  onEdit: () => void;
  onRemove: () => void;
};

function WordChip({ word, onEdit, onRemove }: WordChipProps) {
  const { t } = useTranslation();

  return (
    <View className="-my-2 h-touch flex-row items-center">
      <View
        pointerEvents="none"
        className="absolute inset-x-0 inset-y-2 border-2 border-border bg-popover"
      />
      <PressableFocus
        accessibilityRole="button"
        accessibilityLabel={t('wordChips.edit', { word })}
        onPress={onEdit}
        className="justify-center pl-2.5"
      >
        <Text variant="chip">{word}</Text>
      </PressableFocus>
      <PressableFocus
        accessibilityRole="button"
        accessibilityLabel={t('wordChips.remove', { word })}
        onPress={onRemove}
        className="items-center justify-center"
      >
        <Icon name="cross" decorative className="text-muted-foreground" />
      </PressableFocus>
    </View>
  );
}

type WordChipsInputProps = {
  words: string[];
  draft: string;
  maxWords: number;
  placeholder?: string;
  accessibilityLabel: string;
  trailing?: ReactNode;
  onChange: (change: WordChipsChange) => void;
  onWordsLeftOut?: (count: number) => void;
};

function WordChipsInput({
  words,
  draft,
  maxWords,
  placeholder,
  accessibilityLabel,
  trailing,
  onChange,
  onWordsLeftOut,
}: WordChipsInputProps) {
  const isFull = words.length >= maxWords;
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);

  function focusInput() {
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function report(state: WordChipsState) {
    onChange({ words: state.words, draft: state.draft });
    if (state.leftOutCount > 0) onWordsLeftOut?.(state.leftOutCount);
  }

  return (
    <View className="relative">
      <View
        className={cn(
          'min-h-36 flex-row flex-wrap content-start items-center gap-x-2 gap-y-2 border-2 border-field bg-card p-3',
          trailing ? 'pb-16' : '',
        )}
      >
        {words.map((word, index) => (
          <WordChip
            key={word}
            word={word}
            onEdit={() => {
              report(editWord(words, index, draft, maxWords));
              focusInput();
            }}
            onRemove={() =>
              onChange({ words: removeWord(words, index), draft })
            }
          />
        ))}
        {!isFull && (
          <TextInput
            ref={inputRef}
            multiline
            scrollEnabled={false}
            value={draft}
            onChangeText={(text) =>
              report(applyWordInput(words, text, maxWords))
            }
            onBlur={() => {
              if (draft.trim() !== '') {
                report(commitDraft(words, draft, maxWords));
              }
            }}
            onKeyPress={(event) => {
              if (
                event.nativeEvent.key === 'Backspace' &&
                draft === '' &&
                words.length > 0
              ) {
                event.preventDefault?.();
                report(editWord(words, words.length - 1, '', maxWords));
              }
            }}
            placeholder={words.length === 0 ? placeholder : undefined}
            {...placeholderProps}
            accessibilityLabel={accessibilityLabel}
            autoCorrect={false}
            spellCheck={false}
            textAlignVertical="center"
            className="-my-2 h-touch min-w-16 flex-1 py-0 font-content text-body text-foreground outline-none placeholder:text-muted-foreground"
          />
        )}
      </View>
      {trailing ? (
        <View className="absolute bottom-2.5 right-2.5">{trailing}</View>
      ) : null}
    </View>
  );
}

export { WordChipsInput };
export type { WordChipsChange, WordChipsInputProps };
