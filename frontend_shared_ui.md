
# 🧩 Shared UI Components (TailwindCSS + Next.js)

Đây là base UI Kit viết bằng **TailwindCSS** để dùng trong folder `frontend/shared/ui/`.

## 📂 Cấu trúc thư mục

```
frontend/
  shared/
    ui/
      Button.tsx
      Card.tsx
      Input.tsx
```

---

## `Button.tsx`

```tsx
"use client";

import { cn } from "../lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition",
        variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "secondary" && "bg-gray-200 text-gray-800 hover:bg-gray-300",
        variant === "outline" && "border border-gray-300 text-gray-800 hover:bg-gray-100",
        className
      )}
      {...props}
    />
  );
}
```

---

## `Card.tsx`

```tsx
import { cn } from "../lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-sm p-4",
        className
      )}
      {...props}
    />
  );
}
```

---

## `Input.tsx`

```tsx
"use client";

import { cn } from "../lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm",
        "focus:border-blue-500 focus:ring focus:ring-blue-200",
        className
      )}
      {...props}
    />
  );
}
```

---

## `lib/utils.ts`

```ts
// Hàm tiện ích để merge className Tailwind
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
```

---

## ✅ Cách dùng trong Page

```tsx
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-96 space-y-4">
        <h1 className="text-xl font-bold">Login</h1>
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Button className="w-full">Sign In</Button>
      </Card>
    </main>
  );
}
```

---

✨ Giờ bạn có sẵn một bộ **UI cơ bản** trong `frontend/shared/ui/` có thể tái sử dụng trong toàn project.
