import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { rootFontSizeInPixels, toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { TipButton, type TipButtonProps } from './TipButton';
import { tipButtonMeta } from './TipButton.meta';

function TipButtonDemo({ isOpen, onToggle, ...props }: TipButtonProps) {
  const [open, setOpen] = useState(isOpen);

  return (
    <View className="items-start p-gutter">
      <WithText>
        {() => (
          <TipButton
            {...props}
            isOpen={open}
            onToggle={() => {
              setOpen(!open);
              onToggle();
            }}
          />
        )}
      </WithText>
    </View>
  );
}

const meta = {
  title: 'Components/TipButton',
  component: TipButton,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(tipButtonMeta) } },
  },
  args: { word: 'Gleis', isOpen: false, onToggle: fn() },
  argTypes: {
    word: {
      control: 'text',
      description: 'The word the tip is about, for the accessible name.',
    },
    isOpen: {
      control: 'boolean',
      description: 'Whether the tip card is open: the button is then filled.',
    },
    onToggle: { description: 'Called when the button is pressed.' },
    className: {
      control: false,
      description: 'Position classes from the parent.',
    },
  },
  render: (args) => <TipButtonDemo {...args} />,
} satisfies Meta<typeof TipButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const button = await canvas.findByRole('button', {
      name: t('tip.button', { word: args.word }),
    });
    const bounds = button.getBoundingClientRect();

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(toRem(getComputedStyle(button).borderTopWidth)).toBe(0);
    const closedBackground = getComputedStyle(button).backgroundColor;
    expect(toRem(bounds.width)).toBeGreaterThanOrEqual(3);
    expect(toRem(bounds.height)).toBeGreaterThanOrEqual(3);

    await userEvent.click(button);
    expect(args.onToggle).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(getComputedStyle(button).backgroundColor).not.toBe(closedBackground);
  },
};

export const Open: Story = {
  args: { isOpen: true },
  parameters: { controls: { include: ['word', 'isOpen'] } },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const button = await canvas.findByRole('button', {
      name: t('tip.button', { word: args.word }),
    });

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(getComputedStyle(button).backgroundColor).not.toBe(
      getComputedStyle(button.parentElement!).backgroundColor,
    );
  },
};

export const InTheCorner: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <View className="relative h-40 border-2 border-border">
      <WithText>
        {() => <TipButton {...args} className="absolute right-2 top-2" />}
      </WithText>
    </View>
  ),
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const button = await canvas.findByRole('button', {
      name: t('tip.button', { word: args.word }),
    });
    const frame = button.parentElement!.getBoundingClientRect();
    const bounds = button.getBoundingClientRect();
    const borderInPixels = 0.125 * rootFontSizeInPixels();

    expect(frame.right - bounds.right).toBeCloseTo(
      0.5 * rootFontSizeInPixels() + borderInPixels,
      0,
    );
    expect(bounds.top - frame.top).toBeCloseTo(
      0.5 * rootFontSizeInPixels() + borderInPixels,
      0,
    );
  },
};
