import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { TopBar } from '../TopBar/TopBar';
import { WordChipsInput, type WordChipsInputProps } from './WordChipsInput';
import { wordChipsInputMeta } from './WordChipsInput.meta';

function WordChipsInputDemo({
  words,
  draft,
  onChange,
  ...props
}: WordChipsInputProps) {
  const [typedWords, setTypedWords] = useState(words);
  const [typedDraft, setTypedDraft] = useState(draft);

  return (
    <View className="p-gutter">
      <WithText>
        {(t) => (
          <WordChipsInput
            {...props}
            words={typedWords}
            draft={typedDraft}
            placeholder={t('home.wordsPlaceholder')}
            accessibilityLabel={t('home.wordsLabel')}
            trailing={
              <TopBar.Button
                icon="mic"
                accessibilityLabel={t('home.dictate')}
                onPress={fn()}
              />
            }
            onChange={(change) => {
              setTypedWords(change.words);
              setTypedDraft(change.draft);
              onChange(change);
            }}
          />
        )}
      </WithText>
    </View>
  );
}

const meta = {
  title: 'Components/WordChipsInput',
  component: WordChipsInput,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(wordChipsInputMeta) } },
    controls: { include: ['words', 'maxWords'] },
  },
  args: {
    words: [],
    draft: '',
    maxWords: 6,
    accessibilityLabel: '',
    onChange: fn(),
    onWordsLeftOut: fn(),
  },
  argTypes: {
    words: {
      control: 'object',
      description: 'The words that are already chips. The screen owns this.',
    },
    maxWords: {
      control: 'number',
      description: 'How many chips fit. At the limit the text input goes away.',
    },
  },
  render: (args) => <WordChipsInputDemo {...args} />,
} satisfies Meta<typeof WordChipsInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const field = await canvas.findByRole('textbox', {
      name: t('home.wordsLabel'),
    });

    expect(
      canvas.queryByRole('button', { name: /^Edit|^Изменить/ }),
    ).toBeNull();

    await userEvent.type(field, 'Bahnhof{enter}Fahrkarte Gleis,verspä');

    for (const word of ['Bahnhof', 'Fahrkarte', 'Gleis']) {
      expect(
        canvas.getByRole('button', { name: t('wordChips.edit', { word }) }),
      ).toBeTruthy();
    }
    expect((field as HTMLTextAreaElement).value).toBe('verspä');
    expect(args.onChange).toHaveBeenLastCalledWith({
      words: ['Bahnhof', 'Fahrkarte', 'Gleis'],
      draft: 'verspä',
    });
  },
};

export const WithChips: Story = {
  args: { words: ['Bahnhof', 'Fahrkarte', 'verspätet', 'Gleis'] },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const edit = await canvas.findByRole('button', {
      name: t('wordChips.edit', { word: 'Fahrkarte' }),
    });
    const remove = canvas.getByRole('button', {
      name: t('wordChips.remove', { word: 'Fahrkarte' }),
    });

    expect(toRem(edit.getBoundingClientRect().height)).toBeGreaterThanOrEqual(
      3,
    );
    expect(toRem(edit.getBoundingClientRect().width)).toBeGreaterThanOrEqual(3);
    expect(toRem(remove.getBoundingClientRect().height)).toBeGreaterThanOrEqual(
      3,
    );
    expect(toRem(remove.getBoundingClientRect().width)).toBeGreaterThanOrEqual(
      3,
    );

    await userEvent.click(remove);
    expect(args.onChange).toHaveBeenLastCalledWith({
      words: ['Bahnhof', 'verspätet', 'Gleis'],
      draft: '',
    });
    expect(
      canvas.queryByRole('button', {
        name: t('wordChips.edit', { word: 'Fahrkarte' }),
      }),
    ).toBeNull();
  },
};

export const EditAChip: Story = {
  args: { words: ['Bahnhof', 'Gleis'] },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const field = await canvas.findByRole('textbox', {
      name: t('home.wordsLabel'),
    });

    await userEvent.click(
      canvas.getByRole('button', {
        name: t('wordChips.edit', { word: 'Bahnhof' }),
      }),
    );

    expect((field as HTMLTextAreaElement).value).toBe('Bahnhof');
    expect(args.onChange).toHaveBeenLastCalledWith({
      words: ['Gleis'],
      draft: 'Bahnhof',
    });
  },
};

export const PastedList: Story = {
  args: { words: ['Gleis'], maxWords: 4 },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const field = await canvas.findByRole('textbox', {
      name: t('home.wordsLabel'),
    });

    await userEvent.click(field);
    await userEvent.paste('Bahnhof\nFahrkarte, verspätet\nGleis\nHaus\n');

    expect(args.onChange).toHaveBeenLastCalledWith({
      words: ['Gleis', 'Bahnhof', 'Fahrkarte', 'verspätet'],
      draft: '',
    });
    expect(args.onWordsLeftOut).toHaveBeenCalledWith(1);
  },
};

export const Full: Story = {
  args: { words: ['a', 'b', 'c', 'd', 'e', 'f'] },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);

    expect(
      await canvas.findAllByRole('button', { name: /^Edit|^Изменить/ }),
    ).toHaveLength(6);
    expect(
      canvas.queryByRole('textbox', { name: t('home.wordsLabel') }),
    ).toBeNull();
  },
};

export const LongWordsOnANarrowScreen: Story = {
  args: {
    words: [
      'Sicherheitsvorkehrung',
      'Entschuldigung',
      'Geschwindigkeitsbegrenzung',
      'Gleis',
    ],
  },
  parameters: { controls: { disable: true } },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ canvasElement }) => {
    await within(canvasElement).findAllByRole('button', {
      name: /^Edit|^Изменить/,
    });

    expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
      canvasElement.clientWidth,
    );
  },
};

export const BackspaceTakesTheLastChipBack: Story = {
  args: { words: ['Bahnhof', 'Gleis'] },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const field = await canvas.findByRole('textbox', {
      name: t('home.wordsLabel'),
    });

    await userEvent.click(field);
    await userEvent.keyboard('{Backspace}');

    expect((field as HTMLTextAreaElement).value).toBe('Gleis');
    expect(args.onChange).toHaveBeenLastCalledWith({
      words: ['Bahnhof'],
      draft: 'Gleis',
    });
  },
};

export const DuplicateIsSkipped: Story = {
  args: { words: ['Bahnhof'] },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const field = await canvas.findByRole('textbox', {
      name: t('home.wordsLabel'),
    });

    await userEvent.type(field, 'bahnhof{enter}');

    expect(args.onChange).toHaveBeenLastCalledWith({
      words: ['Bahnhof'],
      draft: '',
    });
    expect(args.onWordsLeftOut).not.toHaveBeenCalled();
  },
};
