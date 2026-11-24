import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { gleis } from '../../mocks/words';
import { TipCard } from './TipCard';
import { tipCardMeta } from './TipCard.meta';

const meta = {
  title: 'Components/TipCard',
  component: TipCard,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(tipCardMeta) } },
  },
  args: { tip: gleis.tip!.en },
  argTypes: {
    tip: {
      control: 'text',
      description: 'The tip text in the native language.',
    },
  },
  render: (args) => (
    <View className="p-gutter">
      <WithText>{() => <TipCard {...args} />}</WithText>
    </View>
  ),
} satisfies Meta<typeof TipCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const card = await canvas.findByRole('group', { name: t('tip.card') });

    expect(within(card).getByText(args.tip)).toBeTruthy();
    expect(within(card).getByText(t('tip.card'))).toBeTruthy();
    expect(toRem(parseFloat(getComputedStyle(card).borderTopWidth))).toBe(
      0.125,
    );
    expect(getComputedStyle(card.previousElementSibling!).position).toBe(
      'absolute',
    );
  },
};

export const LongTip: Story = {
  args: {
    tip: `${gleis.tip!.en} ${gleis.tip!.en} ${gleis.tip!.en}`,
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const card = await canvas.findByRole('group', { name: t('tip.card') });

    expect(within(card).getByText(args.tip)).toBeTruthy();
    expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth);
  },
};
