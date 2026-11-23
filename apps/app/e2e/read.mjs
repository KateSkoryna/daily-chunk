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

try {
  step('reach the Read screen');
  await startDemoLesson(page, server.url);
  await page.getByRole('button', { name: 'Next section →' }).click();
  await page.waitForURL('**/lesson/listen');
  await page.getByRole('button', { name: 'Next phrase' }).click();
  await page.getByRole('button', { name: 'Next phrase' }).click();
  await page.getByRole('button', { name: 'Next section →' }).click();
  await page.waitForURL('**/lesson/read');
  await page.getByText('Der letzte Zug', { exact: true }).waitFor();

  step('see the XP of the finished flashcards and listen');
  await page
    .getByText('+40 XP', { exact: true })
    .locator('visible=true')
    .first()
    .waitFor();

  step('see the translation under every paragraph');
  await page.getByText('Anna is standing at the station.').waitFor();
  await page.getByText('She is looking for her ticket in the bag.').waitFor();
  assert.equal(await page.getByRole('switch').count(), 0);

  step('open and close a word card');
  await page.getByRole('button', { name: 'Fahrkarte', exact: true }).click();
  const card = page.getByRole('group', { name: /Fahrkarte/ });
  await card.waitFor();
  await card.getByRole('button', { name: /^Play/ }).click();
  assert.deepEqual(await page.evaluate(() => window.spokenTexts), [
    { text: 'die Fahrkarte', language: 'de-DE' },
  ]);
  await page.getByRole('button', { name: 'Gleis', exact: true }).click();
  await page.getByRole('group', { name: /Gleis/ }).waitFor();
  assert.equal(await page.getByRole('group').count(), 1);
  await page.getByRole('button', { name: 'Gleis', exact: true }).click();
  assert.equal(await page.getByRole('group').count(), 0);

  step('quit and keep going');
  const dialog = page.getByRole('alertdialog');
  await page.getByRole('button', { name: 'Quit' }).click();
  await dialog.getByText('Leave the lesson?').waitFor();
  await dialog.getByRole('button', { name: 'Keep going' }).click();
  await dialog.waitFor({ state: 'hidden' });
  assert.equal(pathname(), '/lesson/read');

  step('go back to Listen');
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.waitForURL('**/lesson/listen');
  await page.getByRole('button', { name: 'Go to: Read the story' }).click();
  await page.waitForURL('**/lesson/read');

  step('finish the task');
  await page.getByRole('button', { name: 'Now read it aloud' }).click();
  await page.waitForURL('**/lesson/record');

  step('read the saved result');
  await page.goto(`${server.url}/dev/storage-check`);
  await page
    .getByText('lesson: lesson-1 flashcards 3/3 listen 0/3 read 3/3')
    .waitFor();

  assert.deepEqual(problems, []);
  console.log('read e2e passed');
} catch (error) {
  console.error(`read e2e failed at step: ${currentStep}`);
  throw error;
} finally {
  await browser.close();
  server.close();
}
