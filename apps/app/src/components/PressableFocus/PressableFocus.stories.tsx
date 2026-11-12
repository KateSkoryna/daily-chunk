import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { Text } from '../ui/text';
import { PressableFocus, type PressableFocusProps } from './PressableFocus';
import { pressableFocusMeta } from './PressableFocus.meta';

const meta = {
  title: 'Primitives/PressableFocus',
  component: PressableFocus,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(pressableFocusMeta) } },
    controls: {
      include: ['accessibilityRole', 'accessibilityLabel'],
    },
  },
  args: {
    accessibilityRole: 'button',
    accessibilityLabel: 'Next',
    onPress: fn(),
  },
  argTypes: {
    accessibilityRole: {
      control: 'select',
      options: ['button', 'link', 'tab'],
      description: 'The role of the control.',
    },
    accessibilityLabel: {
      control: 'text',
      description: 'Required when the content is an icon only.',
    },
  },
  render: (args) => (
    <View className="items-start gap-4 p-gutter">
      <PressableFocus {...args}>
        <Text variant="display-btn-sm">{args.accessibilityLabel}</Text>
      </PressableFocus>
      <View testID="ring-colour" className="h-4 w-4 border-2 border-ring" />
    </View>
  ),
} satisfies Meta<typeof PressableFocus>;

export default meta;

type Story = StoryObj<typeof meta>;

function findControl(canvasElement: HTMLElement, args: PressableFocusProps) {
  return within(canvasElement).findByRole(args.accessibilityRole ?? 'button', {
    name: args.accessibilityLabel ?? undefined,
  });
}

function waitForNextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function hasNoOutline(element: HTMLElement) {
  const style = getComputedStyle(element);
  const alpha = style.outlineColor.match(/([\d.]+)\)$/)?.[1];
  return style.outlineStyle === 'none' || Number(alpha ?? 1) === 0;
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The demo control has no look of its own, because PressableFocus draws none: only the 3rem touch target and, while it is focused or pressed, the cyan ring. Press Tab to see the ring from the keyboard. The real look comes from the component that wraps it, such as Button.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const button = await findControl(canvasElement, args);
    const box = button.getBoundingClientRect();

    expect(toRem(box.height)).toBeGreaterThanOrEqual(3);
    expect(toRem(box.width)).toBeGreaterThanOrEqual(3);
    expect(button.children).toHaveLength(1);
  },
};

export const Focused: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Tab to the control: the ring is 0.125rem thick, 0.25rem outside the control, in the ring colour, and the browser outline is off.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = await findControl(canvasElement, args);

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

export const Pressed: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Hold the mouse button: the same ring shows while the control is pressed, which is what a touch screen needs because a tap does not focus.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = await findControl(canvasElement, args);
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
