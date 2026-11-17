import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { Text } from '../ui/text';
import { SectionLabel } from './SectionLabel';
import { sectionLabelMeta } from './SectionLabel.meta';

const meta = {
  title: 'Components/SectionLabel',
  component: SectionLabel,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(sectionLabelMeta) } },
    controls: { include: ['children'] },
  },
  args: { children: "01 / Add today's words" },
  argTypes: {
    children: { control: 'text', description: 'The label text.' },
  },
  render: (args) => (
    <View className="gap-2 p-gutter">
      <SectionLabel {...args} />
      <Text testID="body-text">Body text for comparison</Text>
    </View>
  ),
} satisfies Meta<typeof SectionLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const heading = await canvas.findByRole('heading', {
      name: String(args.children),
    });
    const style = getComputedStyle(heading);
    const body = getComputedStyle(await canvas.findByTestId('body-text'));

    expect(style.textTransform).toBe('uppercase');
    expect(toRem(style.fontSize)).toBe(1.5);
    expect(toRem(style.letterSpacing)).toBe(0.125);
    expect(style.color).not.toBe(body.color);
  },
};
