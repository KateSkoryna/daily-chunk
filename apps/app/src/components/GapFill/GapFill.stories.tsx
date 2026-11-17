import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { appLanguageOf, textFor, WithText } from '../../lib/story-text';
import { ticketGapFill } from '../../mocks/gap-fill';
import { OptionGrid } from '../OptionGrid/OptionGrid';
import { GapFill } from './GapFill';
import { gapFillMeta } from './GapFill.meta';

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
    controls: { include: ['answer', 'status'] },
  },
  args: { answer: null, status: 'open' },
  argTypes: {
    answer: {
      control: 'select',
      options: [noneOption, ...ticketGapFill.options],
      mapping: { [noneOption]: null },
      description: 'The word in the blank, or none while nothing is chosen.',
    },
    status: {
      control: 'inline-radio',
      options: ['open', 'correct', 'wrong'],
      description: 'open while choosing; correct or wrong after the check.',
    },
  },
  render: ({ answer = null, status = 'open' }) => (
    <View className="gap-4 p-gutter">
      <WithText>
        {(t, appLanguage) => (
          <GapFill
            before={ticketGapFill.before}
            after={ticketGapFill.after}
            answer={answer}
            status={status}
            blankLabel={t('gapFill.blank')}
            hint={ticketGapFill.hints[appLanguage]}
          >
            <OptionGrid
              options={ticketGapFill.options}
              value={answer}
              onSelect={() => undefined}
              correctAnswer={
                status === 'open' ? undefined : ticketGapFill.answer
              }
              accessibilityLabel={t('gapFill.pickWord')}
            />
          </GapFill>
        )}
      </WithText>
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

type Story = StoryObj<typeof GapFill>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const answer = args.answer ?? null;
    const status = args.status ?? 'open';
    const blank = await canvas.findByTestId('gap-fill-blank');
    const swatch = await canvas.findByTestId(`swatch-${status}`);
    const style = getComputedStyle(blank);
    const swatchColour = getComputedStyle(swatch).backgroundColor;

    expect(blank.getAttribute('aria-label')).toBe(answer ?? t('gapFill.blank'));
    expect(toRem(blank.getBoundingClientRect().width)).toBeGreaterThanOrEqual(
      6.875,
    );
    expect(toRem(style.borderBottomWidth)).toBe(0.1875);
    expect(style.borderBottomColor).toBe(swatchColour);
    if (answer !== null) {
      expect(getComputedStyle(within(blank).getByText(answer)).color).toBe(
        status === 'open' ? getComputedStyle(blank).color : swatchColour,
      );
    }
    for (const word of `${ticketGapFill.before} ${ticketGapFill.after}`.split(
      ' ',
    )) {
      expect(await canvas.findByText(word)).toBeTruthy();
    }
    expect(
      await canvas.findByText(ticketGapFill.hints[appLanguageOf(globals)]),
    ).toBeTruthy();
    expect(canvas.getAllByRole('radio')).toHaveLength(
      ticketGapFill.options.length,
    );
  },
};

export const Answered: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View className="gap-6 p-gutter">
      <WithText>
        {(t) => (
          <>
            <GapFill
              before={ticketGapFill.before}
              after={ticketGapFill.after}
              answer={ticketGapFill.answer}
              status="correct"
              blankLabel={t('gapFill.blank')}
            />
            <GapFill
              before={ticketGapFill.before}
              after={ticketGapFill.after}
              answer="Gleis"
              status="wrong"
              blankLabel={t('gapFill.blank')}
            />
          </>
        )}
      </WithText>
    </View>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [correctBlank, wrongBlank] =
      await canvas.findAllByTestId('gap-fill-blank');

    expect(getComputedStyle(correctBlank!).borderBottomColor).not.toBe(
      getComputedStyle(wrongBlank!).borderBottomColor,
    );
    expect(correctBlank!.getAttribute('aria-label')).toBe(ticketGapFill.answer);
    expect(wrongBlank!.getAttribute('aria-label')).toBe('Gleis');
  },
};

export const LongSentence: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View className="w-48 p-gutter">
      <WithText>
        {(t) => (
          <GapFill
            before="Anna steht am Bahnhof und sucht ihre"
            after={ticketGapFill.after}
            answer={null}
            blankLabel={t('gapFill.blank')}
          />
        )}
      </WithText>
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
