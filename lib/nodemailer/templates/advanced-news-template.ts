export const ADVANCED_NEWS_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Signalist Daily Market Briefing</title>
    <!-- Use safe, inline styles only; most email clients strip CSS -->
  </head>
  <body style="margin:0; padding:0; background:#f5f7fb; color:#111827; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
    <!-- Wrapper -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f5f7fb;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <!-- Container -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px; max-width:100%; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.06);">
            <!-- Header -->
            <tr>
              <td style="padding:24px 24px 12px; border-bottom:1px solid #e5e7eb;">
                <div style="font-size:20px; font-weight:700; color:#111827;">Signalist Daily Market Briefing</div>
                <div style="margin-top:6px; font-size:14px; color:#6b7280;">{{date}}</div>
              </td>
            </tr>

            <!-- Market Snapshot -->
            <tr>
              <td style="padding:16px 24px;">
                <div style="font-size:16px; font-weight:600; color:#111827; margin-bottom:8px;">Market Snapshot</div>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e5e7eb; border-radius:8px;">
                  <tr>
                    <td style="padding:12px; border-bottom:1px solid #e5e7eb; background:#f9fafb; font-size:12px; text-transform:uppercase; color:#6b7280;">Index</td>
                    <td style="padding:12px; border-bottom:1px solid #e5e7eb; background:#f9fafb; font-size:12px; text-transform:uppercase; color:#6b7280;" align="right">Change</td>
                  </tr>
                  {{marketSnapshot}}
                </table>
              </td>
            </tr>

            <!-- Top Movers (Premium) -->
            <tr>
              <td style="padding:8px 24px 0;">
                <div style="font-size:16px; font-weight:600; color:#111827; margin-bottom:8px;">Top Movers (Your Watchlist)</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 8px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e5e7eb; border-radius:8px;">
                  <tr>
                    <td style="padding:12px; background:#f9fafb; font-size:12px; text-transform:uppercase; color:#6b7280;">Symbol</td>
                    <td style="padding:12px; background:#f9fafb; font-size:12px; text-transform:uppercase; color:#6b7280;">Price</td>
                    <td style="padding:12px; background:#f9fafb; font-size:12px; text-transform:uppercase; color:#6b7280;" align="right">Change</td>
                  </tr>
                  {{topMovers}}
                </table>
              </td>
            </tr>

            <!-- Valuation Snapshot (Premium) -->
            <tr>
              <td style="padding:8px 24px 0;">
                <div style="font-size:16px; font-weight:600; color:#111827; margin-bottom:8px;">Valuation Snapshot</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 8px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e5e7eb; border-radius:8px;">
                  <tr>
                    <td style="padding:12px; background:#f9fafb; font-size:12px; text-transform:uppercase; color:#6b7280;">Symbol</td>
                    <td style="padding:12px; background:#f9fafb; font-size:12px; text-transform:uppercase; color:#6b7280;">P/E</td>
                    <td style="padding:12px; background:#f9fafb; font-size:12px; text-transform:uppercase; color:#6b7280;">Market Cap</td>
                    <td style="padding:12px; background:#f9fafb; font-size:12px; text-transform:uppercase; color:#6b7280;" align="right">Note</td>
                  </tr>
                  {{valuationRows}}
                </table>
              </td>
            </tr>

            <!-- Volume Leaders (Premium) -->
            <tr>
              <td style="padding:8px 24px 0;">
                <div style="font-size:16px; font-weight:600; color:#111827; margin-bottom:8px;">Volume Leaders</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 8px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e5e7eb; border-radius:8px;">
                  <tr>
                    <td style="padding:12px; background:#f9fafb; font-size:12px; text-transform:uppercase; color:#6b7280;">Symbol</td>
                    <td style="padding:12px; background:#f9fafb; font-size:12px; text-transform:uppercase; color:#6b7280;">Volume</td>
                    <td style="padding:12px; background:#f9fafb; font-size:12px; text-transform:uppercase; color:#6b7280;" align="right">Price</td>
                  </tr>
                  {{volumeRows}}
                </table>
              </td>
            </tr>

            <!-- Top Stories -->
            <tr>
              <td style="padding:8px 24px 0;">
                <div style="font-size:16px; font-weight:600; color:#111827; margin-bottom:8px;">Top Stories</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 8px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e5e7eb; border-radius:8px;">
                  <tr>
                    <td style="padding:16px; font-size:14px; color:#111827; line-height:1.6;">
                      {{newsSections}}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Your Watchlist -->
            <tr>
              <td style="padding:8px 24px 0;">
                <div style="font-size:16px; font-weight:600; color:#111827; margin-bottom:8px;">Your Watchlist</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 16px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e5e7eb; border-radius:8px;">
                  <tr>
                    <td style="padding:12px; background:#f9fafb; font-size:12px; text-transform:uppercase; color:#6b7280;">Symbol</td>
                    <td style="padding:12px; background:#f9fafb; font-size:12px; text-transform:uppercase; color:#6b7280;">Price</td>
                    <td style="padding:12px; background:#f9fafb; font-size:12px; text-transform:uppercase; color:#6b7280;" align="right">Change</td>
                  </tr>
                  {{watchlistRows}}
                </table>
                <div style="margin-top:12px; font-size:12px; color:#6b7280;">Tip: Add more symbols to your watchlist to personalize this section.</div>
              </td>
            </tr>

            <!-- Outlook (Premium) -->
            <tr>
              <td style="padding:8px 24px 0;">
                <div style="font-size:16px; font-weight:600; color:#111827; margin-bottom:8px;">Tomorrow's Outlook</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 16px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e5e7eb; border-radius:8px;">
                  <tr>
                    <td style="padding:16px; font-size:14px; color:#111827; line-height:1.6;">
                      {{outlook}}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td style="padding:8px 24px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="left">
                  <tr>
                    <td style="border-radius:8px; background:#facc15;">
                      <a href="{{ctaUrl}}" style="display:inline-block; padding:10px 14px; text-decoration:none; font-size:14px; font-weight:600; color:#1f2937;">Open Watchlist</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:16px 24px; border-top:1px solid #e5e7eb; background:#fafafa;">
                <div style="font-size:12px; color:#6b7280;">You’re receiving this email because you enabled daily market emails in Signalist.</div>
                <div style="font-size:12px; color:#6b7280; margin-top:6px;">
                  <a href="{{managePrefsUrl}}" style="color:#2563eb; text-decoration:none;">Manage preferences</a> · 
                  <a href="{{unsubscribeUrl}}" style="color:#ef4444; text-decoration:none;">Unsubscribe</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
