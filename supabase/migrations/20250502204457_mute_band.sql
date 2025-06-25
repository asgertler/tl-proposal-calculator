/*
  # Initial Schema Setup for Proposal Calculator

  1. New Tables
    - projects
      - id (uuid, primary key)
      - name (text)
      - created_at (timestamp)
      - updated_at (timestamp)
      - user_id (uuid, references auth.users)
      
    - personnel
      - id (uuid, primary key)
      - project_id (uuid, references projects)
      - name (text)
      - role_id (text)
      - bill_rate (numeric)
      - notes (text)
      
    - tasks
      - id (uuid, primary key)
      - project_id (uuid, references projects)
      - personnel_id (uuid, references personnel)
      - name (text)
      - hours (numeric)
      - is_custom (boolean)
      
    - burn_plan
      - id (uuid, primary key)
      - project_id (uuid, references projects)
      - start_date (date)
      - end_date (date)
      
    - burn_plan_allocations
      - id (uuid, primary key)
      - burn_plan_id (uuid, references burn_plan)
      - personnel_id (uuid, references personnel)
      - task_id (uuid, references tasks)
      - week_number (integer)
      - hours (numeric)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create tables
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

CREATE TABLE personnel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  role_id text NOT NULL,
  bill_rate numeric NOT NULL,
  notes text
);

CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects ON DELETE CASCADE NOT NULL,
  personnel_id uuid REFERENCES personnel ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  hours numeric NOT NULL,
  is_custom boolean DEFAULT false
);

CREATE TABLE burn_plan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects ON DELETE CASCADE NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL
);

CREATE TABLE burn_plan_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  burn_plan_id uuid REFERENCES burn_plan ON DELETE CASCADE NOT NULL,
  personnel_id uuid REFERENCES personnel ON DELETE CASCADE NOT NULL,
  task_id uuid REFERENCES tasks ON DELETE CASCADE NOT NULL,
  week_number integer NOT NULL,
  hours numeric NOT NULL
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE burn_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE burn_plan_allocations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage personnel in their projects"
  ON personnel
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects WHERE id = personnel.project_id AND user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects WHERE id = personnel.project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can manage tasks in their projects"
  ON tasks
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects WHERE id = tasks.project_id AND user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects WHERE id = tasks.project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can manage burn plans in their projects"
  ON burn_plan
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects WHERE id = burn_plan.project_id AND user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects WHERE id = burn_plan.project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can manage burn plan allocations in their projects"
  ON burn_plan_allocations
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM burn_plan
    JOIN projects ON projects.id = burn_plan.project_id
    WHERE burn_plan.id = burn_plan_allocations.burn_plan_id
    AND projects.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM burn_plan
    JOIN projects ON projects.id = burn_plan.project_id
    WHERE burn_plan.id = burn_plan_allocations.burn_plan_id
    AND projects.user_id = auth.uid()
  ));