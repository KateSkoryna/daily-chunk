import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { StatTile, type StatTileVariant } from './StatTile';
import { statTileMeta } from './StatTile.meta';

const variants = ['primary', 'success', 'highlight'] as const;

const meta = {
  title: 'Components/StatTile',
  component: StatTile,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(statTileMeta) } },
    controls: { include: ['variant', 'value', 'label'] },
  },
  args: { variant: 'primary', value: '+140', label: 'XP' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: variants,
      description:
        'primary is filled yellow; success and highlight are outlines.',
    },
    value: { control: 'text', description: 'The number, as text.' },
    label: { control: 'text', description: 'The label under the number.' },
  },
  render: (args) => (
    <View className="flex-row p-gutter">
      <StatTile {...args} />
    </View>
  ),
} satisfies Meta<typeof StatTile>;

export default meta;

type Story = StoryObj<typeof meta>;

function isTransparent(colour: string) {
  return colour === 'transparent' || /,\s*0\)$/.test(colour);
}

function tileOf(valueElement: HTMLElement) {
  return valueElement.parentElement as HTMLElement;
}

function expectTile(tile: HTMLElement, variant: StatTileVariant) {
  const style = getComputedStyle(tile);

  expect(toRem(tile.getBoundingClientRect().height)).toBeGreaterThanOrEqual(6);
  if (variant === 'primary') {
    expect(toRem(style.borderTopWidth)).toBe(0);
    expect(isTransparent(style.backgroundColor)).toBe(false);
  } else {
    expect(toRem(style.borderTopWidth)).toBe(0.125);
    expect(style.borderTopColor).toBe(
      getComputedStyle(tile.firstElementChild as HTMLElement).color,
    );
  }
}

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const value = await canvas.findByText(args.value);
    const label = await canvas.findByText(args.label);
    const tile = tileOf(value);

    expectTile(tile, args.variant);
    expect(getComputedStyle(label).color).toBe(getComputedStyle(value).color);
    expect(label.getBoundingClientRect().top).toBeGreaterThan(
      value.getBoundingClientRect().top,
    );
  },
};

export const Row: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View className="flex-row gap-2 p-gutter">
      <StatTile variant="primary" value="+140" label="XP" />
      <StatTile variant="success" value="13" label="Day streak" />
      <StatTile variant="highlight" value="88%" label="Accuracy" />
    </View>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tiles = [
      tileOf(await canvas.findByText('+140')),
      tileOf(await canvas.findByText('13')),
      tileOf(await canvas.findByText('88%')),
    ];
    const widths = tiles.map((tile) => tile.getBoundingClientRect().width);
    const colours = new Set(
      ['+140', '13', '88%'].map(
        (value) =>
          getComputedStyle(within(canvasElement).getByText(value)).color,
      ),
    );

    expect(new Set(widths.map(Math.round)).size).toBe(1);
    expect(colours.size).toBe(3);
    variants.forEach((variant, index) => expectTile(tiles[index]!, variant));
  },
};
