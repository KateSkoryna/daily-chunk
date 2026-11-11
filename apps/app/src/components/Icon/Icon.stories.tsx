import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { Text, TextClassContext } from '../ui/text';
import { Icon } from './Icon';
import { iconNames } from './icon-shapes';
import { iconMeta } from './Icon.meta';

const colourSwatches = {
  'text-foreground': 'bg-foreground',
  'text-muted-foreground': 'bg-muted-foreground',
  'text-primary': 'bg-primary',
  'text-ring': 'bg-ring',
  'text-success': 'bg-success',
  'text-highlight': 'bg-highlight',
} as const;

const colourClasses = Object.keys(
  colourSwatches,
) as (keyof typeof colourSwatches)[];

function ScreenReaderCaption({ text }: { text: string }) {
  return <Text variant="caption">{`Screen readers say: "${text}"`}</Text>;
}

const meta = {
  title: 'Primitives/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(iconMeta) } },
  },
  args: { name: 'check', label: 'Correct', className: 'text-foreground' },
  argTypes: {
    name: {
      control: 'select',
      options: iconNames,
      description: 'Which icon to draw. The set is fixed (14 icons).',
    },
    label: {
      control: 'text',
      description:
        'Accessible name. Required when the icon stands alone; leave empty when decorative.',
    },
    decorative: {
      control: 'boolean',
      description:
        'Hide the icon from screen readers. Use when text next to it already says the same.',
    },
    className: {
      control: 'select',
      options: colourClasses,
      description:
        'Colour class. On phones the colour also comes from the surrounding text class.',
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ name, label, decorative, className }) => (
    <View className="items-start gap-4 p-gutter">
      <View className="flex-row items-center gap-4">
        {decorative ? (
          <Icon name={name} decorative className={className} />
        ) : (
          <Icon name={name} label={label ?? name} className={className} />
        )}
        <View
          testID="colour-swatch"
          className={`${colourSwatches[(className ?? 'text-foreground') as keyof typeof colourSwatches]} h-2 w-6`}
        />
      </View>
      <Text variant="caption">
        {decorative
          ? 'Decorative: hidden from screen readers, no name'
          : `Screen readers say: "${label ?? name}"`}
      </Text>
    </View>
  ),
  play: async ({ canvasElement, args }) => {
    const icon = canvasElement.querySelector('svg')!;
    const swatch = canvasElement.querySelector(
      '[data-testid="colour-swatch"]',
    )!;

    expect(toRem(icon.getBoundingClientRect().width)).toBe(1.5);
    if (args.decorative) {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
      expect(icon.getAttribute('aria-label')).toBeNull();
    } else {
      expect(icon.getAttribute('aria-label')).toBe(args.label);
      expect(icon.getAttribute('role')).toBe('img');
      expect(icon.getAttribute('aria-hidden')).toBeNull();
    }
    expect(getComputedStyle(icon).color).toBe(
      getComputedStyle(swatch).backgroundColor,
    );
  },
};

export const Gallery: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View className="flex-row flex-wrap gap-4 p-gutter">
      {iconNames.map((name) => (
        <View key={name} className="items-center gap-1">
          <Icon name={name} decorative className="text-foreground" />
          <Text variant="caption">{name}</Text>
        </View>
      ))}
    </View>
  ),
  play: async ({ canvasElement }) => {
    const icons = [...canvasElement.querySelectorAll('svg')];
    const filledNames = icons
      .map((icon, index) => ({ icon, name: iconNames[index] }))
      .filter(({ icon }) => getComputedStyle(icon).fill !== 'none')
      .map(({ name }) => name)
      .sort();

    expect(icons).toHaveLength(iconNames.length);
    for (const icon of icons) {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
      expect(toRem(icon.getBoundingClientRect().width)).toBe(1.5);
      expect(toRem(icon.getBoundingClientRect().height)).toBe(1.5);
    }
    expect(filledNames).toEqual(['pause', 'play']);
  },
};

export const Decorative: Story = {
  parameters: { controls: { include: ['name'] } },
  args: { name: 'mic' },
  render: ({ name }) => (
    <View className="flex-row items-center gap-2 p-gutter">
      <Icon name={name} decorative className="text-foreground" />
      <Text variant="ui">{name}</Text>
    </View>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const icon = canvasElement.querySelector('svg')!;

    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.getAttribute('aria-label')).toBeNull();
    expect(await canvas.findByText(args.name)).toBeTruthy();
  },
};

type InheritsColourArgs = {
  parentTextClass?: keyof typeof colourSwatches;
};

export const InheritsColour: Story = {
  parameters: { controls: { include: ['name', 'label', 'parentTextClass'] } },
  args: {
    name: 'mic',
    label: 'Record',
    parentTextClass: 'text-ring',
  } as Story['args'] & InheritsColourArgs,
  argTypes: {
    parentTextClass: {
      control: 'select',
      options: colourClasses,
      description:
        'The text colour set on the parent (TextClassContext). The icon has no className and follows it.',
    },
  } as Story['argTypes'],
  render: (args) => {
    const { name, label } = args;
    const parentTextClass =
      (args as typeof args & InheritsColourArgs).parentTextClass ?? 'text-ring';

    return (
      <View className="items-start gap-4 p-gutter">
        <View className="flex-row items-center gap-4">
          <TextClassContext.Provider value={parentTextClass}>
            <Icon name={name} label={label ?? name} />
          </TextClassContext.Provider>
          <View
            testID="parent-colour-swatch"
            className={`${colourSwatches[parentTextClass]} h-4 w-4`}
          />
        </View>
        <Text variant="caption">{`Parent sets ${parentTextClass}; the icon has no colour of its own`}</Text>
        <ScreenReaderCaption text={label ?? name} />
      </View>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = canvasElement.querySelector('svg')!;
    const swatch = await canvas.findByTestId('parent-colour-swatch');

    expect(getComputedStyle(icon).color).toBe(
      getComputedStyle(swatch).backgroundColor,
    );
  },
};
