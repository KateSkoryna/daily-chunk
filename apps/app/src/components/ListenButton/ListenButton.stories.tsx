import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor } from '../../lib/story-text';
import { ListenButton, type ListenButtonProps } from './ListenButton';
import { listenButtonMeta } from './ListenButton.meta';

function ListenDemo({ isListening, onPress }: ListenButtonProps) {
  const [isOn, setIsOn] = useState(isListening);

  return (
    <View className="items-center p-gutter">
      <ListenButton
        isListening={isOn}
        onPress={() => {
          setIsOn((current) => !current);
          onPress();
        }}
      />
    </View>
  );
}

const meta = {
  title: 'Components/ListenButton',
  component: ListenButton,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(listenButtonMeta) } },
    controls: { include: ['isListening'] },
  },
  args: { isListening: false, onPress: fn() },
  argTypes: {
    isListening: {
      control: 'boolean',
      description: 'Whether the voice is speaking now.',
    },
  },
  render: (args) => <ListenDemo {...args} />,
} satisfies Meta<typeof ListenButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const listen = await canvas.findByRole('button', {
      name: t('common.listen'),
    });

    expect(listen.getAttribute('aria-pressed')).toBe('false');

    await userEvent.click(listen);
    const stop = canvas.getByRole('button', { name: t('common.stop') });

    expect(stop.getAttribute('aria-pressed')).toBe('true');
    expect(args.onPress).toHaveBeenCalledTimes(1);

    await userEvent.click(stop);
    expect(
      canvas.getByRole('button', { name: t('common.listen') }),
    ).toBeTruthy();
    expect(args.onPress).toHaveBeenCalledTimes(2);
  },
};

export const Listening: Story = {
  args: { isListening: true },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const stop = await within(canvasElement).findByRole('button', {
      name: t('common.stop'),
    });

    expect(stop.getAttribute('aria-pressed')).toBe('true');
  },
};
