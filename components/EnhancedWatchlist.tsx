"use client";

import React, { useState, useEffect } from "react";
import { WatchlistItem } from "@/database/models/watchlist.model";
import { StockQuote, getStockQuotes } from "@/lib/actions/finnhub.actions";
import WatchlistButton from "./WatchlistButton";
import TradingViewWidget from "./TradingViewWidget";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  AlertTriangle, 
  MoreHorizontal,
  Eye,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Settings,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

interface EnhancedWatchlistProps {
  watchlist: WatchlistItem[];
  userId: string;
}

export default function EnhancedWatchlist({ watchlist, userId }: EnhancedWatchlistProps) {
  const [stockData, setStockData] = useState<Record<string, StockQuote>>({});
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change' | 'added'>('symbol');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterGainers, setFilterGainers] = useState(false);
  const [filterLosers, setFilterLosers] = useState(false);
  const [showCharts, setShowCharts] = useState<Record<string, boolean>>({});

  // Fetch real stock data
  useEffect(() => {
    const fetchStockData = async () => {
      if (watchlist.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const symbols = watchlist.map(item => item.symbol);
        const quotes = await getStockQuotes(symbols);
        console.log('Fetched stock quotes:', quotes);
        console.log('Sample quote data:', symbols.length > 0 ? quotes[symbols[0]] : 'No symbols');
        setStockData(quotes);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [watchlist]);

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'symbol':
        comparison = a.symbol.localeCompare(b.symbol);
        break;
      case 'price':
        comparison = (stockData[a.symbol]?.price || 0) - (stockData[b.symbol]?.price || 0);
        break;
      case 'change':
        comparison = (stockData[a.symbol]?.changePercent || 0) - (stockData[b.symbol]?.changePercent || 0);
        break;
      case 'added':
        comparison = new Date(a.added_at).getTime() - new Date(b.added_at).getTime();
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const filteredWatchlist = sortedWatchlist.filter(item => {
    const data = stockData[item.symbol];
    if (!data) return true;
    
    if (filterGainers && data.changePercent <= 0) return false;
    if (filterLosers && data.changePercent >= 0) return false;
    
    return true;
  });

  const totalValue = watchlist.reduce((sum, item) => {
    const data = stockData[item.symbol];
    return sum + (data?.price || 0);
  }, 0);

  const totalChange = watchlist.reduce((sum, item) => {
    const data = stockData[item.symbol];
    return sum + (data?.change || 0);
  }, 0);

  const gainersCount = watchlist.filter(item => (stockData[item.symbol]?.changePercent || 0) > 0).length;
  const losersCount = watchlist.filter(item => (stockData[item.symbol]?.changePercent || 0) < 0).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-800 rounded-xl border border-gray-700 p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl border border-blue-600/20 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-200 text-sm">Total Tracked</p>
            <BarChart3 className="h-5 w-5 text-blue-300" />
          </div>
          <p className="text-2xl font-bold text-white">{watchlist.length}</p>
          <p className="text-blue-200 text-sm">Stocks tracked</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl border border-green-600/20 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-200 text-sm">Today's Change</p>
            {totalChange >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-300" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-300" />
            )}
          </div>
          <p className={`text-2xl font-bold ${totalChange >= 0 ? 'text-white' : 'text-red-300'}`}>
            {totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)}
          </p>
          <p className="text-green-200 text-sm">
            {((totalChange / totalValue) * 100).toFixed(2)}%
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl border border-yellow-600/20 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-yellow-200 text-sm">Gainers</p>
            <ArrowUpRight className="h-5 w-5 text-yellow-300" />
          </div>
          <p className="text-2xl font-bold text-white">{gainersCount}</p>
          <p className="text-yellow-200 text-sm">Stocks up today</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl border border-red-600/20 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-red-200 text-sm">Losers</p>
            <ArrowDownRight className="h-5 w-5 text-red-300" />
          </div>
          <p className="text-2xl font-bold text-white">{losersCount}</p>
          <p className="text-red-200 text-sm">Stocks down today</p>
        </motion.div>
      </div> */}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-800 border border-gray-600 text-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="symbol">Sort by Symbol</option>
            <option value="price">Sort by Price</option>
            <option value="change">Sort by Change</option>
            <option value="added">Sort by Date Added</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="bg-gray-800 border border-gray-600 text-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-700 transition-colors"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilterGainers(!filterGainers)}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              filterGainers 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Gainers
          </button>
          <button
            onClick={() => setFilterLosers(!filterLosers)}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              filterLosers 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Losers
          </button>
        </div>
      </div>

      {/* Watchlist Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Symbol</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Price</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Change</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Volume</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Market Cap</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">P/E</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Chart</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWatchlist.map((item, index) => {
                const data = stockData[item.symbol];
                if (!data) return null;

                return (
                  <React.Fragment key={item.symbol}>
                    <motion.tr 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-100">{item.symbol}</p>
                          <p className="text-sm text-gray-400">{item.company}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-100 font-medium">${data.price.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1 ${data.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {data.change >= 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span className="font-medium">
                            {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}
                          </span>
                          <span className="text-sm">
                            ({data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-300">
                          {data.volume > 0 ? `${(data.volume / 1000000).toFixed(1)}M` : 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-300">
                          {data.marketCap > 0 ? `$${(data.marketCap / 1000000000).toFixed(1)}B` : 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-300">
                          {data.pe && data.pe > 0 ? data.pe.toFixed(1) : 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setShowCharts(prev => ({ ...prev, [item.symbol]: !prev[item.symbol] }))}
                          className="w-20 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition-colors"
                          title={showCharts[item.symbol] ? "Hide Chart" : "Show Chart"}
                        >
                          <BarChart3 className="h-4 w-4 text-gray-400" />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link 
                            href={`/stocks/${item.symbol.toLowerCase()}`}
                            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <WatchlistButton
                            symbol={item.symbol}
                            company={item.company}
                            isInWatchlist={true}
                            showTrashIcon={true}
                            type="icon"
                            userId={userId}
                            onWatchlistChange={() => {
                              // Refresh the page or update local state
                              window.location.reload();
                            }}
                          />
                        </div>
                      </td>
                    </motion.tr>
                    {showCharts[item.symbol] && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b border-gray-700"
                      >
                        <td colSpan={8} className="px-6 py-4">
                          <div className="h-64 bg-gray-900 rounded-lg overflow-hidden">
                            <TradingViewWidget
                              scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
                              config={{
                                autosize: true,
                                symbol: item.symbol,
                                interval: "D",
                                timezone: "Etc/UTC",
                                theme: "dark",
                                style: "1",
                                locale: "en",
                                toolbar_bg: "#1e1e1e",
                                enable_publishing: false,
                                allow_symbol_change: true,
                                container_id: `chart-${item.symbol}`,
                                support_host: "https://www.tradingview.com",
                                backgroundColor: "#141414",
                                gridColor: "rgba(240, 243, 250, 0.06)",
                                hide_side_toolbar: false,
                                hide_legend: true,
                                save_image: false,
                                details: true,
                                hotlist: true,
                                calendar: false,
                                studies: ["Volume@tv-basicstudies"],
                                show_popup_button: true,
                                popup_width: "1000",
                                popup_height: "650"
                              }}
                              height={256}
                            />
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Overview Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Market Overview</h3>
          <TradingViewWidget
            scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
            config={{
              colorTheme: "dark",
              dateRange: "12M",
              locale: "en",
              largeChartUrl: "",
              isTransparent: true,
              showFloatingTooltip: true,
              plotLineColorGrowing: "#0FEDBE",
              plotLineColorFalling: "#FF495B",
              gridLineColor: "rgba(240, 243, 250, 0)",
              scaleFontColor: "#DBDBDB",
              belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
              belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
              belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
              belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
              symbolActiveColor: "rgba(15, 237, 190, 0.05)",
              tabs: [
                {
                  title: "Your Watchlist",
                  symbols: watchlist.slice(0, 6).map(item => ({
                    s: item.symbol,
                    d: item.company
                  }))
                }
              ],
              support_host: "https://www.tradingview.com",
              backgroundColor: "#141414",
              width: "100%",
              height: 300,
              showSymbolLogo: true,
              showChart: true,
            }}
            height={300}
          />
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <button 
              onClick={() => {
                // TODO: Implement price alerts
                alert('Price alerts feature coming soon!');
              }}
              className="w-full flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left"
            >
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-gray-100 font-medium">Set Price Alerts</p>
                <p className="text-gray-400 text-sm">Get notified when stocks hit your target price</p>
              </div>
            </button>
            <button 
              onClick={() => {
                // TODO: Implement portfolio analysis
                alert('Portfolio analysis feature coming soon!');
              }}
              className="w-full flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left"
            >
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-gray-100 font-medium">View Portfolio Analysis</p>
                <p className="text-gray-400 text-sm">Analyze your portfolio performance and risk</p>
              </div>
            </button>
            <button 
              onClick={() => {
                // Export watchlist data as CSV
                const csvData = filteredWatchlist.map(item => {
                  const data = stockData[item.symbol];
                  return {
                    Symbol: item.symbol,
                    Company: item.company,
                    Price: data?.price?.toFixed(2) || 'N/A',
                    Change: data?.change?.toFixed(2) || 'N/A',
                    'Change %': data?.changePercent?.toFixed(2) || 'N/A',
                    Volume: data?.volume || 'N/A',
                    'Market Cap': data?.marketCap ? `${(data.marketCap / 1000000000).toFixed(1)}B` : 'N/A',
                    'P/E Ratio': data?.pe > 0 ? data.pe.toFixed(1) : 'N/A',
                    'Date Added': new Date(item.added_at).toLocaleDateString()
                  };
                });
                
                const headers = Object.keys(csvData[0] || {});
                const csvContent = [
                  headers.join(','),
                  ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
                ].join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `watchlist-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
              }}
              className="w-full flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left"
            >
              <Download className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-gray-100 font-medium">Export Data</p>
                <p className="text-gray-400 text-sm">Download your watchlist data as CSV</p>
              </div>
            </button>
            <button 
              onClick={() => {
                // Refresh stock data
                setLoading(true);
                const symbols = watchlist.map(item => item.symbol);
                getStockQuotes(symbols).then(quotes => {
                  setStockData(quotes);
                  setLoading(false);
                }).catch(() => setLoading(false));
              }}
              className="w-full flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left"
            >
              <RefreshCw className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-gray-100 font-medium">Refresh Data</p>
                <p className="text-gray-400 text-sm">Update all stock prices and data</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
