# Val Store - Development Setup Guide

**Last Updated:** 2025-12-30

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ ([download](https://nodejs.org))
- **pnpm** 8+ (`npm install -g pnpm`)
- **PostgreSQL** 15+ ([download](https://postgresql.org) or use Docker)
- **Git**

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-org/val-store.git
cd val-store

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local
```

---

## ⚙️ Environment Configuration

Edit `.env.local`:

```env
# Database (required)
DATABASE_URL="postgresql://user:password@localhost:5432/val_store"

# Better Auth (required)
BETTER_AUTH_SECRET="your-secret-key-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"

# Email - Resend (optional for dev)
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="Val Store <noreply@valstore.com>"

# File Uploads - Uploadthing (optional)
UPLOADTHING_SECRET="sk_live_xxxx"
UPLOADTHING_APP_ID="xxxx"

# OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Val Store"
```

---

## 🗄️ Database Setup

### Option 1: Local PostgreSQL

```bash
# Create database
createdb val_store

# Push schema to database
pnpm db:push

# (Optional) Open Drizzle Studio
pnpm db:studio
```

### Option 2: Docker

```bash
# Start PostgreSQL in Docker
docker run -d \
  --name val-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=val_store \
  -p 5432:5432 \
  postgres:15

# Then push schema
pnpm db:push
```

---

## 🌱 Seeding Data

```bash
# Basic seed (categories, products)
pnpm seed:basic

# Full seed (include orders, customers)
pnpm seed
```

---

## 🏃 Running the App

```bash
# Development server
pnpm dev

# The app will be available at:
# http://localhost:3000        - Storefront
# http://localhost:3000/login  - Login
# http://localhost:3000/dashboard - Admin (requires admin account)
```

---

## 👤 Creating an Admin Account

1. Sign up at `/signup`
2. Verify your email
3. Update your role in the database:

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE user_id = (SELECT id FROM "user" WHERE email = 'your@email.com');
```

Or using Drizzle Studio:

```bash
pnpm db:studio
# Navigate to user_profiles table and update role
```

---

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin pages
│   ├── (auth)/            # Login/signup
│   ├── (main)/            # Customer pages
│   └── api/               # API routes
├── application/           # Use cases & DI
├── components/            # React components
├── db/                    # Database schema
├── domain/                # Business logic
├── infrastructure/        # Repositories
├── lib/                   # Utilities
└── server/                # tRPC routers
```

---

## 🧪 Running Tests

```bash
# Unit tests (when implemented)
pnpm test

# Type checking
pnpm type-check

# Linting
pnpm lint
```

---

## 🔧 Useful Commands

| Command            | Description             |
| ------------------ | ----------------------- |
| `pnpm dev`         | Start dev server        |
| `pnpm build`       | Production build        |
| `pnpm start`       | Start production server |
| `pnpm lint`        | Run ESLint              |
| `pnpm type-check`  | TypeScript check        |
| `pnpm db:push`     | Push schema to DB       |
| `pnpm db:generate` | Generate migrations     |
| `pnpm db:migrate`  | Run migrations          |
| `pnpm db:studio`   | Open Drizzle Studio     |
| `pnpm seed`        | Seed database           |

---

## 🌐 Key URLs (Development)

| URL                               | Purpose        |
| --------------------------------- | -------------- |
| `http://localhost:3000`           | Storefront     |
| `http://localhost:3000/dashboard` | Admin panel    |
| `http://localhost:3000/login`     | Login page     |
| `http://localhost:3000/signup`    | Registration   |
| `https://local.drizzle.studio`    | Drizzle Studio |

---

## 📚 Tech Stack References

- [Next.js 14 Docs](https://nextjs.org/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Better Auth Docs](https://www.better-auth.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🐛 Common Issues

### Database Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:** Ensure PostgreSQL is running and `DATABASE_URL` is correct.

### Session Cookie Not Set

```
Error: UNAUTHORIZED
```

**Solution:** Check `BETTER_AUTH_URL` matches your dev URL.

### Email Not Sending

**Solution:** Check `RESEND_API_KEY` is set. In dev, emails are logged to console.

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes with proper commits
3. Run `pnpm lint` and `pnpm type-check`
4. Open a pull request

---

_Development Guide created by Senior Full-Stack Developer_
