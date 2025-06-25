/*
  # Project persistence implementation

  1. New Tables
    - `saved_projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `data` (jsonb) - Stores the complete project configuration
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `saved_projects` table
    - Add policies for authenticated users to manage their own projects
*/

CREATE TABLE IF NOT EXISTS saved_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE saved_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own saved projects"
  ON saved_projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_saved_projects_updated_at
  BEFORE UPDATE ON saved_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();