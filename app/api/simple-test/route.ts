import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Simple test - just try to connect and count users
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, name')
      .limit(10);

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database error',
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      userCount: users?.length || 0,
      users: users || []
    });

  } catch (error) {
    console.error('Error testing database:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
