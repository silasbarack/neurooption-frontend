import type { Policy } from "../types";
import { Callout, Co, Definitions, PolicyLink, Table } from "../components";

const policy: Policy = {
  slug: "risk-disclosure",
  title: "Risk Disclosure",
  summary:
    "Fixed-time options are high-risk, all-or-nothing products: you can lose the whole of every stake, payouts below 100% mean the average result over many trades is a loss, prices are synthetic and NeuroOption is the other side of every trade. Read this before you trade, even on the demo account.",
  updated: "2026-10-16",
  sections: [
    {
      id: "risk-warning",
      title: "1. Important risk warning",
      body: (
        <>
          <Callout tone="risk" title="High risk: you can lose all the money you trade">
            <ul>
              <li>
                <strong>You can lose 100% of every stake.</strong> A losing trade returns nothing. There is no partial loss and no way to close a
                trade early.
              </li>
              <li>
                <strong>The odds are against you.</strong> A winning trade pays less than the amount you risk, because payouts are below 100%. Over
                many trades the average result is a loss. At an 85% payout you must win about 54.1% of your trades just to break even.
              </li>
              <li>
                <strong>Prices are synthetic.</strong> Every instrument on NeuroOption is an "OTC" instrument priced by NeuroOption's own price
                engine. These prices do not come from any exchange, interbank market or data provider and can differ from the real-world asset with
                a similar name.
              </li>
              <li>
                <strong>We are on the other side of your trade.</strong> NeuroOption is the counterparty to every trade. When you lose, we gain;
                when you win, we pay you from our own funds.
              </li>
              <li>
                <strong>Losses can build up very quickly.</strong> Trades can last as little as 5 seconds, and you can open many trades in a short
                time.
              </li>
              <li>
                <strong>Only trade with money you can afford to lose completely.</strong> Never trade with borrowed money or money you need for
                rent, food, school fees, health care or other essentials.
              </li>
            </ul>
          </Callout>
          <p>
            Read this whole Risk Disclosure before you trade. It explains the main risks of trading fixed-time options on NeuroOption, but it
            cannot describe every risk that may affect you. If you do not understand any part of it, do not trade, and contact us through{" "}
            <a href="/support">Support</a> with your questions.
          </p>
        </>
      ),
    },
    {
      id: "about-this-disclosure",
      title: "2. About this Risk Disclosure",
      body: (
        <>
          <h3>2.1 Who we are</h3>
          <p>
            In this Risk Disclosure, "NeuroOption", "we", "us" and "our" mean <Co field="legalName" /> (trading as NeuroOption), a company
            incorporated in <Co field="jurisdiction" /> with registration number <Co field="registrationNumber" /> and its registered office at{" "}
            <Co field="registeredAddress" />. "You" and "your" mean the person using the NeuroOption website and platform at https://neurooption.com.
          </p>
          <h3>2.2 What this document is for</h3>
          <p>
            This document explains, in plain terms, how fixed-time options work on NeuroOption and what can go wrong. It is a disclosure of risks.
            It is not advice and is not a recommendation to trade. Our regulatory status is described in section 16.1, and you should read that
            section before you rely on anything we say.
          </p>
          <h3>2.3 How it fits with our other policies</h3>
          <p>This Risk Disclosure forms part of the information you should read before trading, together with:</p>
          <ul>
            <li>
              the <PolicyLink slug="terms">Terms and Conditions</PolicyLink>, which set out the agreement between you and us;
            </li>
            <li>
              the <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink>, which explains how trades are accepted, priced
              and settled;
            </li>
            <li>
              the <PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink>, which explains how we deal with the fact that
              we are the counterparty to your trades;
            </li>
            <li>
              the <PolicyLink slug="responsible-trading">Responsible Trading Policy</PolicyLink>, which explains how to keep control of your
              trading;
            </li>
            <li>
              the <PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink> and the{" "}
              <PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink>, which cover payments and identity checks.
            </li>
          </ul>
          <h3>2.4 Key terms</h3>
          <Definitions
            items={[
              [
                "Fixed-time option",
                <>
                  A contract between you and NeuroOption in which you predict whether the price of an instrument will be higher (Buy) or lower
                  (Sell) at a fixed expiry time than it was when the trade started. Often called a "binary option". The result is all-or-nothing.
                </>,
              ],
              [
                "Instrument",
                <>Something you can trade on the platform, such as "EUR/USD OTC" or "Gold OTC". Every instrument on NeuroOption is a synthetic OTC instrument.</>,
              ],
              [
                "OTC price (synthetic price)",
                <>
                  A price generated by NeuroOption's own price engine. It is not taken from any exchange, interbank market or data provider.
                </>,
              ],
              ["Stake", <>The amount you commit to a trade. It is taken from your available balance when we accept the trade.</>],
              [
                "Payout",
                <>
                  The profit you receive if a trade wins, shown as a percentage of the stake. For example, an 85% payout on a KES 1,000 stake means
                  KES 850 profit, so KES 1,850 is returned to your balance.
                </>,
              ],
              ["Entry price", <>Our platform price at the moment our server accepts your trade.</>],
              [
                "Expiry",
                <>The moment the trade ends, measured from when our server accepts it. Expiries range from 5 seconds to 5 hours.</>,
              ],
              ["Settlement price", <>Our platform price at the moment the trade is settled, which is normally at expiry.</>],
              [
                "Win, loss and draw",
                <>
                  A win means the settlement price moved in the direction you chose. A loss means it did not. A draw means the settlement price is
                  exactly equal to the entry price.
                </>,
              ],
              [
                "Break-even win rate",
                <>The share of trades you would need to win, on average, just to avoid losing money over many trades.</>,
              ],
              ["Counterparty", <>The party on the other side of a contract. NeuroOption is the counterparty to every trade.</>],
              [
                "Demo account",
                <>An account funded with virtual US dollars (USD) that have no value and cannot be withdrawn.</>,
              ],
              [
                "Real account",
                <>An account held in Kenya Shillings (KES) for trading with real money.</>,
              ],
              ["EAT", <>East Africa Time (UTC+3). Times on the platform are shown in EAT.</>],
            ]}
          />
        </>
      ),
    },
    {
      id: "how-fixed-time-options-work",
      title: "3. How fixed-time options work on NeuroOption",
      body: (
        <>
          <h3>3.1 Placing a trade</h3>
          <ol>
            <li>You choose an instrument, for example "EUR/USD OTC".</li>
            <li>You choose an expiry between 5 seconds and 5 hours.</li>
            <li>
              You enter a stake. The minimum stake is 1 unit of your account currency (for example KES 1 on a real account, or USD 1 of virtual
              funds on the demo account). The maximum is your available balance.
            </li>
            <li>The platform shows you the payout percentage for that instrument and expiry.</li>
            <li>You press Buy if you think the price will be higher at expiry, or Sell if you think it will be lower.</li>
            <li>Our server accepts or rejects the trade. If it accepts it, the stake is taken from your balance and the entry price is recorded.</li>
            <li>At expiry the trade is settled automatically and the result is applied to your balance.</li>
          </ol>
          <h3>3.2 The three possible outcomes</h3>
          <p>The table uses a stake of KES 1,000 and a payout of 85% as an example.</p>
          <Table
            head={["Outcome", "When it happens", "What you get back", "Your profit or loss"]}
            rows={[
              [
                "Win",
                <>You chose Buy and the settlement price is higher than the entry price, or you chose Sell and it is lower.</>,
                "KES 1,850 (your stake plus 85%)",
                "Profit of KES 850",
              ],
              [
                "Loss",
                <>You chose Buy and the settlement price is lower than the entry price, or you chose Sell and it is higher.</>,
                "Nothing",
                "Loss of KES 1,000 (the whole stake)",
              ],
              ["Draw", <>The settlement price is exactly equal to the entry price.</>, "KES 1,000 (your stake)", "No profit and no loss"],
            ]}
          />
          <h3>3.3 Only the direction matters</h3>
          <p>
            The size of the price movement makes no difference to the result. A movement of the smallest possible price step in your direction is
            enough to win, and a movement of the smallest step against you is enough to lose. A large movement in your favour does not pay more
            than a small one.
          </p>
          <h3>3.4 You cannot close a trade early</h3>
          <p>
            Once we accept a trade, you cannot close, cancel or sell it back before expiry, even if the price moves strongly against you. You are
            committed until the trade settles. A trade placed by mistake, for example by pressing Buy instead of Sell or entering the wrong stake, is
            binding once we accept it, subject only to section 10.3.
          </p>
          <h3>3.5 You do not own anything</h3>
          <p>
            A fixed-time option is a contract with NeuroOption about a price movement on our platform. You do not buy, own or receive any currency,
            cryptocurrency, share, index or commodity, and you have no rights such as dividends, voting or delivery.
          </p>
        </>
      ),
    },
    {
      id: "total-loss-of-stake",
      title: "4. You can lose 100% of every stake",
      body: (
        <>
          <h3>4.1 Every losing trade costs the whole stake</h3>
          <p>
            Fixed-time options have no stop-loss and no partial outcome. If the trade loses, the entire stake is gone. If you place ten trades of
            KES 500 and all ten lose, you have lost KES 5,000.
          </p>
          <h3>4.2 Losing streaks are normal</h3>
          <p>
            Even if each trade had an even (50%) chance of winning, long runs of losses would be common. The table shows the chance of at least one
            losing streak of a given length within a series of trades, assuming each trade has a 50% chance of losing and trades are independent of
            each other.
          </p>
          <Table
            head={["Number of trades", "At least 5 losses in a row", "At least 7 losses in a row", "At least 10 losses in a row"]}
            rows={[
              ["20 trades", "About 25%", "About 6%", "Under 1%"],
              ["50 trades", "About 55%", "About 17%", "About 2%"],
              ["100 trades", "About 81%", "About 32%", "About 4%"],
              ["200 trades", "About 97%", "About 54%", "About 9%"],
            ]}
          />
          <p>
            Losing streaks do not mean a win is "due". Each trade's result is independent of the results before it. Increasing your stake to win
            back losses can make them much larger (see section 18.2).
          </p>
          <h3>4.3 Your losses are limited to your balance, but you can lose all of it</h3>
          <p>
            Each stake is taken from your available balance when the trade is accepted, you cannot stake more than your available balance, and there
            is no leverage or borrowing on the platform. Your trading losses therefore cannot take your balance below zero. However, you can lose
            your entire balance, and if you deposit again, everything you deposit.
          </p>
        </>
      ),
    },
    {
      id: "negative-expected-return",
      title: "5. Payouts below 100% mean a negative expected return",
      body: (
        <>
          <h3>5.1 Why the odds are against you</h3>
          <p>
            When you win, you receive less than you risk. With an 85% payout you risk KES 1,000 to make KES 850. If you won exactly half your
            trades, every win would add KES 850 and every loss would remove KES 1,000, so you would lose money overall. To come out even, you must
            win more than half your trades. The lower the payout, the more you must win.
          </p>
          <h3>5.2 The break-even win rate</h3>
          <Callout tone="info" title="Break-even win rate = 1 ÷ (1 + payout)">
            <p>
              Write the payout as a decimal (85% = 0.85). At the break-even win rate, what you make on winning trades exactly equals what you lose
              on losing trades: win rate × payout = (1 − win rate) × 1. Solving this gives 1 ÷ (1 + payout).
            </p>
            <p>Example: with an 85% payout, 1 ÷ 1.85 = 0.5405, so you need to win about 54.1% of your trades just to break even.</p>
          </Callout>
          <h3>5.3 Worked table</h3>
          <p>
            The last two columns show the average result if you win exactly 50% of your trades, which is what you should expect if you have no
            reliable way of predicting price direction (see section 5.5). Draws are left out because a draw returns your stake and does not change
            the calculation.
          </p>
          <Table
            head={[
              "Payout",
              "Break-even win rate",
              "Average result per KES 1,000 trade at a 50% win rate",
              "Average result over 100 trades of KES 1,000 at a 50% win rate",
            ]}
            rows={[
              ["70%", "About 58.8%", "Loss of KES 150", "Loss of KES 15,000"],
              ["80%", "About 55.6%", "Loss of KES 100", "Loss of KES 10,000"],
              ["85%", "About 54.1%", "Loss of KES 75", "Loss of KES 7,500"],
              ["88%", "About 53.2%", "Loss of KES 60", "Loss of KES 6,000"],
              ["92%", "About 52.1%", "Loss of KES 40", "Loss of KES 4,000"],
            ]}
          />
          <h3>5.4 Working out your own expected result</h3>
          <p>
            Average result per trade = stake × (win rate × payout − (1 − win rate)). For example, a KES 1,000 stake at an 85% payout with a 50% win
            rate gives 1,000 × (0.5 × 0.85 − 0.5) = −KES 75 per trade. These figures are averages over many trades. In any short period your actual
            result can be much better or much worse, up to the loss of every stake.
          </p>
          <h3>5.5 No method reliably beats the break-even rate</h3>
          <p>
            Our price engine generates price movements using software and seeded random processes (see section 7). We do not know of any indicator, chart pattern, system or strategy that can reliably predict their direction, and you
            should assume that none will give you a win rate above the break-even rate over time. A run of wins is not evidence that a strategy
            works.
          </p>
          <h3>5.6 Lower payouts make it harder</h3>
          <p>
            Payouts change (see section 9). Under our current settings payouts are kept between 20% and 92%. At a 20% payout the break-even win rate
            is about 83.3%. Very short expiries currently pay slightly less than the instrument's standard payout. Always check the payout shown
            before you place a trade.
          </p>
        </>
      ),
    },
    {
      id: "short-expiries",
      title: "6. Short expiries and the speed of losses",
      body: (
        <>
          <h3>6.1 How short trades can be</h3>
          <p>
            Expiries start at 5 seconds. Under our current settings, expiries of 15 seconds or less pay 3 percentage points less than the
            instrument's standard payout, expiries of 16 to 30 seconds pay 2 points less, and expiries of 5 minutes or more pay 1 point more. Short
            expiries therefore combine the lowest payouts with the fastest results.
          </p>
          <h3>6.2 How fast losses can build up</h3>
          <p>
            The table compares one hour of continuous trading with a KES 500 stake and a 50% win rate. The payouts are illustrative. The expected
            loss is an average; in any particular hour you could lose much more.
          </p>
          <Table
            head={["Expiry", "Trades in one hour", "Total staked", "Illustrative payout", "Average loss at a 50% win rate"]}
            rows={[
              ["5 seconds (one trade every 10 seconds)", "360", "KES 180,000", "82%", "KES 16,200"],
              ["1 minute (one trade a minute)", "60", "KES 30,000", "85%", "KES 2,250"],
              ["5 minutes (one trade every 5 minutes)", "12", "KES 6,000", "86%", "KES 420"],
            ]}
          />
          <h3>6.3 Several trades at once</h3>
          <p>
            You can have more than one trade open at the same time, on the same or different instruments. Your total amount at risk can therefore be
            much larger than any single stake, and several trades can lose at the same moment.
          </p>
          <h3>6.4 Less time to think</h3>
          <p>
            Fast results leave little time to reflect between trades and make it easy to trade on impulse, to increase stakes after a loss, or to
            keep going longer than you planned. Decide your limits before you start (see section 18).
          </p>
        </>
      ),
    },
    {
      id: "synthetic-otc-prices",
      title: "7. Synthetic OTC prices",
      body: (
        <>
          <h3>7.1 Every instrument is synthetic</h3>
          <p>
            NeuroOption offers 67 instruments, all labelled "OTC": 20 currency pairs, 11 cryptocurrencies, 16 stocks, 10 indices and 10 commodities.
            The price of every one of them is generated by NeuroOption's own price engine, which uses seeded random processes designed to produce
            price movements that look broadly like the markets the instruments are named after.
          </p>
          <h3>7.2 These are not real-world prices</h3>
          <ul>
            <li>
              Prices do not come from any exchange, interbank market, broker or data provider. "EUR/USD OTC" is not the euro to US dollar exchange
              rate, and "Gold OTC" is not the price of gold.
            </li>
            <li>Prices can differ, sometimes widely, from the real-world asset with a similar name, both in level and in direction.</li>
            <li>
              News, economic data, company results and other real-world events do not drive these prices. Analysis of the real asset gives you no
              information about the synthetic price.
            </li>
            <li>Synthetic instruments are not tied to real-market opening hours, so prices may move when the real market is closed.</li>
            <li>Your trades are not passed to any exchange or other market.</li>
          </ul>
          <h3>7.3 NeuroOption controls the price engine</h3>
          <p>
            We design, operate and can change the price engine, including the instruments offered and the way prices move. Trades are settled using
            the prices our engine produced. There is no independent market price against which you can check them.
          </p>
          <h3>7.4 Gaps, jumps and restarts</h3>
          <p>
            The price engine runs on our servers. If our systems are restarted, updated or interrupted, the price series of an instrument may
            restart from a different level, so a chart can show a gap or a sudden jump. A trade open during such an event can be affected (see
            section 10).
          </p>
          <h3>7.5 How the entry price is set</h3>
          <p>
            The entry price is our platform mid price at the moment our server accepts the trade. No separate spread is added to it. The settlement
            price is our platform price when the trade is settled.
          </p>
        </>
      ),
    },
    {
      id: "counterparty-and-conflicts",
      title: "8. NeuroOption is your counterparty: conflict of interest",
      body: (
        <>
          <h3>8.1 We take the other side of every trade</h3>
          <p>
            Every trade is a contract between you and NeuroOption. When you win, we pay your profit from our own funds. When you lose, we keep your
            stake. Our trading revenue comes from clients' losses.
          </p>
          <h3>8.2 Our interests are opposed to yours</h3>
          <p>
            Because your profit is our cost and your loss is our gain, our financial interest in each trade is directly opposed to yours. This is a
            conflict of interest that you should keep in mind whenever you trade with us.
          </p>
          <h3>8.3 We control the prices and payouts</h3>
          <p>
            We also generate the prices (section 7), set the payouts (section 9), choose which instruments and expiries are offered, and operate the
            systems that settle trades. In a market with independent prices these things would be outside the control of the firm you trade with.
            On NeuroOption they are not.
          </p>
          <h3>8.4 How we limit this conflict</h3>
          <p>As the platform is currently built:</p>
          <ul>
            <li>Payouts are the same for every client. They depend only on the instrument, measured conditions of its synthetic price stream and the expiry you choose.</li>
            <li>
              The price engine and the payout engine do not use information about who is trading, client balances, open positions or trade results.
            </li>
            <li>The payout is fixed when your trade is accepted, and later payout changes do not affect it.</li>
            <li>Actions that our staff take in the administration console are recorded in an audit log. Some back-office actions are not recorded in that log (see the <PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink>).</li>
          </ul>
          <p>
            These measures reduce the conflict but do not remove it. See the{" "}
            <PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink> for more.
          </p>
          <h3>8.5 Our ability to pay you</h3>
          <p>
            Because we are the counterparty, your winnings and your balance depend on NeuroOption being able to pay. Unless we tell you otherwise in
            writing, you should not assume that money in your account is held separately from our own money or that it is protected by any deposit
            insurance or investor compensation scheme. If NeuroOption became insolvent or stopped operating, you could lose some or all of your
            balance or face long delays in getting it back.
          </p>
        </>
      ),
    },
    {
      id: "payouts-quotes-rejection",
      title: "9. Payout changes, quotes and trade rejection",
      body: (
        <>
          <h3>9.1 Payouts change</h3>
          <p>
            Each instrument's payout is reviewed regularly and can go up or down depending on measured conditions of its synthetic price stream,
            such as volatility, price range and trend. Payouts are normally around 85% to 88%, are lower for very short expiries and are kept between
            20% and 92% under our current settings. We may change how payouts are calculated, and these settings, at any time. A payout you saw
            earlier is not a promise that the same payout will be available later.
          </p>
          <h3>9.2 Your payout is fixed when we accept your trade</h3>
          <p>
            The payout that applies to a trade is the one in force at the moment our server accepts it. It is stored with the trade and used at
            settlement. Changes after that moment do not affect the trade, whether they would have been better or worse for you.
          </p>
          <h3>9.3 When a trade is rejected</h3>
          <p>We will not accept a trade, and nothing is taken from your balance, if for example:</p>
          <ul>
            <li>
              the payout changed between the moment it was shown to you and the moment your trade reached our server. You will be shown the new
              payout and must confirm it and submit the trade again;
            </li>
            <li>no payout is available for the instrument at that moment, for example while the platform is reconnecting;</li>
            <li>the instrument is not available for trading;</li>
            <li>the stake is below the minimum or above your available balance, or the expiry is outside the 5-second to 5-hour range.</li>
          </ul>
          <p>
            A rejected trade cannot be reinstated at the earlier price or payout. By the time you resubmit, the price and payout may be different.
          </p>
          <h3>9.4 Your entry price may differ from what you saw</h3>
          <p>
            Prices on the platform update frequently. The entry price is the price on our server when your trade is accepted, not the
            price on your screen when you pressed Buy or Sell. Because of network delay, the price may have moved in between. Check the entry price
            recorded for each trade.
          </p>
          <h3>9.5 Expiry is measured by our server clock</h3>
          <p>
            Expiry is counted from the moment our server accepts the trade, using our server's clock, not your device's clock. A 60-second trade
            ends 60 seconds after our server accepts it.
          </p>
        </>
      ),
    },
    {
      id: "settlement-timing",
      title: "10. Settlement timing and delay risk",
      body: (
        <>
          <h3>10.1 Normal settlement</h3>
          <p>
            Trades are settled automatically by our systems at expiry, using our platform price at that moment. The result is then applied to your
            balance and shown in your trade history.
          </p>
          <h3>10.2 Delayed settlement</h3>
          <p>
            If our systems are restarted, overloaded or interrupted, a trade can be settled later than its expiry, for example when the system next
            checks for expired trades. A delayed trade is settled using the price available when settlement actually runs, which can be different
            from the price at expiry and can change the result.
          </p>
          <Callout tone="warn" title="Example of a delayed settlement">
            <p>
              You Buy a 60-second trade at an entry price of 1.13450. At expiry the price is 1.13462, which would be a win. Because of a server
              restart, settlement runs 30 seconds late, when the price is 1.13441, and the trade is settled as a loss. A delay can also change a loss
              into a win. You cannot rely on either.
            </p>
          </Callout>
          <h3>10.3 Trades affected by technical errors</h3>
          <p>
            Where a trade is clearly affected by a technical error, such as a price that is obviously wrong, a settlement failure, a price restart
            (section 7.4) or another malfunction of our systems, we may review the trade and correct its result, or cancel it and return your stake.
            How we do this is explained in the <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink> and the{" "}
            <PolicyLink slug="terms">Terms and Conditions</PolicyLink>.
          </p>
          <h3>10.4 Checking your results</h3>
          <p>
            Check your open trades and trade history regularly. If you think a trade was settled wrongly, contact us through{" "}
            <a href="/support">Support</a> as soon as possible and include the trade details. If you are not satisfied with our answer, you can use
            our <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>.
          </p>
        </>
      ),
    },
    {
      id: "technology-risks",
      title: "11. Technology, connectivity and outage risks",
      body: (
        <>
          <h3>11.1 Your connection and device</h3>
          <ul>
            <li>
              Trading depends on your internet connection, mobile data, device and browser. A slow or unstable connection can delay your
              instructions, cause trades to be rejected, or show you out-of-date prices.
            </li>
            <li>
              Losing your connection does not stop or pause a trade. An accepted trade runs to expiry and settles whether or not you are connected.
            </li>
            <li>
              If your connection drops just after you submit a trade, the trade may still have been accepted. Check your open trades before placing
              another one, or you may end up with two trades instead of one.
            </li>
          </ul>
          <h3>11.2 Our systems and providers</h3>
          <p>
            The platform runs on servers and databases operated by third-party hosting providers and depends on software that can fail. Outages,
            maintenance, software faults, loss of the live price stream, or failures at our providers can make the platform slow or unavailable
            without warning, can prevent you from placing trades, and can delay settlement. We do not guarantee that the platform will be available
            at all times or free of errors.
          </p>
          <h3>11.3 What you see on screen</h3>
          <p>
            Charts, candles, countdown timers and indicators on your screen can lag behind, or briefly differ from, the prices and times on our
            server. Trades are accepted, timed and settled using the records on our server.
          </p>
          <h3>11.4 Account restrictions</h3>
          <p>
            We may suspend, lock or restrict an account, for example for security reasons, suspected misuse, unpaid or disputed transactions or
            legal and compliance reasons, as set out in the <PolicyLink slug="terms">Terms and Conditions</PolicyLink>. While an account is
            restricted you may be unable to trade, deposit or withdraw. Trades that are already open when a restriction is applied may still be
            settled at expiry or may be reviewed under section 10.3.
          </p>
          <h3>11.5 Account security</h3>
          <ul>
            <li>
              Anyone who has your password, or access to a device where you are signed in, can trade on your account. Use a strong password that you
              do not use anywhere else and never share it.
            </li>
            <li>Two-factor authentication is not currently available on NeuroOption.</li>
            <li>
              A sign-in can stay valid for up to 7 days. If you do not tick "Remember me", it is kept only for your current browser session. Always
              sign out on shared or public devices.
            </li>
            <li>
              Be careful of messages, websites or callers pretending to be NeuroOption. We will never ask you for your password or your M-Pesa PIN.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "demo-results",
      title: "12. Demo results do not predict real results",
      body: (
        <>
          <h3>12.1 What the demo account is</h3>
          <p>
            The demo account uses virtual US dollars. It starts with USD 70,000 of virtual funds. You can top it up only while the balance is below
            USD 10,000, in fixed amounts of USD 20,000, 50,000, 60,000 or 100,000. Virtual funds have no value and cannot be withdrawn, transferred or
            exchanged for money.
          </p>
          <h3>12.2 Why demo results are a poor guide</h3>
          <ul>
            <li>
              No real money is at stake, so you will not feel the same fear, pressure or temptation to chase losses that real trading brings. People
              often trade differently when their own money is involved.
            </li>
            <li>
              The large virtual balance and the ability to top it up make it easy to place stakes you could never afford with real money and to wipe
              out losses with a top-up.
            </li>
            <li>A good run on the demo account over a short period is consistent with luck and says little about future results.</li>
            <li>The same negative expected return described in section 5 applies to demo trades and real trades alike.</li>
          </ul>
          <h3>12.3 The public demo</h3>
          <p>
            If you use the demo without signing in, you share one public demo session with other visitors. The balance and trades you see there can
            include other people's activity and are not a record of your own results.
          </p>
          <h3>12.4 Past results</h3>
          <p>
            Your past results, on the demo or a real account, are not a reliable indicator of future results. Real accounts use the same
            synthetic prices and payout rules as the demo account unless we tell you otherwise.
          </p>
        </>
      ),
    },
    {
      id: "no-guarantees-no-advice",
      title: "13. No guaranteed returns and no advice",
      body: (
        <>
          <h3>13.1 No guarantees</h3>
          <p>
            No profit or return is guaranteed. No trade on NeuroOption is risk-free. Anyone who tells you that you can make a reliable or regular
            income from fixed-time options is wrong.
          </p>
          <h3>13.2 We do not give advice or check suitability</h3>
          <p>
            We do not give investment, financial, legal or tax advice, and nothing on the platform, in our emails or from our staff is a
            recommendation to place any trade. We do not currently assess your knowledge, experience, income or financial situation before you
            trade, so you must decide for yourself whether this product is right for you. If you are unsure, get independent advice first.
          </p>
          <h3>13.3 Charts, indicators and tools</h3>
          <p>
            Charts, technical indicators, timeframes and other tools on the platform are provided to display prices. They do not predict the
            direction of synthetic prices and are not trading signals.
          </p>
          <h3>13.4 Preview and "coming soon" features</h3>
          <p>
            Some pages show features that are not live services, such as social and copy trading, trading signals, tournaments and express trades.
            Any traders, signals, returns, win rates, copier counts or rankings shown on those pages are illustrative examples. They are not real
            results and not recommendations. NeuroOption does not currently offer bonuses or promotions.
          </p>
          <h3>13.5 Be careful with third-party promises</h3>
          <p>
            We have not authorised anyone to promise returns, to trade on your behalf or to manage your account for us. Be very wary of anyone, for
            example on social media or messaging apps, who offers signals, account management or "guaranteed" profits, or who asks for your password,
            M-Pesa PIN or money.
          </p>
        </>
      ),
    },
    {
      id: "currency-conversion",
      title: "14. Currency and display-conversion risk",
      body: (
        <>
          <h3>14.1 Account currencies</h3>
          <p>
            Real accounts are held in Kenya Shillings (KES). Deposits and withdrawals are in whole Kenya Shillings through M-Pesa, and stakes,
            payouts and balances on a real account are in KES. The demo account uses virtual US dollars.
          </p>
          <h3>14.2 Indicative conversions</h3>
          <p>
            Where the platform shows an amount converted into another currency, such as a US dollar equivalent of a KES amount, the conversion uses a
            fixed indicative rate that we set. It is not a live market exchange rate, it is not updated continuously, and different parts of the
            platform may use slightly different rates. Converted figures are for information only. They are not an offer to exchange money and do
            not change what you are owed, which is determined in the currency of your account.
          </p>
          <h3>14.3 Your own currency risk</h3>
          <p>
            If you measure your money in a currency other than KES, the value of your KES balance in that currency will rise and fall with exchange
            rates. NeuroOption does not protect you against this.
          </p>
          <h3>14.4 OTC currency pairs are not exchange rates</h3>
          <p>
            The synthetic currency pairs you can trade (section 7) are not real exchange rates and are not used to convert any money in your account.
          </p>
        </>
      ),
    },
    {
      id: "payment-system-risks",
      title: "15. Payment-system risks (M-Pesa)",
      body: (
        <>
          <h3>15.1 One payment method</h3>
          <p>
            Deposits and withdrawals are made only through Safaricom M-Pesa. Other methods shown on the
            platform as "coming soon", such as Airtel Money, Equitel, Binance Pay, Visa and Mastercard, are not available. If M-Pesa is unavailable,
            you will not be able to deposit or receive withdrawals until it is restored.
          </p>
          <h3>15.2 Deposits</h3>
          <ul>
            <li>
              You start a deposit on the platform, and M-Pesa sends a payment prompt to your phone, which you approve with your M-Pesa PIN. The prompt
              can fail to arrive, time out, or be declined, for example because of network problems or an incorrect PIN.
            </li>
            <li>
              We credit a deposit only after Safaricom confirms the payment, so there can be a delay between paying and seeing the funds in your
              account.
            </li>
            <li>
              If the amount paid differs from the amount requested, the deposit is held under review and is not available to trade until it has been
              checked.
            </li>
            <li>
              If a deposit fails or is cancelled, nothing is credited. Any money M-Pesa took is reversed by the provider under its own processes and
              timescales, which we do not control.
            </li>
            <li>
              Deposits are limited to KES 150,000 each, and M-Pesa's own transaction and balance limits also apply. NeuroOption does not charge a
              deposit fee, but M-Pesa tariffs may apply.
            </li>
          </ul>
          <h3>15.3 Withdrawals</h3>
          <ul>
            <li>
              Withdrawals are paid in KES to an M-Pesa number. While a withdrawal is pending, the amount is locked and cannot be used for trading.
            </li>
            <li>
              Each withdrawal is reviewed manually by our staff. Our target is usually 24 to 48 hours, but this is not guaranteed and it can take
              longer, for example if we need more information from you or our payment provider is unavailable.
            </li>
            <li>
              A withdrawal can be declined, in which case we tell you the reason and the locked amount is returned to your balance.
            </li>
            <li>
              We may require you to verify your identity before we pay a withdrawal, and we may pay only to an M-Pesa account registered in your own
              name.
            </li>
            <li>
              Check the M-Pesa number carefully. A payment sent to a wrong number may be difficult or impossible to recover.
            </li>
            <li>NeuroOption does not charge a withdrawal fee.</li>
          </ul>
          <h3>15.4 Mobile-money security</h3>
          <p>
            Keep your M-Pesa PIN secret and protect your phone and SIM card. If your phone is lost or your SIM is replaced without your permission
            (a SIM swap), contact Safaricom immediately and tell us through <a href="/support">Support</a>. You only ever enter your M-Pesa PIN in the
            M-Pesa prompt on your own phone.
          </p>
          <h3>15.5 Legal and compliance checks</h3>
          <p>
            Payments may be delayed or refused where we need to carry out checks required by law (see section 16.6). Full details are in the{" "}
            <PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink>.
          </p>
        </>
      ),
    },
    {
      id: "regulatory-legal-risk",
      title: "16. Regulatory and legal risk",
      body: (
        <>
          <h3>16.1 NeuroOption's regulatory status</h3>
          <Table
            head={["Item", "Details"]}
            rows={[
              ["Regulator", <Co field="regulator" />],
              ["Licence", <Co field="licence" />],
            ]}
          />
          <p>
            Do not assume that NeuroOption is licensed, regulated or supervised by any authority beyond what is stated in this table. Clients of a
            firm that is not licensed for a service generally do not have the protections that come with a licensed firm, such as regulatory conduct
            rules, client-money protection, compensation schemes or a regulator's complaints process. A reference in our policies to a Kenyan law or
            public body does not mean that body has approved, licensed or endorsed NeuroOption.
          </p>
          <h3>16.2 The position in Kenya</h3>
          <p>
            The Capital Markets Authority (CMA) regulates capital markets in Kenya under the Capital Markets Act. Whether, and on what terms, products
            such as fixed-time options on synthetic instruments may be offered to the public in Kenya depends on Kenyan law and regulatory policy,
            which can change. Your rights under Kenyan consumer protection law, including the Consumer Protection Act 2012, are not limited by this
            Risk Disclosure.
          </p>
          <h3>16.3 Restrictions and bans in other countries</h3>
          <p>Fixed-time ("binary") options for retail clients are banned or heavily restricted in many countries, including:</p>
          <ul>
            <li>the European Union and European Economic Area, where selling them to retail clients is prohibited;</li>
            <li>the United Kingdom, where the Financial Conduct Authority banned their sale to retail consumers in 2019;</li>
            <li>Australia, where the Australian Securities and Investments Commission banned their issue and distribution to retail clients in 2021;</li>
            <li>Canada, where securities regulators have prohibited the offer of short-term binary options to individuals;</li>
            <li>Israel, where the binary options business has been prohibited;</li>
            <li>the United States, where they may be offered to the public only on exchanges registered with US regulators.</li>
          </ul>
          <p>This is not a complete list. Other countries also restrict these products.</p>
          <h3>16.4 You are responsible for legality where you are</h3>
          <p>
            Our services are not intended for anyone in a country where offering or using them is prohibited. Being able to open our website or
            create an account does not mean our services are lawful or available where you live or are located. You are responsible for checking
            that you are allowed to use them. We may refuse to open an account, restrict it or close it where we believe our services are not lawful
            for you, as set out in the <PolicyLink slug="terms">Terms and Conditions</PolicyLink>.
          </p>
          <h3>16.5 Changes in law or regulation</h3>
          <p>
            Laws, regulations and regulators' positions on online trading products can change at any time. A change, or action by a regulator or a
            payment provider, could require us to change, suspend or withdraw some or all of our services, possibly at short notice, and could delay
            deposits or withdrawals.
          </p>
          <h3>16.6 Anti-money-laundering and counter-terrorism-financing laws</h3>
          <p>
            Laws such as the Proceeds of Crime and Anti-Money Laundering Act 2009 and the Prevention of Terrorism Act 2012 may require us to verify
            your identity, ask about the source of your funds, delay or refuse transactions, and report suspicious activity to the Financial
            Reporting Centre (FRC). We may ask for documents such as your national ID card or passport before you can deposit or withdraw. See the{" "}
            <PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink>.
          </p>
        </>
      ),
    },
    {
      id: "taxation",
      title: "17. Taxation",
      body: (
        <>
          <h3>17.1 Your responsibility</h3>
          <p>
            You are responsible for finding out whether tax is due on your trading results and for declaring and paying it to the Kenya Revenue
            Authority (KRA) or to the tax authority of the country where you are resident. Keep your own records. Your trade history and transaction
            records are available in your account.
          </p>
          <h3>17.2 Tax treatment can be uncertain</h3>
          <p>
            How gains and losses from fixed-time options are taxed can depend on how the law classifies the product and your activity, and on your
            personal circumstances. Tax law and its interpretation can change, possibly with effect for past periods.
          </p>
          <h3>17.3 What we do and do not do</h3>
          <p>
            We do not give tax advice. Unless the law requires us to, we do not deduct tax from your payouts or withdrawals. If the law requires us to
            deduct or report tax, we will do so, and the amount you receive may be reduced. If you are unsure about your position, ask a qualified tax
            adviser.
          </p>
        </>
      ),
    },
    {
      id: "behavioural-risk",
      title: "18. Behavioural risk and gambling-like features",
      body: (
        <>
          <h3>18.1 Features that resemble gambling</h3>
          <p>Fixed-time options share many features with gambling, and they can become compulsive. In particular:</p>
          <ul>
            <li>results are all-or-nothing and arrive quickly, sometimes within seconds;</li>
            <li>a loss by the smallest price step can feel like a "near miss" that invites another try;</li>
            <li>synthetic instruments are not tied to market hours, so trading may be available at any hour, including late at night and at weekends;</li>
            <li>
              our Achievements page awards experience points (XP), levels and badges based on the number of trades you settle, the number you win and
              the number of consecutive days on which you trade, and some badges are linked to goals such as placing a single large stake. These
              have no cash value and are not a measure of skill, but they can encourage you to trade more often or stake more than you intended.
            </li>
          </ul>
          <h3>18.2 Chasing losses and doubling stakes</h3>
          <p>
            A common mistake is to increase the stake after each loss to win back what was lost (sometimes called "martingale"). Because payouts are
            below 100%, doubling does not even reliably recover your losses, and the stakes grow very fast. The table starts at KES 100, doubles after
            every loss and uses an 85% payout.
          </p>
          <Table
            head={["Trade", "Stake", "Total lost if this trade also loses", "Overall result if this trade wins"]}
            rows={[
              ["1st", "KES 100", "KES 100", "Profit of KES 85"],
              ["2nd", "KES 200", "KES 300", "Profit of KES 70"],
              ["3rd", "KES 400", "KES 700", "Profit of KES 40"],
              ["4th", "KES 800", "KES 1,500", "Loss of KES 20"],
              ["5th", "KES 1,600", "KES 3,100", "Loss of KES 140"],
              ["6th", "KES 3,200", "KES 6,300", "Loss of KES 380"],
              ["7th", "KES 6,400", "KES 12,700", "Loss of KES 860"],
              ["8th", "KES 12,800", "KES 25,500", "Loss of KES 1,820"],
            ]}
          />
          <p>
            Using the same assumptions as section 4.2 (a 50% chance of losing each trade, trades independent), the chance of at least one run of 8
            losses in a row within 100 trades is about 17%. At
            that point you would have lost KES 25,500 chasing a KES 100 stake.
          </p>
          <h3>18.3 Warning signs</h3>
          <ul>
            <li>You trade more, or with larger stakes, than you planned.</li>
            <li>You increase stakes or keep trading to win back losses.</li>
            <li>You deposit again soon after losing, or borrow money to trade.</li>
            <li>You trade to escape stress, boredom or low mood, or feel restless when you cannot trade.</li>
            <li>You hide your trading or its cost from family or friends.</li>
            <li>Trading affects your sleep, work, studies, relationships or ability to pay bills.</li>
          </ul>
          <h3>18.4 What you can do</h3>
          <ul>
            <li>
              Decide before you start how much money and time you will spend, and stop when you reach either limit. The platform does not currently
              have built-in tools to set deposit, loss or time limits, so you need to set and keep your own.
            </li>
            <li>Review your trade history honestly, including your total losses, not only your wins.</li>
            <li>Take regular breaks, and do not trade when you are tired, upset, or have been drinking.</li>
            <li>Talk to someone you trust, and consider getting help from a health professional or a support organisation.</li>
            <li>
              Contact us through <a href="/support">Support</a> if you want help to take a break or stop. You can also close your account through{" "}
              <a href="/delete-account">Delete account</a> once your balance is zero and you have no open trades or pending deposits or withdrawals.
              Closing an account cannot be undone. See the <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink>.
            </li>
          </ul>
          <p>
            Read the <PolicyLink slug="responsible-trading">Responsible Trading Policy</PolicyLink> for more guidance.
          </p>
        </>
      ),
    },
    {
      id: "who-should-not-trade",
      title: "19. Who should not trade",
      body: (
        <>
          <h3>19.1 Do not trade if any of these apply to you</h3>
          <ul>
            <li>You are under 21 years old.</li>
            <li>You live in, or are located in, a country where offering or using fixed-time options is prohibited (section 16.3).</li>
            <li>You do not fully understand how fixed-time options work, including the break-even win rate in section 5.</li>
            <li>
              You would be using money you cannot afford to lose, such as money for rent, food, school fees, medical costs, savings, group (chama)
              contributions or your business.
            </li>
            <li>You would be using borrowed money, including bank loans, mobile loans, overdrafts or credit.</li>
            <li>You see trading as a way to earn a regular income, pay off debts or recover past losses.</li>
            <li>You have, or have had, a gambling problem, or you are being treated for one.</li>
            <li>You are under the influence of alcohol or drugs, or in emotional distress.</li>
            <li>You would be trading for someone else, with someone else's money, or using someone else's M-Pesa account.</li>
          </ul>
          <h3>19.2 Think very carefully if</h3>
          <ul>
            <li>your income or savings are small or irregular;</li>
            <li>you have little or no experience of high-risk financial products;</li>
            <li>you tend to make quick decisions under pressure or find it hard to stop once you have started.</li>
          </ul>
          <p>
            If you decide to trade, use the demo account first to understand how the product works, keep stakes small, and treat any money you trade
            as money you may lose completely.
          </p>
        </>
      ),
    },
    {
      id: "acknowledgement-and-changes",
      title: "20. Your acknowledgement, changes and contact",
      body: (
        <>
          <h3>20.1 Your acknowledgement</h3>
          <p>
            By creating an account, using the demo account, depositing money or placing a real-money trade, you confirm that:
          </p>
          <ul>
            <li>you have read and understood this Risk Disclosure;</li>
            <li>you understand that you can lose the whole of every stake and that payouts below 100% mean the average result over many trades is a loss;</li>
            <li>you understand that all prices are synthetic prices generated by NeuroOption and are not real-world market prices;</li>
            <li>you understand that NeuroOption is the counterparty to every trade and that this creates a conflict of interest;</li>
            <li>you understand that we do not give advice and do not guarantee any return;</li>
            <li>you are responsible for making sure your use of our services is lawful where you are, and for any tax due;</li>
            <li>you are at least 21 years old and will trade only with money you can afford to lose.</li>
          </ul>
          <h3>20.2 Changes to this Risk Disclosure</h3>
          <p>
            We may update this Risk Disclosure, for example when the product, the law or our services change. The date at the top of this page shows
            when it was last updated. If we make a significant change, we will take reasonable steps to tell you, for example by email or a notice on
            the platform. Please check this page regularly.
          </p>
          <h3>20.3 Questions and complaints</h3>
          <p>
            If you have a question about any risk described here, open a support ticket from the <a href="/support">Support</a> page while signed
            in, visit the <a href="/help">Help Centre</a>, email <Co field="supportEmail" /> or call <Co field="supportPhone" />. If you want to make
            a complaint, follow our <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink> or email <Co field="complaintsEmail" />.
          </p>
        </>
      ),
    },
  ],
};

export default policy;
