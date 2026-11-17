import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { Notice } from './Notice';
import { noticeMeta } from './Notice.meta';

const meta = {
  title: 'Components/Notice',
  component: Notice,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(noticeMeta) } },
    controls: { disable: true },
  },
  args: { children: '' },
  render: () => (
    <View className="p-gutter">
      <WithText>
        {(t) => (
          <Notice>
            {t('confirm.pluralNotice', {
              written: 'Bahnhöfe',
              saved: 'der Bahnhof',
            })}
          </Notice>
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof Notice>;

export default meta;

type Story = StoryObj<typeof Notice>;

export const Default: Story = {
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const message = t('confirm.pluralNotice', {
      written: 'Bahnhöfe',
      saved: 'der Bahnhof',
    });
    const notice = await within(canvasElement).findByRole('status');
    const style = getComputedStyle(notice);
    const text = within(notice).getByText(message);

    expect(style.borderTopStyle).toBe('dashed');
    expect(toRem(style.borderTopWidth)).toBe(0.125);
    expect(style.borderTopColor).toBe(getComputedStyle(text).color);
    expect(toRem(style.paddingLeft)).toBe(0.75);
  },
};
