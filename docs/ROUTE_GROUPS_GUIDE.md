# Auth Route Group Structure

## 📁 Next.js Route Groups

Using `(auth)` folder creates a **route group** in Next.js:

- ✅ Groups related routes together
- ✅ Shares a common layout
- ✅ **Doesn't affect the URL** - `(auth)` is not in the path

## 🗂️ Current Structure

```
app/
└── (auth)/                    # Route group (not in URL)
    ├── layout.tsx             # Shared layout for all auth pages
    ├── login/
    │   └── page.tsx           # Route: /login
    └── signup/
        └── page.tsx           # Route: /signup
```

## ✅ Benefits

### 1. **Shared Layout**

The `(auth)/layout.tsx` provides consistent styling for all auth pages:

- Centered content
- Same background
- Consistent padding

```tsx
// app/(auth)/layout.tsx
export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      {children}
    </div>
  );
}
```

### 2. **Super Clean Pages**

Page components are now just 3 lines:

```tsx
// app/(auth)/login/page.tsx
import { LoginCard } from "@/components/auth/login";

export default function LoginPage() {
  return <LoginCard />;
}
```

### 3. **Easy to Extend**

Adding new auth routes is simple:

```
app/(auth)/
├── layout.tsx
├── login/
├── signup/
├── forgot-password/         # New: /forgot-password
├── reset-password/          # New: /reset-password
└── verify-email/            # New: /verify-email
```

All will automatically use the same layout!

## 🎯 URLs

The `(auth)` folder **does not appear in URLs**:

- ✅ `/login` (not `/auth/login`)
- ✅ `/signup` (not `/auth/signup`)
- ✅ `/forgot-password` (not `/auth/forgot-password`)

## 📋 When to Use Route Groups

**✅ Use route groups when:**

- Multiple routes need the same layout
- You want to organize routes logically
- You want to keep URLs clean

**Common examples:**

- `(auth)` - Login, signup, password reset
- `(marketing)` - Landing pages, pricing, about
- `(dashboard)` - Admin pages, user dashboard
- `(shop)` - Product pages, cart, checkout

## 🔄 Layout Hierarchy

```
app/layout.tsx (Root)
  └── (auth)/layout.tsx (Auth-specific)
      ├── login/page.tsx
      └── signup/page.tsx
```

Both layouts wrap the pages:

1. Root layout provides global styles, fonts, providers
2. Auth layout adds auth-specific styling (centering, background)

## 💡 Additional Features

You can add more to the auth layout:

```tsx
// app/(auth)/layout.tsx
export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      {/* Optional: Auth-specific header */}
      <header className="absolute top-0 w-full p-4">
        <Link href="/">
          <Logo />
        </Link>
      </header>

      {/* Main content */}
      <main className="w-full px-4 py-12">{children}</main>

      {/* Optional: Auth-specific footer */}
      <footer className="absolute bottom-0 w-full p-4 text-center text-sm text-gray-600">
        © 2024 Val Store. All rights reserved.
      </footer>
    </div>
  );
}
```

## 🎨 Perfect for Different Layouts

You can have different route groups with different layouts:

```
app/
├── (auth)/
│   ├── layout.tsx          # Centered, minimal
│   ├── login/
│   └── signup/
│
├── (dashboard)/
│   ├── layout.tsx          # Sidebar + header
│   ├── profile/
│   └── settings/
│
└── (marketing)/
    ├── layout.tsx          # Full-width, hero sections
    ├── about/
    └── pricing/
```

## 🚀 Summary

**Before:**

```tsx
// Every page had layout duplication
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <LoginCard />
    </div>
  );
}
```

**After:**

```tsx
// Page is just the content
export default function LoginPage() {
  return <LoginCard />;
}
```

**Layout is shared** in `(auth)/layout.tsx` - DRY principle! 🎉
