import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('userwatchlicensedetail', async ({ page }) => {
  await page.goto('https://ea-by-ai.com/EA');
  await page.getByText('license Key: 390F-F538-6087-5').click();
  await page.locator('.anticon.anticon-eye > svg').first().click();
  await page.getByText('License Information').click();
  await expect(page.getByText('License Information', { exact: true })).toBeVisible({ timeout: 10000 })
  await page.getByText('390F-F538-6087-5', { exact: true }).click();
  await page.getByLabel('License Information').getByText('hnjdragontung@gmail.com').click();
  await page.getByText('5046704887', { exact: true }).click();
  await page.getByText('MT5 — XAUUSD').click();
  await page.getByText('MetaQuotes-Demo').click();


});