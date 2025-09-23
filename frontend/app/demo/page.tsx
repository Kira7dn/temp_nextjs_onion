import { AddToCartForm } from '@presentation/components/AddToCartForm';
import { CartDisplay } from '@presentation/components/CartDisplay';

export default function DemoPage() {
  const userId = 'demo-user'; // Hardcoded cho demo

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Demo Server Actions</h1>

      <section className="mb-8">
        <h2 className="text-xl mb-2">Thêm sản phẩm vào giỏ hàng</h2>
        <AddToCartForm userId={userId} />
      </section>

      <section>
        <CartDisplay userId={userId} />
      </section>
    </div>
  );
}
