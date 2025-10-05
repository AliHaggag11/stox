-- Create the profile-pictures storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pictures',
  'profile-pictures',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- Note: Storage policies need to be created through the Supabase Dashboard
-- Go to Authentication > Policies > storage.objects table
-- and create the following policies manually:

/*
Policy 1 - Insert: "Users can upload their own profile pictures"
Target roles: authenticated
Using expression: bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]

Policy 2 - Update: "Users can update their own profile pictures"  
Target roles: authenticated
Using expression: bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]

Policy 3 - Delete: "Users can delete their own profile pictures"
Target roles: authenticated  
Using expression: bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]

Policy 4 - Select: "Profile pictures are publicly viewable"
Target roles: public
Using expression: bucket_id = 'profile-pictures'
*/
