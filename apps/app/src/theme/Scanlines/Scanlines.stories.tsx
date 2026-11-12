import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect } from 'storybook/test';

import { rootFontSizeInPixels } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { Scanlines } from './Scanlines';
import { scanlinesMeta } from './Scanlines.meta';
import { lineGapInRem, lineThicknessInRem } from './scanline-metrics';

const meta = {
  title: 'Primitives/Scanlines',
  component: Scanlines,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(scanlinesMeta) } },
  },
} satisfies Meta<typeof Scanlines>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View className="h-flashcard bg-background">
      <Scanlines />
    </View>
  ),
  play: async ({ canvasElement }) => {
    const lines = canvasElement.querySelector('[aria-hidden="true"]')!;
    const style = getComputedStyle(lines);
    const lineThickness = lineThicknessInRem * rootFontSizeInPixels();
    const lineGap = lineGapInRem * rootFontSizeInPixels();
    const alpha = style.color.match(/([\d.]+)\)$/)?.[1];

    expect(style.backgroundImage).toContain('repeating-linear-gradient');
    expect(style.backgroundImage).toContain(`${lineThickness}px`);
    expect(style.backgroundImage).toContain(`${lineGap}px`);
    expect(style.pointerEvents).toBe('none');
    expect(Number(alpha)).toBe(0.05);
  },
};
