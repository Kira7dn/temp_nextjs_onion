# 🧩 Clean/Onion Architecture cho Frontend (Next.js + TypeScript)

## I. General Rules

- Dependency direction: **UI (Presentation) → Application → Domain**.

  - UI chỉ gọi Application (use case hooks).
  - Application chỉ gọi Domain và Interfaces.
  - Domain không phụ thuộc React, API, hay Next.js.

- Infrastructure implements Application interfaces (repository, API client).
- Không gọi API trực tiếp trong UI component — phải thông qua Use Case.
- **Domain** = pure TypeScript (entities, rules, validators).
- **Application** = orchestrators (use cases, services).
- **Infrastructure** = fetch/axios clients, LocalStorage adapters.
- **Presentation** = Next.js pages, React components.
- **Testing strategy**:

  - Unit test cho domain (pure functions, classes).
  - Mock Application interfaces khi test use case.
  - Integration test cho UI (React Testing Library / Playwright).

---

## II. Directory Map

```text
frontend/
├── domain/                 # Pure domain logic (no React, no fetch)
│   ├── entities/
│   └── services/
├── application/            # Use cases + Interfaces
│   ├── interfaces/         # Repository interfaces
│   └── use_cases/
├── infrastructure/         # Implementation for APIs, storage
│   ├── repositories/
│   └── adapters/
├── presentation/           # Next.js/React UI
│   ├── components/
│   ├── pages/              # Next.js pages
│   └── hooks/              # Hooks consuming use cases
└── shared/                 # Shared utils, UI library
```

---

## III. Workflow (Step-by-Step)

### Step 0 – Clarify Requirements

- Xác định: input, output, entities, hành vi user.
- Xác định domain entity, business rules.
- Đặt acceptance criteria (UI state, error state, latency).

---

### Step 1 – Domain Layer (Pure Business Logic)

**Spec**

- Define entities (TypeScript interfaces/classes).
- Define services (pure functions).
- No fetch, no React, no localStorage.

**Sample Code**

```ts
// src/domain/entities/Cart.ts
export type CartItem = {
  productId: string;
  quantity: number;
};

export class Cart {
  private items: Map<string, CartItem> = new Map();

  addItem(productId: string, qty = 1) {
    if (qty <= 0)
      throw new Error("Quantity must be positive");
    const existing = this.items.get(productId);
    if (existing) existing.quantity += qty;
    else
      this.items.set(productId, {
        productId,
        quantity: qty,
      });
  }

  getItems() {
    return Array.from(this.items.values());
  }
}
```

---

### Step 2 – Application Layer (Use Cases + Interfaces)

**Spec**

- Define repository interfaces (ports).
- Implement use cases (application services).

**Sample Code**

```ts
// src/application/interfaces/CartRepository.ts
import { Cart } from "@/domain/entities/Cart";

export interface ICartRepository {
  load(userId: string): Promise<Cart | null>;
  save(userId: string, cart: Cart): Promise<void>;
}
```

```ts
// src/application/use_cases/AddItemToCart.ts
import { ICartRepository } from "../interfaces/CartRepository";
import { Cart } from "@/domain/entities/Cart";

export class AddItemToCart {
  constructor(private repo: ICartRepository) {}

  async execute(
    userId: string,
    productId: string,
    qty = 1
  ) {
    const cart =
      (await this.repo.load(userId)) ?? new Cart();
    cart.addItem(productId, qty);
    await this.repo.save(userId, cart);
    return cart.getItems();
  }
}
```

---

### Step 3 – Infrastructure Layer

**Spec**

- Implements repository interfaces using API, LocalStorage, IndexedDB.

**Sample Code**

```ts
// src/infrastructure/repositories/CartRepoHttp.ts
import { ICartRepository } from "@/application/interfaces/CartRepository";
import { Cart } from "@/domain/entities/Cart";

export class CartRepoHttp implements ICartRepository {
  async load(userId: string): Promise<Cart | null> {
    const res = await fetch(`/api/cart/${userId}`);
    const dto = await res.json();
    const cart = new Cart();
    dto.items.forEach((i: any) =>
      cart.addItem(i.productId, i.quantity)
    );
    return cart;
  }

  async save(userId: string, cart: Cart): Promise<void> {
    await fetch(`/api/cart/${userId}`, {
      method: "POST",
      body: JSON.stringify({ items: cart.getItems() }),
    });
  }
}
```

---

### Step 4 – Presentation Layer

**Spec**

- Next.js page/component dùng use case qua DI.
- Không gọi API trực tiếp.

**Sample Code**

```tsx
// src/presentation/hooks/useAddToCart.ts
"use client";
import { useState } from "react";
import { AddItemToCart } from "@/application/use_cases/AddItemToCart";
import { CartRepoHttp } from "@/infrastructure/repositories/CartRepoHttp";

const useCase = new AddItemToCart(new CartRepoHttp());

export function useAddToCart(userId: string) {
  const [loading, setLoading] = useState(false);
  const addToCart = async (productId: string) => {
    setLoading(true);
    try {
      return await useCase.execute(userId, productId, 1);
    } finally {
      setLoading(false);
    }
  };
  return { addToCart, loading };
}
```

```tsx
// src/presentation/components/AddToCartButton.tsx
"use client";
import { useAddToCart } from "../hooks/useAddToCart";

export function AddToCartButton({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) {
  const { addToCart, loading } = useAddToCart(userId);
  return (
    <button
      onClick={() => addToCart(productId)}
      disabled={loading}
    >
      {loading ? "Adding..." : "Add to cart"}
    </button>
  );
}
```

---

### Step 5 – Tests

- **Domain**: test `Cart` entity (pure TS).
- **Application**: test `AddItemToCart` with fake repo.
- **Integration**: test `useAddToCart` hook with mocked repo.
- **E2E**: test Next.js page with Playwright.

---

## IV. Chu trình thêm một Feature mới

1. **Xác định yêu cầu**

   - Tên feature, hành vi mong muốn, input/output.
   - Xác định entity nào sẽ chịu trách nhiệm.

2. **Domain**

   - Tạo entity hoặc mở rộng entity sẵn có.
   - Thêm rule/validator nếu có.

3. **Application**

   - Định nghĩa interface repository mới (nếu cần).
   - Viết use case class để orchestrate hành vi mới.

4. **Infrastructure**

   - Cài đặt repository interface bằng API/LocalStorage/adapter.
   - Kết nối với backend nếu cần.

5. **Presentation**

   - Tạo custom hook sử dụng use case.
   - Viết component UI để user tương tác.
   - Kết hợp với page/widget.

6. **Testing**

   - Unit test domain và use case.
   - Integration test hook và component.
   - E2E test để verify toàn bộ flow hoạt động.

---

✅ Chu trình này đảm bảo khi thêm feature mới, bạn đi từ **domain → application → infrastructure → presentation → test**, giữ nguyên triết lý Clean/Onion: domain độc lập, UI chỉ là lớp ngoài.
