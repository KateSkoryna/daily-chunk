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

  await wordsField.pressSequentially('Bahnhof');
  await wordsField.press('Enter');
  await wordsField.pressSequentially('Fahrkarte ');
  await page.getByRole('button', { name: 'Edit Bahnhof' }).waitFor();
  await page.getByRole('button', { name: 'Edit Fahrkarte' }).waitFor();
  await page.getByText('2 / 6 words · min 3').waitFor();
  assert.equal(await wordsField.inputValue(), '');

  await page.getByRole('button', { name: 'Remove Bahnhof' }).click();
  await page.getByText('1 / 6 words · min 3').waitFor();
  assert.equal(
    await page.getByRole('button', { name: 'Edit Bahnhof' }).count(),
    0,
  );

  await page.getByRole('button', { name: 'Edit Fahrkarte' }).click();
  assert.equal(await wordsField.inputValue(), 'Fahrkarte');
  assert.equal(await page.getByRole('button', { name: /^Edit/ }).count(), 0);
  await wordsField.press('Enter');
  await page.getByRole('button', { name: 'Edit Fahrkarte' }).waitFor();

  await wordsField.fill('a b c d e f g h');
  await page.getByText('6 / 6 words · min 3').waitFor();
  await page.getByText('3 words left out: a lesson takes 6.').waitFor();
  assert.equal(await wordsField.count(), 0);

  while (await page.getByRole('button', { name: /^Remove/ }).count()) {
    await page
      .getByRole('button', { name: /^Remove/ })
      .first()
      .click();
  }
  await wordsField.waitFor();
  assert.equal(await checkButton.getAttribute('aria-disabled'), 'true');

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

  await page.goto(`${server.url}/confirm`);
  await page.getByText('der Bahnhof', { exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: /^Edit/ }).count(), 0);
  await page.getByRole('button', { name: 'Start lesson' }).click();
  await page.waitForURL('**/lesson/overview');
  await page.getByRole('list').getByRole('listitem').nth(5).waitFor();
  assert.equal(await page.getByRole('list').getByRole('listitem').count(), 6);
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.waitForURL('**/lesson/flashcards');
  await page.getByText('Lesson 1', { exact: true }).waitFor();

  await page.goto(`${server.url}/confirm`);
  await page.getByText('der Bahnhof', { exact: true }).waitFor();

  assert.deepEqual(problems, []);
  console.log('home e2e passed');
} finally {
  await browser.close();
  server.close();
}
