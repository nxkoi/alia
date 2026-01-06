-- AIDE Database Schema for Supabase
-- This schema implements the types defined in packages/shared/src/types/database.ts

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  preferences JSONB NOT NULL DEFAULT '{
    "theme": "auto",
    "notifications": {
      "enabled": true,
      "email": true,
      "push": true,
      "focusReminders": true
    },
    "focusMode": {
      "defaultDuration": 25,
      "breakDuration": 5,
      "autoStartBreaks": false
    }
  }'::JSONB
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_date TIMESTAMPTZ,
  estimated_duration INTEGER, -- in minutes
  actual_duration INTEGER, -- in minutes
  tags TEXT[] NOT NULL DEFAULT '{}',
  parent_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{
    "aiGenerated": false,
    "source": "user"
  }'::JSONB
);

-- AI Actions table
CREATE TABLE IF NOT EXISTS ai_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('create_task', 'send_email', 'schedule_event', 'update_task', 'delete_task')),
  description TEXT NOT NULL,
  payload JSONB NOT NULL,
  requires_approval BOOLEAN NOT NULL DEFAULT true,
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_parent_task_id ON tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_ai_actions_user_id ON ai_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_actions_approval_status ON ai_actions(approval_status);

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_actions_updated_at
  BEFORE UPDATE ON ai_actions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_actions ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own data
CREATE POLICY users_select_own ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY users_update_own ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Tasks policies
CREATE POLICY tasks_select_own ON tasks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY tasks_insert_own ON tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY tasks_update_own ON tasks
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY tasks_delete_own ON tasks
  FOR DELETE
  USING (auth.uid() = user_id);

-- AI Actions policies
CREATE POLICY ai_actions_select_own ON ai_actions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY ai_actions_insert_own ON ai_actions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY ai_actions_update_own ON ai_actions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Sample data (optional - remove in production)
-- INSERT INTO users (email, name) VALUES ('demo@example.com', 'Demo User');
