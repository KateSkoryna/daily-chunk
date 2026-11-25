import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { lessonStepNames } from '../../lib/lesson-step-names';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { lessonThirteen, stepXpDemo } from '../../mocks/lesson';
import { derLetzteZug } from '../../mocks/lesson-tasks';
import { ReadQuizScreen, type ReadQuizScreenProps } from './ReadQuizScreen';
import { readQuizScreenMeta } from './ReadQuizScreen.meta';

const questions = derLetzteZug.questions.map(
  ({ question, answer, wrongAnswers }) => ({
    question,
    answer,
    options: [...wrongAnswers.slice(0, 1), answer, ...wrongAnswers.slice(1)],
  }),
);

function QuizDemo({
  answers,
  questionIndex,
  onAnswer,
  onNextQuestion,
  ...props
}: ReadQuizScreenProps) {
  const [givenAnswers, setGivenAnswers] = useState(answers);
  const [index, setIndex] = useState(questionIndex);

  return (
    <View className="min-h-screen">
      <WithText>
        {(t, appLanguage) => (
          <ReadQuizScreen
            {...props}
            taskNames={lessonStepNames(t, appLanguage, 'de')}
            answers={givenAnswers}
            questionIndex={index}
            onAnswer={(option) => {
              setGivenAnswers((current) =>
                current.map((answer, answerIndex) =>
                  answerIndex === index ? option : answer,
                ),
              );
              onAnswer(option);
            }}
            onNextQuestion={() => {
              setIndex((current) => current + 1);
              onNextQuestion();
            }}
          />
        )}
      </WithText>
    </View>
  );
}

const noAnswers = questions.map(() => null);

const meta = {
  title: 'Screens/Read quiz',
  component: ReadQuizScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: metaToMarkdown(readQuizScreenMeta) } },
    controls: { disable: true },
  },
  args: {
    lessonNumber: lessonThirteen.number,
    xp: stepXpDemo.read,
    questions,
    answers: noAnswers,
    questionIndex: 0,
    taskNames: [],
    onTaskSelect: fn(),
    onAnswer: fn(),
    onNextQuestion: fn(),
    onBack: fn(),
    onClose: fn(),
    onContinue: fn(),
  },
  render: (args) => <QuizDemo {...args} />,
} satisfies Meta<typeof ReadQuizScreen>;

export default meta;

type Story = StoryObj<typeof ReadQuizScreen>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const group = await canvas.findByRole('radiogroup', {
      name: t('quiz.answers'),
    });

    expect(
      canvas.getByText(
        `${t('quiz.title')} · ${t('quiz.question', { current: 1, total: 5 })}`,
      ),
    ).toBeTruthy();
    expect(canvas.getByText(questions[0]!.question)).toBeTruthy();
    expect(within(group).getAllByRole('radio')).toHaveLength(3);
    expect(canvas.queryByRole('button', { name: t('quiz.next') })).toBeNull();

    await userEvent.click(
      within(group).getByRole('radio', { name: questions[0]!.answer }),
    );
    expect(args.onAnswer).toHaveBeenCalledWith(questions[0]!.answer);

    await userEvent.click(canvas.getByRole('button', { name: t('quiz.next') }));
    expect(args.onNextQuestion).toHaveBeenCalledTimes(1);
    expect(canvas.getByText(questions[1]!.question)).toBeTruthy();
    expect(canvas.queryByRole('status')).toBeNull();

    await userEvent.click(
      canvas.getByRole('button', { name: t('common.back') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('lesson.quit') }),
    );
    expect(args.onBack).toHaveBeenCalledTimes(1);
    expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};

export const WrongAnswer: Story = {
  args: { answers: [questions[0]!.options[0]!, null, null, null, null] },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const group = await canvas.findByRole('radiogroup', {
      name: t('quiz.answers'),
    });

    expect(within(group).getByLabelText(t('answer.wrong'))).toBeTruthy();
    expect(canvas.getByRole('button', { name: t('quiz.next') })).toBeTruthy();
  },
};

export const PassedWithFourOfFive: Story = {
  args: {
    questionIndex: 4,
    answers: [
      questions[0]!.answer,
      questions[1]!.answer,
      questions[2]!.answer,
      questions[3]!.options[0]!,
      questions[4]!.answer,
    ],
  },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const notice = await canvas.findByRole('status');

    expect(notice.textContent).toBe(t('quiz.passed', { correct: 4, total: 5 }));
    expect(canvas.queryByRole('button', { name: t('quiz.next') })).toBeNull();

    await userEvent.click(
      canvas.getByRole('button', { name: t('lesson.nextSection') }),
    );
    expect(args.onContinue).toHaveBeenCalledTimes(1);
  },
};

export const NotPassedWithThreeOfFive: Story = {
  args: {
    questionIndex: 4,
    answers: [
      questions[0]!.answer,
      questions[1]!.options[0]!,
      questions[2]!.options[0]!,
      questions[3]!.answer,
      questions[4]!.answer,
    ],
  },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const notice = await canvas.findByRole('status');

    expect(notice.textContent).toBe(
      t('quiz.failed', { correct: 3, total: 5, needed: 4 }),
    );
    expect(
      canvas.getByRole('button', { name: t('lesson.nextSection') }),
    ).toBeTruthy();
  },
};

export const NarrowScreen: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ canvasElement }) => {
    await within(canvasElement).findAllByRole('radio');

    expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
      canvasElement.clientWidth,
    );
  },
};
