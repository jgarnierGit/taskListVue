import { test, expect } from '@playwright/test';

test('update task status, expect to change its parent too', async ({ page }) => {
  await page.goto('http://localhost:8000/');
  await page.getByText('Start creation').click();
  await page.locator('[id="v-list-group--id-Symbol\\(12\\)"] svg').first().click();
  await page.getByRole('group', { name: 'Created New task' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Complete' }).click();
  await expect(page.locator('[id="v-list-group--id-Symbol\\(12\\)"] div').filter({ hasText: 'Done' }).nth(1)).toBeVisible();
});

test('update task status, expect parent to be still created', async ({ page }) => {
  await page.goto('http://localhost:8000/');
  await page.getByRole('separator').nth(1).click();
  await page.locator('[id="v-list-group--id-Symbol\\(12\\)"] svg').first().click();
  await page.locator('[id="v-list-group--id-Symbol\\(12\\)"]').getByRole('button').click();
  await page.getByRole('button', { name: 'Complete' }).click();
  await expect(page.locator('[id="v-list-group--id-Symbol\\(12\\)"] div').filter({ hasText: 'Created' }).nth(1)).toBeVisible();
});