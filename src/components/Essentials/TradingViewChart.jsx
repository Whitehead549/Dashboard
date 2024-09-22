import React, { useEffect } from 'react';

const TradingViewChart = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;

    script.onload = () => {
      new window.TradingView.widget({
        "container_id": "tradingview_btcusd",
        "autosize": true,
        "symbol": "BINANCE:BTCUSDT", // or any other exchange symbol
        "interval": "D", // D for daily, you can change it to any valid interval like '1', '5', '15', '60', etc.
        "timezone": "Etc/UTC",
        "theme": "dark", // Set theme to dark for dark mode
        "style": "1", // 1 for candle chart style, you can change it to '2' for bars, '3' for area, etc.
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "hideideas": true,
        "studies": [],
        "watchlist": [],
        "height": 400,
      });
    };

    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="tradingview_btcusd" style={{ width: '100%', height: '400px' }} />;
};

export default TradingViewChart;
