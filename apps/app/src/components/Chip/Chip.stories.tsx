import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { Chip } from './Chip';
import { chipMeta } from './Chip.meta';

const words = ['Fahrkarte', 'läuft'];

const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(chipMeta) } },
    controls: { disable: true },
  },
  args: { label: '', onPress: fn() },
  render: ({ onPress }) => (
    <View className="flex-row gap-2 p-gutter">
      <WithText>
        {(t) =>
          words.map((word) => (
            <Chip
              key={word}
              label={word}
              icon="mic"
              onPress={onPress}
              accessibilityLabel={t('record.retry', { word })}
            />
          ))
        }
      </WithText>
      <View
        testID="highlight-swatch"
        className="h-1 w-1 bg-highlight opacity-0"
      />
    </View>
  ),
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const chips = await Promise.all(
      words.map((word) =>
        canvas.findByRole('button', { name: t('record.retry', { word }) }),
      ),
    );
    const swatch = await canvas.findByTestId('highlight-swatch');
    const [first, second] = chips;
    const style = getComputedStyle(first!);

    expect(toRem(first!.getBoundingClientRect().height)).toBe(3.5);
    expect(
      Math.abs(
        first!.getBoundingClientRect().width -
          second!.getBoundingClientRect().width,
      ),
    ).toBeLessThan(1);
    expect(toRem(style.borderTopWidth)).toBe(0.125);
    expect(style.borderTopColor).toBe(getComputedStyle(swatch).backgroundColor);
    expect(first!.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
    expect(within(first!).getByText(words[0]!)).toBeTruthy();

    await userEvent.click(first!);
    expect(args.onPress).toHaveBeenCalledTimes(1);
  },
};
