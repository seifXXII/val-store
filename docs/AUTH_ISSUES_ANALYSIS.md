# Auth System Analysis & Issues

**Date:** December 24, 2025  
**Author:** Analysis based on `src/` codebase exploration

---

## 🔍 Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        Better Auth                                │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────────┐ │
│  │   user      │   │  session    │   │  verification           │ │
│  │  (email,    │   │  (auth)     │   │  (email tokens)         │ │
│  │   name,     │   └─────────────┘   └─────────────────────────┘ │
│  │   phone,    │                                                  │
│  │   birthday) │                                                  │
│  └──────┬──────┘                                                  │
└─────────┼─────────────────────────────────────────────────────────┘
          │ FK: userId
          │
┌─────────▼──────────────────────────────────────────────────────────┐
│                      Custom Tables                                  │
│  ┌─────────────────┐           ┌───────────────────────────────┐   │
│  │  userProfiles   │           │  customers                    │   │
│  │  - role         │           │  - phone (unique identifier)  │   │
│  │  - phone ❌     │◄──────────│  - preferredName              │   │
│  │    (redundant)  │  linked   │  - totalOrders, totalSpent    │   │
│  └─────────────────┘  by phone │  - loyaltyPoints              │   │
│                                └───────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🚨 Issues Found

### Issue 1: Email Verification Not Sending

**Symptom:** No verification email received after signup.

**Root Cause:** `RESEND_API_KEY` environment variable not set.

**Evidence:** In `resend-email.service.ts` (line 24-27):

```typescript
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.warn("RESEND_API_KEY not set - emails will not be sent");
}
```

The service gracefully degrades but never sends emails.

**Fix:** Add to `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM="Val Store <noreply@your-verified-domain.com>"
```

> [!TIP]
> Get your API key from [Resend Dashboard](https://resend.com/api-keys).
> You'll also need to verify a domain or use Resend's test domain.

---

### Issue 2: Phone Field Redundancy

**Symptom:** Phone stored in multiple places, causing confusion.

**Tables with phone:**

1. `user` table (Better Auth) - `phone` field (line 49 in auth.ts)
2. `userProfiles` table - `phone` field (line 123 in schema.ts)
3. `customers` table - `phone` field (line 140 in schema.ts)

**Current Flow:**

```typescript
// In auth.ts databaseHooks.user.create.after:
const phone = (user as { phone?: string }).phone;
if (phone) {
  // Creates/links customer by phone
  await db.insert(customers).values({
    phone: normalizedPhone,
    preferredName: user.name || null,
  });
}
// userProfiles.phone is never set!
```

**Problem:**

- Phone goes to Better Auth `user` table and `customers` table
- `userProfiles.phone` is never populated
- Redundant column wastes space

**Fix:** Remove `phone` from `userProfiles` table. Keep it only in:

- `user` table (Better Auth default)
- `customers` table (for customer identity)

---

### Issue 3: Phone Validation Allows National Format

**Symptom:** Phone numbers without country code are accepted.

**Current Validation:** In `phone.value-object.ts` (line 57-64):

```typescript
private isValidPhone(phone: string): boolean {
  const internationalRegex = /^\+\d{10,15}$/;  // +1234567890
  const nationalRegex = /^\d{7,15}$/;           // 1234567890 ← Problem!
  return internationalRegex.test(phone) || nationalRegex.test(phone);
}
```

**Problem:** Allows `1234567890` without country code, making it impossible to:

- Send SMS verification
- Identify customer's country
- Ensure global uniqueness

**Fix:** Require international format only:

```typescript
private isValidPhone(phone: string): boolean {
  const internationalRegex = /^\+\d{10,15}$/;
  return internationalRegex.test(phone);
}
```

---

### Issue 4: No Super Admin Seed Script

**Symptom:** Must manually edit database to create admin.

**Current State:**

- `scripts/seed-basic.ts` exists but doesn't create super_admin
- No automated way to bootstrap admin access

**Fix:** Create `scripts/seed-admin.ts` with:

- User details in Better Auth `user` table
- `userProfiles` entry with `super_admin` role
- `customers` entry with phone

---

### Issue 5: Dashboard Access Denied for Super Admin

**Symptom:** Logged in as super_admin but redirected to `/login?error=unauthorized`.

**Flow:**

1. ✅ Middleware (`middleware.ts`) checks session → passes
2. ❌ Admin Layout (`(admin)/layout.tsx`) checks role → fails

**Admin Layout Check (line 33-44):**

```typescript
const [profile] = await db
  .select({ role: userProfiles.role })
  .from(userProfiles)
  .where(eq(userProfiles.userId, session.user.id))
  .limit(1);

const userRole = profile?.role ?? "customer"; // ← Falls back to "customer"!
const isAdmin = userRole === "admin" || userRole === "super_admin";

if (!isAdmin) {
  redirect("/?error=forbidden");
}
```

**Problem:** When user was manually added to `user` table:

- `userProfiles` entry was NOT created (no trigger)
- Or `userProfiles` entry has wrong `role` value

**Root Cause:** The `databaseHooks.user.create.after` in `auth.ts` only runs during signup, not manual DB edits.

**Fix:** The seed script will properly create both entries.

---

## ✅ Summary Table

| Issue             | Severity  | Fix Type          |
| ----------------- | --------- | ----------------- |
| Email not sending | 🔴 High   | Configuration     |
| Phone redundancy  | 🟡 Medium | Schema migration  |
| Phone validation  | 🟡 Medium | Code change       |
| Admin seeding     | 🔴 High   | New script        |
| Dashboard access  | 🔴 High   | Data fix via seed |

---

## 🔧 Quick Fixes

### 1. Add RESEND_API_KEY to .env.local

```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM="Val Store <noreply@your-domain.com>"
```

### 2. Run Admin Seed (after implementation)

```bash
pnpm seed:admin
```

### 3. Verify in Drizzle Studio

```bash
pnpm db:studio
```

Check:

- `user` table: entry exists with correct email
- `user_profiles` table: entry exists with `super_admin` role
- `customers` table: entry exists with phone
