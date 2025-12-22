# Development Tooling Setup Guide

This guide covers the development tools configured for the Val Store project.

## 🔧 Tools Overview

We use three main development tools to ensure code quality and consistency:

1. **Husky** - Pre-commit hooks
2. **GitHub Actions** - CI/CD pipeline
3. **Docker Compose** - Local development environment

---

## 🪝 Husky & Pre-commit Hooks

Husky runs automated checks before you commit code.

### What Gets Checked

**Before commit:**

- ESLint fixes and checks TypeScript/JavaScript files
- Prettier formats all code files
- Only staged files are checked (fast!)

**On commit message:**

- Validates commit message follows [Conventional Commits](https://www.conventionalcommits.org/)

### Commit Message Format

```
type(scope): Subject

Body (optional)

Footer (optional)
```

**Valid types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes

**Examples:**

```bash
# Good ✅
git commit -m "feat: Add product search functionality"
git commit -m "fix: Resolve cart calculation bug"
git commit -m "docs: Update API documentation"

# Bad ❌
git commit -m "fixed stuff"
git commit -m "WIP"
git commit -m "Update"
```

### Bypass Hooks (Emergency Only)

```bash
git commit --no-verify -m "emergency fix"
```

⚠️ **Only use this in emergencies!** The CI pipeline will still run the checks.

---

## 🚀 GitHub Actions CI/CD

Automated checks run on every push and pull request.

### What Runs in CI

1. **ESLint** - Code quality checks
2. **TypeScript** - Type checking
3. **Build** - Ensures project builds successfully

### Required Secrets

Add these in GitHub repo settings (`Settings > Secrets > Actions`):

- `DATABASE_URL` - Production database URL
- `BETTER_AUTH_SECRET` - Auth secret key

### Workflow Files

- `.github/workflows/ci.yml` - Main CI pipeline

### View Results

- Check the "Actions" tab in GitHub
- Failed checks will block PR merges
- Fix issues locally and push again

---

## 🐳 Docker Compose

Run the entire development environment with Docker.

### Services Included

| Service    | Port | Description            |
| ---------- | ---- | ---------------------- |
| PostgreSQL | 5432 | Main database          |
| Redis      | 6379 | Caching (future)       |
| pgAdmin    | 5050 | Database management UI |

### Quick Start

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v
```

### Database Connection

**Using Docker PostgreSQL:**

```env
DATABASE_URL=postgresql://valstore:dev_password_change_in_production@localhost:5432/val_store_dev
```

**Access pgAdmin:**

- URL: http://localhost:5050
- Email: `admin@valstore.local`
- Password: `admin`

### Switching Between NeonDB and Docker

**Development (Docker):**

```bash
# In .env.local
DATABASE_URL=postgresql://valstore:dev_password_change_in_production@localhost:5432/val_store_dev
```

**Production (NeonDB):**

```bash
# In .env
DATABASE_URL=your_neon_database_url
```

---

## 📋 Development Workflow

### Initial Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Initialize Husky (already done with prepare script)
pnpm prepare

# 3. Start Docker services (optional - or use NeonDB)
docker-compose up -d

# 4. Run database migrations
pnpm db:push

# 5. Start development server
pnpm dev
```

### Daily Workflow

```bash
# Start Docker (if using local DB)
docker-compose up -d

# Start dev server
pnpm dev

# Before committing, manually check:
pnpm lint          # Run linting
pnpm type-check    # Check types
pnpm build         # Test build

# Commit (hooks run automatically)
git add .
git commit -m "feat: Your change description"
git push
```

### Useful Commands

```bash
# Database
pnpm db:studio              # Open Drizzle Studio
pnpm db:push                # Sync schema to DB
pnpm db:generate            # Generate migrations

# Code Quality
pnpm lint                   # Run ESLint
pnpm type-check             # TypeScript checks
pnpm build                  # Build for production

# Docker
docker-compose ps           # View running services
docker-compose restart      # Restart all services
docker-compose logs -f app  # Follow logs for specific service
```

---

## 🔧 Troubleshooting

### Husky hooks not running

```bash
# Reinitialize Husky
pnpm prepare
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Docker database connection issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# View PostgreSQL logs
docker-compose logs postgres
```

### CI pipeline failing

1. Run checks locally first:
   ```bash
   pnpm lint
   pnpm type-check
   pnpm build
   ```
2. Fix any errors
3. Commit and push again

### Commit message rejected

Make sure your commit message follows this format:

```
type: Subject starts with lowercase
```

Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`

---

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [lint-staged](https://github.com/okonet/lint-staged)

---

## 🎯 Next Steps

After setting up these tools:

1. ✅ Make your first commit to test Husky
2. ✅ Push to GitHub to trigger CI
3. ✅ Try using Docker Compose for local development
4. ✅ Add unit tests and integrate into CI
5. ✅ Set up staging deployment workflow

---

**Last Updated:** December 22, 2025
