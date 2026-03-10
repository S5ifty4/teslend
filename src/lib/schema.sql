-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced from NextAuth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  tesla_model TEXT NOT NULL,
  category TEXT NOT NULL,
  daily_price DECIMAL(10,2) NOT NULL,
  condition TEXT CHECK (condition IN ('Like New', 'Good', 'Fair')),
  city TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view users" ON users FOR SELECT USING (true);
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own" ON users FOR UPDATE USING (true);

CREATE POLICY "Anyone can view active listings" ON listings FOR SELECT USING (active = true);
CREATE POLICY "Anyone can insert listings" ON listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update own listings" ON listings FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete own listings" ON listings FOR DELETE USING (true);

-- Storage bucket (run in dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('listing-images', 'listing-images', true);
