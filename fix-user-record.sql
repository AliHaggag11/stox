-- Fix user record for daily news emails
-- Replace 'ali7aggag@gmail.com' with your actual email if different

-- First, check if you exist in auth.users (this will show your actual user ID)
SELECT id, email, created_at FROM auth.users WHERE email = 'ali7aggag@gmail.com';

-- If the above query shows a user, use that ID in the INSERT below
-- If not, you'll need to sign up again or check your email

-- Insert user record (replace the UUID with your actual user ID from the query above)
INSERT INTO public.users (
    id,
    email,
    name,
    country,
    email_notifications,
    public_profile,
    dark_mode,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'ali7aggag@gmail.com' LIMIT 1),
    'ali7aggag@gmail.com',
    'Ali Haggag',
    'Egypt',
    true,
    false,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    country = EXCLUDED.country,
    email_notifications = EXCLUDED.email_notifications,
    updated_at = NOW();

-- Verify the user was created/updated
SELECT * FROM public.users WHERE email = 'ali7aggag@gmail.com';
