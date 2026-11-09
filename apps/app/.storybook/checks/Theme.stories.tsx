import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';
import { expect, within } from 'storybook/test';

function PrimarySurface() {
  return (
    <View testID="primary-surface" className="bg-primary p-gutter">
      <Text className="font-pixel text-label text-primary-foreground">
        Primary surface
      </Text>
    </View>
  );
}

const meta = {
  title: 'Checks/Theme',
  component: PrimarySurface,
} satisfies Meta<typeof PrimarySurface>;

export default meta;

type Story = StoryObj<typeof meta>;

function colourPaintedFromToken(tokenName: string) {
  const tokenChannels = getComputedStyle(document.documentElement)
    .getPropertyValue(tokenName)
    .trim();
  const swatch = document.createElement('div');
  swatch.style.backgroundColor = `hsl(${tokenChannels})`;
  document.body.appendChild(swatch);
  const swatchColour = getComputedStyle(swatch).backgroundColor;
  swatch.remove();
  return swatchColour;
}

export const PrimarySurfaceUsesPrimaryToken: Story = {
  play: async ({ canvasElement, step }) => {
    let boxColour = '';
    let tokenColour = '';

    await step('Read the real colour of the box in the story', async () => {
      const box = within(canvasElement).getByTestId('primary-surface');
      boxColour = getComputedStyle(box).backgroundColor;
    });

    await step('Read the colour of the --primary token', async () => {
      tokenColour = colourPaintedFromToken('--primary');
    });

    await step('Check that both colours are equal', async () => {
      await expect(boxColour).toBe(tokenColour);
    });
  },
};
