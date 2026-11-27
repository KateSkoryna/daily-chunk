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
  const field = (number) =>
    page.getByRole('textbox', { name: `Word ${number}` });
  const checkButton = page.getByRole('button', { name: 'Check my words' });
  const addButton = page.getByRole('button', { name: '+ Add a word' });
  await field(1).waitFor();
  assert.equal(await page.getByRole('textbox').count(), 3);
  assert.equal(await checkButton.getAttribute('aria-disabled'), 'true');

  await field(1).pressSequentially('Bahnhof');
  await field(1).press('Enter');
  await field(2).pressSequentially('Fahrkarte');
  await page.getByText('2 / 6 words · min 3').waitFor();
  assert.equal(await checkButton.getAttribute('aria-disabled'), 'true');

  await field(2).press('Enter');
  await field(3).pressSequentially('Gleis');
  await page.getByText('3 / 6 words · min 3').waitFor();
  assert.notEqual(await checkButton.getAttribute('aria-disabled'), 'true');

  await field(3).press('Enter');
  await field(4).waitFor();
  await addButton.click();
  await addButton.click();
  assert.equal(await page.getByRole('textbox').count(), 6);
  assert.equal(await addButton.count(), 0);
  await page.getByRole('button', { name: 'Remove word 6' }).click();
  await page.getByRole('button', { name: 'Remove word 5' }).click();
  await page.getByRole('button', { name: 'Remove word 4' }).click();
  assert.equal(await page.getByRole('textbox').count(), 3);
  await addButton.waitFor();

  await page.reload();
  await field(1).waitFor();
  await field(1).fill('a b c d e f g h');
  await page.getByText('6 / 6 words · min 3').waitFor();
  await page.getByText('2 words left out: a lesson takes 6.').waitFor();
  assert.equal(await page.getByRole('textbox').count(), 6);
  assert.equal(await addButton.count(), 0);

  await page.reload();
  await field(1).fill('Haus');
  await field(2).fill('Baum');
  await field(3).fill('Tisch');
  await checkButton.click();
  await page.getByText(/No words recognised/).waitFor();
  assert.equal(pathname(), '/');

  await field(1).fill('Bahnhöfe');
  await field(2).fill('Fahrkarte');
  await field(3).fill('Gleis');
  await page.evaluate(() => {
    window.sawEmptyHome = false;
    const watch = () => {
      const inputs = [...document.querySelectorAll('input')];
      if (
        location.pathname === '/' &&
        inputs.length > 0 &&
        inputs.every((input) => input.value === '')
      ) {
        window.sawEmptyHome = true;
      }
      requestAnimationFrame(watch);
    };
    requestAnimationFrame(watch);
  });
  await checkButton.click();
  await page.waitForURL('**/confirm');
  assert.equal(await page.evaluate(() => window.sawEmptyHome), false);

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
  await field(1).waitFor();
  assert.equal(pathname(), '/');
  assert.equal(await field(1).inputValue(), '');

  await page.goto(`${server.url}/confirm`);
  await page.getByText('der Bahnhof', { exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: /^Edit/ }).count(), 0);
  await page.getByRole('button', { name: 'Start lesson' }).click();
  await page.waitForURL('**/lesson/overview');
  await page.getByRole('list').getByRole('listitem').nth(6).waitFor();
  assert.equal(await page.getByRole('list').getByRole('listitem').count(), 7);
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
