import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { ItemDots } from './ItemDots';
import { itemDotsMeta } from './ItemDots.meta';

const meta = {
  title: 'Components/ItemDots',
  component: ItemDots,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(itemDotsMeta) } },
    controls: { include: ['current'] },
  },
  args: { labels: [], current: 2, groupLabel: '', onSelect: fn() },
  argTypes: {
    current: {
      control: { type: 'number', min: 1, max: 4 },
      description: 'The current item, counting from 1.',
    },
  },
  render: (args) => (
    <View className="p-gutter">
      <WithText>
        {(t) => (
          <ItemDots
            {...args}
            labels={[1, 2, 3, 4].map((number) =>
              t('flashcards.goToCard', { number }),
            )}
            groupLabel={t('flashcards.cards')}
          />
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof ItemDots>;

export default meta;

type Story = StoryObj<typeof ItemDots>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const row = await canvas.findByRole('toolbar', {
      name: t('flashcards.cards'),
    });
    const dots = within(row).getAllByRole('button');
    const current = args.current ?? 1;

    expect(dots).toHaveLength(4);
    expect(dots[current - 1]).toHaveAttribute('aria-current', 'step');
    expect(
      toRem(dots[0]!.getBoundingClientRect().height),
    ).toBeGreaterThanOrEqual(3);
    expect(
      getComputedStyle(dots[current - 1]!.firstElementChild!).backgroundColor,
    ).not.toBe(getComputedStyle(dots[0]!.firstElementChild!).backgroundColor);
    await userEvent.click(dots[3]!);

    expect(args.onSelect).toHaveBeenCalledWith(4);
  },
};
