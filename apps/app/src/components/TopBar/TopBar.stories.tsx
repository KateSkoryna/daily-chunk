import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { HeaderStats } from '../HeaderStats/HeaderStats';
import { iconNames } from '../Icon/icon-shapes';
import { TopBar } from './TopBar';
import { topBarMeta } from './TopBar.meta';

const meta = {
  title: 'Components/TopBar',
  component: TopBar,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(topBarMeta) } },
    controls: { disable: true },
  },
  render: () => (
    <View className="p-gutter">
      <TopBar
        left={
          <TopBar.Button
            icon="menu"
            accessibilityLabel="Open menu"
            onPress={fn()}
          />
        }
        right={<HeaderStats xp={1240} xpLabel="XP" streakLabel="STREAK 12" />}
      />
    </View>
  ),
} satisfies Meta<typeof TopBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByRole('button', { name: 'Open menu' });
    const box = button.getBoundingClientRect();
    const stats = (
      await canvas.findByText('STREAK 12')
    ).getBoundingClientRect();

    expect(iconNames).toContain('menu');
    expect(toRem(box.width)).toBeGreaterThanOrEqual(3);
    expect(toRem(box.height)).toBeGreaterThanOrEqual(3);
    expect(toRem(getComputedStyle(button).borderTopWidth)).toBe(0.125);
    expect(button.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
    expect(box.right).toBeLessThan(stats.left);
    expect(
      Math.abs(box.top + box.height / 2 - (stats.top + stats.height / 2)),
    ).toBeLessThan(box.height);
    await userEvent.click(button);
  },
};
