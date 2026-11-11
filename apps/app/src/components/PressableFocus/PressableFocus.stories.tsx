import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { Text } from '../ui/text';
import { PressableFocus } from './PressableFocus';

const meta = {
  title: 'Primitives/PressableFocus',
  component: PressableFocus,
  args: {
    accessibilityRole: 'button',
    accessibilityLabel: 'Next',
    onPress: fn(),
  },
  render: (args) => (
    <View className="items-start gap-4 p-gutter">
      <PressableFocus {...args}>
        <Text variant="display-btn-sm">Next</Text>
      </PressableFocus>
      <View testID="ring-colour" className="h-4 w-4 border-2 border-ring" />
    </View>
  ),
} satisfies Meta<typeof PressableFocus>;

export default meta;

type Story = StoryObj<typeof meta>;

function waitForNextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function hasNoOutline(element: HTMLElement) {
  const style = getComputedStyle(element);
  const alpha = style.outlineColor.match(/([\d.]+)\)$/)?.[1];
  return style.outlineStyle === 'none' || Number(alpha ?? 1) === 0;
}

export const Idle: Story = {
  play: async ({ canvasElement }) => {
    const button = await within(canvasElement).findByRole('button', {
      name: 'Next',
    });
    const box = button.getBoundingClientRect();

    expect(toRem(box.height)).toBeGreaterThanOrEqual(3);
    expect(toRem(box.width)).toBeGreaterThanOrEqual(3);
    expect(button.children).toHaveLength(1);
  },
};

export const Focused: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByRole('button', { name: 'Next' });

    await userEvent.tab();
    expect(button).toHaveFocus();

    const ring = button.firstElementChild as HTMLElement;
    const ringStyle = getComputedStyle(ring);
    const buttonBox = button.getBoundingClientRect();
    const ringBox = ring.getBoundingClientRect();
    const swatch = await canvas.findByTestId('ring-colour');

    expect(toRem(ringStyle.borderTopWidth)).toBe(0.125);
    expect(ringStyle.borderTopColor).toBe(
      getComputedStyle(swatch).borderTopColor,
    );
    expect(toRem(buttonBox.left - ringBox.left)).toBe(0.25);
    expect(toRem(buttonBox.top - ringBox.top)).toBe(0.25);
    expect(ringStyle.pointerEvents).toBe('none');
    expect(hasNoOutline(button)).toBe(true);
    expect(button.children).toHaveLength(2);

    await userEvent.keyboard('{Enter}');
    expect(args.onPress).toHaveBeenCalled();

    await userEvent.tab();
    expect(button.children).toHaveLength(1);
  },
};

export const MouseDown: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByRole('button', { name: 'Next' });
    const swatch = await canvas.findByTestId('ring-colour');

    await userEvent.pointer({ keys: '[MouseLeft>]', target: button });
    await waitForNextFrame();

    const ring = button.firstElementChild as HTMLElement;
    const ringStyle = getComputedStyle(ring);
    expect(toRem(ringStyle.borderTopWidth)).toBe(0.125);
    expect(ringStyle.borderTopColor).toBe(
      getComputedStyle(swatch).borderTopColor,
    );
    expect(hasNoOutline(button)).toBe(true);
    expect(button.children).toHaveLength(2);

    await userEvent.pointer({ keys: '[/MouseLeft]', target: button });
    button.blur();
    await waitForNextFrame();

    expect(button.children).toHaveLength(1);
  },
};
