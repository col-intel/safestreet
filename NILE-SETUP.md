# Setting Up Safe Street with Nile PostgreSQL

This guide will help you set up the Safe Street project with Nile PostgreSQL as the database provider.

## Prerequisites

- Node.js 18+ installed
- npm or yarn installed
- A Vercel account with Nile PostgreSQL integration

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd safe-street
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Set Up Nile PostgreSQL on Vercel

1. Go to your Vercel dashboard
2. Navigate to the Storage section
3. Add a new Nile PostgreSQL database
4. Connect it to your project
5. Vercel will automatically add the `DATABASE_URL` environment variable to your project

## Step 4: Configure Local Environment Variables

1. Create a `.env.local` file in the root of the project (for local development only)
2. Add your Nile PostgreSQL connection string (you can get this from your Vercel dashboard):

```
DATABASE_URL="postgresql://username:password@db.thenile.dev:5432/database-name?tenant=default&sslmode=require"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="safestreet"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Important**: 
- Make sure to include the `tenant=default` parameter in your connection string. This is required for Nile PostgreSQL to work properly.
- Do not create a `.env.production` file. For production, set environment variables directly in the Vercel dashboard.

## Step 5: Test the Database Connection

Before setting up the database, test the connection to make sure it's working:

```bash
npm run test:connection
```

If the connection is successful, you should see a message indicating that the connection was successful.

## Step 6: Set Up the Database

Run the Nile-specific database setup script:

```bash
npm run setup:nile
```

This will:
- Generate the Prisma client
- Create the database schema using `prisma db push`
- Seed the database with initial data

## Step 7: Start the Development Server

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## Working with Nile PostgreSQL

### Understanding Tenants

Nile PostgreSQL is designed for multi-tenant applications. Each tenant has its own isolated data. In our application, we're using a default tenant for simplicity, but you can create multiple tenants if needed.

To specify a tenant when connecting to the database, you need to include the `tenant` parameter in your connection string:

```
DATABASE_URL="postgresql://username:password@db.thenile.dev:5432/database-name?tenant=tenant-id&sslmode=require"
```

### Schema Changes

When you make changes to your Prisma schema, you need to push those changes to the database:

```bash
npx prisma db push
```

This will update the database schema without creating migrations.

### Deploying to Vercel

1. Push your code to GitHub
2. Create a new project in Vercel (if you haven't already)
3. Connect it to your GitHub repository
4. Make sure the Nile PostgreSQL integration is connected to your project
5. Set up environment variables in the Vercel dashboard:
   - `DATABASE_URL` (automatically set by Nile PostgreSQL integration)
   - `ADMIN_USERNAME` and `ADMIN_PASSWORD` for authentication
   - `NEXT_PUBLIC_APP_URL` with your production URL

The build process will:
1. Generate the Prisma client
2. Push the schema to your Nile PostgreSQL database
3. Build your Next.js application

## Troubleshooting

### "Tenant or user not found" Error

If you encounter a "Tenant or user not found" error, it means that the tenant specified in your connection string doesn't exist or you haven't included the tenant parameter.

To fix this:
1. Make sure your connection string includes the `tenant=default` parameter
2. If you're using a custom tenant, make sure it exists in your Nile PostgreSQL database

### Connection Issues

If you're having trouble connecting to the database:
1. Run `npm run test:connection` to test the connection
2. Check your connection string to make sure it's correct
3. Make sure your Nile PostgreSQL database is properly set up in Vercel

## Nile PostgreSQL Features

Nile PostgreSQL offers several features that can be useful for your application:

1. **Tenant Isolation**: Nile provides built-in tenant isolation, which can be useful if you plan to expand your application to serve multiple municipalities or organizations.

2. **Virtual Tenants**: You can create virtual tenants for each freguesia or district, allowing you to isolate data by region.

3. **User Management**: Nile includes built-in user management features that you can leverage for authentication.

4. **Permissions**: Nile provides fine-grained permissions that you can use to control access to your data.

For more information on these features, check out the [Nile PostgreSQL documentation](https://www.thenile.dev/docs). 