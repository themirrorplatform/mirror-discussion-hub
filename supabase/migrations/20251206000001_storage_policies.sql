-- Migration: Storage policies for avatars and banners
-- Created: 2025-12-06
-- Description: RLS policies for Supabase Storage buckets

-- ============================================================================
-- STORAGE BUCKETS (Create these manually in Supabase Dashboard)
-- ============================================================================

-- 1. Create 'avatars' bucket (public)
-- 2. Create 'banners' bucket (public)

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Avatars Bucket Policies
-- Public read access
CREATE POLICY "Public avatars are viewable by everyone"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Users can upload their own avatars
CREATE POLICY "Users can upload own avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own avatars
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own avatars
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================================
-- Banners Bucket Policies
-- ============================================================================

-- Public read access
CREATE POLICY "Public banners are viewable by everyone"
ON storage.objects FOR SELECT
USING ( bucket_id = 'banners' );

-- Users can upload their own banners
CREATE POLICY "Users can upload own banners"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'banners'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own banners
CREATE POLICY "Users can update own banners"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'banners'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own banners
CREATE POLICY "Users can delete own banners"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'banners'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
