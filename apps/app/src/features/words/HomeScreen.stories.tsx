import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { TabBar } from '../../components/TabBar/TabBar';
import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { storyTabs } from '../../lib/story-tabs';
import { textFor, WithText } from '../../lib/story-text';
import { homeDemo } from '../../mocks/home';
import { demoProfile } from '../../mocks/profile';
import { HomeScreen, type HomeScreenProps } from './HomeScreen';
import { homeScreenMeta } from './HomeScreen.meta';

function HomeDemo({ words, onWordsChange, ...props }: HomeScreenProps) {
  const [typedWords, setTypedWords] = useState(words);

  return (
    <View className="min-h-screen">
      <HomeScreen
        {...props}
        words={typedWords}
        onWordsChange={(next) => {
          setTypedWords(next);
          onWordsChange(next);
        }}
      />
      <WithText>
        {(t) => (
          <TabBar
            tabs={storyTabs(t)}
            activeKey="home"
            accessibilityLabel={t('nav.main')}
            onSelect={fn()}
          />
        )}
      </WithText>
    </View>
  );
}

const meta = {
  title: 'Screens/Home',
  component: HomeScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: metaToMarkdown(homeScreenMeta) } },
    controls: { include: ['xp', 'streak', 'dueForReviewCount'] },
  },
  args: {
    xp: demoProfile.xp,
    streak: demoProfile.currentStreak,
    dueForReviewCount: homeDemo.dueForReviewCount,
    bossRound: homeDemo.bossRound,
    words: homeDemo.typedWords,
    minimumWords: homeDemo.minimumWords,
    onWordsChange: fn(),
    onDictate: fn(),
    onOpenMenu: fn(),
    onOpenReview: fn(),
    onOpenBossRound: fn(),
    onCheckWords: fn(),
  },
  argTypes: {
    xp: { control: 'number', description: 'Total XP.' },
    streak: { control: 'number', description: 'Days in a row.' },
    dueForReviewCount: {
      control: 'number',
      description: 'Words due for review today.',
    },
  },
  render: (args) => <HomeDemo {...args} />,
} satisfies Meta<typeof HomeScreen>;

export default meta;

type Story = StoryObj<typeof HomeScreen>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const { lessonsDone, lessonsTotal } = args.bossRound;
    const words = await canvas.findByRole('textbox', {
      name: t('home.wordsLabel'),
    });
    const check = canvas.getByRole('button', { name: t('home.checkWords') });
    const boss = canvas.getByRole('button', {
      name: new RegExp(
        t('home.bossRound', { count: lessonsTotal - lessonsDone }),
      ),
    });
    const tabBar = canvas.getByRole('tablist', { name: t('nav.main') });

    expect((words as HTMLTextAreaElement).value).toBe(homeDemo.typedWords);
    expect(
      canvas.getByText(
        t('home.wordCount', { count: 4, min: homeDemo.minimumWords }),
        { exact: false },
      ),
    ).toBeTruthy();
    expect(canvas.getByText(t('home.chunkLine'))).toBeTruthy();
    expect(canvas.getByText(String(args.xp))).toBeTruthy();
    expect(canvas.getByText(t('home.addWords'))).toBeTruthy();
    expect(toRem(check.getBoundingClientRect().height)).toBe(4);
    expect(
      toRem(
        canvas
          .getByText(t('home.bossRound', { count: lessonsTotal - lessonsDone }))
          .getBoundingClientRect().height,
      ),
    ).toBeLessThan(2);
    expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
      canvasElement.clientWidth,
    );
    expect(check.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      tabBar.getBoundingClientRect().top,
    );
    expect(tabBar.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      window.innerHeight + 1,
    );

    await userEvent.click(check);
    await userEvent.click(boss);
    await userEvent.click(
      canvas.getByRole('link', {
        name: t('home.dueForReview', { count: args.dueForReviewCount }),
      }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('home.dictate') }),
    );
    await userEvent.click(canvas.getByRole('button', { name: t('nav.menu') }));

    expect(args.onCheckWords).toHaveBeenCalledTimes(1);
    expect(args.onOpenBossRound).toHaveBeenCalledTimes(1);
    expect(args.onOpenReview).toHaveBeenCalledTimes(1);
    expect(args.onDictate).toHaveBeenCalledTimes(1);
    expect(args.onOpenMenu).toHaveBeenCalledTimes(1);
  },
};

export const TooFewWords: Story = {
  args: { words: 'Bahnhöfe' },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const words = await canvas.findByRole('textbox', {
      name: t('home.wordsLabel'),
    });
    const check = canvas.getByRole('button', { name: t('home.checkWords') });

    expect(check.getAttribute('aria-disabled')).toBe('true');
    expect(
      canvas.getByText(
        t('home.wordCount', { count: 1, min: homeDemo.minimumWords }),
        { exact: false },
      ),
    ).toBeTruthy();

    await userEvent.type(words, '{enter}Fahrkarte{enter}Gleis');

    expect(check.getAttribute('aria-disabled')).not.toBe('true');
    expect(
      canvas.getByText(
        t('home.wordCount', { count: 3, min: homeDemo.minimumWords }),
        { exact: false },
      ),
    ).toBeTruthy();
    expect(args.onWordsChange).toHaveBeenCalled();
  },
};
