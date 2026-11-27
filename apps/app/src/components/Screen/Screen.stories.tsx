import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { rootFontSizeInPixels, toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { Button } from '../ui/button';
import { Text } from '../ui/text';
import { Screen } from './Screen';
import { screenMeta } from './Screen.meta';

const meta = {
  title: 'Primitives/Screen',
  component: Screen,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(screenMeta) } },
  },
} satisfies Meta<typeof Screen>;

export default meta;

type Story = StoryObj<typeof meta>;

function expectedPaddingInRem() {
  const viewportInRem = window.innerWidth / rootFontSizeInPixels();
  if (viewportInRem >= 64) return { top: 1.5, side: 3, bottom: 2.5 };
  if (viewportInRem >= 37.5) return { top: 1, side: 2, bottom: 1 };
  return { top: 1, side: 1.5, bottom: 1 };
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

function ancestorWhere(
  start: HTMLElement,
  isWanted: (element: HTMLElement) => boolean,
) {
  let element = start.parentElement;
  while (element && !isWanted(element)) element = element.parentElement;
  if (!element) throw new Error('No matching ancestor');
  return element;
}

export const Default: Story = {
  parameters: { controls: { disable: true } },
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

    const ground = ancestorWhere(
      content,
      (element) =>
        element.firstElementChild?.getAttribute('aria-hidden') === 'true',
    );
    const lines = ground.querySelectorAll('[aria-hidden="true"]');
    expect(lines).toHaveLength(1);
    expect(ground.firstElementChild).toBe(lines[0]);
  },
};

export const MobileWidth: Story = {
  parameters: { controls: { disable: true } },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  render: () => <ScreenWithContent />,
  play: async (context) => {
    expect(window.innerWidth).toBeLessThan(600);
    await Default.play!(context);
  },
};

export const TallContent: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View className="h-64">
      <Screen>
        {Array.from({ length: 12 }, (_, index) => (
          <Text key={index} variant="body">
            {`Wort ${index + 1}`}
          </Text>
        ))}
        <Button variant="secondary">
          <Text>Weiter</Text>
        </Button>
      </Screen>
    </View>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lastLine = await canvas.findByText('Wort 12');
    const scrollContainer = ancestorWhere(
      lastLine,
      (element) => getComputedStyle(element).overflowY !== 'visible',
    );

    expect(scrollContainer.scrollHeight).toBeGreaterThan(
      scrollContainer.clientHeight,
    );
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
    expect(scrollContainer.scrollTop).toBeGreaterThan(0);
    expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
      canvasElement.clientWidth,
    );
  },
};
