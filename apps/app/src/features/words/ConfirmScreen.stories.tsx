import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { appLanguageOf, textFor, WithText } from '../../lib/story-text';
import { homeDemo } from '../../mocks/home';
import { demoWords, gleis } from '../../mocks/words';
import { ConfirmScreen, type ConfirmScreenProps } from './ConfirmScreen';
import { confirmScreenMeta } from './ConfirmScreen.meta';

const meta = {
  title: 'Screens/Confirm',
  component: ConfirmScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: metaToMarkdown(confirmScreenMeta) } },
    controls: { disable: true },
  },
  args: {
    words: demoWords,
    nativeLanguage: 'en',
    pluralInput: homeDemo.pluralInput,
    onBack: fn(),
    onStartLesson: fn(),
    onAddMore: fn(),
  },
  render: (args: ConfirmScreenProps) => (
    <WithText>
      {(_t, appLanguage) => (
        <ConfirmScreen {...args} nativeLanguage={appLanguage} />
      )}
    </WithText>
  ),
} satisfies Meta<typeof ConfirmScreen>;

export default meta;

type Story = StoryObj<typeof ConfirmScreen>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const nativeLanguage = appLanguageOf(globals);
    const canvas = within(canvasElement);
    const list = await canvas.findByRole('list');
    const rows = within(list).getAllByRole('listitem');
    const adjective = demoWords.find(
      (word) => word.partOfSpeech === 'adjective',
    )!;
    const tagWidths = [
      canvas.getByText('der'),
      canvas.getByText('die'),
      canvas.getByText('das'),
      canvas.getByText(t('partOfSpeech.short.adjective')),
    ].map((tag) => tag.parentElement!.getBoundingClientRect().width);

    expect(rows).toHaveLength(demoWords.length);
    expect(
      canvas.getByRole('heading', { name: t('confirm.title') }),
    ).toBeTruthy();
    expect(canvas.getByText(t('confirm.intro'))).toBeTruthy();
    expect(
      canvas.getByText(t('confirm.wordCount', { count: demoWords.length })),
    ).toBeTruthy();
    expect(
      within(list).getByText(
        t('confirm.pluralForms', { forms: 'die Bahnhöfe' }),
      ),
    ).toBeTruthy();
    expect(
      within(list).getByText(t('partOfSpeech.long.adjective')),
    ).toBeTruthy();
    expect(
      within(list).getByText(adjective.translations[nativeLanguage]!),
    ).toBeTruthy();
    for (const width of tagWidths) {
      expect(toRem(width)).toBeGreaterThanOrEqual(3.5);
    }
    for (const row of rows) {
      expect(toRem(row.getBoundingClientRect().height)).toBeGreaterThanOrEqual(
        3,
      );
    }

    const notice = canvas.getByRole('status');
    expect(notice.textContent).toBe(
      t('confirm.pluralNotice', {
        written: homeDemo.pluralInput.typed,
        saved: 'der Bahnhof',
      }),
    );
    expect(getComputedStyle(notice).borderTopStyle).toBe('dashed');

    await userEvent.click(
      canvas.getByRole('button', { name: t('common.back') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('confirm.startLesson') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('confirm.addMore') }),
    );

    expect(args.onBack).toHaveBeenCalledTimes(1);
    expect(args.onStartLesson).toHaveBeenCalledTimes(1);
    expect(args.onAddMore).toHaveBeenCalledTimes(1);
  },
};

export const SingleWord: Story = {
  args: { words: [gleis], pluralInput: undefined },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const list = await canvas.findByRole('list');

    expect(within(list).getAllByRole('listitem')).toHaveLength(1);
    expect(canvas.getByText(t('confirm.wordCount', { count: 1 }))).toBeTruthy();
    expect(canvas.queryByRole('status')).toBeNull();
  },
};

export const OtherPartOfSpeech: Story = {
  args: {
    words: [
      ...demoWords,
      { ...demoWords[2]!, id: 'word-other', partOfSpeech: 'other' },
    ],
  },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const list = await canvas.findByRole('list');
    const longestTag = canvas.getByText(t('partOfSpeech.short.other'));
    const tagBox = longestTag.parentElement!.getBoundingClientRect();
    const textBox = longestTag.getBoundingClientRect();

    expect(
      canvas.getByRole('heading', { name: t('confirm.title') }),
    ).toBeTruthy();
    expect(
      canvas.getByRole('button', { name: t('confirm.startLesson') }),
    ).toBeTruthy();
    expect(textBox.left).toBeGreaterThanOrEqual(tagBox.left);
    expect(textBox.right).toBeLessThanOrEqual(tagBox.right);
    expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
      canvasElement.clientWidth,
    );
    expect(list.getBoundingClientRect().right).toBeLessThanOrEqual(
      canvasElement.clientWidth,
    );
  },
};
