import { getTargetLanguagePack } from '@daily-chunk/languages';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { LetterKeyboard } from './LetterKeyboard';
import { letterKeyboardMeta } from './LetterKeyboard.meta';

const { keyboardRows } = getTargetLanguagePack('de');

const meta = {
  title: 'Components/LetterKeyboard',
  component: LetterKeyboard,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(letterKeyboardMeta) } },
    controls: { disable: true },
  },
  args: { rows: keyboardRows, label: '', onKeyPress: fn(), onDismiss: fn() },
  render: (args) => (
    <View className="max-w-content p-gutter">
      <WithText>
        {(t) => <LetterKeyboard {...args} label={t('crossword.keyboard')} />}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof LetterKeyboard>;

export default meta;

type Story = StoryObj<typeof LetterKeyboard>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const keyboard = await canvas.findByRole('group', {
      name: t('crossword.keyboard'),
    });
    const keys = within(keyboard).getAllByRole('button');
    const sharpS = canvas.getByRole('button', { name: 'ß' });

    expect(keys).toHaveLength(30);
    expect(
      toRem(keys[0]!.getBoundingClientRect().height),
    ).toBeGreaterThanOrEqual(3);
    expect(
      Math.abs(
        sharpS.getBoundingClientRect().width -
          keys[0]!.getBoundingClientRect().width,
      ),
    ).toBeLessThan(4);

    await userEvent.click(canvas.getByRole('button', { name: 'Ü' }));
    await userEvent.click(sharpS);

    expect(args.onKeyPress).toHaveBeenNthCalledWith(1, 'Ü');
    expect(args.onKeyPress).toHaveBeenNthCalledWith(2, 'ß');
  },
};

export const NarrowScreen: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const keyboard = await canvas.findByRole('group', {
      name: t('crossword.keyboard'),
    });

    expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
      canvasElement.clientWidth,
    );
    expect(
      canvas.getByRole('button', { name: 'Ä' }).getBoundingClientRect().right,
    ).toBeLessThanOrEqual(keyboard.getBoundingClientRect().right + 1);
  },
};
