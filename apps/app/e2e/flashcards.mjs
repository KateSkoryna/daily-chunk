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
await page.addInitScript(() => {
  window.spokenTexts = [];
  window.speechSynthesis.speak = (utterance) => {
    window.spokenTexts.push({ text: utterance.text, language: utterance.lang });
  };
});
const pathname = () => new URL(page.url()).pathname;
let currentStep = 'start';
const step = (name) => {
  currentStep = name;
};
const showsCard = async (count, wordText) => {
  await page.getByText(`Card ${count} of 3`).waitFor();
  await page
    .getByText(wordText, { exact: true })
    .locator('visible=true')
    .first()
    .waitFor();
};

try {
  step('start the lesson');
  await startDemoLesson(page, server.url);
  await page.getByText('Lesson 1', { exact: true }).waitFor();
  await showsCard(1, 'Bahnhof');

  step('flip the first card');
  await page.getByRole('button', { name: /Bahnhof/ }).click();
  await page.getByText('Ich warte am Bahnhof.').waitFor();

  await page.getByRole('button', { name: 'Listen', exact: true }).click();
  assert.deepEqual(await page.evaluate(() => window.spokenTexts), [
    { text: 'Ich warte am Bahnhof.', language: 'de-DE' },
  ]);

  step('go to the next card');
  await page.getByRole('button', { name: 'Next card' }).click();
  await showsCard(2, 'Fahrkarte');

  step('go back to the previous card');
  assert.notEqual(
    await page
      .getByRole('button', { name: 'Previous card' })
      .getAttribute('aria-disabled'),
    'true',
  );
  await page.getByRole('button', { name: 'Previous card' }).click();
  await showsCard(1, 'Bahnhof');
  assert.equal(
    await page
      .getByRole('button', { name: 'Previous card' })
      .getAttribute('aria-disabled'),
    'true',
  );

  step('go through all cards');
  await page.getByRole('button', { name: 'Next card' }).click();
  await showsCard(2, 'Fahrkarte');
  await page.getByRole('button', { name: 'Next card' }).click();
  await showsCard(3, 'Gleis');

  step('jump to a card with the dots');
  await page.getByRole('button', { name: 'Card 3', exact: true }).click();
  await showsCard(3, 'Gleis');
  await page.getByRole('button', { name: 'Card 2', exact: true }).click();
  await showsCard(2, 'Fahrkarte');
  await page.getByRole('button', { name: 'Card 3', exact: true }).click();
  await showsCard(3, 'Gleis');

  step('finish on the last card');
  await page.getByRole('button', { name: 'Next section →' }).click();
  await page.waitForURL('**/lesson/listen');
  assert.equal(pathname(), '/lesson/listen');

  step('come back to the flashcards');
  await page.goBack();
  await page.waitForURL('**/lesson/flashcards');
  await showsCard(1, 'Bahnhof');

  step('read the saved result');
  await page.goto(`${server.url}/dev/storage-check`);
  await page.getByText('lesson: lesson-1 flashcards 3/3').waitFor();

  assert.deepEqual(problems, []);
  console.log('flashcards e2e passed');
} catch (error) {
  console.error(`flashcards e2e failed at step: ${currentStep}`);
  throw error;
} finally {
  await browser.close();
  server.close();
}
