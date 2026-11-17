import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { LogoBadge } from './LogoBadge';
import { logoBadgeMeta } from './LogoBadge.meta';

const meta = {
  title: 'Components/LogoBadge',
  component: LogoBadge,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(logoBadgeMeta) } },
    controls: { disable: true },
  },
  args: { accessibilityLabel: '' },
  render: () => (
    <View className="items-start p-gutter">
      <WithText>
        {(t) => <LogoBadge accessibilityLabel={t('app.name')} />}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof LogoBadge>;

export default meta;

type Story = StoryObj<typeof LogoBadge>;

export const Default: Story = {
  play: async ({ canvasElement, globals }) => {
    const badge = await within(canvasElement).findByRole('img', {
      name: textFor(globals)('app.name'),
    });
    const layers = [...badge.querySelectorAll('svg')];
    const colours = new Set(
      layers.map((layer) => getComputedStyle(layer).color),
    );

    expect(toRem(badge.getBoundingClientRect().width)).toBe(2.5);
    expect(toRem(badge.getBoundingClientRect().height)).toBe(2.5);
    expect(layers).toHaveLength(4);
    expect(colours.size).toBe(4);
    for (const layer of layers) {
      expect(layer.getBoundingClientRect().width).toBe(
        badge.getBoundingClientRect().width,
      );
    }
  },
};
