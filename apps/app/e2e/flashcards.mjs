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

  await page.getByRole('button', { name: 'Listen' }).click();
  assert.deepEqual(await page.evaluate(() => window.spokenTexts), [
    { text: 'Ich warte am Bahnhof.', language: 'de-DE' },
  ]);

  step('answer Again');
  await page.getByRole('button', { name: '← Again' }).click();
  await showsCard(1, 'Fahrkarte');

  step('answer Next on card 1');
  await page.getByRole('button', { name: 'Next →' }).click();
  await showsCard(2, 'Gleis');

  step('answer Next on card 2');
  await page.getByRole('button', { name: 'Next →' }).click();
  await showsCard(3, 'Bahnhof');

  step('answer Next on the last card');
  await page.getByRole('button', { name: 'Next →' }).click();
  await page.waitForURL('**/lesson/listen');
  assert.equal(pathname(), '/lesson/listen');

  step('read the saved result');
  await page.goto(`${server.url}/dev/storage-check`);
  await page.getByText('lesson: lesson-1 flashcards 2/3').waitFor();

  assert.deepEqual(problems, []);
  console.log('flashcards e2e passed');
} catch (error) {
  console.error(`flashcards e2e failed at step: ${currentStep}`);
  throw error;
} finally {
  await browser.close();
  server.close();
}
