import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { createWordFields, type WordField } from '../../lib/word-fields';
import { WordFields, type WordFieldsProps } from './WordFields';
import { wordFieldsMeta } from './WordFields.meta';

function WordFieldsDemo({ words, onChange, ...props }: WordFieldsProps) {
  const [fieldTexts, setFieldTexts] = useState(words);

  return (
    <View className="p-gutter">
      <WithText>
        {(t) => (
          <WordFields
            {...props}
            words={fieldTexts}
            placeholder={t('home.wordsPlaceholder')}
            onChange={(next) => {
              setFieldTexts(next);
              onChange(next);
            }}
          />
        )}
      </WithText>
    </View>
  );
}

const meta = {
  title: 'Components/WordFields',
  component: WordFields,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: wordFieldsMetaMarkdown() } },
    controls: { include: ['minFields', 'maxFields'] },
  },
  args: {
    words: createWordFields(['', '', '']),
    minFields: 3,
    maxFields: 6,
    onChange: fn(),
    onWordsLeftOut: fn(),
  },
  argTypes: {
    minFields: {
      control: 'number',
      description: 'How many fields cannot be removed.',
    },
    maxFields: {
      control: 'number',
      description: 'The most fields there can be; the add button goes away.',
    },
  },
  render: (args) => <WordFieldsDemo {...args} />,
} satisfies Meta<typeof WordFields>;

function wordFieldsMetaMarkdown() {
  return metaToMarkdown(wordFieldsMeta);
}

export default meta;

type Story = StoryObj<typeof meta>;

function lastTexts(onChange: { mock: { lastCall?: unknown[] } }) {
  const words = onChange.mock.lastCall?.[0] as WordField[];
  return words.map((field) => field.text);
}

function fieldName(t: ReturnType<typeof textFor>, number: number) {
  return t('home.wordField', { number });
}

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const first = await canvas.findByRole('textbox', {
      name: fieldName(t, 1),
    });
    expect(canvas.getAllByRole('textbox')).toHaveLength(3);
    expect(
      canvas.queryByRole('button', { name: /^Remove|^Удалить/ }),
    ).toBeNull();

    await userEvent.type(first, 'Bahnhof');
    expect((first as HTMLInputElement).value).toBe('Bahnhof');
    expect(lastTexts(args.onChange)).toEqual(['Bahnhof', '', '']);

    const cross = canvas.getByRole('button', {
      name: t('home.removeWord', { number: 1 }),
    });

    expect(cross.getBoundingClientRect().left).toBeGreaterThan(
      first.getBoundingClientRect().right,
    );
    expect(toRem(cross.getBoundingClientRect().width)).toBeGreaterThanOrEqual(
      3,
    );
    expect(toRem(parseFloat(getComputedStyle(cross).borderTopWidth))).toBe(
      0.125,
    );

    await userEvent.click(cross);
    expect((first as HTMLInputElement).value).toBe('');
    expect(canvas.getAllByRole('textbox')).toHaveLength(3);
    expect(
      canvas.queryByRole('button', { name: /^Remove|^Удалить/ }),
    ).toBeNull();
  },
};

export const AddingFields: Story = {
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const add = await canvas.findByRole('button', { name: t('home.addWord') });

    await userEvent.click(add);
    await userEvent.click(
      canvas.getByRole('button', { name: t('home.addWord') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('home.addWord') }),
    );

    expect(canvas.getAllByRole('textbox')).toHaveLength(6);
    expect(
      canvas.queryByRole('button', { name: t('home.addWord') }),
    ).toBeNull();

    await userEvent.click(
      canvas.getByRole('button', { name: t('home.removeWord', { number: 6 }) }),
    );
    expect(canvas.getAllByRole('textbox')).toHaveLength(5);
    expect(
      canvas.getByRole('button', { name: t('home.addWord') }),
    ).toBeTruthy();
  },
};

export const EnterMovesOn: Story = {
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const first = await canvas.findByRole('textbox', { name: fieldName(t, 1) });

    await userEvent.type(first, 'Bahnhof{enter}Gleis');

    expect(document.activeElement).toBe(
      canvas.getByRole('textbox', { name: fieldName(t, 2) }),
    );
    expect(
      (
        canvas.getByRole('textbox', {
          name: fieldName(t, 2),
        }) as HTMLInputElement
      ).value,
    ).toBe('Gleis');
  },
};

export const PastedList: Story = {
  args: { maxFields: 4 },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const first = await canvas.findByRole('textbox', { name: fieldName(t, 1) });

    await userEvent.click(first);
    await userEvent.paste('Bahnhof, Fahrkarte verspätet, Gleis Haus');

    expect(lastTexts(args.onChange)).toEqual([
      'Bahnhof',
      'Fahrkarte',
      'verspätet',
      'Gleis',
    ]);
    expect(args.onWordsLeftOut).toHaveBeenCalledWith(1);
  },
};

export const WithWords: Story = {
  args: { words: createWordFields(['Bahnhof', 'sich freuen', '', 'Gleis']) },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);

    expect(
      (
        (await canvas.findByRole('textbox', {
          name: fieldName(t, 2),
        })) as HTMLInputElement
      ).value,
    ).toBe('sich freuen');
    expect(
      canvas.getByRole('button', { name: t('home.removeWord', { number: 4 }) }),
    ).toBeTruthy();
  },
};

export const NarrowScreen: Story = {
  args: { words: createWordFields(['Geschwindigkeitsbegrenzung', '', '', '']) },
  parameters: { controls: { disable: true } },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ canvasElement }) => {
    await within(canvasElement).findAllByRole('textbox');

    expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
      canvasElement.clientWidth,
    );
  },
};

export const RemovingAMiddleField: Story = {
  args: {
    words: createWordFields(['Bahnhof', 'sich freuen', 'Fahrkarte', 'Gleis']),
  },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const gleisField = await canvas.findByDisplayValue('Gleis');

    await userEvent.click(
      canvas.getByRole('button', { name: t('home.removeWord', { number: 2 }) }),
    );

    expect(canvas.getAllByRole('textbox')).toHaveLength(3);
    expect(canvas.queryByDisplayValue('sich freuen')).toBeNull();
    expect(canvas.getByDisplayValue('Gleis')).toBe(gleisField);
  },
};
