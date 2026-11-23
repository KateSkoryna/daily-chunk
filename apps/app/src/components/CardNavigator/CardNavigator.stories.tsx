import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { Text } from '../ui/text';
import { CardNavigator } from './CardNavigator';
import { cardNavigatorMeta } from './CardNavigator.meta';

const meta = {
  title: 'Components/CardNavigator',
  component: CardNavigator,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(cardNavigatorMeta) } },
    controls: { include: ['isFirst', 'isLast'] },
  },
  args: {
    isFirst: false,
    isLast: false,
    previousLabel: '',
    nextLabel: '',
    swipeHint: '',
    onPrevious: fn(),
    onNext: fn(),
    children: null,
  },
  argTypes: {
    isFirst: { control: 'boolean', description: 'The first item.' },
    isLast: { control: 'boolean', description: 'The last item.' },
  },
  render: (args) => (
    <View className="p-gutter">
      <WithText>
        {(t) => (
          <CardNavigator
            {...args}
            previousLabel={t('flashcards.previousCard')}
            nextLabel={t('flashcards.nextCard')}
            swipeHint={t('flashcards.swipeHint')}
          >
            <View className="aspect-square border-2 border-border bg-card p-6">
              <Text>Card</Text>
            </View>
          </CardNavigator>
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof CardNavigator>;

export default meta;

type Story = StoryObj<typeof CardNavigator>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const previous = await canvas.findByRole('button', {
      name: t('flashcards.previousCard'),
    });
    const next = canvas.getByRole('button', { name: t('flashcards.nextCard') });
    const card = canvas.getByText('Card').parentElement!;

    expect(previous.getBoundingClientRect().right).toBeLessThan(
      card.getBoundingClientRect().left,
    );
    expect(card.getBoundingClientRect().right).toBeLessThan(
      next.getBoundingClientRect().left,
    );
    expect(canvas.queryByText(t('flashcards.swipeHint'))).toBeNull();
    await userEvent.click(previous);
    await userEvent.click(next);

    expect(args.onPrevious).toHaveBeenCalledTimes(1);
    expect(args.onNext).toHaveBeenCalledTimes(1);
  },
};

export const FirstItem: Story = {
  args: { isFirst: true },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);

    expect(
      (
        await canvas.findByRole('button', {
          name: t('flashcards.previousCard'),
        })
      ).getAttribute('aria-disabled'),
    ).toBe('true');
    expect(
      canvas
        .getByRole('button', { name: t('flashcards.nextCard') })
        .getAttribute('aria-disabled'),
    ).not.toBe('true');
  },
};
