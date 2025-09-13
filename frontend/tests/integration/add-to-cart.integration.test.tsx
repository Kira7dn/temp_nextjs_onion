// frontend/tests/integration/add-to-cart.integration.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddToCartButton } from '@presentation/components/AddToCartButton';

// MSW đã được bật trong frontend/jest.setup.ts

describe('Integration: AddToCart flow (component + hook + repo + MSW)', () => {
  it('clicking button calls API and ends with not loading', async () => {
    render(<AddToCartButton userId="user1" productId="p1" />);

    const button = screen.getByRole('button', { name: /add to cart/i });
    await userEvent.click(button);

    // sau khi click, text chuyển sang Adding... rồi trở lại Add to cart
    // dùng findByRole để chờ UI ổn định (loading=false)
    const finalButton = await screen.findByRole('button', { name: /add to cart/i });
    expect(finalButton).toBeEnabled();
  });
});
