# Supabase Migrations

This directory contains Supabase database migrations for The Mirror Discussion Hub.

## Migrations

### 20251206000000_initial_schema.sql
Complete initial database schema including:
- All 12 tables with constraints
- Indexes for performance
- Views (leaderboard, profile_stats)
- Functions and triggers
- Row Level Security (RLS) policies
- Seed data for checklist items

### 20251206000001_storage_policies.sql
Storage bucket policies for:
- Avatars bucket (public, user-owned uploads)
- Banners bucket (public, user-owned uploads)

## How to Apply Migrations

### Option 1: Supabase CLI (Recommended for Production)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push

# Verify migration status
supabase migration list
```

### Option 2: SQL Editor (Quick Setup)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy contents of `20251206000000_initial_schema.sql`
4. Paste and click **Run**
5. Repeat for `20251206000001_storage_policies.sql`

### Option 3: Direct File Upload

1. In Supabase dashboard, go to **Database** → **Migrations**
2. Click **New Migration**
3. Upload migration files in order

## Storage Bucket Setup

**IMPORTANT:** Storage buckets must be created manually before applying storage policies.

1. Go to **Storage** in Supabase dashboard
2. Click **New bucket**
3. Create `avatars` bucket:
   - Name: `avatars`
   - Public: **Yes**
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`

4. Create `banners` bucket:
   - Name: `banners`
   - Public: **Yes**
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`

5. After creating buckets, apply the storage policies migration

## Verification

After applying migrations, verify everything is set up correctly:

```sql
-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Check views exist
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public';

-- Check seed data
SELECT * FROM checklist_items ORDER BY sort;

-- Check storage buckets
SELECT * FROM storage.buckets;

-- Check storage policies
SELECT * FROM storage.policies;
```

## Rollback

If you need to rollback migrations:

```bash
# Using Supabase CLI
supabase db reset

# Or manually drop tables (in reverse order):
DROP TABLE IF EXISTS checklist_progress CASCADE;
DROP TABLE IF EXISTS checklist_items CASCADE;
DROP TABLE IF EXISTS points CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS event_rsvps CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS wishlist_votes CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS reactions CASCADE;
DROP TABLE IF EXISTS mirrorbacks CASCADE;
DROP TABLE IF EXISTS reflections CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP VIEW IF EXISTS profile_stats;
DROP VIEW IF EXISTS leaderboard;
```

## Troubleshooting

### "relation already exists"
Migrations are idempotent (use `IF NOT EXISTS`). Safe to run multiple times.

### "permission denied"
Make sure you're connected with the correct database user with sufficient privileges.

### "function auth.uid() does not exist"
You're not on Supabase. These migrations require Supabase's auth system.

### Storage policies fail
Make sure buckets are created first in the Supabase dashboard.

## Production Deployment

For production:
1. Test migrations on a staging environment first
2. Backup your database before applying
3. Use Supabase CLI for version-controlled migrations
4. Monitor migration logs for errors
5. Verify all RLS policies are working

## Support

See the main [SETUP.md](../SETUP.md) for complete setup instructions.
