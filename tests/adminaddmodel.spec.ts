import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('adminadddeleteea', async ({ page }) => {
  await page.goto('https://ea-by-ai.com/admin/EA');
  await page.getByRole('button', { name: 'Add New Model' }).click();
  await page.locator('div').filter({ hasText: /^Select a Symbol$/ }).first().click();
  await page.getByText('EURUSD').nth(4).click();
  await page.locator('div').filter({ hasText: /^Select a Timeframe$/ }).first().click();
  await page.getByText('H1').nth(4).click();
  await page.locator('div').filter({ hasText: /^Select a Platform$/ }).first().click();
  await page.getByTitle('MT5').click();
  await page.getByRole('textbox', { name: 'ระบุชื่อ EA' }).click();
  await page.getByRole('textbox', { name: 'ระบุชื่อ EA' }).fill('TEST');
  await page.getByPlaceholder('ระบุค่า Commission').click();
  await page.getByPlaceholder('ระบุค่า Commission').fill('010');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Create New EA' }).click();
  await page.getByText('TEST').click();
   await expect(page.getByText('TEST', { exact: true })).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: 'delete' }).nth(1).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByText('ลบ TEST สำเร็จ').click();
    await expect(page.getByText('TEST', { exact: true })).not.toBeVisible({ timeout: 10000 })

});