import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { HeaderStats } from '../HeaderStats/HeaderStats';
import { iconNames } from '../Icon/icon-shapes';
import { LogoBadge } from '../LogoBadge/LogoBadge';
import { TopBar } from './TopBar';
import { topBarMeta } from './TopBar.meta';

const meta = {
  title: 'Components/TopBar',
  component: TopBar,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(topBarMeta) } },
    controls: { disable: true },
  },
  render: () => (
    <View className="p-gutter">
      <WithText>
        {(t) => (
          <TopBar
            left={
              <TopBar.Button
                icon="menu"
                accessibilityLabel={t('nav.menu')}
                onPress={fn()}
              />
            }
            right={
              <HeaderStats
                xp={1240}
                xpLabel={t('stats.xp')}
                streakLabel={t('stats.streak', { count: 12 })}
              />
            }
          />
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof TopBar>;

export default meta;

type Story = StoryObj<typeof TopBar>;

export const Default: Story = {
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const button = await canvas.findByRole('button', { name: t('nav.menu') });
    const box = button.getBoundingClientRect();
    const stats = (
      await canvas.findByText(t('stats.streak', { count: 12 }))
    ).getBoundingClientRect();

    expect(iconNames).toContain('menu');
    expect(toRem(box.width)).toBeGreaterThanOrEqual(3);
    expect(toRem(box.height)).toBeGreaterThanOrEqual(3);
    expect(toRem(getComputedStyle(button).borderTopWidth)).toBe(0.125);
    expect(button.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
    expect(box.right).toBeLessThan(stats.left);
    expect(
      Math.abs(box.top + box.height / 2 - (stats.top + stats.height / 2)),
    ).toBeLessThan(box.height);
    await userEvent.click(button);
  },
};

export const WithLogo: Story = {
  render: () => (
    <View className="p-gutter">
      <WithText>
        {(t) => (
          <TopBar
            left={
              <TopBar.Button
                icon="menu"
                accessibilityLabel={t('nav.menu')}
                onPress={fn()}
              />
            }
            center={<LogoBadge accessibilityLabel={t('app.name')} />}
            right={
              <HeaderStats
                xp={1240}
                xpLabel={t('stats.xp')}
                streakLabel={t('stats.streak', { count: 12 })}
              />
            }
          />
        )}
      </WithText>
    </View>
  ),
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const button = await canvas.findByRole('button', { name: t('nav.menu') });
    const logo = (
      await canvas.findByRole('img', { name: t('app.name') })
    ).getBoundingClientRect();
    const stats = (
      await canvas.findByText(t('stats.streak', { count: 12 }))
    ).getBoundingClientRect();

    expect(button.getBoundingClientRect().right).toBeLessThan(logo.left);
    expect(logo.right).toBeLessThan(stats.left);
  },
};

export const DictateButton: Story = {
  render: () => (
    <View className="flex-row gap-4 p-gutter">
      <WithText>
        {(t) => (
          <>
            <TopBar.Button
              icon="menu"
              accessibilityLabel={t('nav.menu')}
              onPress={fn()}
            />
            <TopBar.Button
              variant="record"
              icon="mic"
              accessibilityLabel={t('home.dictate')}
              onPress={fn()}
            />
          </>
        )}
      </WithText>
    </View>
  ),
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const plain = await canvas.findByRole('button', { name: t('nav.menu') });
    const record = await canvas.findByRole('button', {
      name: t('home.dictate'),
    });

    expect(getComputedStyle(record).borderTopColor).not.toBe(
      getComputedStyle(plain).borderTopColor,
    );
    expect(toRem(record.getBoundingClientRect().width)).toBeGreaterThanOrEqual(
      3,
    );
  },
};

export const HintButton: Story = {
  render: () => (
    <View className="flex-row gap-4 p-gutter">
      <WithText>
        {(t) => (
          <>
            <TopBar.Button
              variant="tip"
              icon="lamp"
              accessibilityLabel={t('crossword.showHint')}
              onPress={fn()}
            />
            <TopBar.Button
              variant="tip"
              icon="lamp"
              accessibilityLabel={t('crossword.hintUsed')}
              disabled
              onPress={fn()}
            />
          </>
        )}
      </WithText>
    </View>
  ),
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const hint = await canvas.findByRole('button', {
      name: t('crossword.showHint'),
    });
    const used = canvas.getByRole('button', { name: t('crossword.hintUsed') });

    expect(hint.getAttribute('aria-disabled')).not.toBe('true');
    expect(used.getAttribute('aria-disabled')).toBe('true');
    expect(getComputedStyle(used).borderTopColor).not.toBe(
      getComputedStyle(hint).borderTopColor,
    );
  },
};

export const LabelledAction: Story = {
  render: () => (
    <View className="p-gutter">
      <WithText>
        {(t) => (
          <TopBar
            left={
              <TopBar.Action
                icon="cross"
                iconPosition="end"
                label={t('lesson.quit')}
                onPress={fn()}
              />
            }
            right={
              <HeaderStats
                xp={1240}
                xpLabel={t('stats.xp')}
                streakLabel={t('stats.streak', { count: 12 })}
              />
            }
          />
        )}
      </WithText>
    </View>
  ),
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const action = await canvas.findByRole('button', {
      name: t('lesson.quit'),
    });
    const box = action.getBoundingClientRect();

    expect(action.textContent).toBe(t('lesson.quit'));
    expect(
      action.querySelector('svg')!.getBoundingClientRect().left,
    ).toBeGreaterThan(
      action.querySelector('div')!.getBoundingClientRect().left,
    );
    expect(action.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
    expect(toRem(box.height)).toBeGreaterThanOrEqual(3);
    expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
      canvasElement.clientWidth,
    );
    await userEvent.click(action);
  },
};
