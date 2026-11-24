import { useTranslation } from '@daily-chunk/i18n';
import { View } from 'react-native';

import { GlitchTitle } from '../../components/GlitchTitle/GlitchTitle';
import { HeaderStats } from '../../components/HeaderStats/HeaderStats';
import { LessonStepper } from '../../components/LessonStepper/LessonStepper';
import { LogoBadge } from '../../components/LogoBadge/LogoBadge';
import { commitDraft } from '../../lib/word-chips';
import { Notice } from '../../components/Notice/Notice';
import { PressableFocus } from '../../components/PressableFocus/PressableFocus';
import { Screen } from '../../components/Screen/Screen';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import { TopBar } from '../../components/TopBar/TopBar';
import {
  WordChipsInput,
  type WordChipsChange,
} from '../../components/WordChipsInput/WordChipsInput';
import { TutorQuote } from '../../components/TutorQuote/TutorQuote';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';

type HomeScreenProps = {
  xp: number;
  streak: number;
  dueForReviewCount: number;
  bossRound: { lessonsDone: number; lessonsTotal: number };
  words: string[];
  draft: string;
  minimumWords: number;
  maxWords: number;
  notice?: string;
  onWordsChange: (change: WordChipsChange) => void;
  onWordsLeftOut: (count: number) => void;
  onDictate: () => void;
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
  draft,
  minimumWords,
  maxWords,
  notice,
  onWordsChange,
  onWordsLeftOut,
  onDictate,
  onOpenMenu,
  onOpenReview,
  onOpenBossRound,
  onCheckWords,
}: HomeScreenProps) {
  const { t } = useTranslation();
  const wordCount = commitDraft(words, draft, maxWords).words.length;
  const { lessonsDone, lessonsTotal } = bossRound;
  const lessonsLeft = lessonsTotal - lessonsDone;

  return (
    <Screen className="gap-section">
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
      <View className="gap-2.5">
        <SectionLabel>{t('home.addWords')}</SectionLabel>
        <WordChipsInput
          words={words}
          draft={draft}
          maxWords={maxWords}
          onChange={onWordsChange}
          onWordsLeftOut={onWordsLeftOut}
          placeholder={t('home.wordsPlaceholder')}
          accessibilityLabel={t('home.wordsLabel')}
          trailing={
            <TopBar.Button
              variant="record"
              icon="mic"
              accessibilityLabel={t('home.dictate')}
              onPress={onDictate}
            />
          }
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
