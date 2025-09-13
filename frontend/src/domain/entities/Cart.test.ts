// frontend/domain/entities/Cart.test.ts
import { Cart } from './Cart';

describe('Cart Entity', () => {
  it('adds item correctly', () => {
    const cart = new Cart();
    cart.addItem('p1', 2);
    expect(cart.getItems()).toEqual([{ productId: 'p1', quantity: 2 }]);
  });

  it('increments quantity when adding same product', () => {
    const cart = new Cart();
    cart.addItem('p1', 1);
    cart.addItem('p1', 3);
    expect(cart.getItems()).toEqual([{ productId: 'p1', quantity: 4 }]);
  });

  it('throws when quantity is not positive', () => {
    const cart = new Cart();
    expect(() => cart.addItem('p1', 0)).toThrow('Quantity must be positive');
  });
});
