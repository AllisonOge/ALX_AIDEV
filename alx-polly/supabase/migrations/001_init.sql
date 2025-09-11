-- Initialization migration for ALX-Polly database

CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  is_public BOOLEAN DEFAULT TRUE NOT NULL,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  -- Each user can only vote once per poll
  UNIQUE(poll_id, user_id)
);

-- Enable Row Level Security for all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Policies for users
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (id = auth.uid());

-- Users can delete their own profile
CREATE POLICY "Users can delete their own profile"
  ON public.users FOR DELETE
  USING (id = auth.uid());

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (id = auth.uid());
-- Anyone can view public polls
CREATE POLICY "Anyone can view public polls" 
  ON public.polls FOR SELECT 
  USING (is_public = TRUE);

-- Allow aggregate functions (e.g., COUNT, SUM) on polls for public polls
CREATE POLICY "Anyone can read public polls"
  ON public.polls
  FOR SELECT
  TO anon, authenticated
  USING (is_public = TRUE);

-- Allow aggregate functions for users on their own polls
CREATE POLICY "Users can read their own polls"
  ON public.polls
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

-- Users can view their own private polls
CREATE POLICY "Users can view their own private polls" 
  ON public.polls FOR SELECT 
  USING (created_by = auth.uid());

-- Users can create polls
CREATE POLICY "Users can create polls" 
  ON public.polls FOR INSERT 
  WITH CHECK (created_by = auth.uid());

-- Users can update their own polls
CREATE POLICY "Users can update their own polls" 
  ON public.polls FOR UPDATE 
  USING (created_by = auth.uid());

-- Users can delete their own polls
CREATE POLICY "Users can delete their own polls" 
  ON public.polls FOR DELETE 
  USING (created_by = auth.uid());

-- Policies for poll options
-- Anyone can view options for public polls
CREATE POLICY "Anyone can view options for public polls" 
  ON public.poll_options FOR SELECT 
  USING (
    poll_id IN (
      SELECT id FROM public.polls WHERE is_public = TRUE
    )
  );

-- Users can view options for their own polls
CREATE POLICY "Users can view options for their own polls" 
  ON public.poll_options FOR SELECT 
  USING (
    poll_id IN (
      SELECT id FROM public.polls WHERE created_by = auth.uid()
    )
  );

-- Users can create options for their own polls
CREATE POLICY "Users can create options for their own polls" 
  ON public.poll_options FOR INSERT 
  WITH CHECK (
    poll_id IN (
      SELECT id FROM public.polls WHERE created_by = auth.uid()
    )
  );

-- Users can update options for their own polls
CREATE POLICY "Users can update options for their own polls" 
  ON public.poll_options FOR UPDATE 
  USING (
    poll_id IN (
      SELECT id FROM public.polls WHERE created_by = auth.uid()
    )
  );

-- Users can delete options for their own polls
CREATE POLICY "Users can delete options for their own polls" 
  ON public.poll_options FOR DELETE 
  USING (
    poll_id IN (
      SELECT id FROM public.polls WHERE created_by = auth.uid()
    )
  );

-- Policies for votes
-- Anyone can view votes for public polls
CREATE POLICY "Anyone can view votes for public polls" 
  ON public.votes FOR SELECT 
  USING (
    poll_id IN (
      SELECT id FROM public.polls WHERE is_public = TRUE
    )
  );

-- Users can view votes for their own polls
CREATE POLICY "Users can view votes for their own polls" 
  ON public.votes FOR SELECT 
  USING (
    poll_id IN (
      SELECT id FROM public.polls WHERE created_by = auth.uid()
    )
  );

-- Users can vote on public polls or their own polls
CREATE POLICY "Users can vote on public polls or their own polls" 
  ON public.votes FOR INSERT 
  WITH CHECK (
    poll_id IN (
      SELECT id FROM public.polls WHERE is_public = TRUE OR created_by = auth.uid()
    ) AND user_id = auth.uid()
  );

-- Users can update their own votes
CREATE POLICY "Users can update their own votes" 
  ON public.votes FOR UPDATE 
  USING (user_id = auth.uid());

-- Users can delete their own votes
CREATE POLICY "Users can delete their own votes" 
  ON public.votes FOR DELETE 
  USING (user_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$;

-- Triggers to update updated_at timestamp
CREATE TRIGGER update_polls_updated_at
  BEFORE UPDATE ON public.polls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_poll_options_updated_at
  BEFORE UPDATE ON public.poll_options
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_votes_updated_at
  BEFORE UPDATE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Create function to get total votes for a poll
CREATE OR REPLACE FUNCTION public.get_poll_total_votes(poll_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
  total INTEGER;
BEGIN
  SELECT COUNT(*) INTO total FROM public.votes v WHERE v.poll_id = $1;
  RETURN total;
END;
$$;

-- Create function to get votes for a poll option
CREATE OR REPLACE FUNCTION public.get_option_votes(option_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
  total INTEGER;
BEGIN
  SELECT COUNT(*) INTO total FROM public.votes v WHERE v.option_id = $1;
  RETURN total;
END;
$$;
