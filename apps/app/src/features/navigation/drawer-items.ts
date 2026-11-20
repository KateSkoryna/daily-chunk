import type { Href } from 'expo-router';

import type { IconName } from '../../components/Icon/icon-shapes';

export const drawerItems = [
  {
    key: 'account',
    icon: 'account',
    labelKey: 'menu.account',
    href: '/account',
  },
  {
    key: 'lessons',
    icon: 'lessons',
    labelKey: 'menu.lessons',
    href: '/lessons',
  },
  { key: 'review', icon: 'retry', labelKey: 'menu.review', href: '/review' },
  {
    key: 'word-bank',
    icon: 'wordBank',
    labelKey: 'menu.wordBank',
    href: '/word-bank',
  },
  { key: 'boss', icon: 'boss', labelKey: 'menu.boss', href: '/boss' },
  {
    key: 'settings',
    icon: 'settings',
    labelKey: 'menu.settings',
    href: '/settings',
  },
  { key: 'help', icon: 'help', labelKey: 'menu.help', href: '/settings' },
] as const satisfies readonly {
  key: string;
  labelKey: string;
  icon: IconName;
  href: Href;
}[];
