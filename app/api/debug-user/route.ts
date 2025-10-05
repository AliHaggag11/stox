import { NextRequest, NextResponse } from 'next/server';
import { getAllUsersForNewsEmail } from '@/lib/actions/user.actions';

export async function GET(request: NextRequest) {
  try {
    const users = await getAllUsersForNewsEmail();
    
    return NextResponse.json({ 
      success: true, 
      userCount: users.length,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
