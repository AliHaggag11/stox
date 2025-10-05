"use client";

import { useState } from "react";
import { WatchlistItem } from "@/database/models/watchlist.model";
import WatchlistButton from "./WatchlistButton";
import { removeFromWatchlist } from "@/lib/actions/watchlist.actions";

interface WatchlistTableProps {
  watchlist: WatchlistItem[];
}

export default function WatchlistTable({ watchlist }: WatchlistTableProps) {
  const [localWatchlist, setLocalWatchlist] = useState(watchlist);

  const handleRemoveFromWatchlist = async (symbol: string) => {
    try {
      // Optimistically update UI
      setLocalWatchlist(prev => prev.filter(item => item.symbol !== symbol));
      
      // Call server action (you'll need to get userId from context/session)
      // const result = await removeFromWatchlist(userId, symbol);
      // if (!result.success) {
      //   // Revert on error
      //   setLocalWatchlist(watchlist);
      // }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      // Revert on error
      setLocalWatchlist(watchlist);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="watchlist-table">
          <thead>
            <tr className="table-header-row">
              <th className="table-header">Company</th>
              <th className="table-header">Symbol</th>
              <th className="table-header">Added</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {localWatchlist.map((item) => (
              <tr key={item.id} className="table-row">
                <td className="table-cell pl-4">
                  <div>
                    <div className="font-medium text-gray-100">{item.company}</div>
                  </div>
                </td>
                <td className="table-cell">
                  <span className="font-mono text-yellow-400">{item.symbol}</span>
                </td>
                <td className="table-cell text-gray-400">
                  {new Date(item.added_at).toLocaleDateString()}
                </td>
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    <a 
                      href={`/stocks/${item.symbol.toLowerCase()}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                      View Details
                    </a>
                    <WatchlistButton
                      symbol={item.symbol}
                      company={item.company}
                      isInWatchlist={true}
                      showTrashIcon={true}
                      type="icon"
                      onWatchlistChange={(symbol, isAdded) => {
                        if (!isAdded) {
                          handleRemoveFromWatchlist(symbol);
                        }
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
