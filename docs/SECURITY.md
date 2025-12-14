# Security Best Practices & Vulnerability Prevention

## 🔒 Current Security Status

✅ Dependencies updated to latest secure versions
✅ React security vulnerabilities addressed
✅ Authentication with password hashing (bcrypt)

---

## 🛡️ Dependency Security

### Regular Security Audits

Run these commands regularly to check for vulnerabilities:

```bash
# Check for vulnerabilities
pnpm audit

# Update dependencies to latest secure versions
pnpm update

# Update specific packages
pnpm update react react-dom next

# Auto-fix vulnerabilities (when possible)
pnpm audit --fix
```

### Automated Security Checks

Add to your CI/CD pipeline:

```yaml
# .github/workflows/security.yml
name: Security Audit

on:
  push:
    branches: [main, develop]
  pull_request:
  schedule:
    - cron: "0 0 * * 1" # Weekly on Monday

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm audit
```

---

## 🔐 Authentication Security

### ✅ Already Implemented

1. **Password Hashing with bcrypt**

   ```typescript
   const passwordHash = await bcrypt.hash(password, 10);
   ```

2. **Email Validation**

   ```typescript
   email: z.string().email("Invalid email address");
   ```

3. **Password Requirements**
   ```typescript
   password: z.string().min(8, "Password must be at least 8 characters");
   ```

### 🚀 Additional Security Measures to Implement

#### 1. Environment Variable Validation

```typescript
// src/lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]),
  // Add all required env vars
});

export const env = envSchema.parse(process.env);
```

#### 2. Rate Limiting

```typescript
// src/middleware/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export async function rateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(
    identifier
  );

  if (!success) {
    throw new Error("Too many requests");
  }

  return { limit, reset, remaining };
}
```

#### 3. CSRF Protection

```typescript
// For forms, use Next.js built-in CSRF protection
// Or implement custom CSRF tokens
import { generateToken, verifyToken } from "@/lib/csrf";

// Generate token
const csrfToken = generateToken();

// Verify on submission
if (!verifyToken(submittedToken)) {
  throw new Error("Invalid CSRF token");
}
```

#### 4. HTTP Security Headers

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
```

#### 5. Input Sanitization

```typescript
// Always validate and sanitize user input
import DOMPurify from "isomorphic-dompurify";

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input);
}

// Use Zod for validation
const userInputSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email(),
  message: z.string().max(5000).trim(),
});
```

#### 6. SQL Injection Prevention

✅ **Already handled by Drizzle ORM** - parameterized queries prevent SQL injection

```typescript
// SAFE - Drizzle handles this correctly
await db.select().from(users).where(eq(users.email, userInput));

// NEVER do this:
// await db.execute(`SELECT * FROM users WHERE email = '${userInput}'`); // DANGEROUS!
```

#### 7. XSS Prevention

```typescript
// React automatically escapes content
// But be careful with dangerouslySetInnerHTML

// ❌ DANGEROUS
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ SAFE - Sanitize first
import DOMPurify from 'isomorphic-dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />

// ✅ BETTER - Use React's default behavior
<div>{userInput}</div>

```

---

## 🔑 Session & Token Security

### JWT Best Practices

```typescript
// src/lib/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";

export function generateToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "HS256",
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
```

### Secure Cookie Settings

```typescript
// Use HTTP-only cookies for tokens
import { cookies } from "next/headers";

export function setAuthCookie(token: string) {
  cookies().set("auth_token", token, {
    httpOnly: true, // Prevents JavaScript access
    secure: true, // HTTPS only
    sameSite: "strict", // CSRF protection
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}
```

---

## 🚨 Common Vulnerabilities to Prevent

### 1. **Never Store Sensitive Data in localStorage**

❌ **BAD**

```typescript
localStorage.setItem("user", JSON.stringify(userData)); // Contains token
```

✅ **GOOD**

```typescript
// Store tokens in HTTP-only cookies
// Store only non-sensitive user data in localStorage
localStorage.setItem("userPreferences", JSON.stringify({ theme: "dark" }));
```

### 2. **Always Validate File Uploads**

```typescript
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function validateFile(file: File) {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error("Invalid file type");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large");
  }
}
```

### 3. **Prevent Information Disclosure**

❌ **BAD**

```typescript
catch (error) {
  return { error: error.message }; // May expose sensitive info
}
```

✅ **GOOD**

```typescript
catch (error) {
  console.error('Internal error:', error); // Log for debugging
  return { error: 'An error occurred' };  // Generic message to user
}
```

### 4. **Use Content Security Policy (CSP)**

```typescript
// next.config.ts
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};
```

---

## 📋 Security Checklist

### Before Production

- [ ] All dependencies updated to latest versions
- [ ] Security audit run and vulnerabilities fixed
- [ ] Environment variables properly secured
- [ ] HTTPS enabled (SSL/TLS certificates)
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] SQL injection prevention verified
- [ ] XSS protection in place
- [ ] CSRF tokens implemented
- [ ] Password hashing with bcrypt (salt rounds >= 10)
- [ ] Secure session management
- [ ] HTTP-only cookies for auth tokens
- [ ] File upload validation
- [ ] Error messages don't expose sensitive info
- [ ] Database credentials secured
- [ ] API keys not committed to git
- [ ] Regular security audits scheduled

---

## 🔄 Regular Maintenance

### Weekly

- [ ] Run `pnpm audit`
- [ ] Check for outdated packages: `pnpm outdated`

### Monthly

- [ ] Update dependencies: `pnpm update`
- [ ] Review security advisories
- [ ] Check access logs for suspicious activity

### Quarterly

- [ ] Full security audit
- [ ] Review and update security policies
- [ ] Test disaster recovery procedures

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [React Security](https://react.dev/learn/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security Advisories](https://github.com/advisories)

---

## 🆘 If You Find a Vulnerability

1. **Don't panic** - Most vulnerabilities have fixes
2. **Run `pnpm audit`** to identify the issue
3. **Update affected packages** with `pnpm update [package]`
4. **Check GitHub Security Advisories** for the package
5. **Consider alternatives** if package is unmaintained
6. **Report to package maintainer** if no fix exists

---

## ✅ Summary

**Current Security Measures:**

- ✅ bcrypt password hashing
- ✅ Input validation with Zod
- ✅ Drizzle ORM (prevents SQL injection)
- ✅ Latest React/Next.js versions

**Recommended Next Steps:**

1. Implement JWT tokens + HTTP-only cookies
2. Add rate limiting
3. Configure security headers
4. Set up CSRF protection
5. Add environment variable validation

Stay secure! 🔒
