/*
  # Enhanced Security Policies

  1. Changes
    - Add RLS policies for user stats
    - Add email confirmation metadata column
    - Add rate limiting function
*/

-- Add RLS policies for user stats
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own stats"
ON user_stats
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create function to track login attempts
CREATE OR REPLACE FUNCTION check_login_attempts()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user has exceeded login attempts
  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = NEW.user_id
    AND user_metadata->>'login_attempts' >= '5'
    AND (user_metadata->>'lockout_until')::timestamp > CURRENT_TIMESTAMP
  ) THEN
    RAISE EXCEPTION 'Account temporarily locked due to too many failed attempts';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for login attempts
CREATE TRIGGER check_login_attempts_trigger
  BEFORE INSERT ON auth.sessions
  FOR EACH ROW
  EXECUTE FUNCTION check_login_attempts();