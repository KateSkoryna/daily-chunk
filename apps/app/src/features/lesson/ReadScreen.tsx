import type { Word } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import type { NativeLanguage } from '@daily-chunk/languages';
import { Fragment } from 'react';
import { View } from 'react-native';

import { Icon } from '../../components/Icon/Icon';
import { LessonHeader } from '../../components/LessonHeader/LessonHeader';
import { Screen } from '../../components/Screen/Screen';
import {
  StoryText,
  type StoryTextMark,
} from '../../components/StoryText/StoryText';
import { Toggle } from '../../components/Toggle/Toggle';
import { WordPopover } from '../../components/WordPopover/WordPopover';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';

type StoryParagraph = {
  text: string;
  highlightedWords: string[];
  translations: Record<NativeLanguage, string>;
};

type OpenWord = { word: string; paragraphIndex: number };

type ReadScreenProps = {
  xp: number;
  title: string;
  paragraphs: StoryParagraph[];
  words: Word[];
  nativeLanguage: NativeLanguage;
  showTranslation: boolean;
  activeWord: OpenWord | null;
  onToggleTranslation: () => void;
  onWordPress: (word: OpenWord) => void;
  onPlayWord: (word: Word) => void;
  onBack: () => void;
  onContinue: () => void;
};

function ReadScreen({
  xp,
  title,
  paragraphs,
  words,
  nativeLanguage,
  showTranslation,
  activeWord,
  onToggleTranslation,
  onWordPress,
  onPlayWord,
  onBack,
  onContinue,
}: ReadScreenProps) {
  const { t } = useTranslation();
  const language = nativeLanguage.toUpperCase();
  const activeLemma = words.find((word) => word.lemma === activeWord?.word);

  function marksOf(paragraph: StoryParagraph): StoryTextMark[] {
    return paragraph.highlightedWords.map((highlighted) => ({
      word: highlighted,
      tone: words.find((word) => word.lemma === highlighted)?.gender ?? 'none',
    }));
  }

  return (
    <Screen className="gap-4">
      <LessonHeader
        left={
          <Button variant="ghost" onPress={onBack}>
            <Icon name="back" decorative />
            <Text>{t('common.back')}</Text>
          </Button>
        }
        right={
          <Toggle
            label={t(
              showTranslation ? 'read.translationOn' : 'read.translationOff',
              { language },
            )}
            isOn={showTranslation}
            onToggle={onToggleTranslation}
          />
        }
        stepLabel={t('lesson.stepLabel', {
          step: '03',
          task: t('lesson.tasks.read'),
        })}
        xpLabel={t('lesson.xpEarned', { count: xp })}
        stepCount={6}
        currentStep={3}
      />
      <Text variant="display-num" className="uppercase text-foreground">
        {title}
      </Text>
      <View className="gap-2.5">
        {paragraphs.map((paragraph, paragraphIndex) => (
          <Fragment key={paragraphIndex}>
            <StoryText
              text={paragraph.text}
              marks={marksOf(paragraph)}
              activeWord={
                activeWord?.paragraphIndex === paragraphIndex
                  ? activeWord.word
                  : null
              }
              onWordPress={(word) => onWordPress({ word, paragraphIndex })}
            />
            {showTranslation && (
              <Text variant="body-sm">
                {paragraph.translations[nativeLanguage]}
              </Text>
            )}
            {activeWord?.paragraphIndex === paragraphIndex && activeLemma && (
              <WordPopover
                word={activeLemma}
                nativeLanguage={nativeLanguage}
                onPlay={() => onPlayWord(activeLemma)}
              />
            )}
          </Fragment>
        ))}
      </View>
      <View className="mt-auto gap-2.5">
        <Text variant="caption" className="uppercase">
          {t('read.hint')}
        </Text>
        <Button onPress={onContinue}>
          <Text>{t('read.readAloud')}</Text>
        </Button>
      </View>
    </Screen>
  );
}

export { ReadScreen };
export type { OpenWord, ReadScreenProps, StoryParagraph };
