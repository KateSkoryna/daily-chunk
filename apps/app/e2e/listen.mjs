import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

import { serveDist } from './serve-dist.mjs';
import { startDemoLesson } from './start-demo-lesson.mjs';

const distFolder = fileURLToPath(new URL('../dist', import.meta.url));

const server = await serveDist(distFolder);
const browser = await chromium.launch({
  args: [
    '--use-fake-device-for-media-stream',
    '--use-fake-ui-for-media-stream',
  ],
});
const context = await browser.newContext({
  locale: 'en-US',
  permissions: ['microphone'],
});
const page = await context.newPage();
const problems = [];
page.on('pageerror', (error) => problems.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error') problems.push(message.text());
});
await page.addInitScript(() => {
  window.spokenTexts = [];
  window.speechSynthesis.speak = (utterance) => {
    window.spokenTexts.push({
      text: utterance.text,
      language: utterance.lang,
      rate: utterance.rate,
    });
    setTimeout(() => utterance.onend?.(new Event('end')), 100);
  };
});
const pathname = () => new URL(page.url()).pathname;
let currentStep = 'start';
const step = (name) => {
  currentStep = name;
};

try {
  step('start the lesson and finish the flashcards');
  await startDemoLesson(page, server.url);
  await page.getByRole('button', { name: 'Next section →' }).click();
  await page.waitForURL('**/lesson/crossword');
  await page.getByRole('button', { name: 'Go to: Listen & shadow' }).click();
  await page.waitForURL('**/lesson/listen');
  await page.getByText('Phrase 1 of 3 · Repeat 1 of 3').waitFor();
  await page
    .getByText('Ich warte am Bahnhof.', { exact: false })
    .locator('visible=true')
    .first()
    .waitFor();

  step('see the XP of the finished flashcards');
  await page
    .getByText('+20 XP', { exact: true })
    .locator('visible=true')
    .first()
    .waitFor();

  step('ask to quit and keep going');
  const dialog = page.getByRole('alertdialog');
  await page.getByRole('button', { name: 'Quit' }).click();
  await dialog.getByText('Leave the lesson?').waitFor();
  await dialog.getByRole('button', { name: 'Keep going' }).click();
  await dialog.waitFor({ state: 'hidden' });
  assert.equal(pathname(), '/lesson/listen');

  step('jump between tasks with the stepper');
  await page.getByRole('button', { name: 'Go to: Flashcards' }).click();
  await page.waitForURL('**/lesson/flashcards');
  await page.getByRole('button', { name: 'Go to: Listen & shadow' }).click();
  await page.waitForURL('**/lesson/listen');

  step('start from any task in the list');
  await page.getByRole('button', { name: 'Go to: Flashcards' }).click();
  await page.waitForURL('**/lesson/flashcards');
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.waitForURL('**/lesson/overview');
  await page
    .getByText('+20 XP', { exact: true })
    .locator('visible=true')
    .waitFor();
  await page.getByRole('button', { name: /^3.*Listen & shadow/ }).click();
  await page.waitForURL('**/lesson/listen');

  step('go back to the crossword from the header');
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.waitForURL('**/lesson/crossword');
  assert.equal(await page.getByRole('alertdialog').count(), 0);
  await page.getByRole('button', { name: 'Go to: Listen & shadow' }).click();
  await page.waitForURL('**/lesson/listen');

  step('see only the play controls on the Listen tab');
  assert.equal(
    await page.getByRole('button', { name: 'Record your repeat' }).count(),
    0,
  );
  await page.getByRole('tab', { name: '1 · Listen' }).waitFor();

  step('play at the slow speed');
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  assert.deepEqual(await page.evaluate(() => window.spokenTexts), [
    { text: 'Ich warte am Bahnhof.', language: 'de-DE', rate: 0.75 },
  ]);

  step('change the speed');
  await page.getByRole('button', { name: '0.75×' }).click();
  await page.getByRole('button', { name: '1.00×' }).waitFor();
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  assert.equal((await page.evaluate(() => window.spokenTexts)).at(-1).rate, 1);
  await page.getByRole('button', { name: 'Pause' }).click();

  step('open the Repeat tab');
  await page.getByRole('tab', { name: '2 · Repeat' }).click();
  assert.equal(
    await page.getByRole('button', { name: 'Play', exact: true }).count(),
    0,
  );

  step('record a repeat and hear it');
  await page.getByRole('button', { name: 'Record your repeat' }).click();
  await page.waitForTimeout(800);
  await page.getByRole('button', { name: 'Stop recording' }).click();
  await page.getByText('Phrase 1 of 3 · Repeat 2 of 3').waitFor();
  await page.getByRole('button', { name: 'Play my recording' }).click();

  step('record again');
  await page.getByRole('button', { name: 'Record again' }).click();
  await page.waitForTimeout(800);
  await page.getByRole('button', { name: 'Stop recording' }).click();
  await page.getByText('Phrase 1 of 3 · Repeat 3 of 3').waitFor();

  step('leave the Repeat tab while recording');
  await page.getByRole('button', { name: 'Record again' }).click();
  await page.waitForTimeout(800);
  await page.getByRole('tab', { name: '1 · Listen' }).click();
  await page.getByRole('button', { name: 'Play', exact: true }).waitFor();
  await page.getByRole('tab', { name: '2 · Repeat' }).click();
  await page.getByRole('button', { name: 'Play my recording' }).waitFor();

  step('go through the phrases');
  await page.getByRole('button', { name: 'Next phrase' }).click();
  await page.getByText('Phrase 2 of 3 · Repeat 1 of 3').waitFor();
  await page.getByRole('button', { name: 'Record your repeat' }).waitFor();
  await page.getByRole('button', { name: 'Previous phrase' }).click();
  await page.getByText('Phrase 1 of 3 · Repeat 3 of 3').waitFor();
  await page.getByRole('button', { name: 'Next phrase' }).click();
  await page.getByText('Phrase 2 of 3 · Repeat 1 of 3').waitFor();
  await page.getByRole('button', { name: 'Next phrase' }).click();
  await page.getByText('Phrase 3 of 3 · Repeat 1 of 3').waitFor();
  await page.getByRole('button', { name: 'Next section →' }).click();
  await page.waitForURL('**/lesson/read');
  assert.equal(pathname(), '/lesson/read');

  step('read the saved result');
  await page.goto(`${server.url}/dev/storage-check`);
  await page.getByText('lesson: lesson-1 flashcards 3/3 listen 1/3').waitFor();

  step('quit from the listen screen');
  await page.goto(`${server.url}/lesson/listen`);
  await page.getByRole('button', { name: 'Quit' }).click();
  await dialog.getByRole('button', { name: 'Leave' }).click();
  await page.waitForURL((url) => url.pathname === '/');

  step('see the lesson cleared after quitting');
  await page.goto(`${server.url}/dev/storage-check`);
  await page.getByText('profile:', { exact: false }).first().waitFor();
  assert.equal(await page.getByText(/^lesson:/).count(), 0);

  assert.deepEqual(problems, []);
  console.log('listen e2e passed');
} catch (error) {
  console.error(`listen e2e failed at step: ${currentStep}`);
  throw error;
} finally {
  await browser.close();
  server.close();
}
