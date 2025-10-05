import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/better-auth/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const authInstance = await auth;
    const session = await authInstance.api.getSession({ 
      headers: await request.headers 
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Get user settings from our public.users table
    const { data: user, error } = await supabase
      .from('users')
      .select('email_notifications, public_profile, dark_mode')
      .eq('id', session.user.id)
      .single();

    if (error) {
      // If user doesn't exist, return default settings
      return NextResponse.json({
        emailNotifications: true,
        publicProfile: false,
        darkMode: true
      });
    }

    return NextResponse.json({
      emailNotifications: user.email_notifications ?? true,
      publicProfile: user.public_profile ?? false,
      darkMode: user.dark_mode ?? true
    });

  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ 
      emailNotifications: true,
      publicProfile: false,
      darkMode: true
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authInstance = await auth;
    const session = await authInstance.api.getSession({ 
      headers: await request.headers 
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { emailNotifications, publicProfile, darkMode } = body;

    const supabase = await createClient();

    // Update user settings in our public.users table
    const updateData: any = {};
    if (emailNotifications !== undefined) updateData.email_notifications = emailNotifications;
    if (publicProfile !== undefined) updateData.public_profile = publicProfile;
    if (darkMode !== undefined) updateData.dark_mode = darkMode;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid settings to update' }, { status: 400 });
    }

    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', session.user.id);

    if (error) {
      console.error('Error updating user settings:', error);
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings: updateData
    });

  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
