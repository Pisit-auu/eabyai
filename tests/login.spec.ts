import { test, expect } from '@playwright/test';

test('Login OTP manual', async ({ page }) => {

  await page.goto('https://ea-by-ai.com/')

  await page.fill('input[type="email"]', 'hnjdragontung@gmail.com')

  await page.click('text=รับรหัส OTP')

  // หยุดให้เราใส่ OTP เอง
  await page.pause()

  // หลังจากใส่ OTP แล้วกดยืนยัน
  await expect(page).toHaveURL(/document/)

});