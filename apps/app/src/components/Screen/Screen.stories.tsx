import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { rootFontSizeInPixels, toRem } from '../../lib/browser-rem';
import { Text } from '../ui/text';
import { Screen } from './Screen';

const meta = {
  title: 'Primitives/Screen',
  component: Screen,
} satisfies Meta<typeof Screen>;

export default meta;

type Story = StoryObj<typeof meta>;

function expectedPaddingInRem() {
  const viewportInRem = window.innerWidth / rootFontSizeInPixels();
  if (viewportInRem >= 64) return { top: 4, side: 3, bottom: 1 };
  if (viewportInRem >= 37.5) return { top: 3.5, side: 2, bottom: 1 };
  return { top: 3.5, side: 1.5, bottom: 1 };
}

function ScreenWithContent() {
  return (
    <View className="h-screen">
      <Screen>
        <Text variant="display-l">Lektion 12</Text>
        <Text variant="body">5 words due today</Text>
      </Screen>
    </View>
  );
}

export const WithContent: Story = {
  render: () => <ScreenWithContent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = await canvas.findByText('Lektion 12');
    const content = title.parentElement!;
    const style = getComputedStyle(content);
    const expected = expectedPaddingInRem();

    expect(toRem(style.paddingTop)).toBe(expected.top);
    expect(toRem(style.paddingLeft)).toBe(expected.side);
    expect(toRem(style.paddingRight)).toBe(expected.side);
    expect(toRem(style.paddingBottom)).toBe(expected.bottom);

    const ground = content.parentElement!;
    const lines = ground.querySelectorAll('[aria-hidden="true"]');
    expect(lines).toHaveLength(1);
    expect(ground.firstElementChild).toBe(lines[0]);
  },
};

export const MobileWidth: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  render: () => <ScreenWithContent />,
  play: async (context) => {
    expect(window.innerWidth).toBeLessThan(600);
    await WithContent.play!(context);
  },
};
