# Setting Up Safe Street with PlanetScale

This guide will help you set up the Safe Street project with PlanetScale as the database provider.

## Prerequisites

- Node.js 18+ installed
- npm or yarn installed
- A PlanetScale account

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd safe-street
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Set Up PlanetScale

1. Create a PlanetScale account at [planetscale.com](https://planetscale.com/)
2. Create a new database (e.g., `safe-street`)
3. Create a new branch (e.g., `main`)
4. Get your connection string from the "Connect" button in the PlanetScale dashboard
5. Select "Prisma" as the connection type to get the correct format

## Step 4: Configure Environment Variables

1. Create a `.env.local` file in the root of the project
2. Add your PlanetScale connection string:

```
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/database-name?sslaccept=strict"
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
- Push your schema to PlanetScale
- Generate the Prisma client
- Seed the database with initial data

## Step 6: Start the Development Server

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push your code to GitHub
2. Create a new project in Vercel
3. Connect it to your GitHub repository
4. Add the following environment variables in Vercel:
   - `DATABASE_URL`: Your PlanetScale connection string
   - `ADMIN_USERNAME`: Admin username
   - `ADMIN_PASSWORD`: Admin password
   - `NEXT_PUBLIC_APP_URL`: Your production URL

Vercel will automatically build and deploy your application. The Prisma client will be generated during the build process, and your database schema will be ready to use. 