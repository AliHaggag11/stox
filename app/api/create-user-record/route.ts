import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, country } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Get user from auth.users by email
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Failed to list users:', authError);
      return NextResponse.json({ 
        error: 'Failed to access auth users',
        details: authError.message 
      }, { status: 500 });
    }

    const authUser = users.find(user => user.email === email);
    
    if (!authUser) {
      return NextResponse.json({ 
        error: 'User not found in auth system',
        message: 'Please make sure you are signed in to the application'
      }, { status: 404 });
    }

    // Check if user already exists in users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', authUser.id)
      .single();

    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        message: 'User record already exists',
        user: existingUser
      });
    }

    // Create user record
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authUser.id,
        email: authUser.email,
        name: name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        country: country || authUser.user_metadata?.country || null,
        email_notifications: true,
        public_profile: false,
        dark_mode: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create user record:', error);
      return NextResponse.json({ 
        error: 'Failed to create user record',
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User record created successfully',
      user: data
    });

  } catch (error) {
    console.error('Error creating user record:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}