import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useTranslation } from '@daily-chunk/i18n';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { useState } from 'react';

import { TabBar, type TabBarProps, type TabBarTab } from './TabBar';
import { tabBarMeta } from './TabBar.meta';

const tabs: TabBarTab[] = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'lessons', label: 'Lessons', icon: 'book' },
  {
    key: 'score',
    label: 'Score',
    icon: 'trophy',
    badge: 5,
  },
  { key: 'stats', label: 'Stats', icon: 'chart' },
];

function TabBarDemo({ activeKey, onSelect, ...props }: TabBarProps) {
  const { t } = useTranslation();
  const [active, setActive] = useState(activeKey);
  const labels: Record<string, string> = {
    home: t('nav.home'),
    lessons: t('nav.lessons'),
    score: t('nav.score'),
    stats: t('nav.stats'),
  };

  return (
    <View className="min-h-screen justify-end">
      <TabBar
        {...props}
        accessibilityLabel={t('nav.main')}
        tabs={props.tabs.map((tab) => ({ ...tab, label: labels[tab.key]! }))}
        activeKey={active}
        onSelect={(key) => {
          setActive(key);
          onSelect(key);
        }}
      />
    </View>
  );
}

const meta = {
  title: 'Components/TabBar',
  component: TabBar,
  tags: ['autodocs'],
  parameters: {
    controls: { include: ['activeKey'] },
    docs: {
      description: {
        component:
          metaToMarkdown(tabBarMeta) +
          '\n\nThe labels come from the app language: switch it in the toolbar to see Russian.',
      },
    },
  },
  args: {
    tabs,
    activeKey: 'home',
    accessibilityLabel: 'Main',
    onSelect: fn(),
  },
  argTypes: {
    activeKey: {
      control: 'select',
      options: tabs.map((tab) => tab.key),
      description: 'The key of the active tab.',
    },
  },
  render: (args) => <TabBarDemo {...args} />,
} satisfies Meta<typeof TabBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const list = await canvas.findByRole('tablist', { name: 'Main' });
    const tabButtons = within(list).getAllByRole('tab');
    const active = tabButtons.find(
      (tab) => tab.getAttribute('aria-selected') === 'true',
    )!;
    const inactive = tabButtons.find((tab) => tab !== active)!;

    expect(tabButtons).toHaveLength(tabs.length);
    expect(active.textContent).toContain(
      tabs.find((tab) => tab.key === args.activeKey)!.label,
    );
    const labelColourOf = (tab: HTMLElement) =>
      getComputedStyle(
        within(tab).getByText(tab.textContent!.replace(/\d+$/, '')),
      ).color;
    expect(labelColourOf(active)).not.toBe(labelColourOf(inactive));
    expect(toRem(getComputedStyle(list).borderTopWidth)).toBe(0.125);
    for (const tab of tabButtons) {
      expect(toRem(tab.getBoundingClientRect().height)).toBe(3.5);
      expect(
        Math.abs(
          tab.getBoundingClientRect().width -
            tabButtons[0]!.getBoundingClientRect().width,
        ),
      ).toBeLessThan(1);
    }
    const bars = canvas.getAllByTestId('tab-active-bar');
    const bar = bars[0]!;
    const badge = await canvas.findByText('5');

    expect(bars).toHaveLength(1);
    expect(active.contains(bar)).toBe(true);
    expect(toRem(getComputedStyle(bar).borderTopWidth)).toBe(0.1875);
    expect(getComputedStyle(bar).borderTopColor).toBe(
      getComputedStyle(within(active).getAllByText(/./)[0]!).color,
    );
    expect(bar.getBoundingClientRect().top).toBeLessThanOrEqual(
      list.getBoundingClientRect().top + 1,
    );
    expect(bar.getBoundingClientRect().bottom).toBeGreaterThan(
      list.getBoundingClientRect().top + 2,
    );
    expect(badge.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      list.getBoundingClientRect().top,
    );

    const target = tabButtons.find((tab) => tab !== active)!;
    await userEvent.click(target);

    expect(args.onSelect).toHaveBeenCalledTimes(1);
    expect(target.getAttribute('aria-selected')).toBe('true');
    expect(active.getAttribute('aria-selected')).toBe('false');
  },
};
