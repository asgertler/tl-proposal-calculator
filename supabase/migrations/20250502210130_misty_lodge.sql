/*
  # Add global tasks table

  1. New Tables
    - `global_tasks`
      - `id` (uuid, primary key)
      - `name` (text)
      - `hours` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `global_tasks` table
    - Add policy for authenticated users to read global tasks
*/

CREATE TABLE IF NOT EXISTS global_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  hours numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE global_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read global tasks"
  ON global_tasks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify global tasks"
  ON global_tasks
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Add updated_at trigger
CREATE TRIGGER update_global_tasks_updated_at
  BEFORE UPDATE ON global_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();