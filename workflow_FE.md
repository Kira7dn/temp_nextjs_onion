# Frontend Clean/Onion Architecture (Next.js + TypeScript)

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

## II. Directory Map & Test Layout

```text
frontend/
├── app/                            # Next.js App Router
├── public/                         # Static assets
├── src/                            # Toàn bộ code theo layers
│   ├── domain/
│   │   └── entities/
│   │       ├── Cart.ts            # Domain entity
│   │       └── Cart.test.ts       # Unit test (domain)
│   ├── application/
│   │   ├── interfaces/            # Repository / service interfaces
│   │   └── use_cases/
│   │       └── AddItemToCart.ts   # Use case
│   ├── infrastructure/
│   │   └── repositories/
│   │       └── CartRepoHttp.ts    # Implements ICartRepository (fetch '/api/cart/:userId')
│   ├── presentation/
│   │   ├── hooks/
│   │   │   └── useAddToCart.ts    # Custom hook using use case
│   │   └── components/
│   │       └── AddToCartButton.tsx# UI component
│   └── shared/
│       └── ...
├── tests/
│   ├── msw/
│   │   ├── handlers.ts            # MSW v2 handlers (http.get/post, HttpResponse)
│   │   └── server.ts              # MSW server setup
│   ├── integration/
│   │   └── add-to-cart.integration.test.tsx
│   └── e2e/
│       └── add-to-cart.spec.ts
├── jest.config.js                  # Jest config (Next/Jest), alias '@/', '@domain/*', ... → src/*
├── jest.setup.ts                   # Jest setup (jest-dom, whatwg-fetch, MSW server)
├── jest.polyfills.ts               # Polyfills for Jest (TextEncoder, Streams, BroadcastChannel)
├── playwright.config.ts            # Playwright config (testDir=tests/e2e)
└── tsconfig.json                   # Paths: '@/': 'src/*', '@presentation/*': 'src/presentation/*', ...
```

---

## III. Workflow (Step-by-Step)

### Step 0 – Clarify Requirements

- Xác định: input, output, entities, hành vi user.
- Xác định domain entity, business rules.
- Đặt acceptance criteria (UI state, error state, latency).

### Step 1 – Domain Layer (Pure Business Logic)

- Define entities (TypeScript interfaces/classes).
- Define services (pure functions).
- No fetch, no React, no localStorage.

### Step 2 – Application Layer (Use Cases + Interfaces)

- Define repository interfaces (ports).
- Implement use cases (application services).

### Step 3 – Infrastructure Layer

- Implements repository interfaces using API, LocalStorage, IndexedDB.

### Step 4 – Presentation Layer

- Next.js page/component dùng use case qua DI.
- Không gọi API trực tiếp.

### Step 5 – Tests

- **Domain**: test `Cart` entity (pure TS).
- **Application**: test `AddItemToCart` với fake repository.
- **Integration**: test hook/component dùng MSW để mock API (`tests/msw/handlers.ts`).
- **E2E**: test Next.js page với Playwright, mock API qua `page.route`.

---

## IV. Chu trình thêm một Feature mới

1. **Xác định yêu cầu**
2. **Domain**: Tạo entity hoặc mở rộng entity sẵn có.
3. **Application**: Viết use case class.
4. **Infrastructure**: Cài đặt repository interface.
5. **Presentation**: Tạo custom hook + component UI.
6. **Testing**: Unit test domain & use case, integration test hook/component, E2E test toàn bộ flow.

---

## V. Testing Strategy by Layer

| Layer          | Type of Test       | Tools / Notes                                     |
| -------------- | ------------------ | ------------------------------------------------- |
| Domain         | Unit test          | Jest, pure TypeScript                             |
| Application    | Unit test          | Jest + fake repository/mock                        |
| Infrastructure | Integration test   | Jest + MSW v2 (`http`, `HttpResponse`)             |
| Presentation   | Unit / Integration | React Testing Library, Jest                        |
| Integration    | Integration test   | Test hooks + component + MSW (mock network)        |
| E2E            | Full flow          | Playwright (`testDir: tests/e2e`, `page.route`)    |

---

## VI. Guidelines

- Domain Layer: Pure business logic, test entities & services.
- Application Layer: Use case orchestration, mock interfaces in unit tests.
- Infrastructure Layer: Implement repository, test API mapping & storage.
- Presentation Layer: Hook & component, test UI behavior & state.
- Integration / E2E: Test flow from UI → UseCase → Domain, optionally to real backend.
- Shared Layer: Utilities or UI helpers, test individually with unit tests.

> ✅ Naming convention:
>
> - `.ts` for TypeScript files
> - `.tsx` for React components/hooks
> - `.test.ts` / `.test.tsx` for unit tests
> - `.integration.test.tsx` for integration tests
> - `.spec.ts` for E2E tests

---

## VII. Commands (trong thư mục `frontend/`)

- `npm run test` — chạy Jest (Unit/Integration)
- `npm run test:watch` — chạy Jest watch mode
- `npm run test:ci` — chạy Jest trong CI
- `npm run test:e2e` — chạy Playwright E2E

Ghi chú:
- MSW: dùng API v2 (`import { http, HttpResponse } from 'msw'`). Trong integration test (JSDOM), ưu tiên path-only `/api/...` để khớp `fetch('/api/...')`.
- Jest polyfills: `jest.polyfills.ts` thêm `TextEncoder`, Streams, `BroadcastChannel` để MSW hoạt động trong Node.
- Playwright trên Linux có thể cần cài thêm system libs (GTK, gstreamer, v.v.).
