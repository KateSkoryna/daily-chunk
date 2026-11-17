import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { RecordButton, type RecordButtonState } from './RecordButton';
import { recordButtonMeta } from './RecordButton.meta';

const labelKeys = {
  idle: 'record.start',
  recording: 'record.stop',
  done: 'record.play',
} as const satisfies Record<RecordButtonState, string>;

const swatchClasses = {
  idle: 'bg-highlight',
  recording: 'bg-highlight',
  done: 'bg-success',
} satisfies Record<RecordButtonState, string>;

const meta = {
  title: 'Components/RecordButton',
  component: RecordButton,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(recordButtonMeta) } },
    controls: { include: ['state', 'size'] },
  },
  args: {
    state: 'idle',
    size: 'default',
    accessibilityLabel: '',
    onPress: fn(),
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['idle', 'recording', 'done'],
      description:
        'idle shows a microphone, recording a stop square, done a play triangle.',
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'small'],
      description: 'default is 5rem (read aloud), small is 4rem (shadowing).',
    },
  },
  render: ({ state, ...args }) => (
    <View className="items-start gap-4 p-gutter">
      <WithText>
        {(t) => (
          <RecordButton
            {...args}
            state={state}
            accessibilityLabel={t(labelKeys[state])}
          />
        )}
      </WithText>
      <View
        testID="colour-swatch"
        className={`${swatchClasses[state]} h-4 w-4 opacity-0`}
      />
    </View>
  ),
} satisfies Meta<typeof RecordButton>;

export default meta;

type Story = StoryObj<typeof RecordButton>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const state = args.state ?? 'idle';
    const canvas = within(canvasElement);
    const button = await canvas.findByRole('button', {
      name: t(labelKeys[state]),
    });
    const swatch = await canvas.findByTestId('colour-swatch');
    const style = getComputedStyle(button);
    const box = button.getBoundingClientRect();
    const icon = button.querySelector('svg')!;
    const swatchColour = getComputedStyle(swatch).backgroundColor;
    const expectedSize = args.size === 'small' ? 4 : 5;

    expect(toRem(box.width)).toBe(expectedSize);
    expect(toRem(box.height)).toBe(expectedSize);
    expect(toRem(style.borderTopWidth)).toBe(0.1875);
    expect(parseFloat(style.borderTopLeftRadius)).toBeGreaterThanOrEqual(
      box.width / 2,
    );
    expect(style.borderTopColor).toBe(swatchColour);
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    if (state === 'recording') {
      expect(style.backgroundColor).toBe(swatchColour);
    } else {
      expect(style.backgroundColor).not.toBe(swatchColour);
    }
    expect(getComputedStyle(icon).fill !== 'none').toBe(state !== 'idle');

    await userEvent.click(button);
    expect(args.onPress).toHaveBeenCalledTimes(1);
  },
};

export const AllStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View className="flex-row items-center gap-4 p-gutter">
      <WithText>
        {(t) => (
          <>
            <RecordButton
              state="idle"
              accessibilityLabel={t(labelKeys.idle)}
              onPress={() => undefined}
            />
            <RecordButton
              state="recording"
              accessibilityLabel={t(labelKeys.recording)}
              onPress={() => undefined}
            />
            <RecordButton
              state="done"
              accessibilityLabel={t(labelKeys.done)}
              onPress={() => undefined}
            />
            <RecordButton
              state="done"
              size="small"
              accessibilityLabel={t(labelKeys.done)}
              onPress={() => undefined}
            />
          </>
        )}
      </WithText>
    </View>
  ),
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const idle = await canvas.findByRole('button', {
      name: t(labelKeys.idle),
    });
    const recording = await canvas.findByRole('button', {
      name: t(labelKeys.recording),
    });
    const playButtons = await canvas.findAllByRole('button', {
      name: t(labelKeys.done),
    });
    const done = playButtons[0]!;
    const small = playButtons[1]!;

    expect(toRem(small.getBoundingClientRect().width)).toBe(4);
    expect(toRem(idle.getBoundingClientRect().width)).toBe(5);
    expect(getComputedStyle(recording).backgroundColor).not.toBe(
      getComputedStyle(idle).backgroundColor,
    );
    expect(getComputedStyle(done).borderTopColor).not.toBe(
      getComputedStyle(idle).borderTopColor,
    );
  },
};
