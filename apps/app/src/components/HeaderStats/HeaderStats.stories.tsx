import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { HeaderStats } from './HeaderStats';
import { headerStatsMeta } from './HeaderStats.meta';

const meta = {
  title: 'Components/HeaderStats',
  component: HeaderStats,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(headerStatsMeta) } },
    controls: { include: ['xp', 'xpLabel', 'streakLabel'] },
  },
  args: { xp: 1240, xpLabel: 'XP', streakLabel: 'STREAK 12' },
  argTypes: {
    xp: { control: 'number', description: 'The XP total.' },
    xpLabel: { control: 'text', description: 'The word after the number.' },
    streakLabel: {
      control: 'text',
      description: 'The streak line, already translated with its number.',
    },
  },
  render: (args) => (
    <View className="items-end p-gutter">
      <HeaderStats {...args} />
    </View>
  ),
} satisfies Meta<typeof HeaderStats>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const number = await canvas.findByText(String(args.xp));
    const xpLabel = await canvas.findByText(args.xpLabel);
    const streak = await canvas.findByText(args.streakLabel);
    const numberBox = number.getBoundingClientRect();
    const streakBox = streak.getBoundingClientRect();

    expect(getComputedStyle(number).color).not.toBe(
      getComputedStyle(xpLabel).color,
    );
    expect(getComputedStyle(xpLabel).color).toBe(
      getComputedStyle(streak).color,
    );
    expect(streakBox.top).toBeGreaterThan(numberBox.top);
    expect(toRem(streakBox.right - xpLabel.getBoundingClientRect().right)).toBe(
      0,
    );
  },
};
