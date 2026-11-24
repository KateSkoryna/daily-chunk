import { lessonTaskTypes } from '@daily-chunk/core';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import {
  LessonOverviewScreen,
  type LessonOverviewScreenProps,
} from './LessonOverviewScreen';
import { lessonOverviewScreenMeta } from './LessonOverviewScreen.meta';

const meta = {
  title: 'Screens/LessonOverview',
  component: LessonOverviewScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: { component: metaToMarkdown(lessonOverviewScreenMeta) },
    },
    controls: { disable: true },
  },
  args: {
    lessonNumber: 13,
    completedTasks: [],
    earnedXp: {},
    nativeLanguage: 'en',
    targetLanguage: 'de',
    onOpenTask: fn(),
    onStart: fn(),
    onClose: fn(),
  },
  render: (args: LessonOverviewScreenProps) => (
    <WithText>
      {(_t, appLanguage) => (
        <LessonOverviewScreen {...args} nativeLanguage={appLanguage} />
      )}
    </WithText>
  ),
} satisfies Meta<typeof LessonOverviewScreen>;

export default meta;

type Story = StoryObj<typeof LessonOverviewScreen>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const list = await canvas.findByRole('list');

    expect(within(list).getAllByRole('listitem')).toHaveLength(
      lessonTaskTypes.length,
    );
    expect(
      canvas.getAllByText(t('lesson.title', { number: args.lessonNumber })),
    ).not.toHaveLength(0);
    expect(canvas.getByText(t('lesson.overviewIntro'))).toBeTruthy();
    expect(canvas.queryByText(t('lesson.taskDone'))).toBeNull();

    await userEvent.click(within(list).getAllByRole('button')[2]!);
    await userEvent.click(
      canvas.getByRole('button', { name: t('lesson.overviewStart') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('lesson.quit') }),
    );

    expect(args.onOpenTask).toHaveBeenCalledWith('read');
    expect(args.onStart).toHaveBeenCalledTimes(1);
    expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};

export const SomeDone: Story = {
  args: {
    completedTasks: ['flashcards', 'listen'],
    earnedXp: { flashcards: 20, listen: 20 },
  },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);

    expect(await canvas.findAllByText(t('lesson.taskDone'))).toHaveLength(2);
    expect(
      canvas.getAllByText(t('lesson.xpEarned', { count: 20 })),
    ).toHaveLength(2);
    expect(canvas.getByText(t('lesson.taskDescriptions.read'))).toBeTruthy();

    const doneRow = (
      await canvas.findAllByText(t('lesson.taskDone'))
    )[0]!.closest('[role="button"]')!;
    const check = doneRow.querySelector('svg')!;
    expect(getComputedStyle(check).color).toBe(
      getComputedStyle(check.parentElement!).borderTopColor,
    );
  },
};
