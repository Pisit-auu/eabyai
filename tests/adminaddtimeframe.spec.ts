import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('adminadddeletetimeframe', async ({ page }) => {
  await page.goto('https://ea-by-ai.com/admin/setup');
  await page.getByRole('button', { name: '✕' }).first().click();
  await page.getByText('Timeframe').click();
  await page.getByRole('textbox', { name: 'ระบุชื่อ TIMEFRAME' }).click();
  await page.getByRole('textbox', { name: 'ระบุชื่อ TIMEFRAME' }).fill('M30');
  await page.getByRole('button', { name: 'เพิ่มข้อมูล' }).click();
  await page.getByText('เพิ่ม TIMEFRAME สำเร็จ').click();
  await expect(page.getByText('M30', { exact: true })).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: 'delete' }).nth(1).click();
  await page.getByRole('button', { name: 'ใช่' }).click();
  await page.getByText('ลบ M30 สำเร็จ').click();
  await expect(page.getByText('M30', { exact: true })).not.toBeVisible({ timeout: 10000 })
});