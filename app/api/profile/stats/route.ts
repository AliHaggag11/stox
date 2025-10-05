import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/better-auth/auth';
import { createClient } from '@/lib/supabase/server';
import { getStockQuotes } from '@/lib/actions/finnhub.actions';

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

    // Get user's watchlist count
    const { count: watchlistCount, error: watchlistError } = await supabase
      .from('watchlist')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id);

    if (watchlistError) {
      console.error('Error fetching watchlist count:', watchlistError);
    }

    // Get price alerts count (placeholder for future implementation)
    const alertsCount = 0;

    return NextResponse.json({
      watchlistCount: watchlistCount || 0,
      alertsCount
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ 
      watchlistCount: 0,
      alertsCount: 0
    });
  }
}
