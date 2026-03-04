import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('userwatchlicensedetail', async ({ page }) => {
  await page.goto('https://ea-by-ai.com/EA');
  await page.getByText('license Key: 390F-F52F-14F2-').click();
  await page.locator('.anticon.anticon-eye > svg').first().click();
  await page.getByText('License Information').click();
  await page.getByLabel('License Information').getByText('XAUUSD', { exact: true }).click();
  await page.getByText('390F-F52F-14F2-7', { exact: true }).click();
  await page.getByLabel('License Information').getByText('hnjdragontung@gmail.com').click();
  await page.getByText('5046704887', { exact: true }).click();
  await page.getByText('MT5 — XAUUSD').click();
  await page.getByText('MetaQuotes-Demo').click();
  await page.getByText('6/3/').click();
  await page.getByText('27/2/').click();

});