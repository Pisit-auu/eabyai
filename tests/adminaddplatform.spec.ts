import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('adminadddeleteplatform', async ({ page }) => {
  await page.goto('https://ea-by-ai.com/admin/setup');
  await page.getByRole('button', { name: '✕' }).first().click();
  await page.getByText('Platform', { exact: true }).click();
  await page.getByRole('textbox', { name: 'ระบุชื่อ PLATFORM' }).click();
  await page.getByRole('textbox', { name: 'ระบุชื่อ PLATFORM' }).fill('MT4');
  await page.getByRole('button', { name: 'เพิ่มข้อมูล' }).click();
  await expect(page.getByText('MT4', { exact: true })).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: 'delete' }).nth(1).click();
  await page.getByRole('button', { name: 'ใช่' }).click();
  await page.getByText('ลบ MT4 สำเร็จ').click();
  await expect(page.getByText('MT4', { exact: true })).not.toBeVisible({ timeout: 10000 })
});