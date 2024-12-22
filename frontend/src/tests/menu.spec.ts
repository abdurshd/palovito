import { expect } from '@playwright/test';
import { test, mockApiCalls } from './setup/test-utils';

test.describe('Menu Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiCalls(page);
  });

  test('displays add menu button', async ({ page }) => {
    await page.goto('/menuItems');
    await expect(page.getByText('Add New Menu Item')).toBeVisible();
  });

  test('can open add menu form', async ({ page }) => {
    await page.goto('/menuItems');
    await page.click('text=Add New Menu Item');
    await expect(page.getByRole('heading', { name: 'Add New Menu Item' })).toBeVisible();
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Price ($)')).toBeVisible();
  });

  test('displays menu cards correctly', async ({ page }) => {
    await page.goto('/menuItems');
    await expect(page.getByText('Test Menu Item')).toBeVisible();
    await expect(page.getByText('$10.99')).toBeVisible();
    await expect(page.getByText('Test Category', { exact: true })).toBeVisible();
  });

  test('can filter by category', async ({ page }) => {
    await page.goto('/menuItems');
    await page.click('button[aria-label="Filter by category"]');
    await page.click(`[data-value="cat1"]`);
    await expect(page.getByText('Test Menu Item')).toBeVisible();
  });

  test('can delete menu item', async ({ page }) => {
    await page.goto('/menuItems');
    await page.click('button[aria-label="Delete menu item"]');
    await expect(page.getByText('Are you sure you want to delete this menu item?')).toBeVisible();
    await page.click('text=Delete');
  });
}); 