-- Supabase Database Schema for Portfolio Manager
-- Run this SQL in your Supabase project's SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  portfolio TEXT NOT NULL,
  point_of_contact TEXT NOT NULL,
  graphic_types TEXT[] NOT NULL,
  other_graphic_type TEXT,
  event_name TEXT NOT NULL,
  event_date DATE,
  event_location TEXT,
  deadline DATE NOT NULL,
  summary TEXT NOT NULL,
  creative_vision TEXT NOT NULL,
  reference_urls TEXT[] DEFAULT '{}',
   additional_requests TEXT,
   content_link TEXT,
   status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'In Review', 'Completed', 'Archived')),
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  created_by TEXT NOT NULL,
  assigned_to TEXT,
  is_on_board BOOLEAN DEFAULT FALSE
);

-- Add content_link column to existing tickets table (no-op if already present)
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS content_link TEXT;

-- Event date column replaces the old event_time column (no-ops if already applied)
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS event_date DATE;
ALTER TABLE tickets DROP COLUMN IF EXISTS event_time;

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_portfolio ON tickets(portfolio);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_is_on_board ON tickets(is_on_board);

-- Enable Row Level Security
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all operations for now - add authentication later)
CREATE POLICY "Allow all operations on tickets" ON tickets
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on team_members" ON team_members
  FOR ALL USING (true);

-- Insert default team members
INSERT INTO team_members (name) VALUES
  ('Ella'),
  ('Yolanda'),
  ('Claire'),
  ('Amber'),
  ('Rosie')
ON CONFLICT (name) DO NOTHING;