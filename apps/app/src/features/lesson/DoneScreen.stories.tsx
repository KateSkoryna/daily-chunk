import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor } from '../../lib/story-text';
import { doneDemo, lessonThirteen } from '../../mocks/lesson';
import { demoWords } from '../../mocks/words';
import { DoneScreen } from './DoneScreen';
import { doneScreenMeta } from './DoneScreen.meta';

const meta = {
  title: 'Screens/Done',
  component: DoneScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: metaToMarkdown(doneScreenMeta) } },
    controls: { disable: true },
  },
  args: {
    lessonNumber: lessonThirteen.number,
    xp: lessonThirteen.xpEarned,
    streakDays: doneDemo.streakDays,
    accuracyPercent: doneDemo.accuracyPercent,
    reviewWords: demoWords.map((word) => ({
      word,
      isWeak: doneDemo.weakWordIds.includes(word.id),
    })),
    bossRound: doneDemo.bossRound,
    onBackToBase: fn(),
    onReplayRecording: fn(),
  },
} satisfies Meta<typeof DoneScreen>;

export default meta;

type Story = StoryObj<typeof DoneScreen>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const list = await canvas.findByRole('list');
    const weak = canvas.getByText(t('done.tomorrowWeak'));
    const normal = canvas.getAllByText(t('done.tomorrow'));

    expect(
      canvas.getByText(t('done.lessonCleared', { number: args.lessonNumber })),
    ).toBeTruthy();
    expect(
      canvas.getByRole('heading', { name: t('done.stageClear') }),
    ).toBeTruthy();
    expect(canvas.getByText(`+${args.xp}`)).toBeTruthy();
    expect(canvas.getByText(String(args.streakDays))).toBeTruthy();
    expect(canvas.getByText(`${args.accuracyPercent}%`)).toBeTruthy();
    expect(canvas.getByText(t('stats.dayStreak'))).toBeTruthy();
    expect(canvas.getByText(t('tutor.says'))).toBeTruthy();
    expect(
      canvas.getByText(t('done.chunkLine', { count: args.reviewWords.length })),
    ).toBeTruthy();
    expect(within(list).getAllByRole('listitem')).toHaveLength(4);
    expect(normal).toHaveLength(3);
    expect(getComputedStyle(weak).color).not.toBe(
      getComputedStyle(normal[0]!).color,
    );
    expect(
      canvas.getByText(
        t('done.bossUnlocks', {
          count: args.bossRound.lessonsTotal - args.bossRound.lessonsDone,
          done: args.bossRound.lessonsDone,
          total: args.bossRound.lessonsTotal,
        }),
      ),
    ).toBeTruthy();

    await userEvent.click(
      canvas.getByRole('button', { name: t('done.backToBase') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('done.replayRecording') }),
    );
    expect(args.onBackToBase).toHaveBeenCalledTimes(1);
    expect(args.onReplayRecording).toHaveBeenCalledTimes(1);
  },
};
