import { expect } from '@playwright/test';
import { test, mockApiCalls } from './setup/test-utils';

test.describe('Category Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiCalls(page);
  });

  test('displays add category button', async ({ page }) => {
    await page.goto('/categories');
    await expect(page.getByText('Add New Category')).toBeVisible();
  });

  test('can open add category form', async ({ page }) => {
    await page.goto('/categories');
    await page.click('text=Add New Category');
    await expect(page.getByTestId('add-new-category')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Add New Category' })).toBeVisible();
    await expect(page.getByPlaceholder('Category Name')).toBeVisible();
    await expect(page.getByPlaceholder('Description (optional)')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save Category' })).toBeVisible();
  });

  test('displays category cards correctly', async ({ page }) => {
    await page.goto('/categories');
    await expect(page.getByRole('heading', { name: 'Test Category' })).toBeVisible();
    await expect(page.getByText('Test Category Description')).toBeVisible();
  });

  test('can edit category', async ({ page }) => {
    await page.goto('/categories');
    await page.click('button[aria-label="Edit category"]');
    await expect(page.getByLabel('Name')).toHaveValue('Test Category');
    await expect(page.getByLabel('Description')).toHaveValue('Test Category Description');
  });

  test('can delete category', async ({ page }) => {
    await page.goto('/categories');
    await page.click('button[aria-label="Delete category"]');
    await expect(page.getByText('Are you sure you want to delete this category?')).toBeVisible();
    await page.click('text=Delete');
  });
}); 