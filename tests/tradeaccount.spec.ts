import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('useradddeletetradeacccount', async ({ page }) => {
  await page.goto('https://ea-by-ai.com/trade-account');
  await page.getByRole('textbox', { name: 'Ex. 88990011' }).click();
  await page.getByRole('textbox', { name: 'Ex. 88990011' }).fill('12345678');
  await page.getByRole('textbox', { name: 'Ex. 123456aB@' }).click();
  await page.getByRole('textbox', { name: 'Ex. 123456aB@' }).fill('12345678aA!');
  await page.getByRole('combobox').click();
  await page.getByText('MT5').nth(4).click();
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByText('12345678').click();
   await expect(page.getByText('12345678', { exact: true })).toBeVisible({ timeout: 10000 })
  await page.locator('div:nth-child(3) > .ant-card-actions > li:nth-child(2) > span > .anticon > svg').click();
  await page.getByRole('button', { name: 'ลบ' }).click();
  await page.getByText('ลบ 12345678 สำเร็จ').click();
   await expect(page.getByText('12345678', { exact: true })).not.toBeVisible({ timeout: 10000 })
});