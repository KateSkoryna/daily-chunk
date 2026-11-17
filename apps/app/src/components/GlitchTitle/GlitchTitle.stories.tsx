import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { GlitchTitle } from './GlitchTitle';
import { glitchTitleMeta } from './GlitchTitle.meta';

const meta = {
  title: 'Components/GlitchTitle',
  component: GlitchTitle,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(glitchTitleMeta) } },
    controls: { include: ['variant'] },
  },
  args: { variant: 'display-xl', children: '' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['display-xl', 'display-l'],
      description: 'display-xl is the Home title; display-l is smaller.',
    },
  },
  render: ({ variant }) => (
    <View className="p-gutter">
      <WithText>
        {(t) => <GlitchTitle variant={variant}>{t('app.name')}</GlitchTitle>}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof GlitchTitle>;

export default meta;

type Story = StoryObj<typeof GlitchTitle>;

export const Default: Story = {
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const title = t('app.name');
    const canvas = within(canvasElement);
    const front = await canvas.findByRole('heading', { name: title });
    const copies = canvas
      .getAllByText(title)
      .filter((element) => element !== front);
    const [pink, cyan] = copies;
    const frontBox = front.getBoundingClientRect();

    expect(copies).toHaveLength(2);
    expect(pink!.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(cyan!.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(
      toRem(pink!.getBoundingClientRect().left - frontBox.left),
    ).toBeCloseTo(0.1875, 2);
    expect(
      toRem(cyan!.getBoundingClientRect().left - frontBox.left),
    ).toBeCloseTo(-0.1875, 2);
    expect(
      new Set([pink, cyan, front].map((node) => getComputedStyle(node!).color))
        .size,
    ).toBe(3);
    expect(toRem(getComputedStyle(front).fontSize)).toBeGreaterThanOrEqual(
      2.125,
    );
  },
};
