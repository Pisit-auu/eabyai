import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('adminadddeletesymbol', async ({ page }) => {
  await page.goto('https://ea-by-ai.com/admin/setup');
  await page.getByRole('button', { name: '✕' }).first().click();
  await page.getByText('Symbol').click();
  await page.getByRole('textbox', { name: 'ระบุชื่อ SYMBOL' }).click();
  await page.getByRole('textbox', { name: 'ระบุชื่อ SYMBOL' }).fill('ABCDEF');
  await page.getByRole('button', { name: 'เพิ่มข้อมูล' }).click();
  await page.getByText('เพิ่ม SYMBOL สำเร็จ').click();
  await expect(page.getByText('ABCDEF', { exact: true })).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: 'delete' }).nth(2).click();
  await page.getByRole('button', { name: 'ใช่' }).click();
  await page.getByText('ลบ ABCDEF สำเร็จ').click();
    await expect(page.getByText('ABCDEF', { exact: true })).not.toBeVisible({ timeout: 10000 })

});