-- Temporarily disable RLS on users table for testing
-- WARNING: This is only for testing - re-enable after fixing

-- Check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- Disable RLS temporarily
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- Test query (should now work)
SELECT * FROM public.users;

-- IMPORTANT: Re-enable RLS after testing
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
