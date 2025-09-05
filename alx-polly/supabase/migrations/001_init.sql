-- Initialization migration for ALX-Polly database
-- (copied from schema.sql)

-- Create users table (this is managed by Supabase Auth, but we reference it)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create polls table
CREATE TABLE IF NOT EXISTS polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  is_public BOOLEAN DEFAULT TRUE NOT NULL,
  created_by UUID REFERENCES users(id) NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create poll options table
CREATE TABLE IF NOT EXISTS poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  -- Each user can only vote once per poll
  UNIQUE(poll_id, user_id)
);

-- Create RLS policies
-- Enable Row Level Security
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policies for polls
-- Anyone can view public polls
CREATE POLICY "Anyone can view public polls" 
  ON polls FOR SELECT 
  USING (is_public = TRUE);

-- Allow aggregate functions (e.g., COUNT, SUM) on polls for public polls
CREATE POLICY "Anyone can read public polls"
  ON polls
  FOR SELECT
  TO anon, authenticated
  USING (is_public = TRUE);

-- Allow aggregate functions for users on their own polls
CREATE POLICY "Users can read their own polls"
  ON polls
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

-- Users can view their own private polls
CREATE POLICY "Users can view their own private polls" 
  ON polls FOR SELECT 
  USING (created_by = auth.uid());

-- Users can create polls
CREATE POLICY "Users can create polls" 
  ON polls FOR INSERT 
  WITH CHECK (created_by = auth.uid());

-- Users can update their own polls
CREATE POLICY "Users can update their own polls" 
  ON polls FOR UPDATE 
  USING (created_by = auth.uid());

-- Users can delete their own polls
CREATE POLICY "Users can delete their own polls" 
  ON polls FOR DELETE 
  USING (created_by = auth.uid());

-- Policies for poll options
-- Anyone can view options for public polls
CREATE POLICY "Anyone can view options for public polls" 
  ON poll_options FOR SELECT 
  USING (
    poll_id IN (
      SELECT id FROM polls WHERE is_public = TRUE
    )
  );

-- Users can view options for their own polls
CREATE POLICY "Users can view options for their own polls" 
  ON poll_options FOR SELECT 
  USING (
    poll_id IN (
      SELECT id FROM polls WHERE created_by = auth.uid()
    )
  );

-- Users can create options for their own polls
CREATE POLICY "Users can create options for their own polls" 
  ON poll_options FOR INSERT 
  WITH CHECK (
    poll_id IN (
      SELECT id FROM polls WHERE created_by = auth.uid()
    )
  );

-- Users can update options for their own polls
CREATE POLICY "Users can update options for their own polls" 
  ON poll_options FOR UPDATE 
  USING (
    poll_id IN (
      SELECT id FROM polls WHERE created_by = auth.uid()
    )
  );

-- Users can delete options for their own polls
CREATE POLICY "Users can delete options for their own polls" 
  ON poll_options FOR DELETE 
  USING (
    poll_id IN (
      SELECT id FROM polls WHERE created_by = auth.uid()
    )
  );

-- Policies for votes
-- Anyone can view votes for public polls
CREATE POLICY "Anyone can view votes for public polls" 
  ON votes FOR SELECT 
  USING (
    poll_id IN (
      SELECT id FROM polls WHERE is_public = TRUE
    )
  );

-- Users can view votes for their own polls
CREATE POLICY "Users can view votes for their own polls" 
  ON votes FOR SELECT 
  USING (
    poll_id IN (
      SELECT id FROM polls WHERE created_by = auth.uid()
    )
  );

-- Users can vote on public polls or their own polls
CREATE POLICY "Users can vote on public polls or their own polls" 
  ON votes FOR INSERT 
  WITH CHECK (
    poll_id IN (
      SELECT id FROM polls WHERE is_public = TRUE OR created_by = auth.uid()
    ) AND user_id = auth.uid()
  );

-- Users can update their own votes
CREATE POLICY "Users can update their own votes" 
  ON votes FOR UPDATE 
  USING (user_id = auth.uid());

-- Users can delete their own votes
CREATE POLICY "Users can delete their own votes" 
  ON votes FOR DELETE 
  USING (user_id = auth.uid());

-- Create functions and triggers
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at timestamp
CREATE TRIGGER update_polls_updated_at
  BEFORE UPDATE ON polls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_poll_options_updated_at
  BEFORE UPDATE ON poll_options
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_votes_updated_at
  BEFORE UPDATE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create function to get total votes for a poll
CREATE OR REPLACE FUNCTION get_poll_total_votes(poll_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total INTEGER;
BEGIN
  SELECT COUNT(*) INTO total FROM votes WHERE votes.poll_id = $1;
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Create function to get votes for a poll option
CREATE OR REPLACE FUNCTION get_option_votes(option_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total INTEGER;
BEGIN
  SELECT COUNT(*) INTO total FROM votes WHERE votes.option_id = $1;
  RETURN total;
END;
$$ LANGUAGE plpgsql;
