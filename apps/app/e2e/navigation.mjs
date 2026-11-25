import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

import { serveDist } from './serve-dist.mjs';

const distFolder = fileURLToPath(new URL('../dist', import.meta.url));
const tabs = [
  { name: 'Home', path: '/' },
  { name: 'Lessons', path: '/lessons' },
  { name: 'Score', path: '/score' },
  { name: 'Stats', path: '/stats' },
];
const drawerItems = [
  { name: 'My account', path: '/account' },
  { name: 'My lessons', path: '/lessons' },
  { name: 'Review', path: '/review' },
  { name: 'Word bank', path: '/word-bank' },
  { name: 'Boss round', path: '/boss' },
  { name: 'Settings', path: '/settings' },
  { name: 'Help & feedback', path: '/settings' },
];

const server = await serveDist(distFolder);
const browser = await chromium.launch();
const page = await browser.newPage({ locale: 'en-US' });
const pathname = () => new URL(page.url()).pathname;
const openApp = async (path) => {
  await page.goto(server.url + path);
  await page
    .getByRole('button', { name: 'Menu', exact: true })
    .or(page.getByRole('button', { name: /Back|Quit/ }))
    .first()
    .waitFor();
};

try {
  await openApp('/');
  const tabBar = page.getByRole('tablist', { name: 'Main' });
  for (const tab of tabs) {
    await tabBar.getByRole('tab', { name: tab.name }).click();
    await page.waitForURL((url) => url.pathname === tab.path);
    await (
      tab.path === '/'
        ? page.getByRole('textbox', { name: 'Word 1' })
        : page.getByRole('heading', { name: tab.name })
    ).waitFor();
    assert.equal(
      await tabBar
        .getByRole('tab', { name: tab.name })
        .getAttribute('aria-selected'),
      'true',
      `${tab.name} tab is selected`,
    );
  }

  for (const item of drawerItems) {
    await openApp('/');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    const menu = page.getByRole('navigation', { name: 'App menu' });
    await menu.waitFor();
    await menu.getByRole('link', { name: item.name }).click();
    await page.waitForURL((url) => url.pathname === item.path);
    await menu.waitFor({ state: 'hidden' });
  }

  await openApp('/');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('navigation', { name: 'App menu' }).waitFor();
  await page.waitForFunction(
    () => document.activeElement?.getAttribute('aria-label') === 'Close menu',
  );
  await page.keyboard.press('Escape');
  await page
    .getByRole('navigation', { name: 'App menu' })
    .waitFor({ state: 'hidden' });

  await openApp('/lesson/translate');
  await page.getByRole('button', { name: 'Quit' }).click();
  const dialog = page.getByRole('alertdialog');
  await dialog.getByText('Leave the lesson?').waitFor();
  await dialog.getByRole('button', { name: 'Keep going' }).click();
  await dialog.waitFor({ state: 'hidden' });
  assert.equal(pathname(), '/lesson/translate');

  await page.getByRole('button', { name: 'Quit' }).click();
  await dialog.getByRole('button', { name: 'Leave' }).click();
  await page.waitForURL((url) => url.pathname === '/');

  await openApp('/');
  await page.evaluate(() => {
    window.history.pushState({}, '', '/lesson/translate');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await page.getByRole('button', { name: 'Quit' }).waitFor();
  await page.goBack();
  await dialog.getByText('Leave the lesson?').waitFor();
  await dialog.getByRole('button', { name: 'Keep going' }).click();
  assert.equal(pathname(), '/lesson/translate');

  await openApp('/lesson/done');
  await page.getByRole('button', { name: 'Quit' }).click();
  await page.waitForURL((url) => url.pathname === '/');
  assert.equal(await page.getByRole('alertdialog').count(), 0);

  console.log('navigation e2e passed');
} finally {
  await browser.close();
  server.close();
}
