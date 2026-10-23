// NeuroOption - Complete Market Definitions
// All live + OTC markets

export const MARKET_CATEGORIES = {
  OTC_FOREX: 'OTC Forex',
  OTC_CRYPTO: 'OTC Crypto',
  OTC_COMMODITIES: 'OTC Commodities',
  OTC_INDICES: 'OTC Indices',
  OTC_STOCKS: 'OTC Stocks',
  LIVE_FOREX: 'Live Forex',
  LIVE_CRYPTO: 'Live Crypto',
  LIVE_COMMODITIES: 'Live Commodities',
  LIVE_INDICES: 'Live Indices',
  LIVE_STOCKS: 'Live Stocks',
};

export const TIMEFRAMES = [
  { label: '5s',  seconds: 5   },
  { label: '15s', seconds: 15  },
  { label: '30s', seconds: 30  },
  { label: '1m',  seconds: 60  },
  { label: '2m',  seconds: 120 },
  { label: '3m',  seconds: 180 },
  { label: '5m',  seconds: 300 },
  { label: '10m', seconds: 600 },
  { label: '15m', seconds: 900 },
  { label: '30m', seconds: 1800},
  { label: '1h',  seconds: 3600},
  { label: '4h',  seconds: 14400},
];

export const MARKETS = [
  // ─── OTC FOREX ───────────────────────────────────────
  { id:'EUR/USD-OTC', symbol:'EUR/USD', name:'Euro / US Dollar',    category:'OTC_FOREX', icon:'🇪🇺', payout:85, volatility:'medium', spread:0.0002 },
  { id:'GBP/USD-OTC', symbol:'GBP/USD', name:'British Pound / USD', category:'OTC_FOREX', icon:'🇬🇧', payout:83, volatility:'high',   spread:0.0003 },
  { id:'USD/JPY-OTC', symbol:'USD/JPY', name:'US Dollar / Yen',     category:'OTC_FOREX', icon:'🇯🇵', payout:84, volatility:'medium', spread:0.02   },
  { id:'USD/CHF-OTC', symbol:'USD/CHF', name:'US Dollar / CHF',     category:'OTC_FOREX', icon:'🇨🇭', payout:82, volatility:'medium', spread:0.0003 },
  { id:'AUD/USD-OTC', symbol:'AUD/USD', name:'Aussie / USD',        category:'OTC_FOREX', icon:'🇦🇺', payout:81, volatility:'medium', spread:0.0003 },
  { id:'USD/CAD-OTC', symbol:'USD/CAD', name:'US Dollar / CAD',     category:'OTC_FOREX', icon:'🇨🇦', payout:80, volatility:'medium', spread:0.0003 },
  { id:'NZD/USD-OTC', symbol:'NZD/USD', name:'NZD / USD',           category:'OTC_FOREX', icon:'🇳🇿', payout:80, volatility:'medium', spread:0.0004 },
  { id:'EUR/GBP-OTC', symbol:'EUR/GBP', name:'Euro / British Pound',category:'OTC_FOREX', icon:'🇪🇺', payout:79, volatility:'low',    spread:0.0003 },
  { id:'EUR/JPY-OTC', symbol:'EUR/JPY', name:'Euro / Yen',          category:'OTC_FOREX', icon:'🇪🇺', payout:82, volatility:'high',   spread:0.04   },
  { id:'GBP/JPY-OTC', symbol:'GBP/JPY', name:'GBP / Yen',          category:'OTC_FOREX', icon:'🇬🇧', payout:83, volatility:'high',   spread:0.05   },
  { id:'USD/SGD-OTC', symbol:'USD/SGD', name:'USD / Singapore $',   category:'OTC_FOREX', icon:'🇸🇬', payout:78, volatility:'low',    spread:0.0005 },
  { id:'USD/MXN-OTC', symbol:'USD/MXN', name:'USD / Mexican Peso',  category:'OTC_FOREX', icon:'🇲🇽', payout:80, volatility:'high',   spread:0.01   },
  { id:'USD/TRY-OTC', symbol:'USD/TRY', name:'USD / Turkish Lira',  category:'OTC_FOREX', icon:'🇹🇷', payout:82, volatility:'extreme',spread:0.05   },
  { id:'EUR/AUD-OTC', symbol:'EUR/AUD', name:'Euro / Aussie',       category:'OTC_FOREX', icon:'🇪🇺', payout:79, volatility:'medium', spread:0.0004 },
  { id:'GBP/AUD-OTC', symbol:'GBP/AUD', name:'GBP / Aussie',       category:'OTC_FOREX', icon:'🇬🇧', payout:80, volatility:'high',   spread:0.0005 },
  { id:'AUD/JPY-OTC', symbol:'AUD/JPY', name:'Aussie / Yen',        category:'OTC_FOREX', icon:'🇦🇺', payout:81, volatility:'high',   spread:0.04   },
  { id:'CAD/JPY-OTC', symbol:'CAD/JPY', name:'CAD / Yen',           category:'OTC_FOREX', icon:'🇨🇦', payout:80, volatility:'high',   spread:0.04   },
  { id:'CHF/JPY-OTC', symbol:'CHF/JPY', name:'CHF / Yen',           category:'OTC_FOREX', icon:'🇨🇭', payout:80, volatility:'high',   spread:0.04   },
  { id:'USD/INR-OTC', symbol:'USD/INR', name:'USD / Indian Rupee',  category:'OTC_FOREX', icon:'🇮🇳', payout:78, volatility:'medium', spread:0.05   },
  { id:'USD/BRL-OTC', symbol:'USD/BRL', name:'USD / Brazilian Real',category:'OTC_FOREX', icon:'🇧🇷', payout:80, volatility:'high',   spread:0.03   },

  // ─── OTC CRYPTO ──────────────────────────────────────
  { id:'BTC/USD-OTC', symbol:'BTC/USD', name:'Bitcoin / USD',       category:'OTC_CRYPTO', icon:'₿', payout:90, volatility:'extreme', spread:15    },
  { id:'ETH/USD-OTC', symbol:'ETH/USD', name:'Ethereum / USD',      category:'OTC_CRYPTO', icon:'Ξ', payout:88, volatility:'extreme', spread:0.8   },
  { id:'BNB/USD-OTC', symbol:'BNB/USD', name:'BNB / USD',           category:'OTC_CRYPTO', icon:'🔶',payout:86, volatility:'high',    spread:0.2   },
  { id:'SOL/USD-OTC', symbol:'SOL/USD', name:'Solana / USD',        category:'OTC_CRYPTO', icon:'◎', payout:87, volatility:'extreme', spread:0.1   },
  { id:'XRP/USD-OTC', symbol:'XRP/USD', name:'Ripple / USD',        category:'OTC_CRYPTO', icon:'✕', payout:85, volatility:'high',    spread:0.003 },
  { id:'ADA/USD-OTC', symbol:'ADA/USD', name:'Cardano / USD',       category:'OTC_CRYPTO', icon:'₳', payout:84, volatility:'high',    spread:0.001 },
  { id:'DOGE/USD-OTC',symbol:'DOGE/USD',name:'Dogecoin / USD',      category:'OTC_CRYPTO', icon:'🐕',payout:85, volatility:'extreme', spread:0.001 },
  { id:'AVAX/USD-OTC',symbol:'AVAX/USD',name:'Avalanche / USD',     category:'OTC_CRYPTO', icon:'🔺',payout:86, volatility:'high',    spread:0.05  },
  { id:'MATIC/USD-OTC',symbol:'MATIC/USD',name:'Polygon / USD',     category:'OTC_CRYPTO', icon:'🟣',payout:84, volatility:'high',    spread:0.002 },
  { id:'LTC/USD-OTC', symbol:'LTC/USD', name:'Litecoin / USD',      category:'OTC_CRYPTO', icon:'Ł', payout:83, volatility:'high',    spread:0.1   },

  // ─── OTC COMMODITIES ─────────────────────────────────
  { id:'GOLD-OTC',    symbol:'XAU/USD', name:'Gold / USD',          category:'OTC_COMMODITIES', icon:'🥇', payout:82, volatility:'medium', spread:0.5  },
  { id:'SILVER-OTC',  symbol:'XAG/USD', name:'Silver / USD',        category:'OTC_COMMODITIES', icon:'🥈', payout:80, volatility:'high',   spread:0.01 },
  { id:'PLATINUM-OTC',symbol:'XPT/USD', name:'Platinum / USD',      category:'OTC_COMMODITIES', icon:'⬡',  payout:79, volatility:'medium', spread:1.0  },
  { id:'OIL-OTC',     symbol:'WTI/USD', name:'Crude Oil / USD',     category:'OTC_COMMODITIES', icon:'🛢️', payout:83, volatility:'high',   spread:0.05 },
  { id:'BRENT-OTC',   symbol:'BRENT',   name:'Brent Oil / USD',     category:'OTC_COMMODITIES', icon:'⛽', payout:82, volatility:'high',   spread:0.05 },
  { id:'GAS-OTC',     symbol:'NGAS',    name:'Natural Gas',          category:'OTC_COMMODITIES', icon:'🔥', payout:80, volatility:'extreme',spread:0.01 },
  { id:'COPPER-OTC',  symbol:'COPPER',  name:'Copper / USD',         category:'OTC_COMMODITIES', icon:'🟤', payout:79, volatility:'medium', spread:0.01 },
  { id:'WHEAT-OTC',   symbol:'WHEAT',   name:'Wheat',               category:'OTC_COMMODITIES', icon:'🌾', payout:78, volatility:'medium', spread:0.5  },
  { id:'CORN-OTC',    symbol:'CORN',    name:'Corn',                 category:'OTC_COMMODITIES', icon:'🌽', payout:78, volatility:'medium', spread:0.3  },
  { id:'COFFEE-OTC',  symbol:'COFFEE',  name:'Coffee',               category:'OTC_COMMODITIES', icon:'☕', payout:79, volatility:'high',   spread:0.2  },

  // ─── OTC INDICES ─────────────────────────────────────
  { id:'SP500-OTC',   symbol:'US500',   name:'S&P 500 Index',        category:'OTC_INDICES', icon:'🇺🇸', payout:83, volatility:'medium', spread:0.5  },
  { id:'NASDAQ-OTC',  symbol:'NAS100',  name:'Nasdaq 100',           category:'OTC_INDICES', icon:'💻', payout:84, volatility:'high',   spread:1.0  },
  { id:'DOW-OTC',     symbol:'US30',    name:'Dow Jones',            category:'OTC_INDICES', icon:'📊', payout:82, volatility:'medium', spread:2.0  },
  { id:'DAX-OTC',     symbol:'GER40',   name:'DAX 40',               category:'OTC_INDICES', icon:'🇩🇪', payout:82, volatility:'medium', spread:1.0  },
  { id:'FTSE-OTC',    symbol:'UK100',   name:'FTSE 100',             category:'OTC_INDICES', icon:'🇬🇧', payout:81, volatility:'medium', spread:1.5  },
  { id:'CAC-OTC',     symbol:'FRA40',   name:'CAC 40',               category:'OTC_INDICES', icon:'🇫🇷', payout:80, volatility:'medium', spread:1.0  },
  { id:'NIKKEI-OTC',  symbol:'JPN225',  name:'Nikkei 225',           category:'OTC_INDICES', icon:'🇯🇵', payout:82, volatility:'high',   spread:5.0  },
  { id:'ASX-OTC',     symbol:'AUS200',  name:'ASX 200',              category:'OTC_INDICES', icon:'🇦🇺', payout:80, volatility:'medium', spread:2.0  },
  { id:'HANG-OTC',    symbol:'HK50',    name:'Hang Seng',            category:'OTC_INDICES', icon:'🇭🇰', payout:82, volatility:'high',   spread:5.0  },
  { id:'VIX-OTC',     symbol:'VIX',     name:'Volatility Index',     category:'OTC_INDICES', icon:'⚡', payout:86, volatility:'extreme',spread:0.05 },

  // ─── OTC STOCKS ──────────────────────────────────────
  { id:'AAPL-OTC',    symbol:'AAPL',    name:'Apple Inc.',           category:'OTC_STOCKS', icon:'🍎', payout:80, volatility:'medium', spread:0.05 },
  { id:'TSLA-OTC',    symbol:'TSLA',    name:'Tesla Inc.',           category:'OTC_STOCKS', icon:'⚡', payout:85, volatility:'extreme',spread:0.2  },
  { id:'AMZN-OTC',    symbol:'AMZN',    name:'Amazon.com',           category:'OTC_STOCKS', icon:'📦', payout:81, volatility:'high',   spread:0.15 },
  { id:'GOOGL-OTC',   symbol:'GOOGL',   name:'Alphabet Inc.',        category:'OTC_STOCKS', icon:'🔍', payout:80, volatility:'medium', spread:0.1  },
  { id:'MSFT-OTC',    symbol:'MSFT',    name:'Microsoft Corp.',      category:'OTC_STOCKS', icon:'🪟', payout:80, volatility:'medium', spread:0.05 },
  { id:'META-OTC',    symbol:'META',    name:'Meta Platforms',       category:'OTC_STOCKS', icon:'🔵', payout:82, volatility:'high',   spread:0.1  },
  { id:'NVDA-OTC',    symbol:'NVDA',    name:'NVIDIA Corp.',         category:'OTC_STOCKS', icon:'🟢', payout:86, volatility:'extreme',spread:0.2  },
  { id:'NFLX-OTC',    symbol:'NFLX',    name:'Netflix Inc.',         category:'OTC_STOCKS', icon:'🎬', payout:83, volatility:'high',   spread:0.15 },
  { id:'UBER-OTC',    symbol:'UBER',    name:'Uber Technologies',    category:'OTC_STOCKS', icon:'🚗', payout:81, volatility:'high',   spread:0.05 },
  { id:'COIN-OTC',    symbol:'COIN',    name:'Coinbase Global',      category:'OTC_STOCKS', icon:'🪙', payout:85, volatility:'extreme',spread:0.2  },
  { id:'AMD-OTC',     symbol:'AMD',     name:'AMD Inc.',             category:'OTC_STOCKS', icon:'🔴', payout:83, volatility:'high',   spread:0.1  },
  { id:'PYPL-OTC',    symbol:'PYPL',    name:'PayPal Holdings',      category:'OTC_STOCKS', icon:'💳', payout:80, volatility:'medium', spread:0.05 },
  { id:'SHOP-OTC',    symbol:'SHOP',    name:'Shopify Inc.',         category:'OTC_STOCKS', icon:'🛒', payout:82, volatility:'high',   spread:0.1  },
  { id:'SQ-OTC',      symbol:'SQ',      name:'Block Inc.',           category:'OTC_STOCKS', icon:'◼', payout:81, volatility:'high',   spread:0.05 },
  { id:'BABA-OTC',    symbol:'BABA',    name:'Alibaba Group',        category:'OTC_STOCKS', icon:'🔶', payout:82, volatility:'high',   spread:0.1  },
  { id:'TWTR-OTC',    symbol:'X',       name:'X (Twitter)',          category:'OTC_STOCKS', icon:'🐦', payout:80, volatility:'extreme',spread:0.05 },
  { id:'DIS-OTC',     symbol:'DIS',     name:'Walt Disney Co.',      category:'OTC_STOCKS', icon:'🏰', payout:79, volatility:'medium', spread:0.05 },
  { id:'BAC-OTC',     symbol:'BAC',     name:'Bank of America',      category:'OTC_STOCKS', icon:'🏦', payout:79, volatility:'medium', spread:0.03 },
  { id:'JPM-OTC',     symbol:'JPM',     name:'JPMorgan Chase',       category:'OTC_STOCKS', icon:'💼', payout:79, volatility:'medium', spread:0.05 },
  { id:'GS-OTC',      symbol:'GS',      name:'Goldman Sachs',        category:'OTC_STOCKS', icon:'💹', payout:80, volatility:'high',   spread:0.1  },

  // ─── LIVE FOREX ──────────────────────────────────────
  { id:'EUR/USD', symbol:'EUR/USD', name:'Euro / US Dollar',    category:'LIVE_FOREX', icon:'🇪🇺', payout:75, volatility:'medium', spread:0.0001 },
  { id:'GBP/USD', symbol:'GBP/USD', name:'British Pound / USD', category:'LIVE_FOREX', icon:'🇬🇧', payout:74, volatility:'high',   spread:0.0002 },
  { id:'USD/JPY', symbol:'USD/JPY', name:'US Dollar / Yen',     category:'LIVE_FOREX', icon:'🇯🇵', payout:74, volatility:'medium', spread:0.01   },
  { id:'AUD/USD', symbol:'AUD/USD', name:'Aussie / USD',        category:'LIVE_FOREX', icon:'🇦🇺', payout:72, volatility:'medium', spread:0.0002 },

  // ─── LIVE CRYPTO ─────────────────────────────────────
  { id:'BTC/USD', symbol:'BTC/USD', name:'Bitcoin / USD',       category:'LIVE_CRYPTO', icon:'₿', payout:80, volatility:'extreme', spread:10    },
  { id:'ETH/USD', symbol:'ETH/USD', name:'Ethereum / USD',      category:'LIVE_CRYPTO', icon:'Ξ', payout:78, volatility:'extreme', spread:0.5   },
  { id:'SOL/USD', symbol:'SOL/USD', name:'Solana / USD',        category:'LIVE_CRYPTO', icon:'◎', payout:77, volatility:'extreme', spread:0.05  },

  // ─── LIVE COMMODITIES ────────────────────────────────
  { id:'XAU/USD', symbol:'XAU/USD', name:'Gold / USD',          category:'LIVE_COMMODITIES', icon:'🥇', payout:73, volatility:'medium', spread:0.3 },
  { id:'XAG/USD', symbol:'XAG/USD', name:'Silver / USD',        category:'LIVE_COMMODITIES', icon:'🥈', payout:72, volatility:'high',   spread:0.01},
  { id:'WTI/USD', symbol:'WTI/USD', name:'Crude Oil / USD',     category:'LIVE_COMMODITIES', icon:'🛢️', payout:74, volatility:'high',   spread:0.03},

  // ─── LIVE INDICES ────────────────────────────────────
  { id:'US500',   symbol:'US500',   name:'S&P 500',              category:'LIVE_INDICES', icon:'🇺🇸', payout:74, volatility:'medium', spread:0.4 },
  { id:'NAS100',  symbol:'NAS100',  name:'Nasdaq 100',           category:'LIVE_INDICES', icon:'💻', payout:75, volatility:'high',   spread:0.8 },
  { id:'GER40',   symbol:'GER40',   name:'DAX 40',               category:'LIVE_INDICES', icon:'🇩🇪', payout:73, volatility:'medium', spread:0.8 },
];

export const getMarketsByCategory = (category) =>
  MARKETS.filter(m => m.category === category);

export const getOTCMarkets = () =>
  MARKETS.filter(m => m.category.startsWith('OTC_'));

export const getLiveMarkets = () =>
  MARKETS.filter(m => m.category.startsWith('LIVE_'));

export const getMarketById = (id) =>
  MARKETS.find(m => m.id === id);

export const isOTC = (marketId) =>
  marketId.endsWith('-OTC') || MARKETS.find(m=>m.id===marketId)?.category.startsWith('OTC_');

export const PAYOUT_RATES = { 5:70, 15:75, 30:80, 60:85, 120:83, 180:82, 300:85, 600:84, 900:83, 1800:82, 3600:80 };
