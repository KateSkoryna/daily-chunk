import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { displayedWord } from '../../lib/displayed-word';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
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
    onTogglePlay: fn(),
    onSpeedPress: fn(),
    onRecord: fn(),
    onNextPhrase: fn(),
  },
  render: (args: ListenScreenProps) => (
    <View className="min-h-screen">
      <WithText>
        {(_t, appLanguage) => (
          <ListenScreen {...args} nativeLanguage={appLanguage} />
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
    const steps = await canvas.findByRole('progressbar', {
      name: t('listen.steps'),
    });
    const waveform = canvas.getByRole('img', {
      name: t('listen.waveform', {
        played: playback.playedSeconds,
        total: playback.durationSeconds,
      }),
    });
    const underlined = canvas.getByText(args.highlightedWord);

    expect(steps.getAttribute('aria-valuenow')).toBe('1');
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
    expect(
      canvas
        .getByRole('progressbar', {
          name: t('lesson.stepLabel', {
            step: '02',
            task: t('lesson.tasks.listen'),
          }),
        })
        .getAttribute('aria-valuenow'),
    ).toBe('2');

    await userEvent.click(
      canvas.getByRole('button', { name: t('listen.pause') }),
    );
    await userEvent.click(
      canvas.getByRole('button', {
        name: t('listen.speed', { speed: args.playback.speed }),
      }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('listen.recordRepeat') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('listen.nextPhrase') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('common.back') }),
    );

    expect(args.onTogglePlay).toHaveBeenCalledTimes(1);
    expect(args.onSpeedPress).toHaveBeenCalledTimes(1);
    expect(args.onRecord).toHaveBeenCalledTimes(1);
    expect(args.onNextPhrase).toHaveBeenCalledTimes(1);
    expect(args.onBack).toHaveBeenCalledTimes(1);
  },
};

export const RepeatStep: Story = {
  args: {
    step: 2,
    recordState: 'recording',
    playback: {
      bars: listenDemo.waveformBars,
      playedSeconds: listenDemo.durationSeconds,
      durationSeconds: listenDemo.durationSeconds,
      speed: listenDemo.speed,
      isPlaying: false,
    },
  },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const steps = await canvas.findByRole('progressbar', {
      name: t('listen.steps'),
    });
    const record = canvas.getByRole('button', {
      name: t('listen.recordRepeat'),
    });
    const waveform = canvas.getByRole('img');

    expect(steps.getAttribute('aria-valuenow')).toBe('2');
    expect(canvas.getByRole('button', { name: t('listen.play') })).toBeTruthy();
    expect(within(waveform).queryAllByTestId('bar-unplayed')).toHaveLength(0);
    expect(getComputedStyle(record).backgroundColor).toBe(
      getComputedStyle(record).borderTopColor,
    );
  },
};
