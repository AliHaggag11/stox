"use client";
import React, { useMemo, useState, useEffect } from "react";
import { addToWatchlist, removeFromWatchlist } from "@/lib/actions/watchlist.actions";

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
  userId,
}: WatchlistButtonProps & { userId?: string }) => {
  const [added, setAdded] = useState<boolean>(!!isInWatchlist);
  const [loading, setLoading] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setAdded(!!isInWatchlist);
  }, [isInWatchlist]);

  const label = useMemo(() => {
    if (type === "icon") return added ? "" : "";
    if (loading) return added ? "Removing..." : "Adding...";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type, loading]);

  const handleClick = async () => {
    if (loading || !userId) return;
    
    setLoading(true);
    const next = !added;
    
    try {
      let result;
      if (next) {
        result = await addToWatchlist(userId, symbol, company);
      } else {
        result = await removeFromWatchlist(userId, symbol);
      }

      if (result.success) {
        setAdded(next);
        onWatchlistChange?.(symbol, next);
      } else {
        console.error('Watchlist action failed:', result.error);
        // Could show a toast notification here
      }
    } catch (error) {
      console.error('Watchlist action error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (type === "icon") {
    return (
      <button
        title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleClick}
        disabled={loading || !userId}
      >
        {loading ? (
          <div className="watchlist-star animate-spin">⟳</div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={added ? "#FACC15" : "none"}
            stroke="#FACC15"
            strokeWidth="2"
            className="watchlist-star"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button 
      className={`watchlist-btn ${added ? "watchlist-remove" : ""} ${loading ? "opacity-50 cursor-not-allowed" : ""}`} 
      onClick={handleClick}
      disabled={loading || !userId}
    >
      {showTrashIcon && added ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6" />
        </svg>
      ) : null}
      <span>{label}</span>
    </button>
  );
};

export default WatchlistButton;
