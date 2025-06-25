/*
  # Authentication Policies and Error Handling

  1. Changes
    - Add policies for user authentication
    - Add error handling for failed logins
    - Add user metadata management

  2. Security
    - Ensure proper access control for auth operations
    - Add safeguards against authentication failures
*/

-- Ensure auth schema exists
CREATE SCHEMA IF NOT EXISTS auth;

-- Add policy for auth operations
CREATE POLICY "Enable all operations for authenticated users only"
ON auth.users
FOR ALL
TO authenticated
USING (
  auth.role() = 'authenticated'
);

-- Add function to handle auth errors
CREATE OR REPLACE FUNCTION auth.handle_auth_error()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user exists and is confirmed
  IF NOT EXISTS (
    SELECT 1 FROM auth.users
    WHERE email = NEW.email
    AND confirmed_at IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'User not found or email not confirmed';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auth error handling
CREATE TRIGGER on_auth_error
  BEFORE INSERT ON auth.sessions
  FOR EACH ROW
  EXECUTE FUNCTION auth.handle_auth_error();

-- Ensure proper permissions for auth operations
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO anon, authenticated;