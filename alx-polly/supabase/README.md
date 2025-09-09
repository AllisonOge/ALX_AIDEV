# Supabase Database Schema for ALX-Polly

This directory contains the database schema for the ALX-Polly application. The schema defines the structure of the database tables, relationships, and security policies for the polls and votes functionality.

## Schema Overview

The database schema consists of the following tables:

1. **users** - Managed by Supabase Auth, extended with additional fields
2. **polls** - Stores poll questions and metadata
3. **poll_options** - Stores options for each poll
4. **votes** - Records user votes for poll options

## Row Level Security (RLS) Policies

The schema includes Row Level Security policies to ensure data security:

- Public polls are visible to everyone
- Private polls are only visible to their creators
- Users can only create, update, and delete their own polls and options
- Users can vote on public polls or their own polls
- Users can only update or delete their own votes

## Helper Functions

The schema includes helper functions:

- `update_updated_at()` - Automatically updates the `updated_at` timestamp
- `get_poll_total_votes()` - Calculates the total votes for a poll
- `get_option_votes()` - Calculates the votes for a specific poll option


## How to Apply the Schema

### Prerequisites for Local Development

1. **Install Docker Desktop**
   - Download and install Docker Desktop from [https://docs.docker.com/desktop](https://docs.docker.com/desktop)
   - Start Docker Desktop and ensure it is running

2. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

3. **Start Supabase Local Stack**
   ```bash
   npx supabase start
   ```
   This will start the local Supabase services (database, API, etc.) using Docker.

### Option 1: Using Supabase CLI

1. Link your project (if not already linked):
   ```bash
   supabase link --project-ref your-project-ref
   ```

2. Apply the schema:
   ```bash
   supabase db push
   ```

3. To reset the local database (for development):
   ```bash
   supabase db reset
   ```

### Option 2: Using npm scripts

1. Set your Supabase project URL and service key as environment variables:
   ```powershell
   $env:SUPABASE_URL="<your-supabase-url>"
   $env:SUPABASE_KEY="<your-service-role-key>"
   ```

2. To print the schema and guide for setup, run:
   ```powershell
   npm run setup-db
   ```

3. To apply migrations (prints each migration SQL):
   ```powershell
   npm run setup-db
   ```

4. To check backend connectivity and required tables:
   ```powershell
   npm run check-backend
   ```

5. To seed the database with initial data, run:
   ```powershell
   npm run seed-db
   ```

> **Note:** The setup script processes all SQL files in `supabase/migrations/` in order. Actual schema changes must be applied via Supabase CLI or dashboard. The backend check script verifies connection and table existence.
> The seed script inserts example data into the `polls` table. Edit `seed-db.js` to customize seeding as needed.

### Option 3: Using Supabase Dashboard

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `schema.sql`
4. Paste into the SQL Editor and run the query

## Data Model

### Users
- `id`: UUID (Primary Key, references auth.users)
- `name`: TEXT
- `email`: TEXT (Unique, Not Null)
- `created_at`: TIMESTAMP WITH TIME ZONE
- `updated_at`: TIMESTAMP WITH TIME ZONE

### Polls
- `id`: UUID (Primary Key)
- `question`: TEXT (Not Null)
- `is_active`: BOOLEAN (Default: TRUE)
- `is_public`: BOOLEAN (Default: TRUE)
- `created_by`: UUID (References users.id)
- `end_date`: TIMESTAMP WITH TIME ZONE
- `created_at`: TIMESTAMP WITH TIME ZONE
- `updated_at`: TIMESTAMP WITH TIME ZONE

### Poll Options
- `id`: UUID (Primary Key)
- `poll_id`: UUID (References polls.id)
- `text`: TEXT (Not Null)
- `created_at`: TIMESTAMP WITH TIME ZONE
- `updated_at`: TIMESTAMP WITH TIME ZONE

### Votes
- `id`: UUID (Primary Key)
- `poll_id`: UUID (References polls.id)
- `option_id`: UUID (References poll_options.id)
- `user_id`: UUID (References users.id)
- `created_at`: TIMESTAMP WITH TIME ZONE
- `updated_at`: TIMESTAMP WITH TIME ZONE
- Unique constraint on (poll_id, user_id) to ensure one vote per poll per user
