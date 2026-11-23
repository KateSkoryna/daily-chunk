import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { ArrowButton } from './ArrowButton';
import { arrowButtonMeta } from './ArrowButton.meta';

const meta = {
  title: 'Components/ArrowButton',
  component: ArrowButton,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(arrowButtonMeta) } },
    controls: { include: ['direction', 'disabled'] },
  },
  args: { direction: 'next', label: '', disabled: false, onPress: fn() },
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: ['previous', 'next'],
      description: 'Which way the arrow points.',
    },
    disabled: { control: 'boolean', description: 'The first or last item.' },
  },
  render: (args) => (
    <View className="flex-row p-gutter">
      <WithText>
        {(t) => (
          <ArrowButton
            {...args}
            label={t(
              args.direction === 'next'
                ? 'flashcards.nextCard'
                : 'flashcards.previousCard',
            )}
          />
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof ArrowButton>;

export default meta;

type Story = StoryObj<typeof ArrowButton>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const button = await within(canvasElement).findByRole('button', {
      name: t('flashcards.nextCard'),
    });
    const box = button.getBoundingClientRect();

    expect(toRem(box.width)).toBeGreaterThanOrEqual(3);
    expect(toRem(box.height)).toBeGreaterThanOrEqual(3);
    await userEvent.click(button);
    expect(args.onPress).toHaveBeenCalledTimes(1);
  },
};

export const Previous: Story = {
  args: { direction: 'previous' },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    expect(
      await within(canvasElement).findByRole('button', {
        name: t('flashcards.previousCard'),
      }),
    ).toBeTruthy();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const button = await within(canvasElement).findByRole('button', {
      name: t('flashcards.nextCard'),
    });

    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(getComputedStyle(button).pointerEvents).toBe('none');
    expect(args.onPress).not.toHaveBeenCalled();
  },
};
