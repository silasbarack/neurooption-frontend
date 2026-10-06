import { Link } from "react-router-dom";
import { Coins } from "lucide-react";
import type { MarketQuote } from "../../api/account.api";
import AssetIcon from "../markets/AssetIcon";
import MarketCategoryArt from "./MarketCategoryArt";
import { FALLBACK_QUOTES, formatChange, formatPrice } from "../markets/useQuotes";
const TICKER_SYMBOLS=["EUR/USD OTC","GBP/USD OTC","BTC/USD OTC","ETH/USD OTC","US100 OTC","Gold OTC","Apple OTC","Tesla OTC"];
export function MarketTicker({quotes,live=false}:{quotes:MarketQuote[];live?:boolean}) {
  return <section className="hp-ticker" aria-label={live?"Market prices with labeled sample fallbacks":"Sample market prices"}>
    <div className="hp-wrap hp-ticker-track">{TICKER_SYMBOLS.map(symbol=>{
      const fetched=live?quotes.find(item=>item.symbol===symbol):undefined;
      const quote=fetched??FALLBACK_QUOTES.find(item=>item.symbol===symbol);if(!quote)return null;
      return <Link key={symbol} to="/trading" state={{symbol}} className="hp-ticker-item">
        <AssetIcon symbol={symbol} category={quote.category} size={24}/>
        <span><b>{symbol.replace(/ OTC$/,"")}</b><small>{formatPrice(quote)}{!fetched&&<i>Sample</i>}</small></span>
        <em className={quote.changePercent>=0?"is-up":"is-down"}>{formatChange(quote.changePercent)}</em>
      </Link>;
    })}</div>
  </section>;
}
const STATS=[["100+","Trading Assets"],["92%","Max Payout"],["24/7","Global Markets"],["< 100ms","Execution Speed"],["Multiple","Account Currencies"],["Award-Winning","Trading Experience"]];
export function PlatformStats(){return <section className="hp-stats-strip" aria-label="Platform highlights"><div className="hp-wrap hp-stats-grid">{STATS.map(([value,label])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>;}
const CATEGORIES=[
 {title:"Forex",text:"Major, minor & exotic pairs",tone:"forex",category:"Currencies"},
 {title:"Cryptocurrencies",text:"A market that never sleeps",tone:"crypto",category:"Cryptocurrencies"},
 {title:"Commodities",text:"Gold, oil and more",tone:"commodities",category:"Commodities"},
 {title:"Stocks",text:"The world's leading companies",tone:"stocks",category:"Stocks"},
 {title:"Indices",text:"The bigger market picture",tone:"indices",category:"Indices"},
 {title:"OTC Markets",text:"Opportunities around the clock",tone:"otc",category:"OTC"},
];
export function GlobalMarketsSection(){return <section id="markets" className="hp-section hp-global-markets"><div className="hp-wrap">
  <div className="hp-global-head"><div><p className="hp-eyebrow">Endless possibilities</p><h2>Trade Global Markets</h2></div><p>Currencies, cryptocurrencies, commodities, stocks and indices. Explore a world of opportunities from one powerful trading platform.</p></div>
  <div className="hp-category-grid">{CATEGORIES.map(({title,text,tone,category})=><Link key={title} to={"/markets?category="+encodeURIComponent(category)} className={"hp-category-card is-"+tone}><span className="hp-category-art"><MarketCategoryArt tone={tone}/></span><span className="hp-category-copy"><b>{title}</b><small>{text}</small></span><span className="hp-category-arrow" aria-hidden="true">→</span></Link>)}</div>
  <div className="hp-markets-note"><Coins size={15} aria-hidden="true"/><span>One account. Global markets. Your next opportunity.</span></div>
</div></section>;}
