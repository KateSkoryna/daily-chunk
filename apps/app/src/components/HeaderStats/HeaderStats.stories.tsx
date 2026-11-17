import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { HeaderStats } from './HeaderStats';
import { headerStatsMeta } from './HeaderStats.meta';

const meta = {
  title: 'Components/HeaderStats',
  component: HeaderStats,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(headerStatsMeta) } },
    controls: { include: ['xp'] },
  },
  args: { xp: 1240 },
  argTypes: {
    xp: { control: 'number', description: 'The XP total.' },
  },
  render: (args) => (
    <View className="items-end p-gutter">
      <WithText>
        {(t) => (
          <HeaderStats
            {...args}
            xpLabel={t('stats.xp')}
            streakLabel={t('stats.streak', { count: 12 })}
          />
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof HeaderStats>;

export default meta;

type Story = StoryObj<typeof HeaderStats>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const number = await canvas.findByText(String(args.xp));
    const xpLabel = await canvas.findByText(t('stats.xp'));
    const streak = await canvas.findByText(t('stats.streak', { count: 12 }));
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
