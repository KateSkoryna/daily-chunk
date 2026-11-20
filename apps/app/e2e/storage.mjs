import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

import { serveDist } from './serve-dist.mjs';

const distFolder = fileURLToPath(new URL('../dist', import.meta.url));

const server = await serveDist(distFolder);
const browser = await chromium.launch();
const page = await browser.newPage();
const problems = [];
page.on('pageerror', (error) => problems.push(error.message));

try {
  await page.goto(`${server.url}/dev/storage-check`);
  await page.getByText('profile: none').waitFor();
  assert.equal(
    await page.evaluate(() => crossOriginIsolated),
    true,
    'page is cross-origin isolated',
  );

  await page.getByRole('button', { name: 'Save demo profile' }).click();
  await page.getByText('profile: profile-demo, xp 1240, ru to de').waitFor();

  await page.reload();
  await page.getByText('profile: profile-demo, xp 1240, ru to de').waitFor();

  assert.deepEqual(problems, []);
  console.log('storage e2e passed');
} finally {
  await browser.close();
  server.close();
}
