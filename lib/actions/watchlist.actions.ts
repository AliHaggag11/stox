// @ts-nocheck
'use server';

import { createClient } from '@/lib/supabase/server-client';
import { Database, WatchlistItem } from '@/database/models/watchlist.model';

// Helper function to ensure user exists in our users table
async function ensureUserExists(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  try {
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (user && !userError) {
      return { success: true };
    }

    // If user doesn't exist, try to create them from auth.users
    const { data: authUser, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser.user || authUser.user.id !== userId) {
      return { success: false, error: 'User not authenticated' };
    }

    // Create user profile
    const { error: insertError } = await supabase.from('users').insert({
      id: authUser.user.id,
      email: authUser.user.email!,
      name: authUser.user.user_metadata?.name || 'User',
      country: authUser.user.user_metadata?.country || null
    });

    if (insertError) {
      console.error('Error creating user profile:', insertError);
      return { success: false, error: 'Failed to create user profile' };
    }

    return { success: true };
  } catch (err) {
    console.error('ensureUserExists error:', err);
    return { success: false, error: 'Failed to ensure user exists' };
  }
}

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const supabase = await createClient();

    // Get user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !user) {
      console.log('User not found:', email);
      return [];
    }

    // Get watchlist symbols for this user
    const { data: watchlistItems, error: watchlistError } = await supabase
      .from('watchlist')
      .select('symbol')
      .eq('user_id', user.id);

    if (watchlistError) {
      console.error('Error fetching watchlist:', watchlistError);
      return [];
    }

    return watchlistItems?.map(item => item.symbol) || [];
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function getUserWatchlist(userId: string): Promise<WatchlistItem[]> {
  try {
    const supabase = await createClient();

    const { data: watchlistItems, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Error fetching watchlist:', error);
      return [];
    }

    return watchlistItems || [];
  } catch (err) {
    console.error('getUserWatchlist error:', err);
    return [];
  }
}

export async function addToWatchlist(userId: string, symbol: string, company: string): Promise<{ success: boolean; error?: string }> {
  try {
    // First, ensure the user exists in our users table
    const userCheck = await ensureUserExists(userId);
    if (!userCheck.success) {
      return userCheck;
    }

    const supabase = await createClient();

    // Now add to watchlist
    const { error } = await supabase
      .from('watchlist')
      .insert({
        user_id: userId,
        symbol: symbol.toUpperCase(),
        company: company
      });

    if (error) {
      console.error('Error adding to watchlist:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('addToWatchlist error:', err);
    return { success: false, error: 'Failed to add to watchlist' };
  }
}

export async function removeFromWatchlist(userId: string, symbol: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('symbol', symbol.toUpperCase());

    if (error) {
      console.error('Error removing from watchlist:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('removeFromWatchlist error:', err);
    return { success: false, error: 'Failed to remove from watchlist' };
  }
}

export async function isInWatchlist(userId: string, symbol: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', userId)
      .eq('symbol', symbol.toUpperCase())
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking watchlist:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('isInWatchlist error:', err);
    return false;
  }
}
