import { test } from '@playwright/test';

test('login once', async ({ page }) => {

  await page.goto('https://ea-by-ai.com/')
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.fill('input[type="email"]', 'hnjdragontung@gmail.com')
  await page.waitForURL('**/user')
  await page.context().storageState({ path: 'auth.json' })

});