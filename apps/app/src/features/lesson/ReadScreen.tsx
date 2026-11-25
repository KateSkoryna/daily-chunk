import type { Word } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import type { NativeLanguage } from '@daily-chunk/languages';
import { useState } from 'react';
import { View } from 'react-native';

import { ListenButton } from '../../components/ListenButton/ListenButton';
import { cn } from '../../lib/utils';
import { Icon } from '../../components/Icon/Icon';
import { LessonHeader } from '../../components/LessonHeader/LessonHeader';
import { Screen } from '../../components/Screen/Screen';
import {
  StoryText,
  type StoryTextMark,
  type WordAnchor,
} from '../../components/StoryText/StoryText';
import { TopBar } from '../../components/TopBar/TopBar';
import { WordPopover } from '../../components/WordPopover/WordPopover';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';

type ReadScreenProps = {
  lessonNumber: number;
  xp: number;
  text: string;
  highlightedWords: string[];
  translation: string;
  isTranslationShown: boolean;
  words: Word[];
  nativeLanguage: NativeLanguage;
  activeWord: string | null;
  taskNames: string[];
  onTaskSelect: (step: number) => void;
  onWordPress: (word: string) => void;
  onTranslationToggle: () => void;
  isListening: boolean;
  onPlayText: () => void;
  onPlayWord: (word: Word) => void;
  onBack: () => void;
  onClose: () => void;
  onStartQuiz: () => void;
};

function ReadScreen({
  lessonNumber,
  xp,
  text,
  highlightedWords,
  translation,
  isTranslationShown,
  words,
  nativeLanguage,
  activeWord,
  taskNames,
  onTaskSelect,
  onWordPress,
  onTranslationToggle,
  isListening,
  onPlayText,
  onPlayWord,
  onBack,
  onClose,
  onStartQuiz,
}: ReadScreenProps) {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<WordAnchor | null>(null);
  const [textWidth, setTextWidth] = useState(0);
  const [popupWidth, setPopupWidth] = useState(0);
  const activeLemma = words.find((word) => word.lemma === activeWord);

  const marks: StoryTextMark[] = highlightedWords.map((highlighted) => ({
    word: highlighted,
    tone: words.find((word) => word.lemma === highlighted)?.gender ?? 'none',
  }));

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
      <View className="gap-2.5">
        <Text variant="caption" className="uppercase">
          {t('read.hint')}
        </Text>
        <View
          className="relative z-10"
          onLayout={(event) => setTextWidth(event.nativeEvent.layout.width)}
        >
          <StoryText
            text={text}
            marks={marks}
            activeWord={activeWord}
            onWordPress={(word, wordAnchor) => {
              setAnchor(wordAnchor);
              onWordPress(word);
            }}
          />
          {activeLemma && (
            <View
              className={cn('absolute z-10 mt-1', !anchor && 'top-full')}
              style={{
                top: anchor?.bottom,
                left: Math.min(
                  Math.max((anchor?.x ?? 0) - popupWidth / 2, 0),
                  Math.max(textWidth - popupWidth, 0),
                ),
                opacity: popupWidth > 0 ? 1 : 0,
              }}
              onLayout={(event) =>
                setPopupWidth(event.nativeEvent.layout.width)
              }
            >
              <WordPopover
                word={activeLemma}
                nativeLanguage={nativeLanguage}
                onPlay={() => onPlayWord(activeLemma)}
              />
            </View>
          )}
        </View>
        <View className="flex-row items-center gap-2.5">
          <ListenButton isListening={isListening} onPress={onPlayText} />
          <Button
            variant="secondary"
            className="shrink"
            aria-expanded={isTranslationShown}
            onPress={onTranslationToggle}
          >
            <Icon name="book" decorative />
            <Text>{t('read.translation')}</Text>
          </Button>
        </View>
        {isTranslationShown && <Text variant="reading">{translation}</Text>}
      </View>
      <View className="mt-auto">
        <Button onPress={onStartQuiz}>
          <Text>{t('read.startQuiz')}</Text>
        </Button>
      </View>
    </Screen>
  );
}

export { ReadScreen };
export type { ReadScreenProps };
