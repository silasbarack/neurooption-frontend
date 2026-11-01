/** The real NeuroOption trading screen on a laptop and a phone, for the sign-in page. */
export default function AuthScreens() {
  return (
    <div className="au-screens" aria-label="The NeuroOption trading screen on a laptop and a phone">
      <figure className="au-laptop">
        <div className="au-laptop-lid">
          <span className="au-laptop-cam" aria-hidden="true" />
          <div className="au-laptop-screen">
            <img
              src="/auth/trading-desktop.webp"
              srcSet="/auth/trading-desktop-960.webp 960w, /auth/trading-desktop.webp 1600w"
              sizes="(max-width: 900px) 92vw, 760px"
              alt="NeuroOption trading screen on desktop: EUR/USD OTC candlestick chart with the trade panel"
              width={1600}
              height={1000}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
        <div className="au-laptop-base" aria-hidden="true"><span /></div>
      </figure>
      <figure className="au-phone">
        <div className="au-phone-body">
          <span className="au-phone-island" aria-hidden="true" />
          <div className="au-phone-screen">
            <img
              src="/auth/trading-mobile.webp"
              alt="NeuroOption trading screen on a phone: live chart with BUY and SELL buttons"
              width={585}
              height={1266}
              decoding="async"
            />
          </div>
        </div>
      </figure>
    </div>
  );
}
