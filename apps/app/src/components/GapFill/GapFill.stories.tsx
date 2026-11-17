import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { OptionGrid } from '../OptionGrid/OptionGrid';
import { GapFill } from './GapFill';
import { gapFillMeta } from './GapFill.meta';

const wordOptions = ['Fahrkarte', 'Fahrkarten', 'Bahnhof', 'Gleis'];
const noneOption = 'none';

const swatchClasses = {
  open: 'bg-field',
  correct: 'bg-success',
  wrong: 'bg-highlight',
} as const;

const meta = {
  title: 'Components/GapFill',
  component: GapFill,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(gapFillMeta) } },
    controls: { include: ['answer', 'status', 'hint'] },
  },
  args: {
    before: 'Sie sucht ihre',
    after: 'in der Tasche.',
    answer: null,
    status: 'open',
    blankLabel: 'Blank',
    hint: 'She is looking for her ticket in the bag.',
  },
  argTypes: {
    answer: {
      control: 'select',
      options: [noneOption, ...wordOptions],
      mapping: { [noneOption]: null },
      description: 'The word in the blank, or none while nothing is chosen.',
    },
    status: {
      control: 'inline-radio',
      options: ['open', 'correct', 'wrong'],
      description: 'open while choosing; correct or wrong after the check.',
    },
    hint: {
      control: 'text',
      description: 'The sentence in the native language.',
    },
  },
  render: ({ answer, status, ...args }) => (
    <View className="gap-4 p-gutter">
      <GapFill answer={answer} status={status} {...args}>
        <OptionGrid
          options={wordOptions}
          value={answer}
          onSelect={() => undefined}
          correctAnswer={status === 'open' ? undefined : 'Fahrkarte'}
          accessibilityLabel="Pick the word"
        />
      </GapFill>
      {(Object.keys(swatchClasses) as (keyof typeof swatchClasses)[]).map(
        (name) => (
          <View
            key={name}
            testID={`swatch-${name}`}
            className={`${swatchClasses[name]} h-1 w-1 opacity-0`}
          />
        ),
      )}
    </View>
  ),
} satisfies Meta<typeof GapFill>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const status = args.status ?? 'open';
    const blank = await canvas.findByTestId('gap-fill-blank');
    const swatch = await canvas.findByTestId(`swatch-${status}`);
    const style = getComputedStyle(blank);
    const swatchColour = getComputedStyle(swatch).backgroundColor;

    expect(blank.getAttribute('aria-label')).toBe(
      args.answer ?? args.blankLabel,
    );
    expect(toRem(blank.getBoundingClientRect().width)).toBeGreaterThanOrEqual(
      6.875,
    );
    expect(toRem(style.borderBottomWidth)).toBe(0.1875);
    expect(style.borderBottomColor).toBe(swatchColour);
    if (args.answer !== null) {
      expect(getComputedStyle(within(blank).getByText(args.answer)).color).toBe(
        status === 'open' ? getComputedStyle(blank).color : swatchColour,
      );
    }
    for (const word of `${args.before} ${args.after}`.split(' ')) {
      expect(await canvas.findByText(word)).toBeTruthy();
    }
    if (args.hint) {
      expect(await canvas.findByText(args.hint)).toBeTruthy();
    }
    expect(canvas.getAllByRole('radio')).toHaveLength(wordOptions.length);
  },
};

export const Answered: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View className="gap-6 p-gutter">
      <GapFill
        before="Sie sucht ihre"
        after="in der Tasche."
        answer="Fahrkarte"
        status="correct"
        blankLabel="Blank"
      />
      <GapFill
        before="Sie sucht ihre"
        after="in der Tasche."
        answer="Gleis"
        status="wrong"
        blankLabel="Blank"
      />
    </View>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [correctBlank, wrongBlank] =
      await canvas.findAllByTestId('gap-fill-blank');

    expect(getComputedStyle(correctBlank!).borderBottomColor).not.toBe(
      getComputedStyle(wrongBlank!).borderBottomColor,
    );
    expect(correctBlank!.getAttribute('aria-label')).toBe('Fahrkarte');
    expect(wrongBlank!.getAttribute('aria-label')).toBe('Gleis');
  },
};

export const LongSentence: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View className="w-48 p-gutter">
      <GapFill
        before="Anna steht am Bahnhof und sucht ihre"
        after="in der Tasche."
        answer={null}
        blankLabel="Blank"
      />
    </View>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blank = await canvas.findByTestId('gap-fill-blank');
    const first = await canvas.findByText('Anna');
    const last = await canvas.findByText('Tasche.');

    expect(blank.getBoundingClientRect().top).toBeGreaterThan(
      first.getBoundingClientRect().top,
    );
    expect(last.getBoundingClientRect().height).toBeLessThan(
      blank.getBoundingClientRect().height * 2,
    );
  },
};
