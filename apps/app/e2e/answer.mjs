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
let currentStep = 'start';
const step = (name) => {
  currentStep = name;
};

const questions = [
  {
    question: 'Wo wartest du auf deinen Zug?',
    answer: 'Ich warte am Bahnhof auf meinen Zug, der leider Verspätung hat.',
    translation: /^I am waiting for my train at the station/,
  },
  {
    question: 'Hast du deine Fahrkarte schon gekauft?',
    answer: 'Ja, ich habe meine Fahrkarte gestern online für den Zug gekauft.',
    translation: /^Yes, I bought my ticket/,
  },
  {
    question: 'Von welchem Gleis fährt dein Zug nach Berlin ab?',
    answer: 'Mein Zug nach Berlin fährt heute von Gleis drei ab.',
    translation: /^My train to Berlin leaves/,
  },
];

async function placeWords(words) {
  for (const word of words) {
    await page.getByRole('button', { name: word, exact: true }).click();
  }
}

try {
  step('reach the Answer screen');
  await startDemoLesson(page, server.url);
  await page.goto(`${server.url}/lesson/answer`);
  await page.getByText(questions[0].question).waitFor();

  step('see the question and no check button');
  await page.getByText('Question 1 of 3').waitFor();
  assert.equal(await page.getByRole('button', { name: 'Check' }).count(), 0);
  assert.equal(await page.getByText('Right order').count(), 0);

  step('tap a wrong word three times and get a hint');
  const firstWords = questions[0].answer.split(' ');
  const wrongWord = firstWords.at(-1);
  await page.getByRole('button', { name: wrongWord, exact: true }).click();
  await page.getByText('Not this word. Try another one.').waitFor();
  await page
    .getByRole('button', { name: `${wrongWord}, not the next word` })
    .waitFor();
  assert.equal(await page.getByRole('group').locator('button').count(), 0);
  await page
    .getByRole('button', { name: `${wrongWord}, not the next word` })
    .click();
  assert.equal(await page.getByText('Look at the marked word.').count(), 0);
  await page
    .getByRole('button', { name: `${wrongWord}, not the next word` })
    .click();
  await page.getByText('Look at the marked word.').waitFor();
  await page
    .getByRole('button', { name: `${firstWords[0]}, the next word` })
    .waitFor();

  step('place the words in the right order');
  await page
    .getByRole('button', { name: `${firstWords[0]}, the next word` })
    .click();
  assert.equal(await page.getByText('Look at the marked word.').count(), 0);
  assert.equal(await page.getByText('Right order').count(), 0);
  await placeWords(firstWords.slice(1));
  await page.getByText('Right order').waitFor();
  await page.getByText(questions[0].translation).waitFor();
  await page.getByRole('button', { name: 'Next question →' }).click();

  step('answer the second and third question without a mistake');
  for (const [index, { question, answer }] of questions.slice(1).entries()) {
    await page.getByText(question).waitFor();
    await page.getByText(`Question ${index + 2} of 3`).waitFor();
    await placeWords(answer.split(' '));
    await page.getByText('Right order').waitFor();
    if (index === 0) {
      await page.getByRole('button', { name: 'Next question →' }).click();
    }
  }

  step('finish the task');
  await page.getByRole('button', { name: 'Next section →' }).click();
  await page.waitForURL('**/lesson/gap-fill');

  step('read the saved result');
  await page.goto(`${server.url}/dev/storage-check`);
  await page.getByText('answer 2/3').waitFor();

  assert.deepEqual(problems, []);
  console.log('answer e2e passed');
} catch (error) {
  console.error(`answer e2e failed at step: ${currentStep}`);
  throw error;
} finally {
  await browser.close();
  server.close();
}
