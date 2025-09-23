// src/app/page.tsx
import { Button } from '@shared/ui/button';
import { Separator } from '@shared/ui/separator';
import { CartSection } from '@presentation/components/CartSection';

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-10 px-4 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
        <p className="text-muted-foreground text-sm">
          Demo kiến trúc: Domain / Application / Infrastructure / Presentation
        </p>
      </header>

      <div className="bg-card rounded-xl border shadow-sm">
        <section className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Thao tác nhanh</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="default" className="hover:cursor-pointer">
              Primary action
            </Button>
            <Button variant="secondary" className="hover:cursor-pointer">
              Secondary
            </Button>
            <Button variant="outline" className="hover:cursor-pointer">
              Outline
            </Button>
            <Button className="bg-red-500 hover:cursor-pointer hover:bg-black">Test color</Button>
          </div>
        </section>
        <Separator />
        <CartSection />
      </div>
    </main>
  );
}
