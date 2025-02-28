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

This application is configured for deployment on Vercel with Neon Postgres database. Follow these steps to deploy:

1. Push your code to a GitHub repository

2. Connect your GitHub repository to Vercel:
   - Sign up or log in to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository you want to deploy

3. Configure the project:
   - Vercel should automatically detect the project as a Vite + Node.js application
   - The build settings should be automatically configured based on the `vercel.json` file

4. Set up Neon Postgres:
   - Sign up for a free account at [Neon](https://neon.tech)
   - Create a new project
   - Create a new database
   - Get your connection string from the Neon dashboard
   - In the Vercel dashboard, go to your project settings
   - Navigate to the "Environment Variables" tab
   - Add the connection string as `POSTGRES_URL`

5. Set up additional environment variables:
   - In the Vercel dashboard, go to your project settings
   - Navigate to the "Environment Variables" tab
   - Add the following environment variables:
     ```
     NODE_ENV=production
     ADMIN_USERNAME=your-admin-username
     ADMIN_PASSWORD=your-secure-admin-password
     VITE_ADMIN_EMAIL=your-admin-email
     VITE_ADMIN_PASSWORD=your-admin-password
     ```
   - Make sure to use secure values for the passwords

6. Deploy the application:
   - Click "Deploy"
   - Vercel will build and deploy your application

7. Migrate existing data (optional):
   - If you have existing data in your local SQLite database that you want to migrate to Neon Postgres:
   - Get your Postgres connection string from the Neon dashboard
   - Create a `.env.production` file locally with the Postgres connection string:
     ```
     NODE_ENV=production
     POSTGRES_URL=your_postgres_connection_string
     ```
   - Run the migration script:
     ```
     node migrate-data.js
     ```
   - This will copy all incidents from your local SQLite database to Neon Postgres
   - Note: The `.env.production` file is in `.gitignore` to prevent sensitive information from being committed

8. Custom Domain (Optional):
   - In the Vercel dashboard, go to your project settings
   - Navigate to the "Domains" tab
   - Add your custom domain and follow the instructions to configure DNS settings 