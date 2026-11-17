import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { useState } from 'react';

import { TopBar } from '../TopBar/TopBar';
import { Textarea } from './Textarea';
import { textareaMeta } from './Textarea.meta';

function TextareaDemo() {
  const [text, setText] = useState('');

  return (
    <View className="p-gutter">
      <WithText>
        {(t) => (
          <Textarea
            value={text}
            onChangeText={setText}
            placeholder={t('home.wordsPlaceholder')}
            accessibilityLabel={t('home.wordsLabel')}
            trailing={
              <TopBar.Button
                icon="mic"
                accessibilityLabel={t('home.dictate')}
                onPress={fn()}
              />
            }
          />
        )}
      </WithText>
      <View testID="field-swatch" className="h-1 w-1 bg-field opacity-0" />
    </View>
  );
}

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(textareaMeta) } },
    controls: { disable: true },
  },
  render: () => <TextareaDemo />,
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const field = (await canvas.findByRole('textbox', {
      name: t('home.wordsLabel'),
    })) as HTMLTextAreaElement;
    const swatch = await canvas.findByTestId('field-swatch');
    const dictate = await canvas.findByRole('button', {
      name: t('home.dictate'),
    });
    const style = getComputedStyle(field);

    expect(field.placeholder).toBe(t('home.wordsPlaceholder'));
    expect(getComputedStyle(field, '::placeholder').color).not.toBe(
      style.color,
    );
    expect(toRem(style.borderTopWidth)).toBe(0.125);
    expect(style.borderTopColor).toBe(getComputedStyle(swatch).backgroundColor);
    expect(toRem(field.getBoundingClientRect().height)).toBeGreaterThanOrEqual(
      9,
    );
    expect(toRem(style.paddingBottom)).toBe(4);
    expect(field.getBoundingClientRect().bottom).toBeGreaterThan(
      dictate.getBoundingClientRect().bottom,
    );
    expect(field.getBoundingClientRect().right).toBeGreaterThan(
      dictate.getBoundingClientRect().right,
    );

    await userEvent.type(field, 'Bahnhof');
    expect(field.value).toBe('Bahnhof');
  },
};
