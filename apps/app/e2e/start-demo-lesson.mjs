export async function startDemoLesson(page, baseUrl) {
  await page.goto(baseUrl);
  const words = ['Bahnhof', 'Fahrkarte', 'Gleis'];
  for (const [index, word] of words.entries()) {
    const field = page.getByRole('textbox', { name: `Word ${index + 1}` });
    await field.waitFor();
    await field.fill(word);
  }
  await page.getByRole('button', { name: 'Check my words' }).click();
  await page.waitForURL('**/confirm');
  await page.getByRole('button', { name: 'Start lesson' }).click();
  await page.waitForURL('**/lesson/overview');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.waitForURL('**/lesson/flashcards');
}
