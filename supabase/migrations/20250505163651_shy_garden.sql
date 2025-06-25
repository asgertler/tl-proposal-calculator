/*
  # Fix Authentication Issues

  1. Changes
    - Fix user authentication triggers
    - Update email confirmation handling
    - Add proper error handling for auth failures
*/

-- Drop existing problematic triggers if they exist
DROP TRIGGER IF EXISTS on_auth_error ON auth.sessions;
DROP TRIGGER IF EXISTS on_email_confirm ON auth.users;
DROP TRIGGER IF EXISTS check_login_attempts_trigger ON auth.sessions;

-- Drop existing functions
DROP FUNCTION IF EXISTS auth.handle_auth_error();
DROP FUNCTION IF EXISTS public.update_email_confirmation();
DROP FUNCTION IF EXISTS public.check_login_attempts();

-- Create improved email confirmation function
CREATE OR REPLACE FUNCTION public.update_email_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if email is confirmed
  IF NEW.email_confirmed_at IS NOT NULL THEN
    UPDATE auth.users
    SET raw_user_meta_data = 
      COALESCE(raw_user_meta_data, '{}'::jsonb) || 
      jsonb_build_object('email_confirmed', true)
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for email confirmation
CREATE TRIGGER on_email_confirm
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_email_confirmation();

-- Create function to handle login attempts
CREATE OR REPLACE FUNCTION public.handle_login_attempt()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user metadata on login attempt
  UPDATE auth.users
  SET raw_user_meta_data = 
    COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object(
      'last_login_attempt', CURRENT_TIMESTAMP,
      'login_attempts', COALESCE((raw_user_meta_data->>'login_attempts')::int, 0)
    )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for login attempts
CREATE TRIGGER on_auth_login_attempt
  AFTER INSERT ON auth.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_login_attempt();

-- Ensure proper permissions
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO anon, authenticated;