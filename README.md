# Rua Segura

A community-driven platform for reporting and tracking safety incidents in Porto, Portugal.

## Features

- Report safety incidents in different neighborhoods
- View incident reports on a map and in a list
- Admin panel for managing and moderating incident reports
- Authentication system for admin access

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the environment variables template:
   ```
   cp .env.example .env
   ```
4. Update the `.env` file with your admin credentials:
   ```
   VITE_ADMIN_EMAIL=your-email@example.com
   VITE_ADMIN_PASSWORD=your-secure-password
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

The application uses the following environment variables:

- `VITE_ADMIN_EMAIL`: Email address for admin login
- `VITE_ADMIN_PASSWORD`: Password for admin login
- `ADMIN_USERNAME`: Username for API basic authentication (used in production)
- `ADMIN_PASSWORD`: Password for API basic authentication (used in production)

These variables are used for authentication in the admin panel. In a production environment, you should implement a more secure authentication system.

## Authentication

The application includes a simple authentication system for the admin panel. To access the admin panel:

1. Click on the "Login" link in the header
2. Enter the admin credentials from your `.env` file
3. After successful login, you'll be redirected to the admin panel

## Development

This project is built with:

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components 

## Deployment to Vercel

This application is configured to be deployed on Vercel with support for the custom domain www.ruasegura.pt.

### Prerequisites

1. A Vercel account
2. A PostgreSQL database (Vercel Postgres, Neon, Supabase, etc.)
3. Domain ownership of ruasegura.pt

### Deployment Steps

1. **Connect your GitHub repository to Vercel**:
   - Go to [Vercel](https://vercel.com) and sign in
   - Click "Add New" > "Project"
   - Select your repository and click "Import"

2. **Configure environment variables**:
   - In the Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     ```
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD=your_secure_password
     VITE_ADMIN_EMAIL=your_admin_email
     VITE_ADMIN_PASSWORD=your_secure_admin_password
     NODE_ENV=production
     ```
   - The PostgreSQL connection variables will be automatically added if you use Vercel Postgres

3. **Set up the custom domain**:
   - In your Vercel project, go to "Settings" > "Domains"
   - Add your domain: www.ruasegura.pt
   - Follow Vercel's instructions to configure your DNS settings
   - Optionally, add the apex domain (ruasegura.pt) and configure a redirect to www.ruasegura.pt

4. **Deploy your application**:
   - Vercel will automatically deploy your application when you push to your repository
   - You can also manually trigger a deployment from the Vercel dashboard

### Local Development with PostgreSQL

The application is now configured to use PostgreSQL in both development and production environments.

1. **Set up a local PostgreSQL database**:
   - Install PostgreSQL on your machine or use a Docker container
   - Create a database named `safestreet`

2. **Configure your local environment**:
   - Update the `.env` file with your PostgreSQL connection details:
     ```
     DEV_POSTGRES_URL=postgresql://postgres:your_password@localhost:5432/safestreet
     DEV_POSTGRES_SSL=false
     ```

3. **Run the application**:
   ```
   npm install
   npm run dev
   ```

## Features

- Report street incidents
- Admin dashboard to manage incidents
- Responsive design
- Secure authentication

## Migration from SQLite to PostgreSQL

If you have existing data in your local SQLite database that you want to migrate to Vercel Postgres, follow these steps:

1. Get your Postgres connection string from the Vercel dashboard (Storage → Your Database → .env.local tab)
2. Create a `.env.production` file locally with the Postgres connection string:
   ```
   NODE_ENV=production
   POSTGRES_URL=your_postgres_connection_string
   ```
3. Run the migration script:
   ```
   node migrate-data.js
   ```
4. This will copy all incidents from your local SQLite database to Vercel Postgres
5. Note: The `.env.production` file is in `.gitignore` to prevent sensitive information from being committed

## Custom Domain (Optional)

In the Vercel dashboard, go to your project settings
Navigate to the "Domains" tab
Add your custom domain and follow the instructions to configure DNS settings 