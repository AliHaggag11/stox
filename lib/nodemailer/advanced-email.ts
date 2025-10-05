// @ts-nocheck
import nodemailer from 'nodemailer';
import { ADVANCED_NEWS_EMAIL_TEMPLATE } from './templates/advanced-news-template';
import { getStockQuotes } from '@/lib/actions/finnhub.actions';

interface AdvancedEmailData {
  email: string;
  date: string;
  newsContent: string; // raw HTML for top news items
  userWatchlist?: string[];
}

export const sendAdvancedNewsEmail = async ({
  email,
  date,
  newsContent,
  userWatchlist = []
}: AdvancedEmailData): Promise<void> => {
  const symbols = (userWatchlist.length > 0 ? userWatchlist : ['AAPL', 'MSFT', 'TSLA', 'NVDA', 'GOOGL']).slice(0, 10);
  const quotes = await getStockQuotes(symbols);

  // Market snapshot (simple indices — placeholders can be wired to real index feed later)
  const marketSnapshot = buildMarketSnapshotRows([
    { label: 'S&P 500', change: '+0.85%' },
    { label: 'Dow Jones', change: '-0.23%' },
    { label: 'NASDAQ', change: '+1.42%' },
    { label: 'VIX (Fear Index)', change: '12.45' }
  ]);

  // Top movers (sort by absolute % change)
  const movers = symbols
    .map(s => ({ symbol: s, price: quotes[s]?.price ?? 0, changePercent: quotes[s]?.changePercent ?? 0 }))
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 5);
  const topMovers = buildWatchlistRows(movers);

  // Valuation snapshot (use pe and marketCap from quotes, when available)
  const valuations = symbols.map(s => ({
    symbol: s,
    pe: quotes[s]?.pe ?? 0,
    marketCap: quotes[s]?.marketCap ?? 0
  }));
  const valuationRows = buildValuationRows(valuations);

  // Volume leaders
  const volumeLeaders = symbols
    .map(s => ({ symbol: s, volume: quotes[s]?.volume ?? 0, price: quotes[s]?.price ?? 0 }))
    .sort((a, b) => (b.volume - a.volume))
    .slice(0, 5);
  const volumeRows = buildVolumeRows(volumeLeaders);

  // Basic watchlist table (same as before, but full list up to 8)
  const watchlistRows = buildWatchlistRows(symbols.slice(0, 8).map(s => ({
    symbol: s,
    price: quotes[s]?.price ?? 0,
    changePercent: quotes[s]?.changePercent ?? 0
  })));

  // Outlook text (simple rule-based; can be replaced with AI later)
  const avgChange = avg(symbols.map(s => quotes[s]?.changePercent ?? 0));
  const outlook = avgChange > 0.25
    ? 'Momentum is favorable across your tracked names; consider tightening stops on recent winners and watching for continuation setups.'
    : avgChange < -0.25
    ? 'Caution: Broader softness across tracked names; consider waiting for confirmation before adding risk and watch key support levels.'
    : 'Mixed signals today; maintain discipline and focus on high-quality breakouts with volume confirmation.';

  let html = ADVANCED_NEWS_EMAIL_TEMPLATE
    .replace('{{date}}', date)
    .replace('{{marketSnapshot}}', marketSnapshot)
    .replace('{{topMovers}}', topMovers)
    .replace('{{valuationRows}}', valuationRows)
    .replace('{{volumeRows}}', volumeRows)
    .replace('{{newsSections}}', newsContent)
    .replace('{{watchlistRows}}', watchlistRows)
    .replace('{{outlook}}', outlook)
    .replace('{{ctaUrl}}', 'https://localhost:3000/watchlist')
    .replace('{{managePrefsUrl}}', 'https://localhost:3000/profile')
    .replace('{{unsubscribeUrl}}', 'https://localhost:3000/profile');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL!,
      pass: process.env.NODEMAILER_PASSWORD!,
    }
  });

  await transporter.sendMail({
    from: 'Signalist Intelligence <intelligence@signalist.com>',
    to: email,
    subject: `Signalist Daily Market Briefing — ${date}`,
    html
  });
};

function buildMarketSnapshotRows(rows: Array<{ label: string; change: string }>): string {
  return rows.map(r => `
    <tr>
      <td style="padding:12px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#111827;">${r.label}</td>
      <td style="padding:12px; border-bottom:1px solid #e5e7eb; font-size:14px; color:${r.change.startsWith('-') ? '#b91c1c' : '#065f46'};" align="right">${r.change}</td>
    </tr>
  `).join('');
}

function buildWatchlistRows(rows: Array<{ symbol: string; price: number; changePercent: number }>): string {
  return rows.map(r => `
    <tr>
      <td style="padding:12px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#111827;">${r.symbol}</td>
      <td style="padding:12px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#111827;">$${r.price.toFixed(2)}</td>
      <td style="padding:12px; border-bottom:1px solid #e5e7eb; font-size:14px; color:${r.changePercent >= 0 ? '#065f46' : '#b91c1c'};" align="right">${r.changePercent >= 0 ? '+' : ''}${r.changePercent.toFixed(2)}%</td>
    </tr>
  `).join('');
}

function buildValuationRows(rows: Array<{ symbol: string; pe: number; marketCap: number }>): string {
  return rows.map(r => `
    <tr>
      <td style="padding:12px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#111827;">${r.symbol}</td>
      <td style="padding:12px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#111827;">${r.pe > 0 ? r.pe.toFixed(1) : 'N/A'}</td>
      <td style="padding:12px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#111827;">${formatMarketCap(r.marketCap)}</td>
      <td style="padding:12px; border-bottom:1px solid #e5e7eb; font-size:12px; color:#6b7280;" align="right">${valuationNote(r.pe)}</td>
    </tr>
  `).join('');
}

function buildVolumeRows(rows: Array<{ symbol: string; volume: number; price: number }>): string {
  return rows.map(r => `
    <tr>
      <td style="padding:12px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#111827;">${r.symbol}</td>
      <td style="padding:12px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#111827;">${formatVolume(r.volume)}</td>
      <td style="padding:12px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#111827;" align="right">$${r.price.toFixed(2)}</td>
    </tr>
  `).join('');
}

function formatMarketCap(mc: number): string {
  if (!mc || mc <= 0) return 'N/A';
  if (mc >= 1e12) return `${(mc / 1e12).toFixed(2)}T`;
  if (mc >= 1e9) return `${(mc / 1e9).toFixed(2)}B`;
  if (mc >= 1e6) return `${(mc / 1e6).toFixed(2)}M`;
  return mc.toFixed(0);
}

function formatVolume(v: number): string {
  if (!v || v <= 0) return 'N/A';
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
  return v.toLocaleString();
}

function valuationNote(pe: number): string {
  if (!pe || pe <= 0) return 'No P/E data';
  if (pe < 12) return 'Potentially undervalued vs. broad market';
  if (pe > 30) return 'Rich multiple — growth expectations priced in';
  return 'Near market median';
}

function avg(arr: number[]): number {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
