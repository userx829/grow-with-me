-- Supabase PostgreSQL Database Schema for Grow With Ayush Portfolio App

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Content Table
CREATE TABLE IF NOT EXISTS content (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL
);

-- 3. Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for fast queries
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
