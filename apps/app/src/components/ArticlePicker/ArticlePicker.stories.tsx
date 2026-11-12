import {
  getTargetLanguagePack,
  supportedTargetLanguages,
  type GenderRole,
} from '@daily-chunk/languages';
import { Description, Title } from '@storybook/addon-docs/blocks';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { ArticlePicker, type ArticlePickerProps } from './ArticlePicker';
import { articlePickerMeta } from './ArticlePicker.meta';

const genderOptions = ['none', 'masc', 'fem', 'neut'];

function PickerDemo({ value, onSelect, ...props }: ArticlePickerProps) {
  const [chosen, setChosen] = useState(value);

  return (
    <View className="p-gutter">
      <ArticlePicker
        {...props}
        value={chosen}
        onSelect={(gender) => {
          setChosen(gender);
          onSelect(gender);
        }}
      />
    </View>
  );
}

const meta = {
  title: 'Components/ArticlePicker',
  component: ArticlePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: metaToMarkdown(articlePickerMeta) },
      page: () => (
        <>
          <Title />
          <Description />
        </>
      ),
    },
    controls: { include: ['value', 'correctAnswer'] },
  },
  args: {
    targetLanguage: 'de',
    value: null,
    correctAnswer: undefined,
    accessibilityLabel: 'Pick the article',
    onSelect: fn(),
  },
  argTypes: {
    targetLanguage: {
      control: 'select',
      options: supportedTargetLanguages,
      description: 'The language being learned; its pack lists the choices.',
    },
    value: {
      control: 'select',
      options: genderOptions,
      mapping: { none: null },
      description: 'The chosen gender, or none before a choice.',
    },
    correctAnswer: {
      control: 'select',
      options: genderOptions,
      mapping: { none: undefined },
      description:
        'The right gender. Once set, the picker shows the result and locks.',
    },
  },
  render: (args) => <PickerDemo key={String(args.value)} {...args} />,
} satisfies Meta<typeof ArticlePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

function articleOf(gender: GenderRole) {
  return getTargetLanguagePack('de').articles[gender];
}

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const group = await canvas.findByRole('radiogroup', {
      name: args.accessibilityLabel,
    });
    const radios = within(group).getAllByRole('radio');
    const pack = getTargetLanguagePack(args.targetLanguage);

    expect(radios).toHaveLength(pack.pickerGenders.length);
    for (const radio of radios) {
      expect(toRem(radio.getBoundingClientRect().height)).toBe(3);
    }

    if (args.correctAnswer === undefined) {
      for (const radio of radios) {
        expect(radio.getAttribute('aria-disabled')).not.toBe('true');
      }
      const target = pack.pickerGenders.find(
        (gender) => gender !== args.value,
      )!;
      const targetRadio = await canvas.findByRole('radio', {
        name: articleOf(target),
      });

      await userEvent.click(targetRadio);

      expect(args.onSelect).toHaveBeenCalledWith(target);
      expect(targetRadio.getAttribute('aria-checked')).toBe('true');
      return;
    }

    for (const radio of radios) {
      expect(radio.getAttribute('aria-disabled')).toBe('true');
    }
    if (args.value !== null) {
      const picked = await canvas.findByRole('radio', {
        name: new RegExp(articleOf(args.value)),
      });
      const resultName =
        args.value === args.correctAnswer ? 'Correct' : 'Wrong';

      expect(within(picked).getByRole('img').getAttribute('aria-label')).toBe(
        resultName,
      );
    }
    await userEvent.click(radios[0]!, { pointerEventsCheck: 0 });
    expect(args.onSelect).not.toHaveBeenCalled();
  },
};
