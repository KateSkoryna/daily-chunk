import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
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
      description:
        'Required when the content is an icon only. Empty: the translated default for the app language.',
    },
  },
  render: (args) => (
    <View className="items-start gap-4 p-gutter">
      <WithText>
        {(t) => {
          const label = args.accessibilityLabel || t('common.next');

          return (
            <PressableFocus {...args} accessibilityLabel={label}>
              <Text variant="display-btn-sm">{label}</Text>
            </PressableFocus>
          );
        }}
      </WithText>
      <View testID="ring-colour" className="h-4 w-4 border-2 border-ring" />
    </View>
  ),
} satisfies Meta<typeof PressableFocus>;

export default meta;

type Story = StoryObj<typeof PressableFocus>;

function findControl(
  canvasElement: HTMLElement,
  args: PressableFocusProps,
  globals: Record<string, unknown>,
) {
  return within(canvasElement).findByRole(args.accessibilityRole ?? 'button', {
    name: args.accessibilityLabel || textFor(globals)('common.next'),
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
  play: async ({ canvasElement, args, globals }) => {
    const button = await findControl(canvasElement, args, globals);
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
  play: async ({ canvasElement, args, globals }) => {
    const canvas = within(canvasElement);
    const button = await findControl(canvasElement, args, globals);

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
          'Click the control with the mouse: no ring appears for a click or a tap. The ring is only for keyboard focus (see Focused). The rule that tells a click from a Tab is the browser\u2019s focus-visible; the unit test hasKeyboardFocus covers it.',
      },
    },
  },
  play: async ({ canvasElement, args, globals }) => {
    const button = await findControl(canvasElement, args, globals);

    await userEvent.click(button);
    await waitForNextFrame();

    expect(args.onPress).toHaveBeenCalled();
  },
};
