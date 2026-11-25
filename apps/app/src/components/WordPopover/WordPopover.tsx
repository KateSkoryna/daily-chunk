import type { Word } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import type { GenderRole, NativeLanguage } from '@daily-chunk/languages';
import { View } from 'react-native';

import { displayedWord } from '../../lib/displayed-word';
import { cn } from '../../lib/utils';
import { ArticleChip } from '../ArticleChip/ArticleChip';
import { Icon } from '../Icon/Icon';
import { PartOfSpeechChip } from '../PartOfSpeechChip/PartOfSpeechChip';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { TextClassContext, Text } from '../ui/text';
import { HardShadow } from '../../theme/HardShadow/HardShadow';

const borderClasses = {
  masc: 'border-gender-masc',
  fem: 'border-gender-fem',
  neut: 'border-gender-neut',
  plural: 'border-gender-plural',
} satisfies Record<GenderRole, string>;

type WordPopoverProps = {
  word: Word;
  nativeLanguage: NativeLanguage;
  onPlay: () => void;
};

function WordPopover({ word, nativeLanguage, onPlay }: WordPopoverProps) {
  const { t } = useTranslation();
  const translation = word.translations[nativeLanguage];

  return (
    <HardShadow>
      <View
        role="group"
        accessibilityLabel={t('wordPopover.label', {
          word: displayedWord(word),
        })}
        className={cn(
          'flex-row items-center gap-2.5 border-2 bg-popover px-3 py-2.5',
          word.gender ? borderClasses[word.gender] : 'border-border',
        )}
      >
        {word.gender ? (
          <ArticleChip
            gender={word.gender}
            targetLanguage={word.targetLanguage}
          />
        ) : (
          <PartOfSpeechChip
            label={t(`partOfSpeech.short.${word.partOfSpeech}`)}
          />
        )}
        <View className="min-w-0 shrink">
          <Text variant="option">{displayedWord(word)}</Text>
          <Text variant="body-sm">
            {word.forms
              ? `${translation} · ${t('confirm.pluralForms', { forms: word.forms })}`
              : translation}
          </Text>
        </View>
        <TextClassContext.Provider value="text-ring">
          <PressableFocus
            accessibilityRole="button"
            accessibilityLabel={t('wordPopover.play', {
              word: displayedWord(word),
            })}
            onPress={onPlay}
            className="items-center justify-center border-2 border-ring"
          >
            <Icon name="speaker" decorative />
          </PressableFocus>
        </TextClassContext.Provider>
      </View>
    </HardShadow>
  );
}

export { WordPopover };
export type { WordPopoverProps };
