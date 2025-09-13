// src/app/page.tsx
import { Button } from '@shared/ui/button';
import { AddToCartButton } from '@presentation/components/AddToCartButton';

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-fuchsia-900">Shop</h1>
        <p className="text-muted-foreground text-sm">
          Demo kiến trúc: Domain / Application / Infrastructure / Presentation
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Thao tác nhanh</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="default">Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button className="bg-red-500 hover:bg-black">Test color</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Giỏ hàng</h2>
        <div className="flex items-center gap-3">
          <AddToCartButton userId="u1" productId="p1" />
          <span className="text-muted-foreground text-sm">Thêm sản phẩm demo vào giỏ</span>
        </div>
      </section>
    </main>
  );
}
