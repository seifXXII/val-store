# Database Setup Guide

## 🗄️ Setting up NeonDB with Drizzle ORM

### Step 1: Create a NeonDB Account and Database

1. **Sign up for NeonDB**

   - Go to [https://neon.tech](https://neon.tech)
   - Click "Sign Up" and create an account (you can use GitHub, Google, or email)

2. **Create a New Project**

   - Once logged in, click "New Project"
   - Give your project a name (e.g., "clothing-brand-store")
   - Select a region (choose the one closest to your users for better performance)
   - Click "Create Project"

3. **Get Your Connection String**

   - After creating the project, you'll see your project dashboard
   - Click on "Connection Details" or look for "Connection String"
   - You'll see two connection string options:
     - **Pooled connection** (recommended for serverless/edge environments)
     - **Direct connection** (for traditional server environments)
   - **Select "Pooled connection"** and copy the connection string

4. **Connection String Format**

   ```
   postgresql://[username]:[password]@[host].neon.tech/[database]?sslmode=require
   ```

   Example:

   ```
   postgresql://myuser:AbCdEf123456@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Step 2: Configure Environment Variables

1. **Create a `.env` file** in your project root (it's gitignored, so safe for secrets):

   ```bash
   # In the clothing-brand-project directory
   touch .env
   ```

2. **Add your database connection string** to `.env`:

   ```env
   DATABASE_URL="postgresql://[your-connection-string-here]"
   NODE_ENV="development"
   ```

   Replace `[your-connection-string-here]` with the actual connection string from NeonDB.

### Step 3: Install Required Dependencies

Run the following commands in your project directory:

```bash
# Install Drizzle ORM and PostgreSQL driver
npm install drizzle-orm postgres

# Install Drizzle Kit (development dependency for migrations)
npm install -D drizzle-kit

# Install dotenv for environment variables
npm install dotenv

# Install types for Node.js
npm install -D @types/node
```

### Step 4: Initialize Drizzle

The Drizzle schema files have been created in the `src/db` directory:

- `src/db/schema.ts` - Database schema definitions
- `src/db/index.ts` - Database connection and client
- `drizzle.config.ts` - Drizzle Kit configuration

### Step 5: Run Migrations

1. **Generate migration files:**

   ```bash
   npm run db:generate
   ```

2. **Apply migrations to the database:**

   ```bash
   npm run db:migrate
   ```

3. **Open Drizzle Studio to view your database (optional):**
   ```bash
   npm run db:studio
   ```

### Step 6: Verify the Setup

After running migrations, you should see all the tables created in your NeonDB dashboard:

- users
- addresses
- categories
- products
- product_variants
- product_images
- orders
- order_items
- cart_items
- wishlist
- reviews
- coupons
- payments
- inventory_logs

## 📝 Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

## 🔒 Security Notes

- ✅ Never commit your `.env` file to git (it's already in .gitignore)
- ✅ Use environment variables for all sensitive data
- ✅ Use different databases for development, staging, and production
- ✅ Enable SSL mode for database connections (already included in NeonDB connection strings)

## 📚 Next Steps

After setting up the database:

1. Implement authentication (see `02-authentication.md`)
2. Create API endpoints (see `05-api-endpoints.md`)
3. Build admin features (see `03-admin-features.md`)
4. Develop customer-facing pages (see `04-customer-pages.md`)

## 🆘 Troubleshooting

### Connection Issues

- Make sure your IP address is allowed (NeonDB allows all IPs by default)
- Verify the connection string is correct
- Check if `sslmode=require` is in the connection string

### Migration Issues

- Ensure `DATABASE_URL` is set in your `.env` file
- Make sure you're running commands from the project root
- Check that all dependencies are installed

### Common Errors

- **"relation already exists"**: Run `npm run db:push` to sync without generating new migrations
- **"connection refused"**: Check your internet connection and DATABASE_URL
- **"authentication failed"**: Verify your username and password in the connection string
