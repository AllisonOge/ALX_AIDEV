# Setting Up Supabase Database for ALX-Polly

This guide will walk you through setting up the Supabase database for the ALX-Polly application.

## Prerequisites

1. A Supabase account and project
2. Supabase CLI (optional, for local development)

## Step 1: Create a Supabase Project

If you haven't already, create a new Supabase project:

1. Go to [https://app.supabase.io](https://app.supabase.io)
2. Click "New Project"
3. Fill in the project details and create the project

## Step 2: Set Up Environment Variables

Create or update your `.env.local` file with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 3: Apply the Database Schema

All database changes are managed using migrations in the `supabase/migrations/` directory. Do not manually apply a separate `schema.sql` file.

Option A — Automated (recommended):
- Run the guided setup that supports Local (Docker) or Remote (Production):
  ```bash
  npm run setup-db
  ```
  You can also run it non-interactively:
  ```bash
  # Local dev (Docker)
  npm run setup-db -- --env=local

  # Remote (push to linked Supabase project)
  npm run setup-db -- --env=remote --project-ref=YOUR_PROJECT_REF
  ```

Option B — Manual via Supabase CLI:
1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Link your project (remote only):
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Apply all migrations:
   ```bash
   supabase db push
   ```

This will set up your database schema according to the migration files. For reference, you can generate a full schema dump using:
```bash
supabase db dump
```

## Step 4: Enable Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure your authentication providers (Email, OAuth, etc.)
3. Set up email templates for verification, password reset, etc.

## Step 5: Update TypeScript Types

The `types/database.ts` file contains TypeScript types that match the database schema. If you make any changes to the schema, make sure to update these types accordingly.

## Step 6: Test the Database Connection

You can test the database connection by running the application and trying to create a poll or vote on an existing poll.

Tip: For local development, ensure Docker Desktop is running. The guided setup will start the local Supabase stack and reset/apply migrations.

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: If you're getting permission denied errors, check that the Row Level Security (RLS) policies are correctly set up.

2. **Type Errors**: If you're getting TypeScript errors, make sure the types in `types/database.ts` match your actual database schema.

3. **Authentication Issues**: If users can't sign in or sign up, check your authentication settings in the Supabase dashboard.

### Getting Help

If you encounter any issues, you can:

- Check the [Supabase documentation](https://supabase.io/docs)
- Join the [Supabase Discord](https://discord.supabase.com)
- Open an issue in the ALX-Polly repository