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

1. Create a `.env.local` file in the root of the project
2. Add your Nile PostgreSQL connection string (you can get this from your Vercel dashboard):

```
DATABASE_URL="postgresql://username:password@db.thenile.dev:5432/database-name?sslmode=require"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="safestreet"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Step 5: Set Up the Database

Run the database setup script:

```bash
npm run setup:db
```

This will:
- Generate the Prisma client
- Create and apply migrations
- Seed the database with initial data

## Step 6: Start the Development Server

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## Working with Migrations

### Creating Migrations

When you make changes to your Prisma schema, you need to create a new migration:

```bash
npm run migrate:dev
```

This will:
- Generate a new migration based on your schema changes
- Apply the migration to your local database

### Deploying Migrations

To deploy migrations to your production database:

```bash
npm run migrate:deploy
```

This will apply all pending migrations to your production database.

## Deploying to Vercel

1. Push your code to GitHub
2. Create a new project in Vercel (if you haven't already)
3. Connect it to your GitHub repository
4. Make sure the Nile PostgreSQL integration is connected to your project
5. Vercel will automatically build and deploy your application

The build process will:
1. Generate the Prisma client
2. Apply any pending migrations to your Nile PostgreSQL database
3. Build your Next.js application

## Nile PostgreSQL Features

Nile PostgreSQL offers several features that can be useful for your application:

1. **Tenant Isolation**: Nile provides built-in tenant isolation, which can be useful if you plan to expand your application to serve multiple municipalities or organizations.

2. **Virtual Tenants**: You can create virtual tenants for each freguesia or district, allowing you to isolate data by region.

3. **User Management**: Nile includes built-in user management features that you can leverage for authentication.

4. **Permissions**: Nile provides fine-grained permissions that you can use to control access to your data.

For more information on these features, check out the [Nile PostgreSQL documentation](https://www.thenile.dev/docs). 