import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { metaToMarkdown } from '../../lib/meta-to-markdown';
import {
  appLanguageOf,
  textFor,
  type Translate,
  WithText,
} from '../../lib/story-text';
import { lessonThirteen, stepXpDemo } from '../../mocks/lesson';
import { translateTask } from '../../mocks/lesson-tasks';
import { bahnhof, verspaetet } from '../../mocks/words';
import {
  TranslateScreen,
  type TranslateFeedback,
  type TranslateScreenProps,
} from './TranslateScreen';
import { translateScreenMeta } from './TranslateScreen.meta';

const { correction } = translateTask;

function feedbackFor(
  answer: string,
  appLanguage: 'ru' | 'en',
): TranslateFeedback {
  return answer === correction.corrected
    ? { status: 'correct' }
    : {
        status: 'almost',
        wrongWord: correction.wrongWord,
        rightWord: correction.rightWord,
        explanation: correction.explanation[appLanguage],
      };
}

function TranslateDemo({
  answer,
  feedback,
  onAnswerChange,
  onCheck,
  onTryAgain,
  ...props
}: TranslateScreenProps) {
  const [text, setText] = useState(answer);
  const [shownFeedback, setShownFeedback] = useState(feedback);

  return (
    <View className="min-h-screen">
      <WithText>
        {(_t, appLanguage) => (
          <TranslateScreen
            {...props}
            nativeLanguage={appLanguage}
            prompt={translateTask.prompt[appLanguage]}
            answer={text}
            feedback={
              shownFeedback?.status === 'almost'
                ? {
                    ...shownFeedback,
                    explanation: correction.explanation[appLanguage],
                  }
                : shownFeedback
            }
            onAnswerChange={(next) => {
              setText(next);
              onAnswerChange(next);
            }}
            onCheck={() => {
              setShownFeedback(feedbackFor(text, appLanguage));
              onCheck();
            }}
            onTryAgain={() => {
              setShownFeedback(null);
              onTryAgain();
            }}
          />
        )}
      </WithText>
    </View>
  );
}

function almostFeedback(t: Translate) {
  return t('translate.verdict.almost');
}

const meta = {
  title: 'Screens/Translate',
  component: TranslateScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: metaToMarkdown(translateScreenMeta) } },
    controls: { disable: true },
  },
  args: {
    lessonNumber: lessonThirteen.number,
    xp: stepXpDemo.translate,
    nativeLanguage: 'en',
    targetLanguage: 'de',
    prompt: translateTask.prompt.en,
    wordsToUse: [bahnhof, verspaetet],
    answer: '',
    feedback: null,
    onAnswerChange: fn(),
    onDictate: fn(),
    onBack: fn(),
    onCheck: fn(),
    onTryAgain: fn(),
    onContinue: fn(),
  },
  render: (args) => <TranslateDemo {...args} />,
} satisfies Meta<typeof TranslateScreen>;

export default meta;

type Story = StoryObj<typeof TranslateScreen>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const appLanguage = appLanguageOf(globals);
    const canvas = within(canvasElement);
    const check = await canvas.findByRole('button', {
      name: t('translate.check'),
    });
    const field = canvas.getByLabelText(t('translate.answerLabel'));

    expect(check.getAttribute('aria-disabled')).toBe('true');
    expect(canvas.getByText(translateTask.prompt[appLanguage])).toBeTruthy();
    expect(canvas.getByText(t('translate.use'))).toBeTruthy();
    expect(canvas.getByText('Bahnhof')).toBeTruthy();
    expect(canvas.getByText('verspätet')).toBeTruthy();
    expect(canvas.getByText(t('partOfSpeech.short.adjective'))).toBeTruthy();
    expect(
      canvas
        .getByRole('progressbar', {
          name: t('lesson.stepLabel', {
            step: '06',
            task: t('lesson.tasks.translate', {
              from: appLanguage.toUpperCase(),
              to: 'DE',
            }),
          }),
        })
        .getAttribute('aria-valuenow'),
    ).toBe('6');

    await userEvent.type(field, translateTask.attempt);
    expect(args.onAnswerChange).toHaveBeenLastCalledWith(translateTask.attempt);
    expect(check.getAttribute('aria-disabled')).not.toBe('true');

    await userEvent.click(check);
    expect(args.onCheck).toHaveBeenCalledTimes(1);
    expect(await canvas.findByText(almostFeedback(t))).toBeTruthy();
    expect(canvas.getByText(correction.explanation[appLanguage])).toBeTruthy();

    await userEvent.click(
      canvas.getByRole('button', { name: t('translate.tryAgain') }),
    );
    expect(args.onTryAgain).toHaveBeenCalledTimes(1);
    expect(canvas.queryByText(almostFeedback(t))).toBeNull();

    await userEvent.click(
      canvas.getByRole('button', { name: t('translate.dictate') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('common.back') }),
    );
    expect(args.onDictate).toHaveBeenCalledTimes(1);
    expect(args.onBack).toHaveBeenCalledTimes(1);
  },
};

export const AlmostRight: Story = {
  args: { answer: translateTask.attempt },
  render: (args) => (
    <TranslateDemo
      {...args}
      feedback={{
        status: 'almost',
        wrongWord: correction.wrongWord,
        rightWord: correction.rightWord,
        explanation: '',
      }}
    />
  ),
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const appLanguage = appLanguageOf(globals);
    const canvas = within(canvasElement);
    const box = await canvas.findByRole('status');
    const fixed = canvas.getByLabelText(
      t('translate.correctionLabel', {
        sentence: correction.corrected,
        wrong: correction.wrongWord,
        right: correction.rightWord,
      }),
    );
    const wrong = within(fixed).getByText(correction.wrongWord);
    const right = within(fixed).getByText(correction.rightWord);

    expect(within(box).getByText(almostFeedback(t))).toBeTruthy();
    expect(
      within(box).getByText(correction.explanation[appLanguage]),
    ).toBeTruthy();
    expect(getComputedStyle(wrong).textDecorationLine).toBe('line-through');
    expect(getComputedStyle(right).textDecorationLine).toBe('underline');
    expect(getComputedStyle(wrong).color).not.toBe(
      getComputedStyle(right).color,
    );
    expect(fixed.textContent).toContain('Mein Zug ist verspätet, ich warte');
    expect(
      canvas.getByRole('button', { name: t('translate.tryAgain') }),
    ).toBeTruthy();

    await userEvent.click(
      canvas.getByRole('button', { name: t('common.next') }),
    );
    expect(args.onContinue).toHaveBeenCalledTimes(1);
  },
};

export const RightAnswer: Story = {
  args: {
    answer: correction.corrected,
    feedback: { status: 'correct' },
  },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const box = await canvas.findByRole('status');

    expect(within(box).getByText(t('translate.verdict.correct'))).toBeTruthy();
    expect(within(box).getByText(correction.corrected)).toBeTruthy();
    expect(
      canvas.queryByRole('button', { name: t('translate.tryAgain') }),
    ).toBeNull();
    expect(canvas.getByRole('button', { name: t('common.next') })).toBeTruthy();
  },
};
