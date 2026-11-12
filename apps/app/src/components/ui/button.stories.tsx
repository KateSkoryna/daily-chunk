import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import type { ComponentProps } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { Icon } from '../Icon/Icon';
import { Button, type ButtonVariant } from './button';
import { buttonMeta } from './button.meta';
import { Text } from './text';

type ButtonStoryArgs = ComponentProps<typeof Button> & { label: string };

const variants = [
  'default',
  'secondary',
  'ghost',
  'destructive',
] as const satisfies readonly ButtonVariant[];

const heightInRem = {
  default: 4,
  secondary: 3.5,
  ghost: 3,
  destructive: 3.5,
} as const satisfies Record<ButtonVariant, number>;

const labelFamily = {
  default: 'Russo One',
  secondary: 'Russo One',
  ghost: 'Handjet',
  destructive: 'Russo One',
} as const satisfies Record<ButtonVariant, string>;

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(buttonMeta) } },
    controls: { include: ['variant', 'disabled', 'label'] },
  },
  args: {
    variant: 'default',
    disabled: false,
    label: 'Next',
    onPress: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variants,
      description:
        'Visual weight of the action. One default (primary) button per screen.',
    },
    disabled: {
      control: 'boolean',
      description: 'Blocks the press. The default variant turns grey.',
    },
    label: {
      control: 'text',
      description: 'The label shown inside the button.',
    },
  },
  render: ({ label, ...args }) => (
    <View className="items-start gap-4 p-gutter">
      <Button {...args}>
        <Text>{label}</Text>
      </Button>
    </View>
  ),
} satisfies Meta<ButtonStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

function shadowBlocksOf(button: HTMLElement) {
  const sibling = button.previousElementSibling;
  const isShadowBlock =
    sibling !== null && getComputedStyle(sibling).position === 'absolute';
  return isShadowBlock ? 1 : 0;
}

function clickEvenWhenDisabled(button: HTMLElement) {
  return userEvent.setup({ pointerEventsCheck: 0 }).click(button);
}

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const button = await within(canvasElement).findByRole('button', {
      name: args.label,
    });
    const variant = args.variant ?? 'default';
    const label = button.querySelector('div') as HTMLElement;

    expect(toRem(button.getBoundingClientRect().height)).toBe(
      heightInRem[variant],
    );
    expect(getComputedStyle(label).fontFamily).toContain(labelFamily[variant]);
    expect(shadowBlocksOf(button)).toBe(
      variant === 'default' && !args.disabled ? 1 : 0,
    );

    await clickEvenWhenDisabled(button);
    expect(args.onPress).toHaveBeenCalledTimes(args.disabled ? 0 : 1);
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View className="items-start gap-6 p-gutter">
      {variants.map((variant) => (
        <Button key={variant} variant={variant}>
          <Text>{variant}</Text>
        </Button>
      ))}
    </View>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const variant of variants) {
      const button = await canvas.findByRole('button', { name: variant });
      const style = getComputedStyle(button);

      expect(toRem(button.getBoundingClientRect().height)).toBe(
        heightInRem[variant],
      );
      expect(toRem(style.borderTopWidth)).toBe(
        variant === 'secondary' ? 0.125 : 0,
      );
      expect(shadowBlocksOf(button)).toBe(variant === 'default' ? 1 : 0);
    }
  },
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: ({ onPress }) => (
    <View className="items-start gap-6 p-gutter">
      {variants.map((variant) => (
        <Button key={variant} variant={variant} disabled onPress={onPress}>
          <Text>{variant}</Text>
        </Button>
      ))}
    </View>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const buttons = await Promise.all(
      variants.map((variant) => canvas.findByRole('button', { name: variant })),
    );
    const fills = buttons.map((button) => getComputedStyle(button));
    const labelColours = buttons.map(
      (button) => getComputedStyle(button.querySelector('div')!).color,
    );

    for (const button of buttons) {
      expect(button.getAttribute('aria-disabled')).toBe('true');
      expect(shadowBlocksOf(button)).toBe(0);
      await clickEvenWhenDisabled(button);
    }

    expect(args.onPress).not.toHaveBeenCalled();
    expect(new Set(fills.map((style) => style.backgroundColor)).size).toBe(1);
    expect(new Set(labelColours).size).toBe(1);
    expect(fills[1]!.borderTopColor).toBe(fills[1]!.backgroundColor);
  },
};

export const Pressed: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Hold the mouse button on the primary button: it moves 0.25rem down and right and the shadow disappears.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const button = await within(canvasElement).findByRole('button', {
      name: args.label,
    });
    const restingBox = button.getBoundingClientRect();

    expect(shadowBlocksOf(button)).toBe(1);

    await userEvent.pointer({ keys: '[MouseLeft>]', target: button });

    await waitFor(() => {
      const pressedBox = button.getBoundingClientRect();
      expect(toRem(pressedBox.left - restingBox.left)).toBe(0.25);
      expect(toRem(pressedBox.top - restingBox.top)).toBe(0.25);
      expect(shadowBlocksOf(button)).toBe(0);
    });

    await userEvent.pointer({ keys: '[/MouseLeft]', target: button });
    button.blur();

    await waitFor(() => expect(shadowBlocksOf(button)).toBe(1));
  },
};

export const WithIcon: Story = {
  args: { variant: 'secondary', label: 'Listen' },
  parameters: { controls: { include: ['variant', 'label'] } },
  render: ({ label, ...args }) => (
    <View className="items-start gap-4 p-gutter">
      <Button {...args}>
        <Icon name="speaker" decorative />
        <Text>{label}</Text>
      </Button>
    </View>
  ),
  play: async ({ canvasElement, args }) => {
    const button = await within(canvasElement).findByRole('button', {
      name: args.label,
    });
    const icon = button.querySelector('svg') as SVGElement;
    const label = button.querySelector('div') as HTMLElement;

    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(getComputedStyle(icon).color).toBe(getComputedStyle(label).color);
  },
};
