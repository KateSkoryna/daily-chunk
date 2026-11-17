import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { LessonStepper } from './LessonStepper';
import { lessonStepperMeta } from './LessonStepper.meta';

const meta = {
  title: 'Components/LessonStepper',
  component: LessonStepper,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(lessonStepperMeta) } },
    controls: { include: ['total', 'current'] },
  },
  args: { total: 6, current: 3 },
  argTypes: {
    total: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'How many segments: 6 for a lesson, 3 for a Boss round.',
    },
    current: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'The position of the current task, counting from 1.',
    },
  },
  render: (args) => (
    <View className="p-gutter">
      <WithText>
        {(t) => (
          <LessonStepper
            {...args}
            label={t('lesson.stepLabel', {
              step: String(args.current).padStart(2, '0'),
              task: t('lesson.tasks.read'),
            })}
            xpLabel={t('lesson.xpEarned', { count: 40 })}
          />
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof LessonStepper>;

export default meta;

type Story = StoryObj<typeof LessonStepper>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const label = t('lesson.stepLabel', {
      step: String(args.current).padStart(2, '0'),
      task: t('lesson.tasks.read'),
    });
    const canvas = within(canvasElement);
    const done = canvas.queryAllByTestId('segment-done');
    const current = canvas.queryAllByTestId('segment-current');
    const upcoming = canvas.queryAllByTestId('segment-upcoming');
    const segments = [...done, ...current, ...upcoming];
    const progress = await canvas.findByRole('progressbar');

    expect(done).toHaveLength(args.current - 1);
    expect(current).toHaveLength(1);
    expect(upcoming).toHaveLength(args.total - args.current);
    expect(progress.getAttribute('aria-label')).toBe(label);
    expect(progress.getAttribute('aria-valuenow')).toBe(String(args.current));
    expect(progress.getAttribute('aria-valuemax')).toBe(String(args.total));
    expect(await canvas.findByText(label)).toBeTruthy();
    expect(
      await canvas.findByText(t('lesson.xpEarned', { count: 40 })),
    ).toBeTruthy();

    for (const segment of segments) {
      expect(toRem(segment.getBoundingClientRect().height)).toBe(0.5);
    }
    const [first, second] = segments.map((segment) =>
      segment.getBoundingClientRect(),
    );
    if (first && second) {
      expect(toRem(second.left - first.right)).toBe(0.25);
    }

    const groups = [done, current, upcoming].filter(
      (group) => group.length > 0,
    );
    const colours = new Set(
      groups.map((group) => getComputedStyle(group[0]!).backgroundColor),
    );
    expect(colours.size).toBe(groups.length);
  },
};

export const BossProgress: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View className="p-gutter">
      <WithText>
        {(t) => (
          <LessonStepper
            variant="progress"
            total={5}
            current={3}
            label={t('home.bossRound', { count: 2 })}
            xpLabel="3/5"
          />
        )}
      </WithText>
    </View>
  ),
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const bar = await canvas.findByRole('progressbar', {
      name: t('home.bossRound', { count: 2 }),
    });

    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuenow')).toBe('3');
    expect(within(bar).getAllByTestId('segment-done')).toHaveLength(3);
    expect(within(bar).getAllByTestId('segment-upcoming')).toHaveLength(2);
    expect(within(bar).queryByTestId('segment-current')).toBeNull();
  },
};
