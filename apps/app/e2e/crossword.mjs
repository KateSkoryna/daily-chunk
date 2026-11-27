import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

import { serveDist } from './serve-dist.mjs';
import { startDemoLesson } from './start-demo-lesson.mjs';

const distFolder = fileURLToPath(new URL('../dist', import.meta.url));

const server = await serveDist(distFolder);
const browser = await chromium.launch();
const page = await browser.newPage({ locale: 'en-US' });
const problems = [];
page.on('pageerror', (error) => problems.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error') problems.push(message.text());
});
const pathname = () => new URL(page.url()).pathname;
let currentStep = 'start';
const step = (name) => {
  currentStep = name;
};

const cell = (number, direction, position, letter) =>
  page.getByRole('button', {
    name: `${number} ${direction}, letter ${position}, ${letter ?? 'empty'}`,
    exact: true,
  });

async function type(letters) {
  for (const letter of letters) {
    await page.getByRole('button', { name: letter, exact: true }).click();
  }
}

try {
  step('reach the crossword after the flashcards');
  await startDemoLesson(page, server.url);
  await page.getByRole('button', { name: 'Next section →' }).click();
  await page.waitForURL('**/lesson/crossword');
  await page
    .getByText(
      'Tap the first letter of a word, the one with a number, to start.',
    )
    .waitFor();
  await page.getByText('02 / Crossword').waitFor();
  const next = page.getByRole('button', { name: 'Next section →' });
  assert.equal(await next.getAttribute('aria-disabled'), 'true');

  step('open a word and see its clue');
  await cell(1, 'down', 1).click();
  await page.getByText('1 ↓ Down').waitFor();
  await page
    .getByText('Ein Gebäude, in dem sich Reisende und Züge treffen.')
    .waitFor();
  await page.getByText('Lesson word · 7 letters').waitFor();
  await page.getByRole('group', { name: 'Keyboard' }).waitFor();

  step('type a wrong letter');
  await type(['X']);
  await page
    .getByText('Not X. 2 tries left, then Chunk fills it in.')
    .waitFor();
  await cell(1, 'down', 1).waitFor();

  step('let Chunk fill the letter in after three wrong tries');
  await type(['Y', 'Z']);
  await page.getByText('Chunk filled in that letter. Keep going.').waitFor();
  await cell(1, 'down', 1, 'B').waitFor();

  step('show the translation hint');
  await page
    .getByRole('button', { name: 'Show a hint: the translation' })
    .click();
  await page.getByText('Hint: station').waitFor();
  const usedHint = page.getByRole('button', { name: 'Hint used' });
  assert.equal(await usedHint.getAttribute('aria-disabled'), 'true');

  step('solve the word past the given letter');
  await type(['A', 'N', 'H', 'O', 'F']);
  await page.getByText('Tap the next word.').waitFor();
  await page
    .getByRole('status')
    .getByText('der Bahnhof', { exact: true })
    .waitFor();
  assert.equal(await page.getByRole('group', { name: 'Keyboard' }).count(), 0);

  step('open the link word and close it again');
  await cell(2, 'across', 1).click();
  await page.getByText('2 → Across · Link word').waitFor();
  await page
    .getByText('Link word: joins your words, does not count.')
    .waitFor();
  await page.getByRole('button', { name: 'Close the keyboard' }).click();
  await page
    .getByText(
      'Tap the first letter of a word, the one with a number, to start.',
    )
    .waitFor();

  step('solve the other words');
  await cell(2, 'across', 1).click();
  await type(['Z', 'U']);
  await cell(3, 'down', 2).click();
  await type(['L', 'I', 'S']);
  await cell(4, 'across', 1).click();
  await type(['F', 'A', 'R', 'K', 'A', 'R', 'T']);
  await page.getByText('All words found.').waitFor();

  step('go on to Listen & shadow');
  assert.notEqual(await next.getAttribute('aria-disabled'), 'true');
  await next.click();
  await page.waitForURL('**/lesson/listen');
  assert.equal(pathname(), '/lesson/listen');
  await page
    .getByText('+40 XP', { exact: true })
    .locator('visible=true')
    .first()
    .waitFor();

  step('read the saved result');
  await page.goto(`${server.url}/dev/storage-check`);
  await page
    .getByText('lesson: lesson-1 flashcards 3/3 crossword 2/3')
    .waitFor();

  assert.deepEqual(problems, []);
  console.log('crossword e2e passed');
} catch (error) {
  console.error(`crossword e2e failed at step: ${currentStep}`);
  throw error;
} finally {
  await browser.close();
  server.close();
}
