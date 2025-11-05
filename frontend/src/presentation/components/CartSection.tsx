'use client';
import { useCallback, useState } from 'react';
import { useCart } from '@presentation/hooks/useCart';
import { CartItem } from '@domain/entities/Cart';

export function CartSection() {
  const { cart, addToCart } = useCart('test-user');
  const [productId, setProductId] = useState('p1');
  const [quantity, setQuantity] = useState(1);

  // Form action với optimistic update - memoized để tránh re-create
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('qty', quantity.toString());

    try {
      await addToCart(formData);
      // Reset form state after successful submission
      setProductId('p1');
      setQuantity(1);
    } catch (error) {
      console.error('❌ Add to cart failed:', error);
    }
  }, [productId, quantity, addToCart]);

  // Ensure cart is always an array
  const safeCart = Array.isArray(cart) ? cart : [];

  return (
    <section className="space-y-4 p-6">
      <h2 className="text-lg font-semibold tracking-tight">Giỏ hàng</h2>
      <div className="flex items-center gap-3">
        <form onSubmit={handleSubmit}>
          <input
            name="productId"
            placeholder="Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          />
          <input
            name="qty"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
          />
          <button type="submit">Add to Cart</button>
        </form>
        <span className="text-muted-foreground text-sm">Thêm sản phẩm demo vào giỏ</span>
      </div>
      <div>
        <h3>Cart Items (User: test-user)</h3>
        <p>Items count: {safeCart.length}</p>
        {safeCart.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          <ul className="space-y-1">
            {safeCart.map((item: CartItem) => (
              <li key={item.productId} className="text-sm">
                Product {item.productId}: {item.quantity}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
