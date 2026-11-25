import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { appLanguageOf, textFor, WithText } from '../../lib/story-text';
import { lessonThirteen, stepXpDemo } from '../../mocks/lesson';
import { derLetzteZug, readAloudResult } from '../../mocks/lesson-tasks';
import { RecordScreen, type RecordScreenProps } from './RecordScreen';
import { recordScreenMeta } from './RecordScreen.meta';

const storyText = derLetzteZug.text;

const meta = {
  title: 'Screens/Record',
  component: RecordScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: metaToMarkdown(recordScreenMeta) } },
    controls: { disable: true },
  },
  args: {
    lessonNumber: lessonThirteen.number,
    xp: stepXpDemo.record,
    storyText,
    durationSeconds: readAloudResult.durationSeconds,
    scorePercent: readAloudResult.scorePercent,
    verdict: readAloudResult.verdict,
    retryWords: readAloudResult.retryWords,
    pronunciationTip: readAloudResult.pronunciationTips.en,
    onBack: fn(),
    onPlayRecording: fn(),
    onRetryWord: fn(),
    onRecordAgain: fn(),
    onContinue: fn(),
  },
  render: (args: RecordScreenProps) => (
    <View className="min-h-screen">
      <WithText>
        {(_t, appLanguage) => (
          <RecordScreen
            {...args}
            pronunciationTip={readAloudResult.pronunciationTips[appLanguage]}
          />
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof RecordScreen>;

export default meta;

type Story = StoryObj<typeof RecordScreen>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const tip = readAloudResult.pronunciationTips[appLanguageOf(globals)];
    const canvas = within(canvasElement);
    const play = await canvas.findByRole('button', { name: t('record.play') });
    const score = canvas.getByText('86%');
    const retry = args.retryWords.map((word) =>
      canvas.getByRole('button', { name: t('record.retry', { word }) }),
    );

    expect(
      canvas
        .getByRole('progressbar', {
          name: t('lesson.stepLabel', {
            step: '04',
            task: t('lesson.tasks.record'),
          }),
        })
        .getAttribute('aria-valuenow'),
    ).toBe('4');
    expect(canvas.getByText('00:24')).toBeTruthy();
    expect(canvas.getByText(t('record.verdict.clear'))).toBeTruthy();
    expect(
      canvas.getByText(t('record.wordsToRetry', { count: 2 })),
    ).toBeTruthy();
    expect(canvas.getByText(tip)).toBeTruthy();
    expect(
      canvas.getByText(t('record.chunkLine', { score: 86, word: 'Fahrkarte' })),
    ).toBeTruthy();
    expect(canvas.getByText(t('tutor.approves'))).toBeTruthy();
    expect(canvasElement.textContent).toContain(storyText.slice(0, 40));
    expect(getComputedStyle(score).color).toBe(
      getComputedStyle(canvas.getByText(t('record.verdict.clear'))).color,
    );
    expect(retry).toHaveLength(2);
    expect(canvas.getAllByText('Fahrkarte').length).toBeGreaterThanOrEqual(2);

    await userEvent.click(play);
    await userEvent.click(retry[1]!);
    await userEvent.click(
      canvas.getByRole('button', { name: t('record.recordAgain') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('common.continue') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('common.back') }),
    );

    expect(args.onPlayRecording).toHaveBeenCalledTimes(1);
    expect(args.onRetryWord).toHaveBeenCalledWith('läuft');
    expect(args.onRecordAgain).toHaveBeenCalledTimes(1);
    expect(args.onContinue).toHaveBeenCalledTimes(1);
    expect(args.onBack).toHaveBeenCalledTimes(1);
  },
};

export const HardToHear: Story = {
  args: { scorePercent: 41, verdict: 'unclear' },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const score = await canvas.findByText('41%');
    const verdict = canvas.getByText(t('record.verdict.unclear'));

    expect(getComputedStyle(score).color).toBe(getComputedStyle(verdict).color);
    expect(canvas.getByText(t('tutor.sighs'))).toBeTruthy();
    expect(canvas.queryByText(t('tutor.approves'))).toBeNull();
  },
};

export const NothingToRetry: Story = {
  args: { scorePercent: 100, retryWords: [], pronunciationTip: '' },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);

    expect(await canvas.findByText('100%')).toBeTruthy();
    expect(canvas.queryByText(t('record.retryThese'))).toBeNull();
    expect(canvas.queryByRole('button', { name: /Fahrkarte/ })).toBeNull();
    expect(
      canvas.getByText(t('record.chunkLineClean', { score: 100 })),
    ).toBeTruthy();
    expect(
      canvas.getByText(t('record.wordsToRetry', { count: 0 })),
    ).toBeTruthy();
  },
};
