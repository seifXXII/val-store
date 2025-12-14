# Component Structure & Responsibility Guidelines

## 🎯 Single Responsibility Principle

**Every file should have ONE clear responsibility.**

---

## 📁 Component Organization Pattern

```
src/
├── app/                                    # ROUTING ONLY
│   ├── login/
│   │   └── page.tsx                        # Just route + layout
│   └── signup/
│       └── page.tsx                        # Just route + layout
│
└── components/                             # UI COMPONENTS
    ├── auth/
    │   ├── login/
    │   │   ├── LoginForm.tsx               # Form logic & state
    │   │   ├── LoginCard.tsx               # Card wrapper
    │   │   └── index.ts                    # Barrel exports
    │   └── signup/
    │       ├── SignupForm.tsx              # Form logic & state
    │       ├── SignupCard.tsx              # Card wrapper
    │       └── index.ts                    # Barrel exports
    └── UserDialog.tsx
```

---

## 🚫 Anti-Pattern (DON'T DO THIS)

### ❌ Bad: Everything in page.tsx

```tsx
// app/login/page.tsx - TOO MUCH RESPONSIBILITY
'use client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = trpc.auth.login.useMutation({ ... });

  const handleSubmit = () => { ... };

  return (
    <div className="...">
      <Card>
        <CardHeader>...</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* 100+ lines of form UI */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Problems:**

- ❌ Page component has too many responsibilities
- ❌ Hard to test form logic separately
- ❌ Can't reuse form in other contexts
- ❌ Difficult to maintain

---

## ✅ Recommended Pattern (DO THIS)

### ✅ Good: Separated Concerns

#### 1. Page Component (Routing & Layout Only)

```tsx
// app/login/page.tsx - ROUTING RESPONSIBILITY
import { LoginCard } from "@/components/auth/login";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <LoginCard />
    </div>
  );
}
```

**Responsibility:** Route handler + page-level layout

#### 2. Card Component (Presentation Wrapper)

```tsx
// components/auth/login/login-card.tsx - PRESENTATION RESPONSIBILITY
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LoginForm } from "./login-form";

export function LoginCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Enter your email and password to sign in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
```

**Responsibility:** Card styling and header content

#### 3. Form Component (Business Logic)

```tsx
// components/auth/login/login-form.tsx - FORM LOGIC RESPONSIBILITY
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
    </form>
  );
}
```

**Responsibility:** Form state, validation, submission logic

---

## 📋 Component Responsibility Checklist

### Page Components (`app/**/page.tsx`)

**Should:**

- ✅ Import and render main component
- ✅ Handle page-level layout (centering, background, etc.)
- ✅ Be as simple as possible (< 15 lines ideally)

**Should NOT:**

- ❌ Contain useState hooks
- ❌ Contain business logic
- ❌ Contain form handling
- ❌ Import tRPC hooks
- ❌ Have more than 3 levels of JSX nesting

### Form Components (`components/**/form.tsx`)

**Should:**

- ✅ Manage form state (useState)
- ✅ Handle form submission
- ✅ Contain validation logic
- ✅ Use API hooks (tRPC mutations/queries)
- ✅ Handle loading and error states

**Should NOT:**

- ❌ Contain page-level layout
- ❌ Contain unrelated business logic
- ❌ Mix multiple feature concerns

### Card/Wrapper Components

**Should:**

- ✅ Provide consistent styling
- ✅ Wrap child components
- ✅ Handle presentational logic only

**Should NOT:**

- ❌ Contain state management
- ❌ Make API calls
- ❌ Handle form logic

---

## 🎨 File Naming Conventions

### Component Files

| Type           | Naming                | Example                  |
| -------------- | --------------------- | ------------------------ |
| Form component | `[Feature]Form.tsx`   | `LoginForm.tsx`          |
| Card wrapper   | `[Feature]Card.tsx`   | `ProductCard.tsx`        |
| List component | `[Feature]List.tsx`   | `OrderList.tsx`          |
| Item component | `[Feature]Item.tsx`   | `CartItem.tsx`           |
| Dialog/Modal   | `[Feature]Dialog.tsx` | `ConfirmationDialog.tsx` |
| Page component | `page.tsx`            | `app/login/page.tsx`     |

### Folder Structure

```
components/
└── [feature]/                  # Feature folder (auth, products, cart) - kebab-case
    └── [sub-feature]/          # Sub-feature (login, signup) - kebab-case
        ├── [Name]Form.tsx      # Logic component - PascalCase
        ├── [Name]Card.tsx      # Presentation wrapper - PascalCase
        ├── [Name].test.tsx     # Tests (optional) - PascalCase
        └── index.ts            # Barrel exports - lowercase
```

---

## 🔄 Component Hierarchy Example

```
LoginPage (page.tsx)
  │
  ├─ Page layout (centering, background)
  │
  └─ LoginCard (login-card.tsx)
      │
      ├─ Card UI (header, styling)
      │
      └─ LoginForm (login-form.tsx)
          │
          ├─ Form state
          ├─ Validation
          ├─ API calls
          └─ Form UI (inputs, buttons)
```

---

## ✅ Benefits of This Pattern

1. **Testability**

   - Test form logic without page wrapper
   - Mock components easily

2. **Reusability**

   - Use `LoginForm` in modal, page, or sidebar
   - Share components across features

3. **Maintainability**

   - Each file has clear purpose
   - Easy to find and fix issues

4. **Scalability**

   - Add features without breaking existing code
   - Team members can work on different components

5. **Readability**
   - Smaller files are easier to understand
   - Clear separation of concerns

---

## 📝 Component Creation Checklist

Before creating any component, ask:

1. ✅ **What is its single responsibility?**

   - If you say "and" when describing it, split it up

2. ✅ **Can it be reused?**

   - If yes, make it generic and move to `components/`

3. ✅ **Does it handle data?**

   - Forms, lists → separate from presentation

4. ✅ **Is it page-specific?**

   - Page layout → `app/[route]/page.tsx`
   - Feature logic → `components/[feature]/`

5. ✅ **How many lines?**
   - > 150 lines → consider splitting
   - > 300 lines → definitely split

---

## 🎯 Quick Rules

1. **Page.tsx** = Route + Layout ONLY
2. **Card/Wrapper** = Presentation ONLY
3. **Form/Logic** = State + Business Logic
4. **One component** = One responsibility
5. **Max 200 lines** per component file
6. **Descriptive names** always

---

## 📚 Real-World Examples

### ✅ Good Structure

```
components/
├── auth/
│   ├── login/
│   │   ├── LoginForm.tsx           # Form state & logic
│   │   ├── LoginCard.tsx           # Card wrapper
│   │   └── index.ts
│   └── signup/
│       ├── SignupForm.tsx
│       ├── SignupCard.tsx
│       └── index.ts
│
├── products/
│   ├── list/
│   │   ├── ProductList.tsx         # List rendering
│   │   ├── ProductFilters.tsx      # Filter logic
│   │   └── index.ts
│   └── detail/
│       ├── ProductDetail.tsx
│       ├── ProductGallery.tsx
│       └── index.ts
│
└── cart/
    ├── CartItem.tsx                # Single item
    ├── CartList.tsx                # List of items
    ├── CartSummary.tsx             # Price summary
    └── index.ts
```

### ❌ Bad Structure

```
components/
├── login.tsx                       # Everything in one file
├── signup.tsx                      # Everything in one file
├── products.tsx                    # Everything in one file
└── cart.tsx                        # Everything in one file
```

---

## 🚀 Summary

**Golden Rule:** If a component does more than ONE thing, split it!

Follow this pattern for all future features:

1. Create feature folder
2. Create sub-feature folders
3. Separate logic from presentation
4. Keep page.tsx minimal
5. Use barrel exports (index.ts)

This keeps the codebase clean, testable, and maintainable! 🎉
