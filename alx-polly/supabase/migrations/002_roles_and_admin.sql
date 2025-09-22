-- Add roles to users and admin helpers/policies

-- 1) Add role column to users with default 'user'
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

-- 2) Optional: index on role for quick lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- 3) Helper function to check if a user is admin
CREATE OR REPLACE FUNCTION public.is_admin(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = uid AND u.role = 'admin'
  );
$$;

-- 4) Admin bypass policies: allow admins to do anything on each table
-- Users table
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
CREATE POLICY "Admins can manage all users"
  ON public.users
  FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Polls table
DROP POLICY IF EXISTS "Admins can manage all polls" ON public.polls;
CREATE POLICY "Admins can manage all polls"
  ON public.polls
  FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Poll options table
DROP POLICY IF EXISTS "Admins can manage all poll options" ON public.poll_options;
CREATE POLICY "Admins can manage all poll options"
  ON public.poll_options
  FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Votes table
DROP POLICY IF EXISTS "Admins can manage all votes" ON public.votes;
CREATE POLICY "Admins can manage all votes"
  ON public.votes
  FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
