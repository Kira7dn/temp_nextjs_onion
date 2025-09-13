// frontend/tests/e2e/add-to-cart.spec.ts
import { test, expect } from '@playwright/test';

// E2E: mock API bằng route interception để không phụ thuộc backend thực tế

test('user can add item to cart from homepage', async ({ page }) => {
  // Mock API GET cart
  await page.route('**/api/cart/*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [{ productId: 'p1', quantity: 0 }] }),
      });
      return;
    }
    if (request.method() === 'POST') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
      return;
    }
    await route.continue();
  });

  await page.goto('/');

  const button = page.getByRole('button', { name: /add to cart/i });
  await expect(button).toBeEnabled();
  await button.click();

  // Kiểm tra trạng thái cuối cùng ổn định: trở lại 'Add to cart' và vẫn enable
  await expect(button).toHaveText(/add to cart/i, { timeout: 5000 });
  await expect(button).toBeEnabled();
});
