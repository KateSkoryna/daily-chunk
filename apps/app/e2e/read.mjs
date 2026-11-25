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
  await page.getByText('Tap an underlined word for its card').waitFor();

  step('see the XP of the finished flashcards and listen');
  await page
    .getByText('+40 XP', { exact: true })
    .locator('visible=true')
    .first()
    .waitFor();

  step('see one text, listen to it and show the translation');
  assert.equal(await page.getByText(/^Anna has been waiting/).count(), 0);
  await page.getByRole('button', { name: 'Listen', exact: true }).click();
  assert.deepEqual(
    (await page.evaluate(() => window.spokenTexts)).map((item) => [
      item.text.slice(0, 20),
      item.language,
    ]),
    [['Anna wartet seit ein', 'de-DE']],
  );
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await page.getByRole('button', { name: 'Listen', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Translation' }).click();
  await page.getByText(/^Anna has been waiting at the station/).waitFor();
  await page.getByText(/she laughs with relief\.$/).waitFor();
  assert.equal(await page.getByRole('switch').count(), 0);
  await page.getByRole('button', { name: 'Translation' }).click();
  assert.equal(await page.getByText(/^Anna has been waiting/).count(), 0);

  step('open and close a word card');
  await page.getByRole('button', { name: 'Fahrkarte', exact: true }).click();
  const card = page.getByRole('group', { name: /Fahrkarte/ });
  await card.waitFor();
  const wordBox = await page
    .getByRole('button', { name: 'Fahrkarte', exact: true })
    .boundingBox();
  const cardBox = await card.boundingBox();
  assert.ok(cardBox.y > wordBox.y + wordBox.height - 1);
  assert.ok(cardBox.y - (wordBox.y + wordBox.height) < 12);
  assert.ok(cardBox.width < 400);
  await card.getByRole('button', { name: /^Play/ }).click();
  assert.deepEqual((await page.evaluate(() => window.spokenTexts)).at(-1), {
    text: 'die Fahrkarte',
    language: 'de-DE',
  });
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

  step('answer the quiz, one wrong');
  await page.getByRole('button', { name: 'Start the quiz' }).click();
  await page.getByText('Quiz · Question 1 of 5').waitFor();
  await page.getByText('Wie lange wartet Anna schon?').waitFor();
  assert.equal(await page.getByRole('radio').count(), 3);
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByRole('button', { name: 'Start the quiz' }).click();
  const quizAnswers = [
    ['eine halbe Stunde', 'Next question →'],
    ['18:40 Uhr', 'Next question →'],
    ['im Internet', 'Next question →'],
    ['19 Euro', 'Next question →'],
    ['Gleis drei', 'Next section →'],
  ];
  for (const [answer, nextButton] of quizAnswers) {
    await page.getByRole('radio', { name: new RegExp(`^${answer}`) }).click();
    await page.getByRole('button', { name: nextButton }).waitFor();
    if (answer === '19 Euro') {
      await page.getByRole('radio', { name: /^29 Euro/ }).waitFor();
    }
    if (nextButton !== 'Next section →') {
      await page.getByRole('button', { name: nextButton }).click();
    }
  }
  await page
    .getByText('4 of 5 right. This counts toward your next level.')
    .waitFor();

  step('finish the task');
  await page.getByRole('button', { name: 'Next section →' }).click();
  await page.waitForURL('**/lesson/answer');

  step('read the saved result');
  await page.goto(`${server.url}/dev/storage-check`);
  await page
    .getByText('lesson: lesson-1 flashcards 3/3 listen 0/3 read 4/5')
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
