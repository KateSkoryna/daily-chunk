import type { ReactNode } from 'react';
import { TextInput, View } from 'react-native';

import { placeholderProps } from '../../lib/text-input-interop';
import { cn } from '../../lib/utils';

type TextareaProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  accessibilityLabel: string;
  trailing?: ReactNode;
  className?: string;
};

function Textarea({
  value,
  onChangeText,
  placeholder,
  accessibilityLabel,
  trailing,
  className,
}: TextareaProps) {
  return (
    <View className="relative">
      <TextInput
        multiline
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        {...placeholderProps}
        accessibilityLabel={accessibilityLabel}
        textAlignVertical="top"
        className={cn(
          'min-h-36 border-2 border-field bg-card p-3 font-content text-body text-foreground outline-none placeholder:text-muted-foreground',
          trailing ? 'pb-16' : '',
          className,
        )}
      />
      {trailing ? (
        <View className="absolute bottom-2.5 right-2.5">{trailing}</View>
      ) : null}
    </View>
  );
}

export { Textarea };
export type { TextareaProps };
