import { test, expect } from '@playwright/test';

test('edit the name', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('#add-inline-root').click();
  await page.getByPlaceholder('Edit task name').click();
  await page.getByPlaceholder('Edit task name').press('Control+a');
  await page.getByPlaceholder('Edit task name').fill('test');
  await page.getByPlaceholder('Edit task name').press('Enter');

  await expect(page.getByPlaceholder('Edit task name')).toHaveValue('test');
});

test('make sure name stay consistent while adding a first child', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('#add-inline-root').click();
  await page.getByPlaceholder('Edit task name').click();
  await page.getByPlaceholder('Edit task name').press('Control+a');
  await page.getByPlaceholder('Edit task name').fill('test');
  await page.getByPlaceholder('Edit task name').press('Enter');
  await page.getByText('status : Created').click();
  await expect(page.locator('#input-19')).toHaveValue('test');
});