import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { Text } from '../../components/ui/text';
import { HardShadow } from './HardShadow';
import { hardShadowMeta } from './HardShadow.meta';

const meta = {
  title: 'Primitives/HardShadow',
  component: HardShadow,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(hardShadowMeta) } },
  },
} satisfies Meta<typeof HardShadow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View className="p-gutter">
      <HardShadow testID="hard-shadow">
        <View className="items-center justify-center bg-primary p-4">
          <Text variant="display-btn" className="text-primary-foreground">
            Next
          </Text>
        </View>
      </HardShadow>
    </View>
  ),
  play: async ({ canvasElement }) => {
    const wrapper = await within(canvasElement).findByTestId('hard-shadow');
    const block = wrapper.children[0] as HTMLElement;
    const element = wrapper.children[1] as HTMLElement;
    const blockBox = block.getBoundingClientRect();
    const elementBox = element.getBoundingClientRect();

    expect(toRem(blockBox.left - elementBox.left)).toBe(0.25);
    expect(toRem(blockBox.top - elementBox.top)).toBe(0.25);
    expect(blockBox.width).toBe(elementBox.width);
    expect(blockBox.height).toBe(elementBox.height);
    expect(getComputedStyle(block).backgroundColor).not.toBe(
      getComputedStyle(element).backgroundColor,
    );
    expect(getComputedStyle(block).pointerEvents).toBe('none');
  },
};
