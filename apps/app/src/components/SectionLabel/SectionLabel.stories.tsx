import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { Text } from '../ui/text';
import { SectionLabel } from './SectionLabel';
import { sectionLabelMeta } from './SectionLabel.meta';

const meta = {
  title: 'Components/SectionLabel',
  component: SectionLabel,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(sectionLabelMeta) } },
    controls: { disable: true },
  },
  render: () => (
    <View className="gap-2 p-gutter">
      <WithText>
        {(t) => (
          <>
            <SectionLabel>{t('home.addWords')}</SectionLabel>
            <Text testID="body-text">{t('home.addWords')}</Text>
          </>
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof SectionLabel>;

export default meta;

type Story = StoryObj<typeof SectionLabel>;

export const Default: Story = {
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const heading = await canvas.findByRole('heading', {
      name: t('home.addWords'),
    });
    const style = getComputedStyle(heading);
    const body = getComputedStyle(await canvas.findByTestId('body-text'));

    expect(style.textTransform).toBe('uppercase');
    expect(toRem(style.fontSize)).toBe(1.5);
    expect(toRem(style.letterSpacing)).toBe(0.125);
    expect(style.color).not.toBe(body.color);
  },
};
