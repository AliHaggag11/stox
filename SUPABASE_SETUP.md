# Supabase Setup Guide

## 🚀 Quick Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a region close to your users
4. Set a strong database password

### 2. Get Your Project Credentials
1. Go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key

### 3. Update Environment Variables
Update your `.env` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Set Up Database Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `supabase/schema.sql`
3. Run the SQL to create tables and policies

### 5. Configure Authentication
1. Go to **Authentication** → **Settings**
2. Enable **Email** authentication
3. Configure your site URL: `http://localhost:3000` (development)
4. Add your production URL when deploying

## 📊 Database Schema

### Tables Created:
- **users**: Stores user profiles
- **watchlist**: Stores user watchlist items

### Features:
- ✅ Row Level Security (RLS) enabled
- ✅ Automatic timestamps
- ✅ Foreign key constraints
- ✅ Unique constraints (no duplicate watchlist items per user)
- ✅ Optimized indexes

## 🔐 Security Features

- **Row Level Security**: Users can only access their own data
- **JWT Authentication**: Secure token-based auth
- **API Key Protection**: Public and service role keys
- **CORS Configuration**: Configured for your domains

## 🚀 What's Been Migrated

### ✅ Completed:
- MongoDB → Supabase Database
- Mongoose → Supabase Client
- Better Auth → Supabase Auth
- Database models → TypeScript types
- Connection logic → Supabase client setup

### 🔄 Next Steps:
1. Update your `.env` file with Supabase credentials
2. Run the SQL schema in Supabase dashboard
3. Test the application
4. Update any remaining auth-related components

## 🧪 Testing

After setup, your app should:
- ✅ Connect to Supabase without MongoDB errors
- ✅ Handle user authentication
- ✅ Manage watchlist data
- ✅ Work with all existing features

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
