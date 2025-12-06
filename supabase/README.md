# Supabase Database Setup Guide

This directory contains the complete database schema for The Mirror Discussion Hub.

## Quick Start

### 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be provisioned (~2 minutes)

### 2. Run the Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the contents of `schema.sql`
3. Paste into the SQL Editor
4. Click "Run" to execute

This will create:
- ✅ All 12 tables with proper constraints
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Views for leaderboard and stats
- ✅ Triggers for auto-updating timestamps
- ✅ Auto-profile creation on signup
- ✅ Seed data for checklist items

### 3. Get Your API Credentials

1. Go to **Settings** → **API**
2. Copy your **Project URL** (e.g., `https://xxxxx.supabase.co`)
3. Copy your **anon/public** key
4. Add these to your `.env` file:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)
4. For development, you can enable "Confirm email" to be disabled

### 5. Configure Storage (for profile images)

1. Go to **Storage**
2. Create a new bucket called `avatars`
3. Set it to **Public**
4. Create another bucket called `banners`
5. Set it to **Public**

Storage policies are already configured in the schema to allow:
- Anyone can read
- Users can upload/update their own images

## Database Schema Overview

### Core Tables

#### `profiles`
- User profile information
- Auto-created on signup
- Fields: display_name, bio, avatar_url, banner_url, role, is_admin

#### `reflections`
- Main discussion posts
- Fields: title, content, tags, quote, video_url
- Max lengths: title (300), content (10,000), quote (500)

#### `mirrorbacks`
- Comments/replies to reflections
- Supports threading via `parent_id`
- Max length: 5,000 characters

#### `reactions`
- User reactions to reflections
- Types: reflect, appreciate, challenge, save
- Unique constraint: one of each type per user per reflection

#### `wishlists`
- Community feature requests
- Fields: title, description, status
- Status: newest, top-echoed, implemented

#### `wishlist_votes`
- User votes (echoes) on wishlist ideas
- Unique constraint: one vote per user per wishlist

#### `events`
- Upcoming reflection circles
- Fields: title, description, starts_at, timezone, join_url

#### `event_rsvps`
- User RSVPs to events
- Unique constraint: one RSVP per user per event

#### `follows`
- User follow relationships
- Self-follow prevention check

#### `points`
- Gamification system
- Auto-awarded on actions:
  - Reflection: +5 points
  - Mirrorback: +2 points
  - Wishlist: +3 points

#### `checklist_items` & `checklist_progress`
- Onboarding checklist system
- Pre-seeded with 5 default items

### Views

#### `leaderboard`
- Top users by total points
- Aggregates points table

#### `profile_stats`
- Per-user statistics
- Counts: reflections, mirrorbacks, wishlists, followers
- Includes total score

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Public Read
- ✅ All content is publicly viewable (profiles, reflections, mirrorbacks, etc.)

### Authenticated Write
- ✅ Users must be signed in to create content
- ✅ Users can only create content as themselves (enforced by `auth.uid()`)

### Ownership Policies
- ✅ Users can edit/delete their own content
- ✅ Admins can delete any content
- ✅ Users cannot manipulate others' content

### Admin-Only
- ✅ Only admins can create/edit/delete events
- ✅ Only admins can manage checklist items

## Security Features

### Input Validation
- ✅ Length constraints on all text fields
- ✅ Check constraints on enum fields (status, role, reaction kind)
- ✅ Foreign key constraints ensure referential integrity

### Data Integrity
- ✅ Cascading deletes (delete user → delete all their content)
- ✅ Unique constraints prevent duplicate votes/reactions
- ✅ Self-referential checks (can't follow yourself)

### Auto-timestamps
- ✅ All tables have `created_at`
- ✅ Main tables have `updated_at` (auto-updated via triggers)

## Indexing Strategy

Indexes are created on:
- Foreign keys (author, user_id, reflection_id, etc.)
- Frequently queried fields (created_at, status)
- Array fields (tags using GIN index)

This ensures:
- ✅ Fast joins
- ✅ Fast sorting/filtering
- ✅ Fast tag searches

## Testing Your Setup

After running the schema, test with these queries in the SQL Editor:

### 1. Check all tables exist
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Should show: checklist_items, checklist_progress, event_rsvps, events, follows, mirrorbacks, points, profiles, reactions, reflections, wishlist_votes, wishlists

### 2. Check RLS is enabled
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

All should show `rowsecurity = true`

### 3. Check checklist items seeded
```sql
SELECT * FROM checklist_items ORDER BY sort;
```

Should show 5 items

### 4. Check views exist
```sql
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public';
```

Should show: leaderboard, profile_stats

## Migrations

For production, use Supabase migrations:

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize (if not already done)
supabase init

# Create a migration from schema.sql
supabase db diff -f initial_schema

# Apply migrations
supabase db push
```

## Troubleshooting

### Issue: "permission denied for table profiles"
**Solution:** Make sure RLS policies are created. Re-run the schema.sql file.

### Issue: "function auth.uid() does not exist"
**Solution:** You're not using Supabase's auth. Make sure you're running this on a Supabase project.

### Issue: "relation auth.users does not exist"
**Solution:** The schema assumes Supabase's built-in auth. Can't run on vanilla PostgreSQL.

### Issue: Uploads fail to storage
**Solution:**
1. Check buckets exist (avatars, banners)
2. Check buckets are public
3. Check storage policies allow uploads

## Support

For Supabase-specific issues:
- Docs: https://supabase.com/docs
- Community: https://github.com/supabase/supabase/discussions

For Mirror-specific schema questions:
- Check the inline comments in schema.sql
- Review the QA_REPORT.md
