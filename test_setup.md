# Hướng dẫn Setup Test cho Frontend (Next.js + TypeScript)

## 1. Chuẩn bị môi trường

1) **Cài đặt công cụ test (chạy trong thư mục frontend/):**

   ```bash
   cd frontend
   npm install --save-dev jest @types/jest jest-environment-jsdom ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw whatwg-fetch @playwright/test
   ```

2) **Cấu hình Jest (đặt TOÀN BỘ file config trong `frontend/`):**

   - `frontend/jest.config.js`:

   ```js
   // frontend/jest.config.js
   const nextJest = require('next/jest');

   const createJestConfig = nextJest({
     dir: './', // Next.js app nằm ngay trong thư mục frontend/
   });

   const customJestConfig = {
     testEnvironment: 'jsdom',
     setupFiles: ['<rootDir>/jest.polyfills.ts'],
     setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
     moduleNameMapper: {
       '^@/(.*)$': '<rootDir>/$1', // '@/x' trỏ về chính thư mục frontend/
     },
     testPathIgnorePatterns: ['/node_modules/', '/tests/e2e/'],
   };

   module.exports = createJestConfig(customJestConfig);
   ```

   - `frontend/jest.polyfills.ts`:

   ```ts
   // frontend/jest.polyfills.ts
   import { TextEncoder, TextDecoder } from 'util';
   import { TransformStream, ReadableStream, WritableStream } from 'stream/web';

   // @ts-ignore
   if (!global.TextEncoder) global.TextEncoder = TextEncoder;
   // @ts-ignore
   if (!global.TextDecoder) global.TextDecoder = TextDecoder as any;
   // @ts-ignore
   if (!(global as any).TransformStream) (global as any).TransformStream = TransformStream;
   // @ts-ignore
   if (!(global as any).ReadableStream) (global as any).ReadableStream = ReadableStream;
   // @ts-ignore
   if (!(global as any).WritableStream) (global as any).WritableStream = WritableStream;

   class FakeBroadcastChannel {
     name: string;
     onmessage: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;
     constructor(name: string) { this.name = name; }
     postMessage(_message: any) {}
     close() {}
     addEventListener() {}
     removeEventListener() {}
     // @ts-ignore
     dispatchEvent() { return true; }
   }
   // @ts-ignore
   if (!(global as any).BroadcastChannel) (global as any).BroadcastChannel = FakeBroadcastChannel as any;
   ```

   - `frontend/jest.setup.ts`:

   ```ts
   // frontend/jest.setup.ts
   // Polyfill phải ở TRƯỚC khi import MSW server
   import '@testing-library/jest-dom';
   import 'whatwg-fetch';

   import { server } from './tests/msw/server';
   beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
   afterEach(() => server.resetHandlers());
   afterAll(() => server.close());
   ```

---

## 2. Unit Test

### 2.1 Domain Layer

- **Folder:** `frontend/domain/entities/`
- **Ví dụ:** `Cart.test.ts`

```ts
import { Cart } from "./Cart";

describe("Cart Entity", () => {
  it("adds item correctly", () => {
    const cart = new Cart();
    cart.addItem("p1", 2);
    expect(cart.getItems()).toEqual([
      { productId: "p1", quantity: 2 },
    ]);
  });
});
```

### 2.2 Application Layer

- **Folder:** `frontend/application/use_cases/`
- **Ví dụ:** `AddItemToCart.test.ts`

```ts
import { AddItemToCart } from "./AddItemToCart";
import { Cart } from "@/domain/entities/Cart";

class FakeCartRepo {
  cart: Cart | null = null;
  async load() {
    return this.cart;
  }
  async save(userId: string, cart: Cart) {
    this.cart = cart;
  }
}

describe("AddItemToCart UseCase", () => {
  it("adds item to empty cart", async () => {
    const repo = new FakeCartRepo();
    const useCase = new AddItemToCart(repo);
    const items = await useCase.execute("user1", "p1", 2);
    expect(items).toEqual([
      { productId: "p1", quantity: 2 },
    ]);
  });
});
```

### 2.3 Presentation Layer (Hooks & Components)

- **Folder:** `frontend/presentation/hooks/` hoặc `frontend/presentation/components/`
- **Hook test ví dụ:** `useAddToCart.test.tsx` (dùng `@testing-library/react` thay cho `react-hooks` đã deprecated)

```tsx
import { renderHook, act } from '@testing-library/react';
import { useAddToCart } from './useAddToCart';
import { AddItemToCart } from '@/application/use_cases/AddItemToCart';

jest.mock('@/application/use_cases/AddItemToCart');

test('updates loading state', async () => {
  (AddItemToCart as unknown as jest.Mock).mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue([{ productId: 'p1', quantity: 1 }]),
  }));

  const { result } = renderHook(() => useAddToCart('user1'));
  await act(async () => {
    const items = await result.current.addToCart('p1');
    expect(items).toEqual([{ productId: 'p1', quantity: 1 }]);
    expect(result.current.loading).toBe(false);
  });
});
```

- **Component test ví dụ:** `AddToCartButton.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddToCartButton } from './AddToCartButton';

test('button shows loading state', async () => {
  render(<AddToCartButton userId="user1" productId="p1" />);
  const button = screen.getByRole('button', { name: /add to cart/i });
  await userEvent.click(button);
  expect(button).toHaveTextContent(/adding.../i);
});
```

---

## 3. Integration Test

- **Folder:** `frontend/tests/integration/`
- **Test flow ví dụ:** `useAddToCart.integration.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddToCartButton } from '@/presentation/components/AddToCartButton';

test('full cart flow', async () => {
  render(<AddToCartButton userId="user1" productId="p1" />);
  await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));
  // kiểm tra state/DOM cuối cùng tuỳ theo UI
});
```

---

## 4. Infrastructure Test

- **Folder:** `frontend/infrastructure/repositories/`
- **Test API mapping ví dụ:** `CartRepoHttp.test.ts`

```ts
import { CartRepoHttp } from './CartRepoHttp';

// Khuyến nghị: dùng MSW để mock API thay vì mock thủ công fetch
// Handlers mẫu: tests/msw/handlers.ts

test('loads cart from API', async () => {
  const repo = new CartRepoHttp('http://localhost:3000');
  const cart = await repo.load('user1');
  expect(cart?.getItems()).toEqual([{ productId: 'p1', quantity: 1 }]);
});
```

---

## 5. E2E Test

- **Folder:** `frontend/tests/e2e/`
- **Playwright setup:**

```bash
npx playwright install
```

- **Cấu hình Playwright:** `frontend/playwright.config.ts`

```ts
// frontend/playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: ['**/*.spec.ts'],
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- **Test ví dụ:** `add-to-cart.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('user can add item to cart', async ({ page }) => {
  await page.goto('/product/1');
  await page.getByRole('button', { name: /add to cart/i }).click();
  await expect(page.locator('#cart-count')).toHaveText('1');
});
```

---

## 6. Chạy test

- Chạy trong thư mục `frontend/` cho tiện (hoặc cấu hình script trong package.json):

- **Unit & Integration:**

```bash
cd frontend
npm run test
```

- **E2E:**

```bash
cd frontend
npm run test:e2e
```

---

## 7. Lưu ý

- Unit test để **cạnh code**, không cần `__tests__/` folder.
- Integration và E2E test tách riêng folder `tests/integration/` & `tests/e2e/`.
- Alias `@/` đã được map về `frontend/` trong `frontend/jest.config.js`; đảm bảo `frontend/tsconfig.json` cũng có:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

- Giữ nguyên triết lý Clean/Onion: Domain thuần logic, Application orchestration, UI chỉ gọi UseCase.
