import type { Word } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import type { NativeLanguage } from '@daily-chunk/languages';
import { View } from 'react-native';

import { GlitchTitle } from '../../components/GlitchTitle/GlitchTitle';
import { ListGroup } from '../../components/ListGroup/ListGroup';
import { Notice } from '../../components/Notice/Notice';
import { Screen } from '../../components/Screen/Screen';
import { TopBar } from '../../components/TopBar/TopBar';
import { WordTag } from '../../components/WordTag/WordTag';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';
import { displayedWord } from '../../lib/displayed-word';

type ConfirmScreenProps = {
  words: Word[];
  nativeLanguage: NativeLanguage;
  pluralInput?: { typed: string; savedWordId: string };
  onBack: () => void;
  onStartLesson: () => void;
  onAddMore: () => void;
};

function ConfirmScreen({
  words,
  nativeLanguage,
  pluralInput,
  onBack,
  onStartLesson,
  onAddMore,
}: ConfirmScreenProps) {
  const { t } = useTranslation();
  const savedWord = words.find((word) => word.id === pluralInput?.savedWordId);

  return (
    <Screen className="gap-4">
      <TopBar
        left={
          <TopBar.Action
            icon="back"
            label={t('common.back')}
            onPress={onBack}
          />
        }
      />
      <GlitchTitle variant="display-l">{t('confirm.title')}</GlitchTitle>
      <View className="flex-row items-start gap-3">
        <Text variant="body-sm" className="flex-1">
          {t('confirm.intro')}
        </Text>
        <Text variant="caption" className="uppercase">
          {t('confirm.wordCount', { count: words.length })}
        </Text>
      </View>
      <ListGroup>
        {words.map((word) => (
          <ListGroup.Row
            key={word.id}
            left={<WordTag word={word} className="min-w-14" />}
          >
            <Text variant="word-l">{displayedWord(word)}</Text>
            <Text variant="body-sm">
              {word.gender
                ? t('confirm.pluralForms', { forms: word.forms })
                : t(`partOfSpeech.long.${word.partOfSpeech}`)}
            </Text>
            <Text variant="body-sm" className="text-foreground">
              {word.translations[nativeLanguage]}
            </Text>
          </ListGroup.Row>
        ))}
      </ListGroup>
      {pluralInput && savedWord && (
        <Notice>
          {t('confirm.pluralNotice', {
            written: pluralInput.typed,
            saved: displayedWord(savedWord),
          })}
        </Notice>
      )}
      <View className="mt-auto gap-3">
        <Button onPress={onStartLesson}>
          <Text>{t('confirm.startLesson')}</Text>
        </Button>
        <Button variant="ghost" onPress={onAddMore} className="self-center">
          <Text>{t('confirm.addMore')}</Text>
        </Button>
      </View>
    </Screen>
  );
}

export { ConfirmScreen };
export type { ConfirmScreenProps };
