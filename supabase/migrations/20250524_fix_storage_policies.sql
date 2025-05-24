-- Supabase Storage RLS: Use ONLY existing columns! Use (select auth.uid()) for perf.

-- Create avatars bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
  VALUES ('avatars', 'avatars', false, false, 5242880, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp'])
  ON CONFLICT (id) DO NOTHING;
END
$$;

-- Insert avatars (for authenticated users)
DROP POLICY IF EXISTS "Authenticated users can insert avatars" ON storage.objects;
CREATE POLICY "Authenticated users can insert avatars"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars');

-- View avatars (first path segment of name = user id)
DROP POLICY IF EXISTS "Users can view their own avatars" ON storage.objects;
CREATE POLICY "Users can view their own avatars"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'avatars' AND split_part(name, '/', 1) = (select auth.uid())::text);

-- Update avatars (same rule)
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
CREATE POLICY "Users can update their own avatars"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND split_part(name, '/', 1) = (select auth.uid())::text)
  WITH CHECK (bucket_id = 'avatars' AND split_part(name, '/', 1) = (select auth.uid())::text);

-- Delete avatars (same rule)
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
CREATE POLICY "Users can delete their own avatars"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND split_part(name, '/', 1) = (select auth.uid())::text);

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
