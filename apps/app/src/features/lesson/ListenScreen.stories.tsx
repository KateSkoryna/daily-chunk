import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { displayedWord } from '../../lib/displayed-word';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { lessonStepNames } from '../../lib/lesson-step-names';
import { appLanguageOf, textFor, WithText } from '../../lib/story-text';
import { lessonThirteen, stepXpDemo } from '../../mocks/lesson';
import { listenDemo } from '../../mocks/listen';
import { gleis } from '../../mocks/words';
import { ListenScreen, type ListenScreenProps } from './ListenScreen';
import { listenScreenMeta } from './ListenScreen.meta';

const meta = {
  title: 'Screens/Listen',
  component: ListenScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: metaToMarkdown(listenScreenMeta) } },
    controls: { disable: true },
  },
  args: {
    lessonNumber: lessonThirteen.number,
    xp: stepXpDemo.listen,
    word: gleis,
    highlightedWord: listenDemo.highlightedWord,
    nativeLanguage: 'en',
    step: 1,
    onStepSelect: fn(),
    playback: {
      bars: listenDemo.waveformBars,
      playedSeconds: listenDemo.playedSeconds,
      durationSeconds: listenDemo.durationSeconds,
      speed: listenDemo.speed,
      isPlaying: true,
    },
    recordState: 'idle',
    phrase: listenDemo.phrase,
    repeat: listenDemo.repeat,
    onBack: fn(),
    taskNames: [],
    onTaskSelect: fn(),
    onClose: fn(),
    onTogglePlay: fn(),
    onSpeedPress: fn(),
    onRecord: fn(),
    onPlayRecording: fn(),
    isFirstPhrase: false,
    onPhraseSelect: fn(),
    onPrevious: fn(),
    isLastPhrase: false,
    onNext: fn(),
    onNextSection: fn(),
  },
  render: (args: ListenScreenProps) => (
    <View className="min-h-screen">
      <WithText>
        {(t, appLanguage) => (
          <ListenScreen
            {...args}
            nativeLanguage={appLanguage}
            taskNames={lessonStepNames(t, appLanguage, 'de')}
          />
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof ListenScreen>;

export default meta;

type Story = StoryObj<typeof ListenScreen>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const nativeLanguage = appLanguageOf(globals);
    const canvas = within(canvasElement);
    const { playback } = args;
    const steps = await canvas.findByRole('tablist', {
      name: t('listen.steps'),
    });
    const waveform = canvas.getByRole('img', {
      name: t('listen.waveform', {
        played: playback.playedSeconds,
        total: playback.durationSeconds,
      }),
    });
    const underlined = canvas.getByText(args.highlightedWord);

    expect(
      within(steps).getByRole('tab', { selected: true }).textContent,
    ).toContain(t('listen.stepListen'));
    expect(
      canvas.queryByRole('button', { name: t('listen.recordRepeat') }),
    ).toBeNull();
    expect(canvas.getByText(displayedWord(args.word))).toBeTruthy();
    expect(
      canvas.getByText(args.word.sentenceTranslations[nativeLanguage]!),
    ).toBeTruthy();
    expect(getComputedStyle(underlined).textDecorationLine).toBe('underline');
    expect(getComputedStyle(underlined).textDecorationColor).toBe(
      getComputedStyle(canvas.getByText('das').parentElement!).backgroundColor,
    );
    expect(
      canvas.getByText(
        t('listen.phraseCount', {
          current: args.phrase.current,
          total: args.phrase.total,
          repeat: args.repeat.current,
          repeatTotal: args.repeat.total,
        }),
      ),
    ).toBeTruthy();
    expect(within(waveform).getAllByTestId('bar-played')).toHaveLength(13);
    const stepper = canvas.getByRole('toolbar', {
      name: t('lesson.stepLabel', {
        step: '03',
        task: t('lesson.tasks.listen'),
      }),
    });
    const segments = within(stepper).getAllByRole('button');

    expect(segments).toHaveLength(7);
    expect(segments[2]).toHaveAttribute('aria-current', 'step');
    await userEvent.click(segments[4]!);
    expect(args.onTaskSelect).toHaveBeenCalledWith(5);

    await userEvent.click(
      canvas.getByRole('button', { name: t('listen.pause') }),
    );
    await userEvent.click(
      canvas.getByRole('button', {
        name: t('listen.speed', { speed: args.playback.speed }),
      }),
    );
    await userEvent.click(
      canvas.getByRole('tab', { name: new RegExp(t('listen.stepRepeat')) }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('listen.previousPhrase') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('listen.nextPhrase') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('lesson.nextSection') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('common.back') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('lesson.quit') }),
    );

    expect(args.onTogglePlay).toHaveBeenCalledTimes(1);
    expect(args.onSpeedPress).toHaveBeenCalledTimes(1);
    expect(args.onStepSelect).toHaveBeenCalledWith(2);
    expect(args.onPrevious).toHaveBeenCalledTimes(1);
    expect(args.onNext).toHaveBeenCalledTimes(1);
    expect(args.onNextSection).toHaveBeenCalledTimes(1);
    expect(args.onBack).toHaveBeenCalledTimes(1);
    expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};

export const RepeatStep: Story = {
  args: { step: 2, recordState: 'idle' },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const steps = await canvas.findByRole('tablist', {
      name: t('listen.steps'),
    });
    const record = canvas.getByRole('button', {
      name: t('listen.recordRepeat'),
    });

    expect(
      within(steps).getByRole('tab', { selected: true }).textContent,
    ).toContain(t('listen.stepRepeat'));
    expect(canvas.queryByRole('button', { name: t('listen.play') })).toBeNull();
    expect(canvas.queryByRole('img')).toBeNull();
    await userEvent.click(record);
    expect(args.onRecord).toHaveBeenCalledTimes(1);
    await userEvent.click(
      within(steps).getByRole('tab', {
        name: new RegExp(t('listen.stepListen')),
      }),
    );
    expect(args.onStepSelect).toHaveBeenCalledWith(1);
  },
};

export const Recording: Story = {
  args: { step: 2, recordState: 'recording' },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const stop = await within(canvasElement).findByRole('button', {
      name: t('listen.stopRecording'),
    });

    expect(getComputedStyle(stop).backgroundColor).toBe(
      getComputedStyle(stop).borderTopColor,
    );
  },
};

export const Recorded: Story = {
  args: { step: 2, recordState: 'done' },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);

    await userEvent.click(
      await canvas.findByRole('button', { name: t('listen.playRecording') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('listen.recordAgain') }),
    );

    expect(args.onPlayRecording).toHaveBeenCalledTimes(1);
    expect(args.onRecord).toHaveBeenCalledTimes(1);
  },
};

export const MicrophoneBlocked: Story = {
  render: (args: ListenScreenProps) => (
    <View className="min-h-screen">
      <WithText>
        {(t, appLanguage) => (
          <ListenScreen
            {...args}
            nativeLanguage={appLanguage}
            taskNames={lessonStepNames(t, appLanguage, 'de')}
            notice={t('listen.microphoneDenied')}
          />
        )}
      </WithText>
    </View>
  ),
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const notice = await canvas.findByRole('status');

    expect(notice.textContent).toBe(t('listen.microphoneDenied'));
    expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
      canvasElement.clientWidth,
    );
  },
};

export const WordNotInSentence: Story = {
  args: { highlightedWord: 'Bahnhof' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText(args.word.sentence)).toBeTruthy();
    expect(canvas.queryByText('Bahnhof')).toBeNull();
  },
};

export const FirstPhrase: Story = {
  args: { isFirstPhrase: true },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const previous = await within(canvasElement).findByRole('button', {
      name: t('listen.previousPhrase'),
    });

    expect(previous).toHaveAttribute('aria-disabled', 'true');
  },
};

export const LastPhrase: Story = {
  args: { isLastPhrase: true },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const next = await canvas.findByRole('button', {
      name: t('listen.nextPhrase'),
    });

    expect(next.getAttribute('aria-disabled')).toBe('true');
    expect(args.onNext).not.toHaveBeenCalled();
  },
};
