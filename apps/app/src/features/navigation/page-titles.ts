export const pageTitleKeys = {
  account: 'menu.account',
  review: 'menu.review',
  'word-bank': 'menu.wordBank',
  boss: 'menu.boss',
  settings: 'menu.settings',
  confirm: 'confirm.title',
} as const;

export type PageName = keyof typeof pageTitleKeys;

export function isPageName(name: string | undefined): name is PageName {
  return name !== undefined && name in pageTitleKeys;
}
