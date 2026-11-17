import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { OptionGrid, type OptionGridProps } from './OptionGrid';
import { optionGridMeta } from './OptionGrid.meta';

const wordOptions = ['Fahrkarte', 'Fahrkarten', 'Bahnhof', 'Gleis'];
const noneOption = 'none';

function GridDemo({ value, onSelect, ...props }: OptionGridProps) {
  const [chosen, setChosen] = useState(value);

  return (
    <View className="p-gutter">
      <OptionGrid
        {...props}
        value={chosen}
        onSelect={(option) => {
          setChosen(option);
          onSelect(option);
        }}
      />
    </View>
  );
}

const meta = {
  title: 'Components/OptionGrid',
  component: OptionGrid,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(optionGridMeta) } },
    controls: { include: ['value', 'correctAnswer', 'columns'] },
  },
  args: {
    options: wordOptions,
    value: null,
    correctAnswer: undefined,
    columns: 2,
    accessibilityLabel: 'Pick the word',
    onSelect: fn(),
  },
  argTypes: {
    value: {
      control: 'select',
      options: [noneOption, ...wordOptions],
      mapping: { [noneOption]: null },
      description: 'The chosen answer, or none before a choice.',
    },
    correctAnswer: {
      control: 'select',
      options: [noneOption, ...wordOptions],
      mapping: { [noneOption]: undefined },
      description:
        'The right answer. Once set, the grid shows the result and locks.',
    },
    columns: {
      control: 'inline-radio',
      options: [2, 3],
      description: 'How many options sit in a row.',
    },
  },
  render: (args) => <GridDemo key={String(args.value)} {...args} />,
} satisfies Meta<typeof OptionGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const group = await canvas.findByRole('radiogroup', {
      name: args.accessibilityLabel,
    });
    const radios = within(group).getAllByRole('radio');
    const columns = args.columns ?? 2;

    expect(radios).toHaveLength(wordOptions.length);
    for (const radio of radios) {
      expect(toRem(radio.getBoundingClientRect().height)).toBe(3.5);
    }
    const firstRowTop = radios[0]!.getBoundingClientRect().top;
    const inFirstRow = radios.filter(
      (radio) => radio.getBoundingClientRect().top === firstRowTop,
    );
    expect(inFirstRow).toHaveLength(columns);

    if (args.correctAnswer === undefined) {
      const target = wordOptions.find((option) => option !== args.value)!;
      const targetRadio = await canvas.findByRole('radio', { name: target });

      await userEvent.click(targetRadio);

      expect(args.onSelect).toHaveBeenCalledWith(target);
      expect(targetRadio.getAttribute('aria-checked')).toBe('true');
      return;
    }

    for (const radio of radios) {
      expect(radio.getAttribute('aria-disabled')).toBe('true');
    }
    const right = await canvas.findByRole('radio', {
      name: new RegExp(args.correctAnswer),
    });
    if (args.value === args.correctAnswer) {
      expect(within(right).getByRole('img').getAttribute('aria-label')).toBe(
        'Correct',
      );
    } else {
      expect(getComputedStyle(right).borderTopStyle).toBe('dashed');
      expect(within(right).queryByRole('img')).toBeNull();
    }
    if (args.value !== null && args.value !== args.correctAnswer) {
      const picked = await canvas.findByRole('radio', {
        name: new RegExp(args.value),
      });
      expect(within(picked).getByRole('img').getAttribute('aria-label')).toBe(
        'Wrong',
      );
    }
    await userEvent.click(radios[0]!, { pointerEventsCheck: 0 });
    expect(args.onSelect).not.toHaveBeenCalled();
  },
};

export const Answered: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View className="gap-6 p-gutter">
      <OptionGrid
        options={wordOptions}
        value="Fahrkarte"
        correctAnswer="Fahrkarte"
        onSelect={() => undefined}
        accessibilityLabel="Answered correct"
      />
      <OptionGrid
        options={wordOptions}
        value="Gleis"
        correctAnswer="Fahrkarte"
        onSelect={() => undefined}
        accessibilityLabel="Answered wrong"
      />
    </View>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const correctGroup = await canvas.findByRole('radiogroup', {
      name: 'Answered correct',
    });
    const wrongGroup = await canvas.findByRole('radiogroup', {
      name: 'Answered wrong',
    });
    const correctPick = within(correctGroup).getByRole('radio', {
      name: /^(Correct)?\s*Fahrkarte$/,
    });
    const wrongPick = within(wrongGroup).getByRole('radio', { name: /Gleis/ });
    const revealed = within(wrongGroup).getByRole('radio', {
      name: 'Fahrkarte',
    });

    expect(
      within(correctPick).getByRole('img').getAttribute('aria-label'),
    ).toBe('Correct');
    expect(getComputedStyle(correctPick).borderTopStyle).toBe('solid');
    expect(within(wrongPick).getByRole('img').getAttribute('aria-label')).toBe(
      'Wrong',
    );
    expect(getComputedStyle(revealed).borderTopStyle).toBe('dashed');
    expect(within(revealed).queryByRole('img')).toBeNull();
    expect(getComputedStyle(wrongPick).borderTopColor).not.toBe(
      getComputedStyle(correctPick).borderTopColor,
    );
  },
};
