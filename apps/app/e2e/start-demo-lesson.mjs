export async function startDemoLesson(page, baseUrl) {
  await page.goto(baseUrl);
  const wordsField = page.getByRole('textbox', {
    name: 'Words you heard or saw today',
  });
  await wordsField.waitFor();
  await wordsField.fill('Bahnhof\nFahrkarte\nGleis');
  await page.getByRole('button', { name: 'Check my words' }).click();
  await page.waitForURL('**/confirm');
  await page.getByRole('button', { name: 'Start lesson' }).click();
  await page.waitForURL('**/lesson/flashcards');
}
