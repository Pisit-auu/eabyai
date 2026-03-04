import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('Logout redirect to home', async ({ page }) => {

  await page.goto('https://ea-by-ai.com/EA');

  await page.getByRole('button', { name: 'LOGOUT' }).click();

  // ตรวจว่า redirect ไปหน้า /
  await expect(page).toHaveURL('https://ea-by-ai.com/');

});