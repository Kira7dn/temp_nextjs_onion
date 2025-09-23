# 📖 Codegen Guide cho Frontend Clean Architecture (Next.js + TS)

## 1. JSON Schema Reminder

Mỗi object trong JSON array có cấu trúc:

```json
{
  "layer": "domain | application | infrastructure | presentation",
  "type": "entity | service | interface | use_case | repository | hook | component",
  "name": "Tên class/hook/component",
  "properties": { "field": "type", "...": "..." },
  "methods": ["method1", "method2"],
  "metadata": { "thông tin mở rộng" }
}
```

👉 3 field **bắt buộc**: `layer`, `type`, `name`.
👉 Các field khác: optional.

---

## 2. Mapping JSON → Code theo Layer

### 🟢 Domain Layer

* **Entity**: class với `properties`, `methods`.
* **Service**: class hoặc function chứa logic thuần.

### 🟢 Application Layer

* **Interface**: TS interface định nghĩa contract.
* **Use Case**: class với `execute(input): output`, gọi repository qua constructor.

### 🟢 Infrastructure Layer

* **Repository**: class implements interface, sử dụng fetch/axios/ORM.

### 🟢 Presentation Layer

* **Hook (Client only)**: React hook gọi use case, quản lý state.
* **Client Component**: FC dùng hook, có fallback skeleton, hỗ trợ `UIComponent`.
* **Server Component**: async FC gọi trực tiếp use case, không hook.

---

## 3. Full Flow Example – Feature: Cart

### a. Domain Layer – Entity

**JSON:**

```json
{
  "layer": "domain",
  "type": "entity",
  "name": "Cart",
  "properties": { "items": "CartItem[]" },
  "methods": ["addItem"]
}
```

**Code:**

```ts
// src/domain/entities/Cart.ts
import { CartItem } from './CartItem';

export class Cart {
  constructor(public items: CartItem[] = []) {}

  addItem(item: CartItem) {
    this.items.push(item);
  }
}
```

---

### b. Application Layer – Interface

**JSON:**

```json
{
  "layer": "application",
  "type": "interface",
  "name": "ICartRepository",
  "methods": ["load", "save"]
}
```

**Code:**

```ts
// src/application/interfaces/ICartRepository.ts
import { Cart } from '@domain/entities/Cart';

export interface ICartRepository {
  load(userId: string): Promise<Cart>;
  save(cart: Cart): Promise<void>;
}
```

---

### c. Application Layer – Use Case

**JSON:**

```json
{
  "layer": "application",
  "type": "use_case",
  "name": "AddItemToCart",
  "methods": ["execute"],
  "metadata": {
    "input": { "userId": "string", "item": "CartItem" },
    "output": { "cart": "Cart" }
  }
}
```

**Code:**

```ts
// src/application/use_cases/AddItemToCart.ts
import { ICartRepository } from '@application/interfaces/ICartRepository';
import { CartItem } from '@domain/entities/CartItem';
import { Cart } from '@domain/entities/Cart';

export class AddItemToCart {
  constructor(private repo: ICartRepository) {}

  async execute(input: { userId: string; item: CartItem }): Promise<{ cart: Cart }> {
    const cart = await this.repo.load(input.userId);
    cart.addItem(input.item);
    await this.repo.save(cart);
    return { cart };
  }
}
```

---

### d. Infrastructure Layer – Repository

**JSON:**

```json
{
  "layer": "infrastructure",
  "type": "repository",
  "name": "CartRepoHttp",
  "implements": "ICartRepository"
}
```

**Code:**

```ts
// src/infrastructure/repositories/CartRepoHttp.ts
import { ICartRepository } from '@application/interfaces/ICartRepository';
import { Cart } from '@domain/entities/Cart';

export class CartRepoHttp implements ICartRepository {
  async load(userId: string): Promise<Cart> {
    const res = await fetch(`/api/cart/${userId}`);
    const data = await res.json();
    return new Cart(data.items);
  }

  async save(cart: Cart): Promise<void> {
    await fetch(`/api/cart`, {
      method: 'POST',
      body: JSON.stringify(cart),
    });
  }
}
```

---

### e. Presentation Layer – Hook

**JSON:**

```json
{
  "layer": "presentation",
  "type": "hook",
  "name": "useAddToCart",
  "metadata": { "calls": "AddItemToCart" }
}
```

**Code:**

```ts
'use client';
import { useState } from 'react';
import { AddItemToCart } from '@application/use_cases/AddItemToCart';
import { CartRepoHttp } from '@infrastructure/repositories/CartRepoHttp';

const useCase = new AddItemToCart(new CartRepoHttp());

export function useAddToCart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (userId: string, item: any) => {
    setLoading(true);
    setError(null);
    try {
      return await useCase.execute({ userId, item });
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { run, loading, error };
}
```

---

### f. Presentation Layer – Client Component

**JSON:**

```json
{
  "layer": "presentation",
  "type": "component",
  "name": "AddToCartButton",
  "properties": { "productId": "string", "className": "string" },
  "metadata": { "usesHook": "useAddToCart" }
}
```

**Code:**

```tsx
'use client';
import { useAddToCart } from '@presentation/hooks/useAddToCart';

export function AddToCartButton({
  productId,
  className,
  UIComponent,
}: {
  productId: string;
  className?: string;
  UIComponent?: React.ComponentType<any>;
}) {
  const { run, loading } = useAddToCart();

  if (UIComponent) {
    return (
      <UIComponent
        className={className}
        onClick={() => run('user1', productId)}
        disabled={loading}
      >
        {loading ? 'Loading…' : 'Add to Cart'}
      </UIComponent>
    );
  }

  return (
    <button
      className={className}
      onClick={() => run('user1', productId)}
      disabled={loading}
    >
      {loading ? 'Loading…' : 'Add to Cart'}
    </button>
  );
}
```

---

### g. Presentation Layer – Server Component

**JSON:**

```json
{
  "layer": "presentation",
  "type": "component",
  "name": "CartPage",
  "metadata": { "usesUseCase": "GetCart" }
}
```

**Code:**

```tsx
// src/presentation/components/CartPage.tsx
import { GetCart } from '@application/use_cases/GetCart';
import { CartRepoHttp } from '@infrastructure/repositories/CartRepoHttp';
import { CartView } from './CartView';

export default async function CartPage({ userId }: { userId: string }) {
  const useCase = new GetCart(new CartRepoHttp());
  const cart = await useCase.execute({ userId });

  return <CartView cart={cart} />;
}
```

---

## 4. Flow tổng thể

```
User Story → JSON Spec → Codegen:

Domain: Entity, Service
Application: Interface, Use Case
Infrastructure: Repository
Presentation: Hook, Client Component, Server Component
```

✅ Với hướng dẫn này, JSON → Codegen có thể bao phủ toàn bộ flow của Clean Architecture: từ Domain → Application → Infrastructure → Presentation (Hook, Client, Server Component).
