import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';

export async function POST(request: NextRequest) {
  try {
    // Get the email from the request body
    const body = await request.json();
    const { email, name, country } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required in request body' }, { status: 400 });
    }

    const supabase = await createClient();
    
    // For now, let's create a user record directly with the provided email
    // We'll use a temporary ID that matches the pattern
    const tempUserId = crypto.randomUUID();

    // Check if user already exists in users table by email
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        message: 'User record already exists',
        user: existingUser
      });
    }

    // Create user record with the provided email
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: tempUserId,
        email: email,
        name: name || email.split('@')[0],
        country: country || null,
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
