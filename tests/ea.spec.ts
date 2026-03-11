import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('test', async ({ page }) => {
  await page.goto('https://ea-by-ai.com/EA');
  await page.getByRole('button', { name: '✕' }).first().click();
  await page.locator('div').filter({ hasText: /^Select Trading AccountID$/ }).first().click();
  await page.getByText('12345678').nth(2).click();
  await page.getByRole('combobox').nth(1).click();
  await page.getByText('EURUSD').nth(2).click();
  await page.getByRole('combobox').nth(2).click();
  await page.getByText('H1').nth(1).click();
  await page.getByRole('combobox').nth(3).click();
  await page.getByText('EURUSD1').nth(2).click();
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('img', { name: 'delete' }).nth(4).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('23C0-271E-193', { exact: true })).not.toBeVisible({ timeout: 10000 })

});