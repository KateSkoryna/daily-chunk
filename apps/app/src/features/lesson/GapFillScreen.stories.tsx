import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { lessonThirteen, stepXpDemo } from '../../mocks/lesson';
import { articleGapFill, ticketGapFill } from '../../mocks/gap-fill';
import { GapFillScreen, type GapFillScreenProps } from './GapFillScreen';
import { gapFillScreenMeta } from './GapFillScreen.meta';

function GapFillDemo({
  articleChoice,
  wordChoice,
  isChecked,
  onArticleChoose,
  onWordChoose,
  onCheck,
  ...props
}: GapFillScreenProps) {
  const [article, setArticle] = useState(articleChoice);
  const [word, setWord] = useState(wordChoice);
  const [checked, setChecked] = useState(isChecked);

  return (
    <View className="min-h-screen">
      <WithText>
        {(_t, appLanguage) => (
          <GapFillScreen
            {...props}
            article={{
              ...articleGapFill,
              hint: articleGapFill.hints[appLanguage],
            }}
            word={{ ...ticketGapFill, hint: ticketGapFill.hints[appLanguage] }}
            articleChoice={article}
            wordChoice={word}
            isChecked={checked}
            onArticleChoose={(option) => {
              setArticle(option);
              onArticleChoose(option);
            }}
            onWordChoose={(option) => {
              setWord(option);
              onWordChoose(option);
            }}
            onCheck={() => {
              setChecked(true);
              onCheck();
            }}
          />
        )}
      </WithText>
    </View>
  );
}

const meta = {
  title: 'Screens/GapFill',
  component: GapFillScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: metaToMarkdown(gapFillScreenMeta) } },
    controls: { disable: true },
  },
  args: {
    lessonNumber: lessonThirteen.number,
    xp: stepXpDemo['gap-fill'],
    articleChoice: null,
    wordChoice: null,
    isChecked: false,
    onArticleChoose: fn(),
    onWordChoose: fn(),
    onBack: fn(),
    onCheck: fn(),
    onContinue: fn(),
  },
  render: (args) => <GapFillDemo {...args} />,
} satisfies Meta<typeof GapFillScreen>;

export default meta;

type Story = StoryObj<typeof GapFillScreen>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const check = await canvas.findByRole('button', {
      name: t('gapFill.check'),
    });

    expect(check.getAttribute('aria-disabled')).toBe('true');
    expect(
      canvas
        .getByRole('progressbar', {
          name: t('lesson.stepLabel', {
            step: '06',
            task: t('lesson.tasks.gap-fill'),
          }),
        })
        .getAttribute('aria-valuenow'),
    ).toBe('6');

    await userEvent.click(canvas.getByRole('radio', { name: 'vom' }));
    expect(check.getAttribute('aria-disabled')).toBe('true');
    await userEvent.click(canvas.getByRole('radio', { name: 'Fahrkarten' }));
    expect(args.onArticleChoose).toHaveBeenCalledWith('vom');
    expect(args.onWordChoose).toHaveBeenCalledWith('Fahrkarten');
    expect(check.getAttribute('aria-disabled')).not.toBe('true');
    expect(
      canvas.getByRole('radio', { name: 'vom' }).getAttribute('aria-checked'),
    ).toBe('true');

    await userEvent.click(check);
    expect(args.onCheck).toHaveBeenCalledTimes(1);
    expect(canvas.getAllByLabelText(t('answer.correct'))).toHaveLength(1);
    expect(canvas.getAllByLabelText(t('answer.wrong'))).toHaveLength(1);

    await userEvent.click(
      canvas.getByRole('button', { name: t('common.next') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('common.back') }),
    );
    expect(args.onContinue).toHaveBeenCalledTimes(1);
    expect(args.onBack).toHaveBeenCalledTimes(1);
  },
};

export const CheckedWithMistake: Story = {
  args: { articleChoice: 'vom', wordChoice: 'Fahrkarten', isChecked: true },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const [articleBlank, wordBlank] =
      await canvas.findAllByTestId('gap-fill-blank');

    expect(articleBlank!.getAttribute('aria-label')).toBe('vom');
    expect(wordBlank!.getAttribute('aria-label')).toBe('Fahrkarten');
    expect(getComputedStyle(articleBlank!).borderBottomColor).not.toBe(
      getComputedStyle(wordBlank!).borderBottomColor,
    );
    expect(canvas.getAllByLabelText(t('answer.correct'))).toHaveLength(1);
    expect(canvas.getAllByLabelText(t('answer.wrong'))).toHaveLength(1);
    expect(
      getComputedStyle(canvas.getByRole('radio', { name: 'Fahrkarte' }))
        .borderStyle,
    ).toBe('dashed');
    expect(
      canvas
        .getByRole('radio', { name: 'Gleis' })
        .getAttribute('aria-disabled'),
    ).toBe('true');
    expect(canvas.queryByText(t('gapFill.check'))).toBeNull();
  },
};
