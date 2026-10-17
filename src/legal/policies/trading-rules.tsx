import type { Policy } from "../types";
import { Callout, Co, Definitions, PolicyLink, Table } from "../components";

const policy: Policy = {
  slug: "trading-rules",
  title: "Trading Rules and Execution Policy",
  summary:
    "The exact rules for how trades on NeuroOption are requested, accepted, priced, timed and settled, how payouts are set and locked, what happens when something goes wrong, and how the demo account works. All prices come from our own synthetic OTC price engine and NeuroOption is the other side of every trade.",
  updated: "2026-10-16",
  sections: [
    {
      id: "about-this-policy",
      title: "1. About this policy",
      body: (
        <>
          <h3>1.1 Who we are</h3>
          <p>
            In this policy, "NeuroOption", "we", "us" and "our" mean <Co field="legalName" /> (trading as NeuroOption), a company
            incorporated in <Co field="jurisdiction" /> with registration number <Co field="registrationNumber" /> and its registered office
            at <Co field="registeredAddress" />. "You" and "your" mean the person using the NeuroOption website and trading platform at
            https://neurooption.com.
          </p>
          <h3>1.2 What this policy covers</h3>
          <p>
            This policy sets out the operational rules that apply to every trade on NeuroOption: which instruments you can trade, how their
            prices are produced, how you place a trade, the limits on stakes and expiries, how payouts are set and locked, how trades are
            accepted, rejected and settled, how results are calculated, and what we do when there is a delay, outage or error. It also sets out
            the rules for the demo account and how account currencies and trade records work.
          </p>
          <h3>1.3 How this policy fits with our other documents</h3>
          <p>
            This policy forms part of your agreement with us under the <PolicyLink slug="terms">Terms and Conditions</PolicyLink>. If this
            policy and the Terms and Conditions say different things about how trades are placed, priced or settled, this policy applies. The
            details of a specific trade that the platform shows you and confirms when it accepts the trade, such as the locked payout percentage
            and the expiry, take priority over both. Please also read:
          </p>
          <ul>
            <li>
              the <PolicyLink slug="risk-disclosure">Risk Disclosure</PolicyLink>, which explains the risks of trading, including the risk of
              losing every stake;
            </li>
            <li>
              the <PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink>, which explains the conflicts that arise
              because we produce the prices, set the payouts and take the other side of every trade;
            </li>
            <li>
              the <PolicyLink slug="responsible-trading">Responsible Trading Policy</PolicyLink>, which explains how to keep control of your
              trading; and
            </li>
            <li>
              the <PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink>, which explains how money will
              move into and out of a real account.
            </li>
          </ul>
          <h3>1.4 Our regulatory status</h3>
          <Table
            head={["Item", "Details"]}
            rows={[
              ["Regulator", <Co field="regulator" />],
              ["Licence", <Co field="licence" />],
            ]}
          />
          <p>
            Do not assume that NeuroOption is licensed, regulated or supervised by any authority beyond what is stated in this table. Nothing in
            this policy limits any right you have under Kenyan law that cannot be limited by agreement, including under the Consumer Protection
            Act 2012.
          </p>
          <Callout tone="info" title="Real-money services are not available yet">
            <p>
              Today NeuroOption offers demo trading with virtual funds only. Real-money deposits, withdrawals and trades are switched off on the
              platform, and a real-money trade request is refused with the message "Real-money transactions are not available." Where this policy
              describes real accounts, it explains how they will work when real-money accounts are available. Nothing in this policy means that
              real-money services are available now.
            </p>
          </Callout>
          <Callout tone="risk" title="Key points">
            <ul>
              <li>
                <strong>Every price is synthetic.</strong> All 67 instruments are "OTC" instruments priced by NeuroOption's own price engine. They
                are not prices from any exchange, interbank market or data provider.
              </li>
              <li>
                <strong>We are your counterparty.</strong> NeuroOption takes the other side of every trade. When you win, we pay; when you lose,
                we keep your stake.
              </li>
              <li>
                <strong>A losing trade loses the whole stake.</strong> A winning trade pays your stake back plus the locked payout percentage of
                it, which is always less than 100%.
              </li>
              <li>
                <strong>A trade cannot be closed or cancelled early.</strong> Once accepted, it runs to expiry.
              </li>
              <li>
                <strong>Pressing Buy or Sell places the trade at once.</strong> There is no separate confirmation step, so check everything before
                you press.
              </li>
            </ul>
          </Callout>
        </>
      ),
    },
    {
      id: "definitions",
      title: "2. Definitions",
      body: (
        <>
          <p>In this policy, the following words have these meanings:</p>
          <Definitions
            items={[
              [
                "Acceptance",
                <>
                  The moment our server accepts your trade request and opens the trade. A trade exists only from this moment. "Accepted" has the
                  same meaning.
                </>,
              ],
              [
                "Asset payout",
                <>
                  The payout percentage our payout engine currently publishes for an instrument. It is the payout for a 60-second trade, before
                  any expiry adjustment (section 9.5).
                </>,
              ],
              [
                "Available balance",
                <>The amount in the selected account that you can use to trade. It does not include locked funds or stakes on open trades.</>,
              ],
              [
                "Baseline payout",
                <>The standard payout set for each instrument, from which market-condition adjustments are made (section 9.3).</>,
              ],
              ["BUY", <>A trade that wins if the settlement price is higher than the entry price.</>],
              [
                "Demo account",
                <>The practice account shown on the platform as "QT Demo", funded with virtual funds in US dollars (section 16).</>,
              ],
              ["Draw", <>A trade whose settlement price is exactly equal to its entry price. Your stake is returned.</>],
              ["EAT", <>East Africa Time, which is UTC+3 all year round.</>],
              ["Entry price", <>The platform's mid price for the instrument at the moment of acceptance.</>],
              [
                "Expiry",
                <>
                  The length of a trade, which you choose before you trade, from 5 seconds to 5 hours. The "expiry time" is the moment the trade
                  ends: the time of acceptance plus the expiry.
                </>,
              ],
              [
                "Instrument",
                <>
                  A synthetic over-the-counter ("OTC") instrument offered on the platform, such as "EUR/USD OTC" or "Gold OTC" (section 4).
                </>,
              ],
              ["Loss", <>A trade that settles against the direction you chose. You lose the whole stake.</>],
              [
                "Mid price",
                <>The price our price engine quotes for an instrument at a given moment, midway between its internal bid and ask quotes. Trades use only the mid price, with no spread added or taken away.</>,
              ],
              [
                "OTC",
                <>
                  "Over the counter". On NeuroOption it means the instrument is priced by our own engine and traded only with us, not on an
                  exchange or other market.
                </>,
              ],
              [
                "Payout percentage",
                <>
                  The profit you receive on a winning trade, as a percentage of your stake. It is shown before you trade and locked at
                  acceptance.
                </>,
              ],
              ["Platform", <>The NeuroOption website, trading screen, price engine, payout engine and related systems.</>],
              ["Price engine", <>NeuroOption's own system that generates the price of every instrument on the platform.</>],
              [
                "Public demo",
                <>The single demo account shared by all visitors who use the trading screen without signing in (section 16.7).</>,
              ],
              [
                "Real account",
                <>
                  The account shown on the platform as "QT Real", held in Kenya Shillings (KES) and funded with real money, when real-money
                  accounts are available.
                </>,
              ],
              ["SELL", <>A trade that wins if the settlement price is lower than the entry price.</>],
              ["Settlement", <>The process by which our systems close a trade after expiry, decide its outcome and apply the result to your balance.</>],
              ["Settlement price", <>The platform's mid price for the instrument at the moment settlement runs, at or after the expiry time.</>],
              ["Stake", <>The amount you commit to a trade. It is taken from your available balance at acceptance.</>],
              [
                "Technical error",
                <>
                  A fault in the platform or a human error that affects a price, payout, acceptance, settlement, credit or debit, as described in
                  section 15. A "clearly erroneous price" is one kind of technical error.
                </>,
              ],
              [
                "Trade",
                <>
                  A fixed-time (sometimes called "binary") option between you and us: a contract that pays a fixed profit if the instrument's price
                  moves in the direction you chose by the expiry time, and loses your stake if it does not.
                </>,
              ],
              ["Trade request", <>The instruction your device sends to our server when you press Buy or Sell.</>],
              ["Virtual funds", <>Demo money in US dollars that has no monetary value.</>],
              ["Void", <>Treated as if the trade had never been placed: the stake is returned and any profit paid on it is reversed.</>],
              ["Win", <>A trade that settles in the direction you chose. You receive your stake back plus the profit set by the payout percentage.</>],
            ]}
          />
        </>
      ),
    },
    {
      id: "nature-of-trades",
      title: "3. What a NeuroOption trade is",
      body: (
        <>
          <h3>3.1 A fixed-time option</h3>
          <p>
            Every trade on NeuroOption is a fixed-time option. You predict whether the price of an instrument will be higher (BUY) or lower
            (SELL) at the end of a period you choose. If you are right, you receive a fixed profit set by the payout percentage. If you are wrong,
            you lose your stake. If the price ends exactly where it started, your stake is returned.
          </p>
          <h3>3.2 We are the other side of every trade</h3>
          <p>
            Every trade is a contract between you and NeuroOption. There is no exchange, no order book and no other client on the other side.
            We do not pass your trades to any exchange or other market.
          </p>
          <Callout tone="warn" title="This is a conflict of interest">
            <p>
              Your profit is our cost and your loss is our gain. We also produce the prices that decide the outcome of your trades and set the
              payouts. Section 9.8 explains how payouts are kept the same for every client, and the{" "}
              <PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink> explains how we deal with this conflict.
            </p>
          </Callout>
          <h3>3.3 Execution only</h3>
          <p>
            You decide whether to trade, which instrument, which direction, the stake and the expiry. We accept and settle trades under these
            rules. We do not give advice, recommend trades or check whether trading is suitable for you.
          </p>
          <h3>3.4 You do not own anything</h3>
          <p>
            A trade gives you no ownership of, or rights in, any currency, cryptocurrency, share, index or commodity. Instrument names refer to
            real-world assets only as labels.
          </p>
          <h3>3.5 No commission, no spread, no trading fees</h3>
          <p>
            We do not charge commission or any fee for placing or settling a trade, and we do not add a spread to the entry or settlement price.
            Our trading income comes from being the counterparty to your trades. Because a winning trade pays less than 100% profit while a losing
            trade loses the whole stake, the average result over many trades is a loss for you (see the{" "}
            <PolicyLink slug="risk-disclosure">Risk Disclosure</PolicyLink>).
          </p>
          <h3>3.6 The same rules for demo and real accounts</h3>
          <p>
            The rules in this policy apply in the same way to the demo account and, when they are available, to real accounts. The only
            differences are the ones set out in sections 16 and 17, such as the currency and the fact that virtual funds have no value.
          </p>
        </>
      ),
    },
    {
      id: "instruments",
      title: "4. Instruments",
      body: (
        <>
          <h3>4.1 What you can trade</h3>
          <p>
            NeuroOption currently offers 67 instruments in five categories. On the platform every instrument name ends in "OTC", for example
            "EUR/USD OTC", "BTC/USD OTC", "Apple OTC", "US 500 OTC" and "Gold OTC".
          </p>
          <Table
            head={["Category", "Number", "Instruments (each followed by \"OTC\")", "Price decimals"]}
            rows={[
              [
                "Currency pairs",
                "20",
                <>
                  EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, USD/CHF, NZD/USD, EUR/GBP, EUR/JPY, GBP/JPY, AUD/JPY, CAD/JPY, CHF/JPY, EUR/AUD,
                  GBP/AUD, AUD/CAD, AUD/NZD, EUR/CAD, GBP/CAD, USD/ZAR
                </>,
                "3 to 5",
              ],
              [
                "Cryptocurrencies",
                "11",
                <>BTC/USD, ETH/USD, BNB/USD, SOL/USD, XRP/USD, ADA/USD, DOGE/USD, LTC/USD, DOT/USD, AVAX/USD, LINK/USD</>,
                "2 to 5",
              ],
              [
                "Stocks",
                "16",
                <>
                  Apple, Tesla, Amazon, Microsoft, Meta, Google, NVIDIA, Netflix, AMD, Intel, JPMorgan, Visa, Coca-Cola, McDonald’s, Boeing,
                  Toyota
                </>,
                "3",
              ],
              [
                "Indices",
                "10",
                <>US 500, US 100, Dow Jones, UK 100, Germany 40, France 40, Japan 225, Hong Kong 50, Australia 200, EU 50</>,
                "2",
              ],
              [
                "Commodities",
                "10",
                <>Gold, Silver, Brent, WTI Oil, Natural Gas, Copper, Platinum, Coffee, Sugar, Cocoa</>,
                "2 to 4",
              ],
            ]}
          />
          <p>
            The instrument list on the trading screen shows the instruments we offer. If this table and the list on the platform differ, the
            platform applies, and a trade request on an instrument that is not available is refused.
          </p>
          <h3>4.2 Every instrument is synthetic</h3>
          <ul>
            <li>
              Every instrument is priced by our own price engine (section 5). No instrument is linked to, or priced from, the real currency,
              cryptocurrency, share, index or commodity whose name it uses.
            </li>
            <li>
              "Apple OTC" is not Apple Inc. shares, "US 500 OTC" is not the S&amp;P 500 index, and "EUR/USD OTC" is not the euro to US dollar
              exchange rate. The companies, exchanges and index providers whose names appear on the platform have no connection with NeuroOption.
            </li>
            <li>The price of an instrument on NeuroOption can differ, sometimes widely, from the real-world price of the asset with a similar name.</li>
          </ul>
          <h3>4.3 Trading hours and availability</h3>
          <p>
            The platform has no trading-hours timetable. Instruments are not tied to the opening hours of any real market, so they can be traded
            at any time the platform is operating, including at night, at weekends and on public holidays. Trading is not available when the
            platform is down for maintenance or because of an outage (section 14), or when an instrument has been suspended under section 4.5.
          </p>
          <h3>4.4 Price precision</h3>
          <p>
            Each instrument is priced to a fixed number of decimal places, shown in the table above (for example 5 for EUR/USD OTC and 2 for Gold
            OTC). Entry and settlement prices are recorded at that precision, and the smallest possible price step is one unit of the last
            decimal place. Whether a trade wins, loses or draws is decided by comparing prices at that precision.
          </p>
          <h3>4.5 Suspending, adding or withdrawing instruments</h3>
          <ul>
            <li>
              We may add instruments, or suspend or withdraw any instrument, at any time, for example because of a technical problem, a suspected
              technical error, maintenance, a legal or regulatory requirement, or a business decision.
            </li>
            <li>While an instrument is suspended or withdrawn, trade requests on it are refused.</li>
            <li>
              A suspension or withdrawal does not cancel trades already accepted on that instrument. They run to expiry and settle under these
              rules. If a trade cannot be settled because the instrument's price is no longer available, we will void it and return your stake.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "how-prices-are-formed",
      title: "5. How prices are formed",
      body: (
        <>
          <h3>5.1 Our own price engine</h3>
          <p>
            All prices on NeuroOption are produced by our own price engine, which runs on our servers. For each instrument the engine generates a
            continuous series of prices using seeded pseudo-random processes, combined with rules that create features seen in real markets,
            such as calm and volatile periods, ranges, trends and breakouts. Each instrument has its own starting level and its own typical size of
            price movement.
          </p>
          <ul>
            <li>Prices are not taken from, or checked against, any exchange, interbank market, broker or market-data provider.</li>
            <li>News, economic data, company results and other real-world events do not move these prices.</li>
            <li>The engine does not use any information about who is trading, client balances, open trades or trade results.</li>
          </ul>
          <h3>5.2 How often prices change</h3>
          <p>
            The engine updates each instrument's price many times a second. Because of this, the price shown on your screen can change between
            the moment you press Buy or Sell and the moment our server accepts your trade (section 11.2).
          </p>
          <h3>5.3 One mid price, no spread</h3>
          <p>
            Every trade uses the instrument's mid price. The entry price and the settlement price are both mid prices. There is no separate buying
            and selling price for your trades, and no spread is added to or taken away from the price you receive, whether you choose BUY or
            SELL. The engine also produces bid and ask quotes either side of the mid price, but they are not used to enter or settle trades.
          </p>
          <h3>5.4 No independent reference price</h3>
          <p>
            Because the prices are synthetic, there is no independent market price against which a NeuroOption price can be checked. The price
            that counts is the one our engine produced, as recorded with your trade by our server. When we consider whether a price is wrong, we compare it with
            how the instrument normally behaves on our platform, not with real-world markets (section 15.1).
          </p>
          <h3>5.5 Restarts and price gaps</h3>
          <p>
            If our servers are restarted, updated or interrupted, the engine starts again and each instrument's price series restarts from the instrument's own starting level,
            which can be far from where its price was before. A chart can then show a gap or a sudden jump. Section 14.6 explains how we deal with trades that are open when this
            happens.
          </p>
          <h3>5.6 Charts, indicators and the sentiment gauge</h3>
          <ul>
            <li>
              Charts, candles and technical indicators on the trading screen are drawn from our engine's prices. They display past prices; they
              do not predict future ones and are not trading signals.
            </li>
            <li>
              The "Sentiment" gauge on the trading screen is calculated from the instrument's recent price movements on our platform. It does not
              show what other clients are doing, and it is not a forecast or a recommendation.
            </li>
            <li>
              The Markets page may show illustrative prices and payouts while it connects to our live data. Only the trading screen shows the
              prices and payouts at which trades are accepted.
            </li>
          </ul>
          <h3>5.7 Chart timeframe does not change your trade</h3>
          <p>
            The chart timeframe you choose, such as 1-minute candles, only changes how the chart is drawn. It has no effect on your expiry,
            your payout or how your trade is settled.
          </p>
        </>
      ),
    },
    {
      id: "placing-a-trade",
      title: "6. Placing a trade",
      body: (
        <>
          <h3>6.1 Before you start</h3>
          <ul>
            <li>
              <strong>Check the account.</strong> A trade is placed in whichever account is selected on the trading screen when you press Buy or
              Sell: the demo account ("QT Demo") or, when available, your real account ("QT Real"). We cannot move a trade from one account to
              another after acceptance.
            </li>
            <li>
              <strong>Sign in for your own account.</strong> If you are not signed in, you can only use the public demo (section 16.7). You must be
              signed in to use your own demo account and, when available, your real account.
            </li>
            <li>
              <strong>Wait for live data.</strong> The Buy and Sell buttons work only when the trading screen is receiving live prices and the
              current payout. Until then the screen shows a message such as "Waiting for market prices…" or "Waiting for current payout…".
            </li>
          </ul>
          <h3>6.2 Step by step</h3>
          <ol>
            <li>
              <strong>Choose an instrument</strong> from the instrument list on the trading screen.
            </li>
            <li>
              <strong>Set the expiry</strong> in hours, minutes and seconds, between 5 seconds and 5 hours (section 8).
            </li>
            <li>
              <strong>Enter your stake</strong> in the currency shown, at least 1 unit and no more than your available balance (section 7).
            </li>
            <li>
              <strong>Check the payout and potential profit</strong> shown in the trading panel. They are calculated for the instrument and expiry
              you have selected (section 9.9).
            </li>
            <li>
              <strong>Press Buy or Sell.</strong> Press Buy if you think the price will be higher at the expiry time than the entry price, or Sell
              if you think it will be lower. Your trade request is sent immediately.
            </li>
            <li>
              <strong>Our server accepts or rejects the request</strong> (section 10). If it accepts it, your stake is taken from your available
              balance, the entry price, payout and expiry time are fixed, and the trade appears in your open trades.
            </li>
            <li>
              <strong>At the expiry time the trade is settled automatically</strong> (section 11) and the result is applied to your balance and
              shown in your trade history.
            </li>
          </ol>
          <h3>6.3 What you see before you trade</h3>
          <Table
            head={["Shown on the trading screen", "What it means"]}
            rows={[
              ["Instrument and live price", <>The instrument you have selected and its current mid price from our engine.</>],
              ["Account and balance", <>Whether the demo or real account is selected, its currency and your available balance.</>],
              ["Expiry", <>The length of the trade in hours, minutes and seconds (HH:MM:SS).</>],
              ["Amount", <>Your stake, in the currency shown.</>],
              [
                "Payout",
                <>
                  The payout percentage that applies to a trade with the selected instrument and expiry, for example "+86%". It is also shown on the
                  Buy and Sell buttons.
                </>,
              ],
              ["Profit", <>The profit you would receive if the trade wins: stake × payout percentage.</>],
            ]}
          />
          <h3>6.4 There is no separate confirmation step</h3>
          <Callout tone="warn" title="Pressing Buy or Sell places your trade">
            <p>
              The trading screen does not ask you to confirm a trade after you press Buy or Sell. Check the account, instrument, direction, expiry,
              stake and payout before you press. A trade placed by mistake, for example in the wrong direction or with the wrong stake, is a valid
              trade and is not void just because you did not intend it.
            </p>
          </Callout>
          <h3>6.5 What our server checks</h3>
          <p>When your trade request arrives, our server checks, among other things, that:</p>
          <ul>
            <li>the account type and direction (BUY or SELL) are valid;</li>
            <li>the instrument exists and is available for trading;</li>
            <li>the expiry is a whole number of seconds from 5 to 18,000 (5 hours);</li>
            <li>the stake is at least 1 and no more than your available balance;</li>
            <li>a payout is available for the instrument, and it is the same payout that was shown to you (section 9.11); and</li>
            <li>real-money services are available, if the request is for a real account.</li>
          </ul>
          <p>If any check fails, the request is rejected and no trade is placed (section 10).</p>
          <h3>6.6 When a trade exists</h3>
          <p>
            A trade exists only once our server has accepted it. If your request does not reach us, is rejected, or is not confirmed as accepted,
            no trade exists and nothing is taken from your balance. The record on our server decides whether a trade was accepted, and at what
            time, price and payout.
          </p>
          <h3>6.7 More than one trade at a time</h3>
          <p>
            You can have several trades open at the same time, on the same or different instruments and in either direction. There is currently
            no fixed limit on the number of open trades, but each stake is taken from your available balance when the trade is accepted, so the
            total of your open stakes can never be more than your balance. Several trades can lose at the same time.
          </p>
        </>
      ),
    },
    {
      id: "stakes",
      title: "7. Stakes",
      body: (
        <>
          <h3>7.1 Minimum stake</h3>
          <p>
            The minimum stake is 1 unit of the currency in which you enter it: USD 1 of virtual funds on the demo account (or 1 unit of another
            currency you have chosen to view it in, see section 16.5), or KES 1 on a real account when real accounts are available. A trade
            request with a stake below 1 is rejected.
          </p>
          <h3>7.2 Maximum stake</h3>
          <p>
            The maximum stake is your available balance in the selected account at the moment of acceptance. If the stake is more than your
            available balance, the trading screen shows "Amount exceeds available balance" and does not send the request. If the balance has
            fallen by the time the request reaches our server, for example because another trade was accepted first, the request is rejected
            with "Insufficient balance."
          </p>
          <h3>7.3 How stakes are recorded</h3>
          <p>
            Stakes and the amounts calculated from them are recorded to two decimal places in the currency of the trade. The stake is taken
            from your available balance at acceptance and is not available for anything else until the trade settles.
          </p>
          <h3>7.4 No leverage or borrowing</h3>
          <p>
            There is no leverage, margin or credit on NeuroOption. You can never lose more than the stakes you place, and trading losses cannot
            take your balance below zero. You can, however, lose your whole balance.
          </p>
          <h3>7.5 Setting your own limits</h3>
          <p>
            The platform does not currently offer tools to set your own stake, loss, deposit or time limits. Decide your limits before you start
            and keep to them. The <PolicyLink slug="responsible-trading">Responsible Trading Policy</PolicyLink> explains how.
          </p>
          <h3>7.6 Limits we may introduce</h3>
          <p>
            We may introduce a lower maximum stake, a limit on the total amount you can have at risk at one time, or a limit on the number of open
            trades, for all clients or for particular instruments or expiries. Any such limit will apply equally to all clients in the same
            situation, will be shown on the platform before it applies, and will be added to this policy. This does not affect our rights under
            the <PolicyLink slug="terms">Terms and Conditions</PolicyLink> to restrict an individual account, for example where we suspect
            prohibited conduct.
          </p>
        </>
      ),
    },
    {
      id: "expiry",
      title: "8. Expiry",
      body: (
        <>
          <h3>8.1 The expiry range</h3>
          <p>
            The expiry can be any whole number of seconds from 5 seconds to 5 hours (18,000 seconds). A trade request with an expiry outside this
            range is rejected with the message "Expiry must be between 5 seconds and 5 hours."
          </p>
          <h3>8.2 How you set it</h3>
          <p>
            You set the expiry as a length of time, shown as hours, minutes and seconds (HH:MM:SS), using the controls in the trading panel. For
            example, 00:01:00 is a 1-minute trade and 02:30:00 is a trade of two and a half hours. You do not choose a clock time; the expiry
            time follows from the moment your trade is accepted.
          </p>
          <h3>8.3 How expiry is counted</h3>
          <ul>
            <li>The expiry starts at acceptance, not when you press Buy or Sell.</li>
            <li>The expiry time is the time of acceptance plus the expiry you chose, measured to the millisecond.</li>
            <li>All timing uses our server's clock, not the clock on your device.</li>
          </ul>
          <h3>8.4 Examples</h3>
          <p>In each example the trade is accepted at 14:30:12.400 EAT on 16 October 2026.</p>
          <Table
            head={["Expiry chosen", "Expiry time (EAT)"]}
            rows={[
              ["00:00:05 (5 seconds)", "14:30:17.400"],
              ["00:00:30 (30 seconds)", "14:30:42.400"],
              ["00:01:00 (1 minute)", "14:31:12.400"],
              ["00:15:00 (15 minutes)", "14:45:12.400"],
              ["05:00:00 (5 hours)", "19:30:12.400"],
            ]}
          />
          <h3>8.5 The countdown on your screen</h3>
          <p>
            The countdown shown for an open trade is synchronised with our server clock, but it can lag or differ slightly because of your
            connection or device. The expiry time recorded on our server is the one that counts.
          </p>
          <h3>8.6 Expiry and payout</h3>
          <p>
            The expiry you choose can change the payout. Very short trades currently pay slightly less and trades of 5 minutes or more slightly
            more (section 9.5). The payout shown in the trading panel always reflects the expiry you have selected.
          </p>
        </>
      ),
    },
    {
      id: "payouts",
      title: "9. Payouts",
      body: (
        <>
          <h3>9.1 What the payout percentage means</h3>
          <p>
            The payout percentage is the profit you receive on a winning trade, as a percentage of your stake. With an 85% payout, a winning
            KES 1,000 trade returns your KES 1,000 stake plus KES 850 profit. A losing trade returns nothing, whatever the payout.
          </p>
          <h3>9.2 How a payout is made up</h3>
          <p>The payout for a trade is built from three parts and then kept within fixed limits:</p>
          <Table
            head={["Part", "What it is", "Current setting"]}
            rows={[
              ["Baseline payout", <>The standard payout for the instrument for a 60-second trade.</>, <>85% to 88%, depending on the instrument (section 9.3).</>],
              [
                "Market-condition adjustment",
                <>A change made by our payout engine according to measured conditions of the instrument's synthetic price stream.</>,
                <>Up to 6 percentage points below, or 3 points above, the baseline (section 9.4).</>,
              ],
              [
                "Expiry adjustment",
                <>A change depending only on the expiry you choose.</>,
                <>From 3 points lower for the shortest trades to 1 point higher for trades of 5 minutes or more (section 9.5).</>,
              ],
              ["Hard limits", <>The lowest and highest payout the platform will ever offer.</>, <>20% and 92% (section 9.6).</>],
            ]}
          />
          <p>The baseline plus the market-condition adjustment is the asset payout. Payouts are always whole percentages.</p>
          <h3>9.3 Baseline payouts</h3>
          <Table
            head={["Category", "Current baseline payout range"]}
            rows={[
              ["Currency pairs", "85% to 87%"],
              ["Cryptocurrencies", "87% to 88%"],
              ["Stocks", "85% to 88%"],
              ["Indices", "86% to 87%"],
              ["Commodities", "86% to 88%"],
            ]}
          />
          <h3>9.4 Market-condition adjustment</h3>
          <p>
            About once a minute, our payout engine measures the recent behaviour of each instrument's synthetic price stream and works out a
            target payout. It looks at:
          </p>
          <ul>
            <li>short-term volatility compared with the instrument's own volatility over the past hour;</li>
            <li>the recent price range compared with its range over the past hour;</li>
            <li>the strength of any trend; and</li>
            <li>how much of the time the price engine has recently spent in high-volatility or breakout phases.</li>
          </ul>
          <p>
            Calmer conditions than usual can raise the payout a little. More volatile, trending or stressed conditions lower it. Under our current
            settings:
          </p>
          <ul>
            <li>the asset payout can be at most 6 percentage points below, or 3 points above, the instrument's baseline;</li>
            <li>each instrument's payout is reviewed about once every 10 minutes, at its own time slot, so instruments do not all change together;</li>
            <li>after a change, a payout stays the same for at least 10 minutes;</li>
            <li>a single change is at most 2 percentage points, and the total movement in any rolling 60 minutes is at most 6 points;</li>
            <li>the target is smoothed over time, and differences of less than 0.75 points are ignored so that payouts do not flicker; and</li>
            <li>if the engine does not have enough reliable price data to measure conditions, the payout is left unchanged.</li>
          </ul>
          <h3>9.5 Expiry adjustment</h3>
          <Table
            head={["Expiry", "Adjustment to the asset payout"]}
            rows={[
              ["5 to 15 seconds", "3 percentage points lower"],
              ["16 to 30 seconds", "2 percentage points lower"],
              ["31 seconds to 4 minutes 59 seconds", "No adjustment"],
              ["5 minutes to 5 hours", "1 percentage point higher"],
            ]}
          />
          <h3>9.6 Hard limits</h3>
          <p>
            Whatever the market conditions, expiry or settings, the payout for a trade is never below 20% or above 92%. With our current settings
            the rules in sections 9.3 to 9.5 keep payouts between 76% and 92%, and they are normally around 85% to 88% for a 1-minute trade.
          </p>
          <h3>9.7 Worked example</h3>
          <p>
            EUR/USD OTC has a baseline payout of 87%. Suppose the payout engine has lowered it by 1 point because conditions are more volatile
            than usual, so the asset payout is 86%.
          </p>
          <Table
            head={["Expiry selected", "Calculation", "Payout for the trade"]}
            rows={[
              ["10 seconds", "86% − 3", "83%"],
              ["20 seconds", "86% − 2", "84%"],
              ["1 minute", "86% + 0", "86%"],
              ["4 minutes 59 seconds", "86% + 0", "86%"],
              ["5 minutes", "86% + 1", "87%"],
              ["5 hours", "86% + 1", "87%"],
            ]}
          />
          <h3>9.8 The same payout for every client</h3>
          <p>
            Payouts depend only on the instrument, the measured conditions of its synthetic price stream and the expiry you choose. The payout
            engine does not receive or use any information about who is trading, client balances, open trades, trade sizes or trade results.
            Every client who trades the same instrument with the same expiry at the same moment is offered the same payout. We do not offer
            personal or negotiated payouts.
          </p>
          <h3>9.9 Where payouts are shown</h3>
          <ul>
            <li>
              The trading panel shows the payout for the selected instrument and expiry, and the profit you would receive on a win. The same
              payout is shown on the Buy and Sell buttons.
            </li>
            <li>
              Where the expiry adjustment applies, hovering over the payout figure in the trading panel can show the asset payout and the
              adjustment, for example "Asset payout 86%, adjusted -3 for this trade length".
            </li>
            <li>
              The instrument list and the Markets page show the asset payout, which is the payout for a 60-second trade. The final payout for your
              trade is the one shown in the trading panel and accepted by our server.
            </li>
          </ul>
          <h3>9.10 Your payout is locked at acceptance</h3>
          <p>
            The payout percentage that applies to your trade is the one in force at the moment of acceptance. It is stored with the trade and used
            at settlement. Any later change to the instrument's payout, up or down, does not affect a trade that has already been accepted. Your
            open trades show the payout locked for each trade.
          </p>
          <h3>9.11 If the payout changes before your trade is accepted</h3>
          <p>
            Your trade request includes the payout shown to you. If the payout on our server is different when your request arrives, for example
            because a scheduled review changed it a moment earlier, we do not place the trade at the new payout without your agreement. Instead:
          </p>
          <ol>
            <li>the request is rejected and nothing is taken from your balance;</li>
            <li>
              the trading screen shows a message such as "Payout changed from 86% to 84%. No trade was placed — review the new payout and try
              again." and updates the payout shown;
            </li>
            <li>if you want to trade at the new payout, you confirm it by pressing Buy or Sell again.</li>
          </ol>
          <p>
            A new request is a new trade request: it is accepted at the price and payout in force when it reaches our server, and it can itself
            be rejected if the payout changes again.
          </p>
          <h3>9.12 When no payout is available</h3>
          <p>
            If the trading screen loses its connection to our payout updates for a while, it will not send trade requests and shows the message
            "Payouts are reconnecting. Please try again in a moment." If our server has no payout available for an instrument, a trade request on
            it is rejected.
          </p>
          <h3>9.13 Records of payouts</h3>
          <p>
            Each trade is stored with its locked payout percentage, the asset payout it was based on, the expiry adjustment and a version number
            identifying the published payout it was accepted at. Our payout engine also keeps a record of each published payout change, with its
            time and reason.
          </p>
        </>
      ),
    },
    {
      id: "acceptance-and-rejection",
      title: "10. Acceptance and rejection of trade requests",
      body: (
        <>
          <h3>10.1 Why a trade request may be rejected</h3>
          <Table
            head={["Reason", "What you may see", "What happens"]}
            rows={[
              ["The payout changed after it was shown to you", <>"Payout changed from X% to Y%. No trade was placed…"</>, <>No trade. Press Buy or Sell again to trade at the new payout.</>],
              ["Payouts are reconnecting", <>"Payouts are reconnecting. Please try again in a moment."</>, <>The request is not sent.</>],
              ["No payout available for the instrument", <>A message that no payout is available</>, <>No trade.</>],
              ["The instrument is unavailable, suspended or withdrawn", <>A message that the asset is unsupported or inactive</>, <>No trade.</>],
              ["The stake is above your available balance", <>"Amount exceeds available balance" or "Insufficient balance."</>, <>No trade.</>],
              ["The stake is below 1 or is not a valid amount", <>An error message</>, <>No trade.</>],
              ["The expiry is outside 5 seconds to 5 hours", <>"Expiry must be between 5 seconds and 5 hours."</>, <>No trade.</>],
              ["Real-money trading is switched off", <>"Real-money transactions are not available."</>, <>No trade. This applies to every real-account request today.</>],
              ["A real-account request from someone not signed in", <>"Sign in to trade with your real account."</>, <>No trade.</>],
              ["The platform is not working normally", <>An error message, or no response</>, <>No trade unless our server confirms acceptance.</>],
            ]}
          />
          <h3>10.2 Nothing is taken for a rejected request</h3>
          <p>A rejected trade request does not create a trade, and no stake is taken from your balance.</p>
          <h3>10.3 Rejected requests cannot be reinstated</h3>
          <p>
            We cannot reinstate a rejected request at the price or payout that applied when you pressed Buy or Sell. If you send a new request,
            it is treated as a new trade.
          </p>
          <h3>10.4 If you are not sure whether a trade was accepted</h3>
          <p>
            If your connection drops just after you press Buy or Sell, your trade may still have been accepted. Check your open trades on the
            trading screen or on the <a href="/open-trades">Open Trades</a> page before you place another trade, or you may end up with two trades
            instead of one.
          </p>
          <h3>10.5 Other reasons we may decline</h3>
          <p>
            We may also decline trade requests where the <PolicyLink slug="terms">Terms and Conditions</PolicyLink> allow it, for example
            where your account is restricted or suspended, or where we reasonably suspect prohibited conduct such as using automated tools,
            exploiting errors or delays, or trading in coordination with other accounts. Trade requests must be made only through our trading
            screen.
          </p>
        </>
      ),
    },
    {
      id: "entry-and-settlement",
      title: "11. Entry price, settlement price and timing",
      body: (
        <>
          <h3>11.1 Entry price</h3>
          <p>
            The entry price is the instrument's mid price on our server at the moment of acceptance. It is recorded with the trade and shown in
            your open trades and trade history.
          </p>
          <h3>11.2 The price can move before acceptance</h3>
          <p>
            Prices change many times a second, and your trade request takes time to travel from your device to our server. The entry price can
            therefore be different from the last price you saw. We do not reject or re-quote a trade because the price moved in that time, in
            either direction: you receive the price at acceptance, whether the movement was in your favour or against you. Only a change in the
            payout leads to a rejection (section 9.11).
          </p>
          <h3>11.3 When settlement happens</h3>
          <p>
            Our systems schedule settlement for the expiry time when the trade is accepted, and settle the trade automatically at that time. You
            do not need to do anything. If settlement does not run at the expiry time, for example because of a restart, the rules in section 14
            apply.
          </p>
          <h3>11.4 Settlement price</h3>
          <p>
            The settlement price is the instrument's mid price on our server at the moment settlement runs. Settlement normally runs at the expiry
            time, so the settlement price is normally the price at the expiry time. If settlement runs later, the price at that later moment is
            used (section 14.4).
          </p>
          <h3>11.5 Applying the result</h3>
          <p>
            When the trade is settled, the outcome is decided under section 12, any amount due to you is credited to the same account, and the
            trade moves from your open trades to your trade history with its settlement price and settlement time. The trading screen also shows
            the result.
          </p>
          <h3>11.6 You do not need to stay connected</h3>
          <p>
            An accepted trade runs to expiry and is settled whether or not you are connected, signed in or looking at the trading screen. Closing
            your browser, losing your connection or signing out does not stop, pause or cancel a trade.
          </p>
        </>
      ),
    },
    {
      id: "outcomes",
      title: "12. Outcomes and how they are calculated",
      body: (
        <>
          <h3>12.1 The three outcomes</h3>
          <Table
            head={["Outcome", "BUY trade", "SELL trade", "Returned to your balance"]}
            rows={[
              ["WIN", <>Settlement price higher than entry price</>, <>Settlement price lower than entry price</>, <>Stake + (stake × payout percentage)</>],
              ["LOSS", <>Settlement price lower than entry price</>, <>Settlement price higher than entry price</>, <>Nothing. You lose the whole stake.</>],
              ["DRAW", <>Settlement price equal to entry price</>, <>Settlement price equal to entry price</>, <>The stake. No profit and no loss.</>],
            ]}
          />
          <h3>12.2 Formulas</h3>
          <Callout tone="info" title="How results are calculated">
            <ul>
              <li>Profit on a win = stake × payout percentage ÷ 100</li>
              <li>Amount returned on a win = stake + profit on a win</li>
              <li>Amount returned on a loss = 0, so the loss = stake</li>
              <li>Amount returned on a draw = stake, so the profit or loss = 0</li>
            </ul>
            <p>
              The profit is fixed at acceptance from the stake and the locked payout. Because the payout is always below 100%, you must win more
              than half of your trades to break even. For example, at an 87% payout you need to win about 53.5% of your trades (1 ÷ 1.87),
              ignoring draws. The <PolicyLink slug="risk-disclosure">Risk Disclosure</PolicyLink> explains this in
              detail.
            </p>
          </Callout>
          <h3>12.3 Worked examples</h3>
          <p>The payouts in these examples are illustrations. The payout for your trade is the one shown and locked when you trade.</p>
          <Table
            head={["Example", "Trade", "Entry → settlement", "Outcome", "Returned to balance", "Profit or loss"]}
            rows={[
              ["A", <>BUY EUR/USD OTC, 1 minute, stake KES 1,000, payout 87%</>, "1.08735 → 1.08741", "WIN", "KES 1,870.00", "+KES 870.00"],
              ["B", <>SELL Gold OTC, 5 minutes, stake KES 500, payout 86%</>, "2,328.40 → 2,329.15", "LOSS", "KES 0.00", "−KES 500.00"],
              ["C", <>BUY BTC/USD OTC on the demo account, 30 seconds, stake USD 250, payout 85%</>, "66,420.15 → 66,420.15", "DRAW", "USD 250.00", "USD 0.00"],
              ["D", <>SELL USD/JPY OTC, 10 seconds, stake KES 155, payout 84%</>, "157.240 → 157.236", "WIN", <>KES 285.20 (155 + 130.20)</>, "+KES 130.20"],
              ["E", <>BUY Apple OTC on the demo account, 2 hours, minimum stake USD 1, payout 88%</>, "214.850 → 214.849", "LOSS", "USD 0.00", "−USD 1.00"],
            ]}
          />
          <p>The KES examples show how real accounts will work when real-money accounts are available.</p>
          <h3>12.4 Only the direction matters</h3>
          <p>
            The size of the price movement makes no difference. In example E, a fall of one price step (0.001) was enough for the trade to lose
            the whole stake. A large movement in your favour pays the same as a movement of one price step.
          </p>
          <h3>12.5 Rounding</h3>
          <p>
            Amounts are calculated from the exact stake and the whole-number payout percentage and recorded to two decimal places in the currency
            of the trade. On the demo account viewed in another currency, balances move in US dollars and amounts shown in the other
            currency are converted at the indicative rate (section 16.5).
          </p>
          <h3>12.6 How your balance changes</h3>
          <ul>
            <li>At acceptance: the stake is taken from your available balance.</li>
            <li>On a win: the stake plus the profit is credited.</li>
            <li>On a draw: the stake is credited back.</li>
            <li>On a loss: nothing is credited.</li>
          </ul>
        </>
      ),
    },
    {
      id: "no-early-close",
      title: "13. No early close, cancellation or changes",
      body: (
        <>
          <h3>13.1 A trade runs to expiry</h3>
          <p>
            Once a trade has been accepted, you cannot close, cancel, sell back, extend, shorten or otherwise change it, and you cannot change its
            stake, direction, expiry or payout. This applies even if the price moves strongly against you. The platform has no early-close,
            cash-out, rollover or stop-loss feature.
          </p>
          <h3>13.2 We cannot close it either</h3>
          <p>
            We will not close or cancel an accepted trade before expiry, except where a trade is voided or corrected because of a technical error
            under section 15, or where the <PolicyLink slug="terms">Terms and Conditions</PolicyLink> allow us to void trades connected with
            prohibited conduct.
          </p>
          <h3>13.3 Your own mistakes</h3>
          <p>
            A trade you placed by mistake, for example in the wrong account, in the wrong direction, with the wrong stake or with the wrong
            expiry, is not a technical error and will not be cancelled or voided for that reason.
          </p>
          <h3>13.4 Account status and open trades</h3>
          <p>
            Restricting or suspending your account does not by itself cancel a trade that has already been accepted. The trade still runs to
            expiry and is settled under these rules, except that we may void trades connected with prohibited conduct (section 13.2). The
            self-service account deletion on the platform is not available while you have open trades.
          </p>
        </>
      ),
    },
    {
      id: "delays-and-outages",
      title: "14. Delays, outages and settlement after restarts",
      body: (
        <>
          <h3>14.1 Your connection and device</h3>
          <p>
            Trading depends on your internet connection, device and browser. A slow or unstable connection can delay your trade requests, cause
            them to be rejected, or show you out-of-date prices, payouts or countdowns. Problems with your own device, connection or mobile network
            are not technical errors under section 15.
          </p>
          <h3>14.2 Platform outages and maintenance</h3>
          <p>
            The platform may sometimes be slow or unavailable, for example because of maintenance, a software fault, a restart, a cyber attack or a
            failure at one of our hosting or other providers. While it is unavailable you cannot place trades. Where practical, we will give
            advance notice of planned maintenance on the platform.
          </p>
          <h3>14.3 Trades open during an outage</h3>
          <p>
            Trades that have already been accepted are not cancelled by an outage. They remain open and are settled under sections 11 and 14.4.
          </p>
          <h3>14.4 Settlement after a restart or interruption</h3>
          <p>
            Settlement at the expiry time is scheduled by our running systems. If those systems are restarted or interrupted while your trade is
            open, the scheduled settlement may not run at the expiry time. In that case:
          </p>
          <ul>
            <li>
              the trade stays open until our systems next check your account for expired trades. At present this happens when your open trades or
              trade history are loaded, for example when you open the trading screen, the <a href="/open-trades">Open Trades</a> page or the{" "}
              <a href="/history">Trade History</a> page;
            </li>
            <li>
              the trade is then settled using the settlement price at that later moment, which may be different from the price at the expiry time
              and can change the result, in either direction; and
            </li>
            <li>the settlement time recorded for the trade is the time settlement actually ran.</li>
          </ul>
          <Callout tone="warn" title="Example of a delayed settlement">
            <p>
              You BUY EUR/USD OTC with a 1-minute expiry at an entry price of 1.08735. At the expiry time the price is 1.08742, which would be a
              win. Because our servers restarted, settlement runs when you next open the trading screen, when the price is 1.08729, and the trade
              is settled as a loss. A delay can equally turn a loss into a win. You cannot rely on either.
            </p>
          </Callout>
          <h3>14.5 What we will do about delayed settlements</h3>
          <p>
            A settlement that is delayed by a restart, outage or other fault in our systems is a technical error under section 15. If you think a
            delay changed the result of your trade, tell us through <a href="/support">Support</a>. We will review the trade and, where we find
            that a delay caused by our systems changed its result, we will either settle it at the price that applied at the expiry time, where
            we can establish that price reliably, or void it and return your stake. We do not keep a permanent record of every price the engine
            produces, so where the price at the expiry time cannot be established reliably, we will void the trade. We may also review such trades on our own initiative.
          </p>
          <h3>14.6 Price restarts while a trade is open</h3>
          <p>
            If our price engine restarts while your trade is open and the instrument's price series starts again from a different level (section
            5.5), the comparison between the entry price and the settlement price no longer reflects a genuine price movement. Where we identify,
            or you tell us about, a trade affected in this way, we will normally void it and return your stake.
          </p>
          <h3>14.7 Payouts during data problems</h3>
          <p>
            If our payout engine cannot measure market conditions reliably, for example after a restart, it keeps the current payouts unchanged
            until it can. Payouts after a restart are restored from our stored records where they are available.
          </p>
        </>
      ),
    },
    {
      id: "errors-and-void-trades",
      title: "15. Clearly erroneous prices and technical errors",
      body: (
        <>
          <h3>15.1 What counts as a technical error</h3>
          <p>
            A technical error is an obvious mistake in a price, payout, acceptance, settlement, credit or debit, caused by a fault in the platform
            or by human error. A clearly erroneous price is a price that is plainly out of line with the instrument's own recent prices on our
            platform because of a fault, for example a sudden spike, a frozen price or a price restart. Because our prices are synthetic, whether
            a price is wrong is judged against how the platform and the instrument normally behave, not against real-world markets.
          </p>
          <h3>15.2 Examples and what we may do</h3>
          <Table
            head={["Example", "What we may do"]}
            rows={[
              [
                "The price engine produces a price that is clearly out of line with the instrument's recent prices on the platform, such as a sudden spike or a frozen price, caused by a fault",
                <>Void the trades affected, or settle them at the price that should have applied.</>,
              ],
              ["The instrument's price series restarts from a different level while a trade is open (section 14.6)", <>Void the trade and return the stake.</>],
              ["Settlement is delayed by a fault in our systems and the delay changes the result (section 14.5)", <>Settle the trade at the price that applied at the expiry time, or void it.</>],
              [
                "A trade is accepted with a payout outside the 20% to 92% limits, or different from the payout locked for it",
                <>Settle the trade at the correct payout, or void it.</>,
              ],
              ["A trade is settled at the wrong price, at the wrong time or with the wrong outcome", <>Settle it again correctly.</>],
              [
                "A trade is accepted when it should have been rejected, for example with a stake above the available balance or on an unavailable instrument",
                <>Void the trade.</>,
              ],
              ["An amount is credited or debited by mistake, for example a winning return credited twice", <>Reverse or correct the entry.</>],
            ]}
          />
          <h3>15.3 What is not a technical error</h3>
          <ul>
            <li>A price on NeuroOption that differs from the real-world price of a similarly named asset.</li>
            <li>A trade that loses, including by the smallest price step.</li>
            <li>A payout that changed before your trade was accepted, or a price that moved between your click and acceptance.</li>
            <li>A mistake you made when setting up a trade (section 13.3).</li>
            <li>A problem with your own device, browser, internet connection or mobile network.</li>
          </ul>
          <h3>15.4 Errors work both ways</h3>
          <p>
            We will correct a technical error whether it was in your favour or ours. Where an error was against you, we will put your account in
            the position it would have been in had the error not happened.
          </p>
          <h3>15.5 Voiding and correcting</h3>
          <ul>
            <li>
              <strong>Void:</strong> the trade is treated as if it had never been placed. The stake is returned to your balance and any profit
              paid on it is reversed.
            </li>
            <li>
              <strong>Correction:</strong> the trade stays in place but is settled again using the price, payout, time or outcome that should have
              applied, and your balance is adjusted by the difference.
            </li>
          </ul>
          <p>
            Where we cannot reliably establish the price or other detail that should have applied, we will void the trade rather than settle it
            again.
          </p>
          <h3>15.6 How we decide</h3>
          <p>
            Reviews are carried out by our authorised staff using our records of trades, payouts, balances and transactions and, where available, the prices held in our systems. We act fairly and
            consistently, apply the same approach to every client affected by the same error, and keep a record of each review and its outcome.
          </p>
          <h3>15.7 Time limits</h3>
          <p>
            We will act within a reasonable time after we discover a technical error, and normally within 30 days of the trade or transaction
            concerned.
          </p>
          <h3>15.8 How we will tell you</h3>
          <p>
            If we void or correct one of your trades, we will tell you which trade was affected, what we changed and why. We will do this by email
            to the address registered on your account and, if you raised a support ticket about the trade, by replying to that ticket. Trades on
            the public demo are not linked to any person, so we cannot tell anyone individually about corrections to them.
          </p>
          <h3>15.9 If a correction leaves a shortfall</h3>
          <p>
            If correcting an error would leave your balance below zero, the rules in the <PolicyLink slug="terms">Terms and Conditions</PolicyLink>{" "}
            apply. In short, we will not ask you to pay the shortfall unless the error came from your fraud or other prohibited conduct, or you
            withdrew money you knew, or should reasonably have known, had been credited by mistake.
          </p>
          <h3>15.10 You must not exploit errors</h3>
          <p>
            If you notice a price, payout, balance or result that looks wrong, tell us through <a href="/support">Support</a> as soon as possible.
            Deliberately trading on a known error, delay or weakness in the platform is prohibited by the{" "}
            <PolicyLink slug="terms">Terms and Conditions</PolicyLink>, and trades placed in that way may be voided.
          </p>
          <h3>15.11 Demo accounts</h3>
          <p>
            We may correct or void demo trades under this section in the same way. Because virtual funds have no value, a correction on a demo
            account never leads to any payment of real money.
          </p>
          <h3>15.12 If you disagree</h3>
          <p>
            If you disagree with a decision we make under this section, you can ask us to look at it again through Support and, if you are still
            not satisfied, complain under our <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>.
          </p>
        </>
      ),
    },
    {
      id: "demo-account",
      title: "16. Demo account rules",
      body: (
        <>
          <h3>16.1 What the demo account is</h3>
          <p>
            The demo account ("QT Demo") lets you practise with virtual funds. It uses the same instruments, the same synthetic prices, the same
            payout rules, the same stake and expiry rules and the same settlement rules as a real account.
          </p>
          <h3>16.2 Starting balance</h3>
          <p>
            Each signed-in client has their own demo account, which is created with a balance of USD 70,000 in virtual funds the first time it is
            used. The demo account is held in US dollars.
          </p>
          <h3>16.3 Adding demo funds</h3>
          <p>
            You can add virtual funds using the "Add funds" button next to your demo balance on the trading screen, but only while your demo balance is below USD
            10,000. You choose one of the fixed amounts below. If your demo balance is USD 10,000 or more, the request is refused with the message
            "Demo funds can be added when your demo balance is below $10,000."
          </p>
          <Table
            head={["Amounts you can add", "Condition"]}
            rows={[
              [<>USD 20,000, USD 50,000, USD 60,000 or USD 100,000</>, <>Your demo balance must be below USD 10,000 when you add the funds. One amount can be added at a time.</>],
            ]}
          />
          <h3>16.4 Virtual funds have no value</h3>
          <ul>
            <li>Virtual funds and demo winnings have no monetary value.</li>
            <li>
              They cannot be withdrawn, transferred, sold, or exchanged for money, real-account funds, bonuses or anything else, and they cannot
              be moved between accounts.
            </li>
            <li>Demo results do not predict or guarantee results on a real account.</li>
          </ul>
          <h3>16.5 Viewing the demo account in another currency</h3>
          <p>
            You can choose to view the demo account in another currency, such as KES. The account is still held in US dollars: the balance you see
            is converted from US dollars using a fixed indicative rate that we set, and a stake you enter in that currency is converted into US
            dollars at the same rate when the trade is placed. The minimum stake is 1 unit of the currency shown. The conversion is for display
            only (section 17.4).
          </p>
          <h3>16.6 Demo trade records</h3>
          <p>
            Your demo trades are recorded and shown in your open trades and trade history in the same way as real trades (section 18), so that
            you can review how you traded.
          </p>
          <h3>16.7 The public demo</h3>
          <Callout tone="warn" title="Visitors who are not signed in share one demo account">
            <ul>
              <li>
                If you use the trading screen without signing in, you are using the public demo, a single demo account shared by every visitor who
                is not signed in.
              </li>
              <li>
                Its balance, open trades and trade history can be changed by anyone else using it at the same time, and they include other people's
                trades. They are not a record of your own results.
              </li>
              <li>Anything you do on the public demo cannot be transferred to your own account.</li>
              <li>Do not rely on its balance or history, and do not enter personal information there.</li>
            </ul>
          </Callout>
          <h3>16.8 Changes to the demo account</h3>
          <p>
            We may change the demo starting balance, the top-up threshold or amounts, or other demo rules, or withdraw the demo account, at any
            time. We will update this policy when we do.
          </p>
        </>
      ),
    },
    {
      id: "real-accounts-and-currency",
      title: "17. Real accounts and currencies",
      body: (
        <>
          <h3>17.1 Availability</h3>
          <p>
            Real accounts ("QT Real") are not available today. When real-money accounts are available, you will need to be signed in to use
            yours, and the rules in this policy will apply to it in full.
          </p>
          <h3>17.2 Kenya Shillings</h3>
          <p>
            Real accounts will be held in Kenya Shillings (KES). Stakes, payouts, profits, balances and trade records on a real account will be in
            KES. The minimum stake will be KES 1.
          </p>
          <h3>17.3 Funding a real account</h3>
          <p>
            Real accounts will be funded by deposits in whole Kenya Shillings through M-Pesa, and withdrawals will be paid in KES to M-Pesa. The
            rules, limits and checks are in the <PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink> and
            the <PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink>. Only your available balance can be used to stake; money that is
            locked, for example for a pending withdrawal, cannot.
          </p>
          <h3>17.4 Converted amounts are indicative only</h3>
          <ul>
            <li>
              Where the platform shows an amount converted into another currency, the conversion uses a fixed indicative rate that we set. It is
              not a live market exchange rate and is not updated continuously.
            </li>
            <li>Different parts of the platform may use slightly different indicative rates.</li>
            <li>
              Converted amounts are for information only. They are not an offer to exchange money and do not change what you are owed, which is
              always worked out in the currency of your account.
            </li>
            <li>We do not charge for currency conversion.</li>
          </ul>
          <h3>17.5 OTC currency pairs are not exchange rates</h3>
          <p>
            The prices of the synthetic currency pairs you can trade, such as "USD/ZAR OTC", are produced by our price engine. They are not used
            to convert any money in your account.
          </p>
        </>
      ),
    },
    {
      id: "trade-records",
      title: "18. Trade records, history and timestamps",
      body: (
        <>
          <h3>18.1 What we record for each trade</h3>
          <ul>
            <li>a unique trade reference, the account (demo or real) and the currency;</li>
            <li>the instrument, the direction (BUY or SELL) and the stake;</li>
            <li>the locked payout percentage, the asset payout, the expiry adjustment and the payout version;</li>
            <li>the expected profit and the amount that would be returned on a win;</li>
            <li>the entry price, the time of acceptance, the expiry in seconds and the expiry time;</li>
            <li>the status (open, won, lost or draw), the settlement price and the settlement time; and</li>
            <li>the amount returned and the profit or loss.</li>
          </ul>
          <p>Each stake, winning return, draw refund and loss is also recorded as a transaction against the account.</p>
          <h3>18.2 Where you can see your trades</h3>
          <Table
            head={["Where", "What it shows"]}
            rows={[
              [
                "Trading screen",
                <>Your open trades with their locked payouts, a countdown to expiry and the result of each trade when it settles.</>,
              ],
              [
                <a href="/open-trades">Open Trades</a>,
                <>Each open trade's instrument, direction, stake, entry price, time left and expiry, locked payout and potential profit.</>,
              ],
              [
                <a href="/history">Trade History</a>,
                <>
                  Your most recent 100 settled trades, with instrument, direction, entry and settlement price, stake, payout, profit or loss,
                  outcome and settlement time, plus totals.
                </>,
              ],
            ]}
          />
          <p>If you need details of older trades, ask us through <a href="/support">Support</a> (section 18.5).</p>
          <h3>18.3 Times and timestamps</h3>
          <ul>
            <li>Times on the platform are shown in East Africa Time (EAT, UTC+3). EAT does not change for daylight saving.</li>
            <li>
              Our server records the time of acceptance, the expiry time and the settlement time to the millisecond, in Coordinated Universal Time
              (UTC), and the platform converts them to EAT for display. For example, a trade settled at 16:10:35 UTC is shown as settled at
              19:10:35 EAT.
            </li>
            <li>Our server's records of these times are the ones that count, not the clock on your device.</li>
          </ul>
          <h3>18.4 Notifications</h3>
          <p>
            We do not send emails about individual trades. Results appear on the trading screen and in your trade history, so check them
            regularly.
          </p>
          <h3>18.5 Copies of your records</h3>
          <p>
            You can ask us for a copy of the records of your trades and transactions through <a href="/support">Support</a>. For your rights over
            your personal data, see the <PolicyLink slug="privacy">Privacy Policy</PolicyLink>.
          </p>
          <h3>18.6 Our records</h3>
          <p>
            We use our server records of trades, prices, payouts, balances and transactions to decide what happened, unless they are shown to be
            wrong. If you think a record is wrong, tell us under section 18.8.
          </p>
          <h3>18.7 How long we keep records</h3>
          <p>
            We keep trade and transaction records for as long as applicable law requires, for example under anti-money-laundering, tax and
            companies law. Our retention period is <Co field="retentionPeriod" />. Closing your account does not delete these records. See the{" "}
            <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink>.
          </p>
          <h3>18.8 Questions about a trade</h3>
          <p>
            If you think a trade was accepted, priced or settled wrongly, open a support ticket from the <a href="/support">Support</a> page while
            signed in, as soon as possible. Please include:
          </p>
          <ul>
            <li>the account (demo or real), the instrument, the direction and the stake;</li>
            <li>the approximate time of the trade in EAT;</li>
            <li>what you expected and what happened; and</li>
            <li>a screenshot, if you have one.</li>
          </ul>
          <p>
            Raising a question early helps us investigate while the details are fresh. We will still consider a question you raise later, although
            we may then be less able to establish what happened.
          </p>
        </>
      ),
    },
    {
      id: "changes",
      title: "19. Changes to instruments, payouts, limits and this policy",
      body: (
        <>
          <h3>19.1 Changes that happen all the time</h3>
          <p>
            Prices and asset payouts change continuously under the rules in sections 5 and 9, without notice. A payout you saw earlier is not a
            promise that the same payout will be available later.
          </p>
          <h3>19.2 Changes to the product and its settings</h3>
          <p>We may change, among other things:</p>
          <ul>
            <li>the instruments offered, including adding, suspending or withdrawing instruments (section 4.5);</li>
            <li>the expiry range and the expiry adjustments;</li>
            <li>baseline payouts, the market-condition adjustment rules and the review settings described in section 9;</li>
            <li>the minimum stake, and any maximum stake or exposure limits (section 7.6); and</li>
            <li>the demo account rules (section 16.8).</li>
          </ul>
          <p>
            Any change to these settings will stay within the hard payout limits of 20% and 92%, unless we first change those limits by updating
            this policy. We will give you reasonable notice on the platform of any change that significantly affects you, unless we need to act
            sooner for legal, regulatory, security or technical reasons, and we will update this policy to reflect the change.
          </p>
          <h3>19.3 Accepted trades are never affected</h3>
          <p>
            No change to instruments, payouts, settings, limits or this policy affects a trade that was accepted before the change took effect.
            That trade keeps its entry price, locked payout and expiry time and is settled under the rules that applied when it was accepted.
          </p>
          <h3>19.4 Changes to this policy</h3>
          <p>
            We may update this policy. The date at the top of this page shows when it was last updated. Changes are made, and notified to you, in
            the way set out in the <PolicyLink slug="terms">Terms and Conditions</PolicyLink>, including at least 30 days' notice by email and on
            the platform before a change that is to your disadvantage takes effect, except where a shorter period is allowed there.
          </p>
        </>
      ),
    },
    {
      id: "contact",
      title: "20. Questions and complaints",
      body: (
        <>
          <h3>20.1 Questions</h3>
          <p>
            If you have a question about these rules or about a particular trade, open a support ticket from the <a href="/support">Support</a>{" "}
            page while signed in, visit the <a href="/help">Help Centre</a>, email <Co field="supportEmail" /> or call{" "}
            <Co field="supportPhone" />.
          </p>
          <h3>20.2 Complaints</h3>
          <p>
            If you are not satisfied with our answer, you can make a complaint under our{" "}
            <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink> or by email to <Co field="complaintsEmail" />.
          </p>
        </>
      ),
    },
  ],
};

export default policy;
