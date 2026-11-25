import { useTranslation } from '@daily-chunk/i18n';
import { useRef, type ComponentRef } from 'react';
import { TextInput, View } from 'react-native';

import { placeholderProps } from '../../lib/text-input-interop';
import {
  clearField,
  createWordField,
  removeField,
  spreadPastedWords,
  type WordField,
} from '../../lib/word-fields';
import { TopBar } from '../TopBar/TopBar';
import { Button } from '../ui/button';
import { Text } from '../ui/text';

type WordFieldsProps = {
  words: WordField[];
  minFields: number;
  maxFields: number;
  placeholder?: string;
  onChange: (words: WordField[]) => void;
  onWordsLeftOut?: (count: number) => void;
};

function WordFields({
  words,
  minFields,
  maxFields,
  placeholder,
  onChange,
  onWordsLeftOut,
}: WordFieldsProps) {
  const { t } = useTranslation();
  const inputs = useRef<(ComponentRef<typeof TextInput> | null)[]>([]);

  function focusField(index: number) {
    setTimeout(() => inputs.current[index]?.focus(), 0);
  }

  function addField() {
    onChange([...words, createWordField()]);
    focusField(words.length);
  }

  function deleteField(index: number) {
    onChange(
      words.length > minFields
        ? removeField(words, index)
        : clearField(words, index),
    );
  }

  function changeField(index: number, text: string) {
    const isPaste = text.length - (words[index]?.text.length ?? 0) > 1;
    const spread = spreadPastedWords(words, index, text, maxFields, isPaste);
    onChange(spread.fields);
    if (spread.leftOutCount > 0) onWordsLeftOut?.(spread.leftOutCount);
    if (spread.focusIndex !== index) focusField(spread.focusIndex);
  }

  function submitField(index: number) {
    if (index < words.length - 1) {
      focusField(index + 1);
    } else if (words.length < maxFields) {
      addField();
    } else {
      inputs.current[index]?.blur();
    }
  }

  return (
    <View
      role="group"
      accessibilityLabel={t('home.wordsLabel')}
      className="gap-2"
    >
      {words.map((field, index) => (
        <View key={field.id} className="flex-row items-center gap-2">
          <TextInput
            ref={(input) => {
              inputs.current[index] = input;
            }}
            value={field.text}
            onChangeText={(text) => changeField(index, text)}
            onSubmitEditing={() => submitField(index)}
            submitBehavior="submit"
            returnKeyType="next"
            placeholder={index === 0 ? placeholder : undefined}
            {...placeholderProps}
            accessibilityLabel={t('home.wordField', { number: index + 1 })}
            autoCorrect={false}
            spellCheck={false}
            className="h-touch min-w-0 flex-1 border-2 border-field bg-card px-3 font-content text-body text-foreground outline-none placeholder:text-muted-foreground"
          />
          {index >= minFields || field.text.trim() !== '' ? (
            <TopBar.Button
              icon="cross"
              accessibilityLabel={t('home.removeWord', { number: index + 1 })}
              onPress={() => deleteField(index)}
            />
          ) : null}
        </View>
      ))}
      {words.length < maxFields && (
        <Button variant="secondary" onPress={addField}>
          <Text>{t('home.addWord')}</Text>
        </Button>
      )}
    </View>
  );
}

export { WordFields };
export type { WordFieldsProps };
