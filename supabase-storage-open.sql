-- Temporarily open the profile-pictures bucket for testing
-- This removes all RLS restrictions (NOT recommended for production)

-- First, let's see if we can create a simple policy that allows all operations
-- This is just for testing - we'll secure it properly later

-- Create a very permissive policy for testing
-- WARNING: This allows anyone to upload/delete files in this bucket
CREATE POLICY "Allow all operations for testing" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'profile-pictures')
WITH CHECK (bucket_id = 'profile-pictures');

-- Also allow public access to view
CREATE POLICY "Allow public viewing for testing" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'profile-pictures');
