import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/lib/inngest/client';

export async function POST(request: NextRequest) {
  try {
    // Manually trigger the daily news summary
    await inngest.send({
      name: 'app/send.daily.news',
      data: {}
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Daily news summary triggered successfully' 
    });
  } catch (error) {
    console.error('Error triggering daily news summary:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to trigger daily news summary',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
