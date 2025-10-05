import { createClient } from '@/lib/supabase/server'

// Supabase connection is handled automatically
// This function is kept for compatibility with existing code
export const connectToDatabase = async () => {
    const supabase = createClient()
    console.log('Connected to Supabase database')
    return supabase
}
