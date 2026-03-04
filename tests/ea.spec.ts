import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('useradddeleteea', async ({ page }) => {
  await page.goto('https://ea-by-ai.com/EA');
  await page.getByRole('combobox').first().click();
  await page.getByText('11223344').nth(1).click();
  await page.getByRole('combobox').nth(1).click();
  await page.getByText('EURUSD').nth(2).click();
  await page.getByRole('combobox').nth(2).click();
  await page.getByText('H1').nth(1).click();
  await page.getByRole('combobox').nth(3).click();
  await page.getByText('EURUSD1').nth(2).click();
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByText('เพิ่มสำเร็จ').click();
  await expect(page.getByText('license Key: 2080-7F6D-3DB', { exact: true })).toBeVisible({ timeout: 10000 })
  await page.locator('div:nth-child(4) > .ant-card-actions > li:nth-child(2) > span > .anticon > svg').click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByText('ลบ license 2080-7F6D-3DB').click();
  await expect(page.getByText('license Key: 2080-7F6D-3DB', { exact: true })).not.toBeVisible({ timeout: 10000 })
});