import { useTranslation } from '@daily-chunk/i18n';
import { View } from 'react-native';

import { GlitchTitle } from '../../components/GlitchTitle/GlitchTitle';
import { HeaderStats } from '../../components/HeaderStats/HeaderStats';
import { LessonStepper } from '../../components/LessonStepper/LessonStepper';
import { LogoBadge } from '../../components/LogoBadge/LogoBadge';
import { filledWords, type WordField } from '../../lib/word-fields';
import { Notice } from '../../components/Notice/Notice';
import { PressableFocus } from '../../components/PressableFocus/PressableFocus';
import { Screen } from '../../components/Screen/Screen';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import { TopBar } from '../../components/TopBar/TopBar';
import { WordFields } from '../../components/WordFields/WordFields';
import { TutorQuote } from '../../components/TutorQuote/TutorQuote';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';

type HomeScreenProps = {
  xp: number;
  streak: number;
  dueForReviewCount: number;
  bossRound: { lessonsDone: number; lessonsTotal: number };
  words: WordField[];
  minimumWords: number;
  maxWords: number;
  notice?: string;
  onWordsChange: (words: WordField[]) => void;
  onWordsLeftOut: (count: number) => void;
  onOpenMenu: () => void;
  onOpenReview: () => void;
  onOpenBossRound: () => void;
  onCheckWords: () => void;
};

function HomeScreen({
  xp,
  streak,
  dueForReviewCount,
  bossRound,
  words,
  minimumWords,
  maxWords,
  notice,
  onWordsChange,
  onWordsLeftOut,
  onOpenMenu,
  onOpenReview,
  onOpenBossRound,
  onCheckWords,
}: HomeScreenProps) {
  const { t } = useTranslation();
  const wordCount = filledWords(words).length;
  const { lessonsDone, lessonsTotal } = bossRound;
  const lessonsLeft = lessonsTotal - lessonsDone;

  return (
    <Screen className="gap-3">
      <View className="gap-1">
        <TopBar
          left={
            <TopBar.Action
              icon="menu"
              label={t('nav.menu')}
              onPress={onOpenMenu}
            />
          }
          center={<LogoBadge accessibilityLabel={t('app.name')} />}
          right={
            <HeaderStats
              xp={xp}
              xpLabel={t('stats.xp')}
              streakLabel={t('stats.streak', { count: streak })}
            />
          }
        />
        <GlitchTitle>{t('app.name')}</GlitchTitle>
      </View>
      <TutorQuote tabLabel={t('tutor.says')}>{t('home.chunkLine')}</TutorQuote>
      <PressableFocus accessibilityRole="button" onPress={onOpenBossRound}>
        <LessonStepper
          variant="progress"
          total={lessonsTotal}
          current={lessonsDone}
          label={t('home.bossRound', { count: lessonsLeft })}
          xpLabel={`${lessonsDone}/${lessonsTotal}`}
        />
      </PressableFocus>
      <View className="gap-2">
        <SectionLabel>{t('home.addWords')}</SectionLabel>
        <WordFields
          words={words}
          minFields={minimumWords}
          maxFields={maxWords}
          onChange={onWordsChange}
          onWordsLeftOut={onWordsLeftOut}
          placeholder={t('home.wordsPlaceholder')}
        />
        {notice && <Notice>{notice}</Notice>}
        <View className="flex-row items-center justify-between">
          <Text variant="caption" className="uppercase">
            {t('home.wordCount', {
              count: wordCount,
              max: maxWords,
              min: minimumWords,
            })}
          </Text>
          <PressableFocus
            accessibilityRole="link"
            onPress={onOpenReview}
            className="justify-center"
          >
            <Text variant="caption" className="uppercase text-ring">
              {t('home.dueForReview', { count: dueForReviewCount })}
            </Text>
          </PressableFocus>
        </View>
      </View>
      <View className="mt-auto">
        <Button disabled={wordCount < minimumWords} onPress={onCheckWords}>
          <Text>{t('home.checkWords')}</Text>
        </Button>
      </View>
    </Screen>
  );
}

export { HomeScreen };
export type { HomeScreenProps };
