import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { appLanguageOf, textFor, WithText } from '../../lib/story-text';
import { listedWords } from '../../mocks/word-list';
import { ArticleChip } from '../ArticleChip/ArticleChip';
import { Icon } from '../Icon/Icon';
import { Noun } from '../Noun/Noun';
import { Text, TextClassContext } from '../ui/text';
import { ListGroup } from './ListGroup';
import { listGroupMeta } from './ListGroup.meta';

const meta = {
  title: 'Components/ListGroup',
  component: ListGroup,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(listGroupMeta) } },
    controls: { disable: true },
  },
  args: { children: null },
  render: () => (
    <View className="p-gutter">
      <WithText>
        {(t) => (
          <ListGroup>
            {listedWords.map((word) => (
              <ListGroup.Row
                key={word.noun}
                right={<Text variant="caption">{t('done.tomorrow')}</Text>}
              >
                <Noun gender={word.gender} targetLanguage="de" variant="option">
                  {word.noun}
                </Noun>
              </ListGroup.Row>
            ))}
          </ListGroup>
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof ListGroup>;

export default meta;

type Story = StoryObj<typeof ListGroup>;

export const Default: Story = {
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const list = await canvas.findByRole('list');
    const rows = within(list).getAllByRole('listitem');
    const style = getComputedStyle(list);

    expect(rows).toHaveLength(listedWords.length);
    expect(toRem(style.borderTopWidth)).toBe(0.125);
    for (const [index, row] of rows.entries()) {
      expect(toRem(row.getBoundingClientRect().height)).toBeGreaterThanOrEqual(
        3,
      );
      expect(toRem(getComputedStyle(row).borderTopWidth)).toBe(
        index === 0 ? 0 : 0.125,
      );
    }
    expect(within(list).getAllByText(t('done.tomorrow'))).toHaveLength(
      rows.length,
    );
    const label = within(rows[0]!).getByText(listedWords[0]!.noun);
    expect(label).toBeTruthy();
  },
};

export const Editable: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View className="p-gutter">
      <WithText>
        {(_t, appLanguage) => (
          <ListGroup>
            {listedWords.map((word) => (
              <ListGroup.Row
                key={word.noun}
                left={<ArticleChip gender={word.gender} targetLanguage="de" />}
                right={
                  <TextClassContext.Provider value="text-ring">
                    <Icon name="pencil" decorative />
                  </TextClassContext.Provider>
                }
                onPress={fn()}
              >
                <Text variant="word-l">{word.noun}</Text>
                <Text variant="body-sm">{word.forms}</Text>
                <Text variant="body-sm" className="text-foreground">
                  {word.translations[appLanguage]}
                </Text>
              </ListGroup.Row>
            ))}
          </ListGroup>
        )}
      </WithText>
    </View>
  ),
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const language = appLanguageOf(globals);
    const rows = await canvas.findAllByRole('button');
    const first = rows[0]!;

    expect(canvas.getAllByRole('button')).toHaveLength(listedWords.length);
    expect(toRem(first.getBoundingClientRect().height)).toBeGreaterThanOrEqual(
      4,
    );
    expect(
      within(first).getByText(listedWords[0]!.translations[language]),
    ).toBeTruthy();
    expect(first.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
      'true',
    );

    await userEvent.click(first);
  },
};
