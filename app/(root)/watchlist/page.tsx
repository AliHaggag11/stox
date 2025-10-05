import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { getUserWatchlist } from "@/lib/actions/watchlist.actions";
import WatchlistTable from "@/components/WatchlistTable";

export default async function WatchlistPage() {
  const authInstance = await auth;
  const session = await authInstance.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    return <div>Please sign in to view your watchlist.</div>;
  }

  const watchlist = await getUserWatchlist(session.user.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="watchlist-title">My Watchlist</h1>
        <p className="text-gray-400">
          {watchlist.length} {watchlist.length === 1 ? 'stock' : 'stocks'} in watchlist
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="watchlist-empty-container">
          <div className="watchlist-empty">
            <svg
              className="watchlist-star"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
              />
            </svg>
            <h2 className="empty-title">Your watchlist is empty</h2>
            <p className="empty-description">
              Start building your watchlist by searching for stocks and adding them to track their performance.
            </p>
            <a 
              href="/search" 
              className="yellow-btn px-6 py-3 inline-block"
            >
              Search Stocks
            </a>
          </div>
        </div>
      ) : (
        <div className="watchlist-container">
          <div className="watchlist">
            <WatchlistTable watchlist={watchlist} />
          </div>
          <div className="watchlist-alerts">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a 
                  href="/search" 
                  className="block w-full text-center yellow-btn py-2"
                >
                  Add More Stocks
                </a>
                <button className="block w-full text-center bg-gray-700 hover:bg-gray-600 text-gray-100 py-2 rounded transition-colors">
                  Set Price Alerts
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
