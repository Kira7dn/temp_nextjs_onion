# Frontend Clean/Onion Architecture (Next.js + TypeScript)

## Introduction

This document outlines the implementation of **Clean Architecture** (also known as Onion Architecture) for a **Next.js frontend application** with TypeScript. It emphasizes separation of concerns, dependency inversion, and testability.

### Key Principles
- **Dependency Direction**: Presentation → Application → Domain
- **Testability**: Each layer can be tested in isolation
- **Maintainability**: Changes in one layer don't affect others
- **Hybrid Support**: Supports both UI and API presentation in Next.js

---

## Architecture Overview

### Layers
1. **Domain Layer**: Business entities and rules
2. **Application Layer**: Use cases and interfaces
3. **Infrastructure Layer**: External concerns (DB, APIs)
4. **Presentation Layer**: UI components and API routes

### Dependency Rule
- Inner layers (Domain) don't depend on outer layers
- Outer layers depend on inner layers via interfaces

---

## Layers Explanation

### Domain Layer
- **Purpose**: Core business logic, entities, validation rules
- **Contents**: Pure TypeScript classes, interfaces, business rules
- **Dependencies**: None (except standard library)
- **Testing**: Unit tests for entities and pure functions

### Application Layer
- **Purpose**: Orchestrate business operations
- **Contents**: Use cases, server actions, repository interfaces
- **Dependencies**: Domain layer
- **Testing**: Unit tests with mocked interfaces

### Infrastructure Layer
- **Purpose**: Handle external systems
- **Contents**: Repository implementations, DB clients, external API clients
- **Dependencies**: Application interfaces
- **Testing**: Integration tests

### Presentation Layer
- **Purpose**: Present data to users and external clients
- **Contents**:
  - **UI Presentation**: React components, pages, hooks
  - **API Presentation**: API routes (JSON responses)
- **Dependencies**: Application layer
- **Testing**: Component tests, API response tests

---

## Workflow (Step-by-Step)

### Step 0: Clarify Requirements
- Define input/output, entities, business rules
- Identify acceptance criteria

### Step 1: Domain Layer
- Create entities (TypeScript classes/interfaces)
- Implement business rules and validation

### Step 2: Application Layer
- Define repository interfaces (ports)
- Implement use cases (application services)

### Step 3: Infrastructure Layer
- Implement repository interfaces using DB/API

### Step 4: Presentation Layer
- Create UI components/hooks
- Create API routes if needed

### Step 5: Testing
- Write tests for each layer
- Integration and E2E tests

---

## Directory Structure

```
frontend/
├── app/                            # Next.js App Router
│   ├── api/                        # API routes (Presentation: JSON responses)
│   │   ├── users/route.ts          # GET /api/users
│   │   └── cart/[userId]/route.ts  # GET/POST /api/cart/:userId
│   ├── dashboard/                  # UI pages (Presentation)
│   ├── globals.css                 # UI styling (Presentation)
│   ├── layout.tsx                  # UI layout (Presentation)
│   └── page.tsx                    # UI pages (Presentation)
├── public/                         # Static assets (Infrastructure)
├── src/                            # Source code by layers
│   ├── domain/
│   │   └── entities/
│   │       ├── Cart.ts            # Domain entity
│   │       └── Cart.test.ts       # Unit test
│   ├── application/
│   │   ├── interfaces/            # Repository interfaces
│   │   ├── use_cases/             # Use cases
│   │   └── server_actions/        # Server actions
│   ├── infrastructure/
│   │   └── repositories/          # Repository implementations
│   ├── presentation/
│   │   ├── components/            # React components
│   │   ├── dependency/            # Dependency injection factories by domain
│   │   │   ├── auth.ts            # Auth-related factories
│   │   │   └── cart.ts            # Cart-related factories
│   │   └── hooks/                 # Custom hooks
│   └── shared/
│       └── di/                    # Dependency injection
├── tests/
│   ├── integration/               # Integration tests
│   └── e2e/                       # E2E tests
├── jest.config.js                 # Jest configuration
├── playwright.config.ts           # Playwright configuration
└── tsconfig.json                  # TypeScript configuration
```

---

## Examples

### Example 1: Add to Cart (Mutation)
- **Domain**: `Cart` entity with `addItem()` method
- **Application**: `AddItemToCart` use case, `ICartRepository` interface
- **Infrastructure**: `CartRepoHttp` (in-memory storage)
- **Presentation**:
  - UI: `useAddToCart` hook, `AddToCartButton` component
  - API: `POST /api/cart/:userId`

### Example 2: User Login (Authentication)
- **Domain**: `User` entity
- **Application**: `AuthenticateUser` use case, `getUsersServerAction`
- **Infrastructure**: `UserRepoHttp` (in-memory users)
- **Presentation**:
  - UI: `useLogin` hook, `LoginComponent`
  - API: `GET /api/users`

---

## Testing Strategy

| Layer          | Test Type       | Tools/Notes |
| -------------- | --------------- | ----------- |
| Domain         | Unit test       | Jest, pure TypeScript |
| Application    | Unit test       | Jest + mocked interfaces |
| Infrastructure | Integration     | Jest + MSW for API mocks |
| Presentation   | Unit/Integration| React Testing Library, Jest |
| E2E            | Full flow       | Playwright |

---

## Tools & Recipes

### DI Factories
- Use factory functions for dependency injection
- Example: `createAuthenticateUser()` returns new `AuthenticateUser` instance with injected repo

### MSW (Mock Service Worker)
- Mock API responses in tests
- Example: `http.get('/api/cart/:userId', ({ params }) => HttpResponse.json(cartData))`

### Playwright
- E2E testing
- Example: `page.route('**/api/cart/**', route => route.fulfill({ status: 200, json: cartData }))`

### Dependency Injection
- Singleton repos, factory use cases
- Example: `src/shared/di/factories.ts`

---

## Best Practices

- **Naming Convention**:
  - `.ts` for TypeScript files
  - `.tsx` for React components
  - `.test.ts/.tsx` for unit tests
  - `.integration.test.tsx` for integration tests
  - `.spec.ts` for E2E tests

- **Import Rules**:
  - Use path aliases: `@domain/*`, `@application/*`, etc.
  - Presentation only imports Application
  - No direct API calls in components

- **Error Handling**: Use try-catch in server components/actions
- **Security**: Server actions auto-protect against unauthorized access
- **Performance**: Use server components for data fetching

---

## Conclusion

This architecture provides a solid foundation for scalable, testable Next.js applications. Start with the workflow, implement examples, and adapt as needed.

For questions or contributions, refer to the examples and testing strategies.
