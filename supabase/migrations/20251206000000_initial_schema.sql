-- Migration: Initial schema for The Mirror Discussion Hub
-- Created: 2025-12-06
-- Description: Complete database schema with tables, views, RLS policies, and triggers

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  role TEXT DEFAULT 'Witness' CHECK (role IN ('Witness', 'Guide')),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reflections Table
CREATE TABLE IF NOT EXISTS reflections (
  id BIGSERIAL PRIMARY KEY,
  author UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (LENGTH(title) <= 300),
  content TEXT NOT NULL CHECK (LENGTH(content) <= 10000),
  tags TEXT[] DEFAULT '{}',
  quote TEXT CHECK (LENGTH(quote) <= 500),
  video_url TEXT CHECK (LENGTH(video_url) <= 2048),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reflections_author ON reflections(author);
CREATE INDEX IF NOT EXISTS idx_reflections_created_at ON reflections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reflections_tags ON reflections USING GIN(tags);

-- Mirrorbacks Table
CREATE TABLE IF NOT EXISTS mirrorbacks (
  id BIGSERIAL PRIMARY KEY,
  reflection_id BIGINT NOT NULL REFERENCES reflections(id) ON DELETE CASCADE,
  author UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (LENGTH(content) <= 5000),
  parent_id BIGINT REFERENCES mirrorbacks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mirrorbacks_reflection ON mirrorbacks(reflection_id);
CREATE INDEX IF NOT EXISTS idx_mirrorbacks_author ON mirrorbacks(author);
CREATE INDEX IF NOT EXISTS idx_mirrorbacks_parent ON mirrorbacks(parent_id);

-- Reactions Table
CREATE TABLE IF NOT EXISTS reactions (
  id BIGSERIAL PRIMARY KEY,
  reflection_id BIGINT NOT NULL REFERENCES reflections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('reflect', 'appreciate', 'challenge', 'save')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(reflection_id, user_id, kind)
);

CREATE INDEX IF NOT EXISTS idx_reactions_reflection ON reactions(reflection_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user ON reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_kind ON reactions(kind);

-- Wishlists Table
CREATE TABLE IF NOT EXISTS wishlists (
  id BIGSERIAL PRIMARY KEY,
  author UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (LENGTH(title) <= 300),
  description TEXT CHECK (LENGTH(description) <= 2000),
  status TEXT DEFAULT 'newest' CHECK (status IN ('newest', 'top-echoed', 'implemented')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wishlists_author ON wishlists(author);
CREATE INDEX IF NOT EXISTS idx_wishlists_status ON wishlists(status);
CREATE INDEX IF NOT EXISTS idx_wishlists_created_at ON wishlists(created_at DESC);

-- Wishlist Votes Table
CREATE TABLE IF NOT EXISTS wishlist_votes (
  id BIGSERIAL PRIMARY KEY,
  wishlist_id BIGINT NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(wishlist_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_votes_wishlist ON wishlist_votes(wishlist_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_votes_user ON wishlist_votes(user_id);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL CHECK (LENGTH(title) <= 300),
  description TEXT CHECK (LENGTH(description) <= 2000),
  starts_at TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  join_url TEXT CHECK (LENGTH(join_url) <= 2048),
  banner_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_starts_at ON events(starts_at);

-- Event RSVPs Table
CREATE TABLE IF NOT EXISTS event_rsvps (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_rsvps_event ON event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user ON event_rsvps(user_id);

-- Follows Table
CREATE TABLE IF NOT EXISTS follows (
  id BIGSERIAL PRIMARY KEY,
  follower UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  followee UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (follower != followee),
  UNIQUE(follower, followee)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower);
CREATE INDEX IF NOT EXISTS idx_follows_followee ON follows(followee);

-- Points Table
CREATE TABLE IF NOT EXISTS points (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('reflection', 'mirrorback', 'wishlist')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_points_user ON points(user_id);

-- Checklist Items Table
CREATE TABLE IF NOT EXISTS checklist_items (
  id BIGSERIAL PRIMARY KEY,
  item_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checklist Progress Table
CREATE TABLE IF NOT EXISTS checklist_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_key TEXT NOT NULL REFERENCES checklist_items(item_key) ON DELETE CASCADE,
  done BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, item_key)
);

CREATE INDEX IF NOT EXISTS idx_checklist_progress_user ON checklist_progress(user_id);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Leaderboard View
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  p.user_id,
  SUM(p.delta) as score,
  COUNT(*) as activity_count
FROM points p
GROUP BY p.user_id
ORDER BY score DESC;

-- Profile Stats View
CREATE OR REPLACE VIEW profile_stats AS
SELECT
  p.id as user_id,
  COUNT(DISTINCT r.id) as reflections_count,
  COUNT(DISTINCT m.id) as mirrorbacks_count,
  COUNT(DISTINCT w.id) as wishlists_count,
  COUNT(DISTINCT f.follower) as followers_count,
  COALESCE(pts.total_score, 0) as total_score
FROM profiles p
LEFT JOIN reflections r ON r.author = p.id
LEFT JOIN mirrorbacks m ON m.author = p.id
LEFT JOIN wishlists w ON w.author = p.id
LEFT JOIN follows f ON f.followee = p.id
LEFT JOIN (
  SELECT user_id, SUM(delta) as total_score
  FROM points
  GROUP BY user_id
) pts ON pts.user_id = p.id
GROUP BY p.id, pts.total_score;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://ui-avatars.com/api/?name=' || encode(COALESCE(NEW.email, 'User'), 'escape'))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reflections_updated_at
  BEFORE UPDATE ON reflections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mirrorbacks_updated_at
  BEFORE UPDATE ON mirrorbacks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wishlists_updated_at
  BEFORE UPDATE ON wishlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE mirrorbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE points ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_progress ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Reflections Policies
CREATE POLICY "Reflections are viewable by everyone" ON reflections FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reflections" ON reflections FOR INSERT WITH CHECK (auth.uid() = author);
CREATE POLICY "Users can update own reflections" ON reflections FOR UPDATE USING (auth.uid() = author);
CREATE POLICY "Users can delete own reflections or admins can delete any" ON reflections FOR DELETE
  USING (auth.uid() = author OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Mirrorbacks Policies
CREATE POLICY "Mirrorbacks are viewable by everyone" ON mirrorbacks FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create mirrorbacks" ON mirrorbacks FOR INSERT WITH CHECK (auth.uid() = author);
CREATE POLICY "Users can update own mirrorbacks" ON mirrorbacks FOR UPDATE USING (auth.uid() = author);
CREATE POLICY "Users can delete own mirrorbacks or admins can delete any" ON mirrorbacks FOR DELETE
  USING (auth.uid() = author OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Reactions Policies
CREATE POLICY "Reactions are viewable by everyone" ON reactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reactions" ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON reactions FOR DELETE USING (auth.uid() = user_id);

-- Wishlists Policies
CREATE POLICY "Wishlists are viewable by everyone" ON wishlists FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create wishlists" ON wishlists FOR INSERT WITH CHECK (auth.uid() = author);
CREATE POLICY "Users can update own wishlists" ON wishlists FOR UPDATE USING (auth.uid() = author);
CREATE POLICY "Users can delete own wishlists or admins can delete any" ON wishlists FOR DELETE
  USING (auth.uid() = author OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Wishlist Votes Policies
CREATE POLICY "Wishlist votes are viewable by everyone" ON wishlist_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create wishlist votes" ON wishlist_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own wishlist votes" ON wishlist_votes FOR DELETE USING (auth.uid() = user_id);

-- Events Policies
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Admins can create events" ON events FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "Admins can update events" ON events FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "Admins can delete events" ON events FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Event RSVPs Policies
CREATE POLICY "Event RSVPs are viewable by everyone" ON event_rsvps FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create RSVPs" ON event_rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own RSVPs" ON event_rsvps FOR DELETE USING (auth.uid() = user_id);

-- Follows Policies
CREATE POLICY "Follows are viewable by everyone" ON follows FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create follows" ON follows FOR INSERT WITH CHECK (auth.uid() = follower);
CREATE POLICY "Users can delete own follows" ON follows FOR DELETE USING (auth.uid() = follower);

-- Points Policies
CREATE POLICY "Points are viewable by everyone" ON points FOR SELECT USING (true);

-- Checklist Items Policies
CREATE POLICY "Checklist items are viewable by everyone" ON checklist_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage checklist items" ON checklist_items FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Checklist Progress Policies
CREATE POLICY "Users can view own checklist progress" ON checklist_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own checklist progress" ON checklist_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can modify own checklist progress" ON checklist_progress FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- SEED DATA
-- ============================================================================

INSERT INTO checklist_items (item_key, title, description, sort) VALUES
  ('complete_profile', 'Complete Your Profile', 'Add a display name, bio, and profile picture', 1),
  ('first_reflection', 'Share Your First Reflection', 'Post your first thoughtful reflection to the community', 2),
  ('first_mirrorback', 'Leave Your First Mirrorback', 'Respond to someone else''s reflection', 3),
  ('read_principles', 'Read The Mirror Principles', 'Understand the philosophy behind our community', 4),
  ('first_wishlist', 'Share a Wishlist Idea', 'Suggest a feature you''d like to see', 5)
ON CONFLICT (item_key) DO NOTHING;
