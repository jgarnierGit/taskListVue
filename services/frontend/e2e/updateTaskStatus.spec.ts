import { test, expect } from '@playwright/test';

test('update task status, expect to change its parent too', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('[id="v-list-group--id-Symbol\\(5\\)"] svg').nth(1).click();
  await page.locator('#menu-activator-4').click();
  await page.getByRole('button', { name: 'Complete' }).click();
  await expect(page.getByTestId('taskStatusDone-1')).toBeVisible();
});

test('update task status, expect to change its parents too', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('[id="v-list-group--id-Symbol\\(5\\)"] svg').nth(1).click();
  await page.getByLabel('status : Created').getByText('status : Created').click();

  await page.locator('[id="v-list-group--id-Symbol\\(49\\)"] svg').nth(1).click();
  await page.getByRole('group', { name: '1.1 status : Created' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Complete' }).click();
  await expect(page.getByTestId('taskStatusDone-1')).toBeVisible();
  await expect(page.getByTestId('taskStatusDone-4')).toBeVisible();
});

test('update task status, expect parent to be still created', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.locator('[id="v-list-group--id-Symbol\\(5\\)"] svg').nth(1).click();
  await page.locator('#add-inline-after-4').click();
  await page.locator('#menu-activator-4').click();
  await page.getByRole('button', { name: 'Complete' }).click();
  await expect(page.getByTestId('taskStatusCreated-1')).toBeVisible();
});