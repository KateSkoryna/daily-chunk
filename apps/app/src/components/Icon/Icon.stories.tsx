import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { Text, TextClassContext } from '../ui/text';
import { Icon } from './Icon';
import { iconNames } from './icon-shapes';

const meta = {
  title: 'Primitives/Icon',
  component: Icon,
  args: { name: 'check', decorative: true },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
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

export const WithLabel: Story = {
  args: { name: 'check', label: 'Correct', decorative: undefined },
  render: (args) => (
    <View className="flex-row items-center gap-4 p-gutter">
      <Icon {...args} className="text-success" />
      <View testID="success-colour" className="h-4 w-4 bg-success" />
    </View>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = await canvas.findByRole('img', { name: 'Correct' });
    const swatch = await canvas.findByTestId('success-colour');

    expect(getComputedStyle(icon).color).toBe(
      getComputedStyle(swatch).backgroundColor,
    );
    expect(icon.getAttribute('aria-hidden')).toBeNull();
  },
};

export const ColourFromTextContext: Story = {
  args: { name: 'mic', decorative: true },
  render: (args) => (
    <View className="flex-row items-center gap-4 p-gutter">
      <TextClassContext.Provider value="text-ring">
        <Icon {...args} />
      </TextClassContext.Provider>
      <View testID="ring-colour" className="h-4 w-4 bg-ring" />
    </View>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = canvasElement.querySelector('svg')!;
    const swatch = await canvas.findByTestId('ring-colour');

    expect(getComputedStyle(icon).color).toBe(
      getComputedStyle(swatch).backgroundColor,
    );
  },
};
