# Authentication & Authorization

## 🔐 Better Auth Implementation

Val Store uses **[Better Auth](https://www.better-auth.com/)** - a modern, full-stack authentication library for TypeScript with built-in session management, OAuth support, and security best practices.

---

## 📋 Configuration

### Better Auth Setup

**Location:** `src/lib/auth.ts`

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // PostgreSQL
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true when email service is ready
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      enabled: !!process.env.FACEBOOK_CLIENT_ID,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
});
```

### Client Configuration

**Location:** `src/lib/auth-client.ts`

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession, $Infer } = authClient;
```

---

## 🔄 Authentication Flows

### User Registration (Email/Password)

**Client Usage:**

```typescript
import { signUp } from "@/lib/auth-client";

const handleSignUp = async () => {
  const { data, error } = await signUp.email({
    email: "user@example.com",
    password: "SecurePass123!",
    name: "John Doe",
  });

  if (error) {
    console.error("Signup failed:", error);
    return;
  }

  console.log("User created:", data.user);
  // Redirect to login or dashboard
};
```

**Process:**

1. User submits email, password, and name
2. Better Auth validates input
3. Password is hashed automatically (bcrypt)
4. User record created in `user` table
5. Session created automatically
6. Returns user data and session

---

### User Login (Email/Password)

**Client Usage:**

```typescript
import { signIn } from "@/lib/auth-client";

const handleLogin = async () => {
  const { data, error } = await signIn.email({
    email: "user@example.com",
    password: "SecurePass123!",
  });

  if (error) {
    console.error("Login failed:", error);
    return;
  }

  console.log("Logged in:", data.user);
  // Session is automatically created and stored
};
```

**Process:**

1. User submits email and password
2. Better Auth verifies credentials
3. Creates/updates session in `session` table
4. Returns user data and session token
5. Session stored in HTTP-only cookie

---

### OAuth Login (Google/Facebook)

**Client Usage:**

```typescript
import { signIn } from "@/lib/auth-client";

// Google Sign-In
const handleGoogleLogin = async () => {
  await signIn.social({
    provider: "google",
    callbackURL: "/dashboard",
  });
};

// Facebook Sign-In
const handleFacebookLogin = async () => {
  await signIn.social({
    provider: "facebook",
    callbackURL: "/dashboard",
  });
};
```

**Process:**

1. User clicks OAuth provider button
2. Redirected to provider's auth page
3. User authorizes the application
4. Provider redirects back with auth code
5. Better Auth exchanges code for tokens
6. Creates/updates user in `user` table
7. Links account in `account` table
8. Creates session and redirects to callback URL

---

### Check Current Session

**Client Usage:**

```typescript
import { useSession } from "@/lib/auth-client";

function ProfileComponent() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not logged in</div>;

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
```

---

### Logout

**Client Usage:**

```typescript
import { signOut } from "@/lib/auth-client";

const handleLogout = async () => {
  await signOut();
  // Redirects to homepage or login page
};
```

**Process:**

1. Invalidates current session in database
2. Clears session cookie
3. Redirects user

---

## 🗄️ Database Schema

Better Auth automatically manages these tables:

### `user` Table

```sql
CREATE TABLE user (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_verified BOOLEAN DEFAULT false,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### `session` Table

```sql
CREATE TABLE session (
  id TEXT PRIMARY KEY,
  expires_at TIMESTAMP NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  user_id TEXT REFERENCES user(id) ON DELETE CASCADE
);
```

### `account` Table

```sql
CREATE TABLE account (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  user_id TEXT REFERENCES user(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT,
  id_token TEXT,
  access_token_expires_at TIMESTAMP,
  refresh_token_expires_at TIMESTAMP,
  scope TEXT,
  password TEXT, -- Hashed, for email/password auth
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### `verification` Table

```sql
CREATE TABLE verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 👤 Authorization Levels (Custom Implementation)

Better Auth provides authentication. For **role-based authorization**, we extend with a custom `user_profiles` table:

### UserProfile Table

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  user_id TEXT REFERENCES user(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'customer',
  phone VARCHAR,
  shipping_address TEXT,
  billing_address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE user_role AS ENUM ('customer', 'worker', 'admin');
```

### 1. Customer (Default)

**Permissions:**

- View products and categories
- Manage own profile
- Create and manage cart
- Place orders
- View own order history
- Write product reviews

**Protected Routes:**

- `/account/*`
- `/checkout/*`
- `/orders/*`

---

### 2. Worker

**Permissions:**

- All customer permissions
- View all orders
- Update order status
- Process payments
- Manage inventory

**Protected Routes:**

- `/worker/*`
- `/worker/orders/*`
- `/worker/inventory/*`

---

### 3. Admin

**Permissions:**

- All worker permissions
- Manage products (CRUD)
- Manage categories (CRUD)
- View customer list
- Manage coupons
- View analytics

**Protected Routes:**

- `/admin/*`
- `/admin/products/*`
- `/admin/customers/*`
- `/admin/analytics/*`

---

## 🛡️ Security Features

### Built-in Security (Better Auth)

✅ **Password Hashing** - Automatic bcrypt with salt rounds  
✅ **Session Management** - HTTP-only cookies  
✅ **CSRF Protection** - Built-in token validation  
✅ **Token Rotation** - Automatic refresh token rotation  
✅ **Session Expiry** - Configurable expiration (7-day default)  
✅ **IP & User Agent Tracking** - Stored in session table  
✅ **OAuth Security** - State parameter validation

### Additional Security Measures

**Rate Limiting** (To Implement):

```typescript
// Login attempts
- 5 attempts per 15 minutes per IP
- Lock account after 10 failed attempts

// API requests
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users
```

**Email Verification** (To Enable):
Set `requireEmailVerification: true` in Better Auth config

---

## 🔐 Middleware Implementation

### Protect Server Routes

```typescript
// app/api/protected/route.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ user: session.user });
}
```

### Protect Client Routes

```typescript
// app/dashboard/page.tsx
"use client";
import { useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) redirect("/login");

  return <div>Dashboard content</div>;
}
```

### Role-Based Protection

```typescript
import { useSession } from "@/lib/auth-client";
// Note: useUserProfile hook needs to be implemented in your project
// Example: import { useUserProfile } from "@/hooks/useUserProfile";

function AdminPage() {
  const { data: session } = useSession();

  // Fetch user profile to check role
  const { data: profile } = useUserProfile(session?.user.id);

  if (profile?.role !== "admin") {
    return <div>Access Denied</div>;
  }

  return <div>Admin content</div>;
}
```

---

## 📋 Environment Variables

```env
# Better Auth
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-super-secret-key-min-32-chars

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/val_store
```

---

## 🔄 Authentication Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant BetterAuth
    participant DB

    User->>Client: Enter credentials
    Client->>BetterAuth: signIn.email()
    BetterAuth->>DB: Find user by email
    DB-->>BetterAuth: User data
    BetterAuth->>BetterAuth: Verify password hash
    BetterAuth->>DB: Create session
    DB-->>BetterAuth: Session created
    BetterAuth-->>Client: User + Session (HTTP-only cookie)
    Client->>Client: Update UI

    Note over Client,BetterAuth: Subsequent requests

    Client->>BetterAuth: Request with session cookie
    BetterAuth->>DB: Validate session
    DB-->>BetterAuth: Session valid
    BetterAuth-->>Client: Protected resource
```

---

## 📝 Best Practices

1. ✅ **Use Better Auth's built-in security** - Don't roll your own auth
2. ✅ **Enable HTTPS only** in production
3. ✅ **Use HTTP-only cookies** for sessions (automatic with Better Auth)
4. ✅ **Implement email verification** when email service is ready
5. ✅ **Add rate limiting** for auth endpoints
6. ✅ **Log authentication events** for audit trail
7. ✅ **Use environment variables** for secrets
8. ✅ **Implement role-based access** via UserProfile table
9. ✅ **Enable OAuth providers** for better UX
10. ✅ **Monitor sessions** and implement logout on all devices

---

## 📚 Resources

- [Better Auth Documentation](https://www.better-auth.com/)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
