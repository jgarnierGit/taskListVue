import { test, expect } from '@playwright/test';

test('edit the name', async ({ page }) => {
  await page.goto('http://localhost:8000/');
  await page.getByText('Start creation').click();
  await page.getByPlaceholder('Edit task name').click();
  await page.getByPlaceholder('Edit task name').fill('test');
  await page.getByPlaceholder('Edit task name').press('Enter');
  await expect(page.getByPlaceholder('Edit task name')).toHaveValue('test');
});

test('make sure name stay consistent while adding a first child', async ({ page }) => {
  await page.goto('http://localhost:8000/');
  await page.getByText('Start creation').click();
  await page.getByPlaceholder('Edit task name').click();
  await page.getByPlaceholder('Edit task name').press('ControlOrMeta+a');
  await page.getByPlaceholder('Edit task name').fill('test');
  await page.getByPlaceholder('Edit task name').press('Enter');
  await page.locator('[id="v-list-group--id-Symbol\\(12\\)"] svg').first().click();
  await expect(page.locator('#input-16')).toHaveValue('test');
});