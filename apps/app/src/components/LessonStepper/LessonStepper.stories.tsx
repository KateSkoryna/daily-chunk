import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { LessonStepper } from './LessonStepper';
import { lessonStepperMeta } from './LessonStepper.meta';

const meta = {
  title: 'Components/LessonStepper',
  component: LessonStepper,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(lessonStepperMeta) } },
    controls: { include: ['total', 'current', 'label', 'xpLabel'] },
  },
  args: {
    total: 6,
    current: 3,
    label: '03 / Read the story',
    xpLabel: '+40 XP',
  },
  argTypes: {
    total: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'How many segments: 6 for a lesson, 3 for a Boss round.',
    },
    current: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'The position of the current task, counting from 1.',
    },
    label: {
      control: 'text',
      description: 'Text above the segments, already translated.',
    },
    xpLabel: {
      control: 'text',
      description: 'The XP earned so far, already translated.',
    },
  },
  render: (args) => (
    <View className="p-gutter">
      <LessonStepper {...args} />
    </View>
  ),
} satisfies Meta<typeof LessonStepper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const done = canvas.queryAllByTestId('segment-done');
    const current = canvas.queryAllByTestId('segment-current');
    const upcoming = canvas.queryAllByTestId('segment-upcoming');
    const segments = [...done, ...current, ...upcoming];
    const progress = await canvas.findByRole('progressbar');

    expect(done).toHaveLength(args.current - 1);
    expect(current).toHaveLength(1);
    expect(upcoming).toHaveLength(args.total - args.current);
    expect(progress.getAttribute('aria-label')).toBe(args.label);
    expect(progress.getAttribute('aria-valuenow')).toBe(String(args.current));
    expect(progress.getAttribute('aria-valuemax')).toBe(String(args.total));
    expect(await canvas.findByText(args.label)).toBeTruthy();
    expect(await canvas.findByText(args.xpLabel)).toBeTruthy();

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
