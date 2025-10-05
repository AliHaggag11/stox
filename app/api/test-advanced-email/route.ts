import { NextRequest, NextResponse } from 'next/server';
import { sendAdvancedNewsEmail } from '@/lib/nodemailer/advanced-email';

export async function POST(request: NextRequest) {
  try {
    // Test advanced email with sample data
    const sampleNewsContent = `
      <div class="news-item">
        <div class="news-title">🚀 Tech Stocks Rally on Strong Earnings</div>
        <div class="news-summary">
          Major technology companies reported better-than-expected earnings, driving the NASDAQ to new highs. 
          AI-related stocks are leading the charge with NVIDIA up 8% and other semiconductor companies following suit.
        </div>
        <div class="news-metrics">
          <div class="metric">📈 +8.2%</div>
          <div class="metric">🔥 High Volume</div>
          <div class="metric">⭐ Strong Buy</div>
        </div>
      </div>
      
      <div class="news-item">
        <div class="news-title">📊 Federal Reserve Signals Rate Stability</div>
        <div class="news-summary">
          The Federal Reserve indicated that interest rates will remain stable for the foreseeable future, 
          providing clarity for investors and supporting market confidence across all sectors.
        </div>
        <div class="news-metrics">
          <div class="metric">📊 Stable</div>
          <div class="metric">🎯 Fed Policy</div>
          <div class="metric">✅ Positive</div>
        </div>
      </div>
    `;

    await sendAdvancedNewsEmail({
      email: 'ali7aggag@gmail.com',
      date: new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      newsContent: sampleNewsContent,
      userWatchlist: ['AAPL', 'TSLA', 'NVDA', 'GOOGL', 'MSFT']
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Advanced email sent successfully' 
    });
  } catch (error) {
    console.error('Error sending advanced email:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send advanced email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
