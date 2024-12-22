import { expect } from '@playwright/test';
import { test, mockApiCalls } from './setup/test-utils';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiCalls(page);
    
    // Mock WebSocket connection
    await page.addInitScript(() => {
      window.WebSocket = class MockWebSocket {
        onopen: (() => void) | null = null;
        
        constructor() {
          setTimeout(() => {
            this.onopen?.();
          }, 100);
        }
        send() {}
        close() {}
      } as any;
    });
  });

  test('displays orders table with correct columns', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check table headers using more specific selectors
    await expect(page.getByRole('columnheader', { name: 'Order ID' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Items' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Total' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
  });

  test('displays no orders message when empty', async ({ page }) => {
    // Mock empty orders response
    await page.route('**/api/order', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.goto('/dashboard');
    await expect(page.getByText('No orders yet')).toBeVisible();
  });
}); 