'use client';
import { useCart } from '@presentation/hooks/useCart';
import { CartItem } from '@domain/entities/Cart';

export function CartSection() {
  const { cart, addToCart } = useCart('test-user');

  // Form action với optimistic update
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await addToCart(formData);
    } catch (error) {
      console.error('❌ Add to cart failed:', error);
    }
  };

  return (
    <section className="space-y-4 p-6">
      <h2 className="text-lg font-semibold tracking-tight">Giỏ hàng</h2>
      <div className="flex items-center gap-3">
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="userId" value="test-user" />
          <input name="productId" placeholder="Product ID" defaultValue="p1" required />
          <input name="qty" type="number" defaultValue={1} />
          <button type="submit">Add to Cart</button>
        </form>
        <span className="text-muted-foreground text-sm">Thêm sản phẩm demo vào giỏ</span>
      </div>
      <div>
        <h3>Cart Items (User: test-user)</h3>
        <p>Items count: {cart.length}</p>
        {cart.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          <ul>
            {cart.map((item: CartItem) => (
              <li key={item.productId}>
                Product {item.productId}: {item.quantity}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
