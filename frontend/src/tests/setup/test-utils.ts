import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';

// Extend the base test with custom fixtures
export const test = base.extend({
  // Add authentication if needed
  authenticatedPage: async ({ page }, runTest) => {
    // Add any authentication logic here if required
    await page.goto('/');
    await runTest(page);
  }
});

export const mockApiCalls = async (page: Page) => {
  // Mock API responses
  await page.route('**/api/menu', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: '1',
          name: 'Test Menu Item',
          description: 'Test Description',
          price: 10.99,
          category: {
            id: 'cat1',
            name: 'Test Category'
          },
          imageUrl: 'test.jpg',
          available: true,
          bestSeller: true,
          preparationTime: 15,
          spicyLevel: 2
        }
      ])
    });
  });

  await page.route('**/api/category', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'cat1',
          name: 'Test Category',
          description: 'Test Category Description'
        }
      ])
    });
  });
}; 