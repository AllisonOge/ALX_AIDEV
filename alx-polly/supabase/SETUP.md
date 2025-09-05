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

### Option 1: Using the Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `schema.sql` from this directory
4. Paste into the SQL Editor and run the query

### Option 2: Using the Supabase CLI

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Apply the schema:
   ```bash
   supabase db push
   ```

## Step 4: Enable Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure your authentication providers (Email, OAuth, etc.)
3. Set up email templates for verification, password reset, etc.

## Step 5: Update TypeScript Types

The `types/database.ts` file contains TypeScript types that match the database schema. If you make any changes to the schema, make sure to update these types accordingly.

## Step 6: Test the Database Connection

You can test the database connection by running the application and trying to create a poll or vote on an existing poll.

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