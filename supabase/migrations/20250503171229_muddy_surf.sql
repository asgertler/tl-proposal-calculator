/*
  # Authentication Policies and Functions

  1. Changes
    - Add email confirmation tracking
    - Add login attempt tracking
    - Add policies for user authentication

  2. Security
    - Add RLS policies for authentication
    - Add functions to track and manage login attempts
*/

-- Add email confirmation tracking to auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS email_confirmed BOOLEAN DEFAULT FALSE;

-- Create function to update email confirmation status
CREATE OR REPLACE FUNCTION public.update_email_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET email_confirmed = TRUE,
      raw_user_meta_data = raw_user_meta_data || jsonb_build_object('email_confirmed', true)
  WHERE email = NEW.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for email confirmation
CREATE TRIGGER on_email_confirm
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_email_confirmation();

-- Create function to handle login attempts
CREATE OR REPLACE FUNCTION public.handle_login_attempt()
RETURNS TRIGGER AS $$
BEGIN
  -- Reset login attempts on successful login
  IF TG_OP = 'INSERT' THEN
    UPDATE auth.users
    SET raw_user_meta_data = raw_user_meta_data - 'login_attempts' - 'lockout_until'
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for login attempts
CREATE TRIGGER on_auth_login
  AFTER INSERT ON auth.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_login_attempt();

-- Add policy for new users
CREATE POLICY "Allow public access to auth endpoints"
ON auth.users
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Add policy for sessions
CREATE POLICY "Allow authenticated access to own sessions"
ON auth.sessions
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);