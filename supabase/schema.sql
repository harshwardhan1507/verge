-- Execute this within the Supabase SQL editor to scaffold out the required tables.

-- Types
CREATE TYPE memory_type AS ENUM ('COMMITMENT', 'PERSON', 'EMOTION', 'PATTERN', 'EVENT', 'UNRESOLVED', 'INSIGHT');
CREATE TYPE sentiment_type AS ENUM ('neutral', 'tense', 'warm');

-- Memories Table
CREATE TABLE memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type memory_type NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  related_person TEXT,
  resolved BOOLEAN DEFAULT false,
  thread_id TEXT
);

-- People Table
CREATE TABLE people (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  last_mentioned TIMESTAMPTZ DEFAULT NOW(),
  sentiment sentiment_type NOT NULL,
  last_context TEXT NOT NULL
);

-- Patterns Table
CREATE TABLE patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  frequency INTEGER DEFAULT 1,
  first_noticed TIMESTAMPTZ DEFAULT NOW(),
  latest_mention TIMESTAMPTZ DEFAULT NOW(),
  description TEXT NOT NULL,
  related_memory_ids TEXT[] DEFAULT '{}'
);

-- Unresolved Threads Table
CREATE TABLE unresolved_threads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updates TEXT[] DEFAULT '{}',
  related_memory_ids TEXT[] DEFAULT '{}'
);

-- Proactive Surfaces Table
CREATE TABLE proactive_surfaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  memory_id UUID REFERENCES memories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  reason TEXT NOT NULL
);

-- Row Level Security
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE unresolved_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE proactive_surfaces ENABLE ROW LEVEL SECURITY;

-- Allow all policy for anonymous access (Development Only)
CREATE POLICY "Allow all" ON memories FOR ALL USING (true);
CREATE POLICY "Allow all" ON people FOR ALL USING (true);
CREATE POLICY "Allow all" ON patterns FOR ALL USING (true);
CREATE POLICY "Allow all" ON unresolved_threads FOR ALL USING (true);
CREATE POLICY "Allow all" ON proactive_surfaces FOR ALL USING (true);
