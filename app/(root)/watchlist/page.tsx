import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server-client";
import { getUserWatchlist } from "@/lib/actions/watchlist.actions";
import EnhancedWatchlist from "@/components/EnhancedWatchlist";
import SearchCommand from "@/components/SearchCommand";

export default async function WatchlistPage() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (!user || error) {
    redirect('/sign-in');
  }

  const watchlist = await getUserWatchlist(user.id);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-2">My Watchlist</h1>
          <p className="text-gray-400">
            {watchlist.length} {watchlist.length === 1 ? 'stock' : 'stocks'} • 
            Track your favorite stocks
          </p>
        </div>
        <div className="flex gap-3">
          <SearchCommand 
            renderAs="button" 
            label="Add Stocks" 
            initialStocks={[]}
          />
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-12 mx-auto mb-6 text-gray-500">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3">Start Tracking Stocks</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Add stocks to your watchlist to track their performance, set price alerts, 
              and stay updated with real-time market data.
            </p>
            <SearchCommand 
              renderAs="button" 
              label="Search & Add Stocks" 
              initialStocks={[]}
            />
          </div>
        </div>
      ) : (
        <EnhancedWatchlist watchlist={watchlist} userId={user.id} />
      )}
    </div>
  );
}
