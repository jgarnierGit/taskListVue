import { test, expect } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test('test', async ({ page }) => {

  await page.locator('#add-inline-root').click();
  await page.getByPlaceholder('Edit task name').click();
  await page.getByPlaceholder('Edit task name').press('Control+a');
  await page.getByPlaceholder('Edit task name').fill('test');
  await page.getByPlaceholder('Edit task name').press('Enter');

  await expect(page.getByPlaceholder('Edit task name')).toHaveValue('test');
});