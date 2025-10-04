"use client";

import useTradingViewWidget from "@/hooks/UseTradingViewWidget";
// TradingViewWidget.jsx
import React, { useRef, memo } from "react";

interface TradingViewWidgetProps {
  title?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
}

function TradingViewWidget({
  title,
  scriptUrl,
  config,
  height = 600,
  className,
}: TradingViewWidgetProps) {
  const containerRef = useTradingViewWidget(scriptUrl, config, height);

  return (
    <div className="w-full">
        {title && <h3 className="font-semibold text-2xl text-gray-100 mb-5  ">{title}</h3>}
      <div
        className="tradingview-widget-container"
        ref={containerRef}
        style={{ height: `${height}px`, width: "100%" }}
      >
        <div className="tradingview-widget-copyright">
          <a
            href="https://www.tradingview.com/"
            rel="noopener nofollow"
            target="_blank"
          >
            <span className="blue-text">Market Overview</span>
          </a>
          <span className="trademark"> by TradingView</span>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
