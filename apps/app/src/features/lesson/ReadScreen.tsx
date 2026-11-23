import type { StoryParagraph, Word } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import type { NativeLanguage } from '@daily-chunk/languages';
import { Fragment } from 'react';
import { View } from 'react-native';

import { LessonHeader } from '../../components/LessonHeader/LessonHeader';
import { Screen } from '../../components/Screen/Screen';
import {
  StoryText,
  type StoryTextMark,
} from '../../components/StoryText/StoryText';
import { TopBar } from '../../components/TopBar/TopBar';
import { WordPopover } from '../../components/WordPopover/WordPopover';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';

type OpenWord = { word: string; paragraphIndex: number };

type ReadScreenProps = {
  lessonNumber: number;
  xp: number;
  title: string;
  paragraphs: StoryParagraph[];
  words: Word[];
  nativeLanguage: NativeLanguage;
  activeWord: OpenWord | null;
  taskNames: string[];
  onTaskSelect: (step: number) => void;
  onWordPress: (word: OpenWord) => void;
  onPlayWord: (word: Word) => void;
  onBack: () => void;
  onClose: () => void;
  onContinue: () => void;
};

function ReadScreen({
  lessonNumber,
  xp,
  title,
  paragraphs,
  words,
  nativeLanguage,
  activeWord,
  taskNames,
  onTaskSelect,
  onWordPress,
  onPlayWord,
  onBack,
  onClose,
  onContinue,
}: ReadScreenProps) {
  const { t } = useTranslation();
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
          <TopBar.Action
            icon="back"
            label={t('common.back')}
            onPress={onBack}
          />
        }
        right={
          <TopBar.Action
            icon="cross"
            iconPosition="end"
            label={t('lesson.quit')}
            onPress={onClose}
          />
        }
        lessonLabel={t('lesson.title', { number: lessonNumber })}
        stepLabel={t('lesson.stepLabel', {
          step: '03',
          task: t('lesson.tasks.read'),
        })}
        xpLabel={t('lesson.xpEarned', { count: xp })}
        stepCount={6}
        currentStep={3}
        stepNames={taskNames}
        onStepSelect={onTaskSelect}
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
            {activeWord?.paragraphIndex === paragraphIndex && activeLemma && (
              <WordPopover
                word={activeLemma}
                nativeLanguage={nativeLanguage}
                onPlay={() => onPlayWord(activeLemma)}
              />
            )}
            <Text variant="body-sm">{paragraph.translation}</Text>
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
export type { OpenWord, ReadScreenProps };
