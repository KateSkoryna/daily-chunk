import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

import { serveDist } from './serve-dist.mjs';

const distFolder = fileURLToPath(new URL('../dist', import.meta.url));

const server = await serveDist(distFolder);
const browser = await chromium.launch();
const page = await browser.newPage({ locale: 'en-US' });
const problems = [];
page.on('pageerror', (error) => problems.push(error.message));
const pathname = () => new URL(page.url()).pathname;

try {
  await page.goto(server.url);
  const wordsField = page.getByRole('textbox', {
    name: 'Words you heard or saw today',
  });
  const checkButton = page.getByRole('button', { name: 'Check my words' });
  await wordsField.waitFor();
  assert.equal(await checkButton.getAttribute('aria-disabled'), 'true');

  await page.getByRole('button', { name: 'Dictate words' }).click();
  await page
    .getByText('Dictation is coming later. For now, type the words.')
    .waitFor();

  await wordsField.fill('Haus\nBaum\nTisch');
  await checkButton.click();
  await page.getByText(/No words recognised/).waitFor();
  assert.equal(pathname(), '/');

  await wordsField.fill('Bahnhöfe\nFahrkarte\nGleis');
  await checkButton.click();
  await page.waitForURL('**/confirm');

  for (const word of ['der Bahnhof', 'die Fahrkarte', 'das Gleis']) {
    await page.getByText(word, { exact: true }).waitFor();
  }
  await page
    .getByText('You wrote "Bahnhöfe" (plural). Saved as der Bahnhof.')
    .waitFor();

  await page.reload();
  for (const word of ['der Bahnhof', 'die Fahrkarte', 'das Gleis']) {
    await page.getByText(word, { exact: true }).waitFor();
  }
  assert.equal(pathname(), '/confirm');

  await page.getByRole('button', { name: '+ Add more words' }).click();
  await wordsField.waitFor();
  assert.equal(pathname(), '/');
  assert.equal(await wordsField.inputValue(), '');

  assert.deepEqual(problems, []);
  console.log('home e2e passed');
} finally {
  await browser.close();
  server.close();
}
