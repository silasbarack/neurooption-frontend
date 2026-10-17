import type { Policy } from "../types";
import { Callout, Co, Definitions, PolicyLink, Table } from "../components";

const policy: Policy = {
  slug: "terms",
  title: "Terms and Conditions",
  summary:
    "The agreement between you and NeuroOption for using our website, demo and real accounts and fixed-time trading on our own synthetic OTC instruments. It sets out your rights and obligations, explains that we are the counterparty to every trade, and says what happens if something goes wrong.",
  updated: "2026-10-16",
  sections: [
    {
      id: "about-these-terms",
      title: "1. About these Terms",
      body: (
        <>
          <p>
            These Terms and Conditions ("Terms") are a legally binding agreement between you and <Co field="legalName" /> (trading as
            NeuroOption) ("NeuroOption", "we", "us" or "our"). They govern your access to and use of the website at neurooption.com,
            the NeuroOption trading platform, and any account you open with us.
          </p>

          <h3>1.1 Accepting these Terms</h3>
          <p>You accept these Terms when you do either of the following:</p>
          <ul>
            <li>
              tick the box at registration confirming that you are 21 or older and that you agree to these Terms and our{" "}
              <PolicyLink slug="privacy">Privacy Policy</PolicyLink>; or
            </li>
            <li>use the platform in any other way, including the public demo that is available without signing in.</li>
          </ul>
          <p>If you do not agree to these Terms, you must not register or use the platform.</p>

          <h3>1.2 How these Terms fit with our other policies</h3>
          <p>
            These Terms are the main agreement. The policies below form part of it and are binding on you and us. Each one covers a
            topic in more detail than these Terms do.
          </p>
          <Table
            head={["Policy", "What it covers"]}
            rows={[
              [<PolicyLink slug="risk-disclosure">Risk Disclosure</PolicyLink>, <>The risks of fixed-time trading on synthetic instruments, including the risk of losing your whole stake.</>],
              [<PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink>, <>How trades are requested, accepted, priced, settled and, in limited cases, voided.</>],
              [<PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink>, <>The conflicts that arise because we set the prices and payouts and take the other side of every trade, and how we deal with them.</>],
              [<PolicyLink slug="responsible-trading">Responsible Trading Policy</PolicyLink>, <>Warning signs of harmful trading and the help available to you.</>],
              [<PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink>, <>How money goes into and out of a real account, limits, review of withdrawals and refunds.</>],
              [<PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink>, <>Identity verification and our anti-money-laundering and counter-terrorist-financing measures.</>],
              [<PolicyLink slug="privacy">Privacy Policy</PolicyLink>, <>What personal data we collect, why, who we share it with and your rights.</>],
              [<PolicyLink slug="cookies">Cookie and Browser Storage Policy</PolicyLink>, <>What the platform stores in your browser and which third parties may set cookies.</>],
              [<PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink>, <>How to close your account, what is deleted and what we must keep.</>],
              [<PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>, <>How to complain, how we handle complaints and where you can go next.</>],
            ]}
          />

          <h3>1.3 If documents conflict</h3>
          <p>If two documents say different things about the same matter, the following order applies:</p>
          <ol>
            <li>
              the details of a specific trade shown to you and confirmed by the platform when the trade is accepted (for example the
              locked payout percentage and the expiry);
            </li>
            <li>
              the <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink>, on how trades are placed, priced and
              settled;
            </li>
            <li>
              the <PolicyLink slug="privacy">Privacy Policy</PolicyLink>, on how we handle personal data;
            </li>
            <li>these Terms, on everything else; and then</li>
            <li>the other policies listed in section 1.2.</li>
          </ol>

          <h3>1.4 Reading these Terms</h3>
          <ul>
            <li>Headings are for convenience only and do not change the meaning of a section.</li>
            <li>"Including" and "for example" introduce examples; they do not limit what comes before them.</li>
            <li>All times in these Terms and on the platform are East Africa Time (EAT, UTC+3) unless we say otherwise.</li>
            <li>Amounts for real accounts are in Kenya Shillings (KES). Amounts for demo accounts are in virtual US dollars (USD).</li>
          </ul>

          <Callout tone="risk" title="Key points before you trade">
            <ul>
              <li>Fixed-time trading is high risk. You can lose your whole stake on a trade within seconds.</li>
              <li>
                All prices on NeuroOption are produced by our own price engine. They are not prices from any exchange or real market.
              </li>
              <li>We are the counterparty to every trade: when you win, we pay; when you lose, we keep your stake.</li>
              <li>We do not give investment advice and we do not check whether trading is right for you.</li>
            </ul>
            <p>
              Read the <PolicyLink slug="risk-disclosure">Risk Disclosure</PolicyLink> before you trade, and only ever trade with money
              you can afford to lose.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "definitions",
      title: "2. Definitions",
      body: (
        <>
          <p>In these Terms, the following words have these meanings:</p>
          <Definitions
            items={[
              ["Account", <>Your NeuroOption client account, opened in your name, including your demo account and, when available, your real account.</>],
              ["Available balance", <>The amount in an account that you can use to trade or, for a real account, withdraw. It does not include locked funds.</>],
              ["Demo account", <>The practice account (shown as "QT Demo") funded with virtual funds.</>],
              ["Draw", <>A trade whose settlement price is equal to its entry price. Your stake is returned.</>],
              ["EAT", <>East Africa Time, UTC+3.</>],
              ["Entry price", <>The platform's mid price for the instrument at the moment your trade is accepted.</>],
              ["Expiry", <>The time at which a trade ends, which you choose before placing it. Expiries range from 5 seconds to 5 hours.</>],
              ["Instrument", <>A synthetic over-the-counter ("OTC") instrument offered on the platform, such as a currency pair, cryptocurrency, stock, index or commodity labelled "OTC".</>],
              ["Locked funds", <>Money in your real account that is reserved and cannot be used, for example the amount of a withdrawal while it is pending.</>],
              ["Loss", <>A trade that settles against the direction you chose. You lose your stake.</>],
              ["Manifest error", <>An obvious error in a price, payout, settlement, credit or debit, as described in section 12.</>],
              ["Payout percentage", <>The percentage of your stake that you receive as profit if a trade wins. It is shown before you place the trade and locked when the trade is accepted.</>],
              ["Platform", <>The NeuroOption website, trading interface, price engine and related systems.</>],
              ["Policies", <>The documents listed in section 1.2.</>],
              ["Price engine", <>NeuroOption's own system that generates the prices of every instrument on the platform.</>],
              ["Real account", <>An account (shown as "QT Real") held in KES and funded with real money, when real-money accounts are available.</>],
              ["Services", <>Everything we provide through the platform, including accounts, trading, deposits, withdrawals and support.</>],
              ["Settlement price", <>The platform's price for the instrument when the trade is settled, at or after expiry.</>],
              ["Stake", <>The amount you commit to a trade.</>],
              ["Trade", <>A fixed-time (sometimes called "binary") option between you and us: a contract that pays a fixed profit if the instrument's price moves in the direction you chose by expiry, and loses your stake if it does not.</>],
              ["Virtual funds", <>Demo money in USD that has no monetary value.</>],
              ["Void", <>Treated as if it had never happened, as described in section 12.4.</>],
              ["Win", <>A trade that settles in the direction you chose. You receive your stake back plus the profit set by the payout percentage.</>],
              ["You, your", <>The individual who uses the platform or holds an account.</>],
            ]}
          />
        </>
      ),
    },
    {
      id: "who-we-are",
      title: "3. Who we are",
      body: (
        <>
          <p>
            NeuroOption is the trading name of <Co field="legalName" />. Our details are:
          </p>
          <Table
            head={["Detail", "Information"]}
            rows={[
              ["Registered company name", <Co field="legalName" />],
              ["Trading name", <>NeuroOption</>],
              ["Company registration number", <Co field="registrationNumber" />],
              ["Registered office", <Co field="registeredAddress" />],
              ["Country of incorporation", <Co field="jurisdiction" />],
              ["Website", <>neurooption.com</>],
              ["Licensing regulator", <Co field="regulator" />],
              ["Licence number", <Co field="licence" />],
            ]}
          />

          <h3>3.1 Our regulatory status</h3>
          <p>
            Our regulatory status is set out only in the table above. We do not claim to be licensed, regulated, authorised or
            approved by the Capital Markets Authority (CMA) or by any other financial regulator, except as stated in that table.
          </p>
          <p>
            Unless the table names a regulator and a licence number, you should assume that the protections that can come with
            dealing with a licensed firm do not apply to your dealings with us. These can include supervision of how the firm treats
            clients and access to an investor compensation scheme.
          </p>

          <h3>3.2 How to contact us</h3>
          <p>Our contact details are in section 25.</p>
        </>
      ),
    },
    {
      id: "eligibility",
      title: "4. Who can use NeuroOption",
      body: (
        <>
          <p>To open and use an account, all of the following must be true, and must remain true for as long as you use the services.</p>

          <h3>4.1 Age and legal capacity</h3>
          <ul>
            <li>You are at least 21 years old.</li>
            <li>
              You have full legal capacity to enter into this agreement. For example, you are not subject to a court order that limits
              your ability to manage your own financial affairs.
            </li>
          </ul>

          <h3>4.2 Acting for yourself</h3>
          <ul>
            <li>You are an individual opening the account in your own name, for your own benefit.</li>
            <li>
              You are not acting for, or with money belonging to, anyone else, including a company, partnership, trust, club or
              another person.
            </li>
            <li>Only you will use your account. You will not let anyone else trade, deposit or withdraw through it.</li>
          </ul>

          <h3>4.3 Where you live</h3>
          <p>
            We do not offer our services in any country or territory where fixed-time ("binary") options, or services like ours, are
            prohibited, or where offering them would require a licence or registration that we do not hold. It is your
            responsibility to make sure that using NeuroOption is lawful where you live.
          </p>
          <p>You must not open or use an account if you are resident in any of the following:</p>
          <Table
            head={["Country or territory", "Why we do not offer services there"]}
            rows={[
              ["United States", <>Retail binary options may be offered there only on regulated US exchanges, such as those registered with the Commodity Futures Trading Commission (CFTC).</>],
              ["Canada", <>Canadian securities regulators prohibit offering binary options with a term of less than 30 days to individuals.</>],
              ["United Kingdom", <>The Financial Conduct Authority (FCA) has banned the sale of binary options to retail consumers since 2019.</>],
              ["European Union and European Economic Area member states", <>Retail binary options are prohibited following product intervention by the European Securities and Markets Authority (ESMA) and national regulators.</>],
              ["Australia", <>The Australian Securities and Investments Commission (ASIC) has banned the issue and distribution of binary options to retail clients since 2021.</>],
              ["Israel", <>Israeli law prohibits binary options businesses.</>],
              ["Japan", <>Offering these products to residents requires registration with the Financial Services Agency, which we do not hold.</>],
              ["Countries subject to comprehensive United Nations sanctions or on the Financial Action Task Force (FATF) list of high-risk jurisdictions subject to a call for action, for example Iran and North Korea", <>Sanctions and anti-money-laundering requirements.</>],
              ["Any other country or territory where our services are unlawful or would require a licence we do not hold", <>Local law.</>],
            ]}
          />
          <p>
            We may add to or change this list at any time. You must not use a VPN, proxy or any other means to hide where you are, or
            to give the impression that you live somewhere you do not. If you move to a country or territory on this list, you must
            tell us and stop trading. We will then close your account under section 13 and return your available balance where the
            law allows us to.
          </p>

          <h3>4.4 One account per person</h3>
          <p>
            You may hold only one account. You must not open a second account, including under a different email address or phone
            number, or open an account for someone else. If we find more than one account belonging to the same person, we may close
            the extra accounts. Where multiple accounts were used for any of the conduct described in section 11, we may also take
            the steps described in section 11.2.
          </p>

          <h3>4.5 Accurate information</h3>
          <ul>
            <li>
              The name you give us must be your full legal name as it appears on your national identity card or passport. When
              real-money accounts are available, the M-Pesa number you use must be registered in that same name.
            </li>
            <li>The email address you register must be one that you control and check regularly.</li>
            <li>All information you give us must be true, complete and not misleading, and you must keep it up to date in your profile.</li>
          </ul>
          <p>If we have reasonable grounds to believe that information you gave us is false, we may restrict or suspend your account under section 13.</p>

          <h3>4.6 Our right to refuse</h3>
          <p>
            We may decline to open an account for you, or decline to provide a particular service, where we have a legitimate reason,
            for example to comply with the law or to manage risk. Where the law allows, we will tell you that we have declined.
          </p>
        </>
      ),
    },
    {
      id: "account-and-security",
      title: "5. Your account and its security",
      body: (
        <>
          <h3>5.1 Registering</h3>
          <p>
            To register, you give us your full name, email address and a password, and you confirm that you are 21 or older and agree
            to these Terms and our <PolicyLink slug="privacy">Privacy Policy</PolicyLink>. You may add a phone number later in your
            profile. We may ask you to complete a Google reCAPTCHA check when you register, sign in or reset your password, to help
            protect the platform from automated abuse.
          </p>

          <h3>5.2 Verifying your email address</h3>
          <p>
            After you register, we send a verification link to your email address. The link works once and expires after 24 hours.
            You can ask for a new link; the number of requests is limited to prevent misuse. You can sign in before you have verified
            your email address, but we may require a verified email address before you can use real-money services, and we may
            treat an unverified address as a reason to restrict those services.
          </p>

          <h3>5.3 Signing in and sessions</h3>
          <ul>
            <li>A signed-in session lasts up to 7 days unless you sign out earlier.</li>
            <li>If you do not choose "remember me", your sign-in is kept only for the current browser session.</li>
            <li>
              If you forget your password, we email you a 6-digit code that is valid for 10 minutes. The number of code requests and
              wrong attempts is limited to protect your account.
            </li>
          </ul>

          <h3>5.4 Protecting your credentials</h3>
          <p>You are responsible for keeping your sign-in details secure. In particular, you must:</p>
          <ul>
            <li>
              use a strong password that you do not use anywhere else. The platform accepts passwords of 6 characters at sign-up, but
              we strongly recommend at least 8 characters, which is the minimum when you change your password;
            </li>
            <li>never share your password or password-reset codes with anyone, including anyone who claims to work for NeuroOption;</li>
            <li>keep your email account secure, because anyone who controls your email can reset your NeuroOption password;</li>
            <li>keep your phone, computer and browser secure and up to date, and sign out when you use a shared device;</li>
            <li>check that you are on neurooption.com before you enter your password; and</li>
            <li>
              tell us straight away through <a href="/support">Support</a> or at <Co field="supportEmail" /> if you think someone else
              knows your password or has used your account, and change your password in your <a href="/profile">profile</a>.
            </li>
          </ul>
          <Callout tone="warn" title="We will never ask for your password or PIN">
            NeuroOption staff will never ask you for your password, a password-reset code or your M-Pesa PIN, by email, message,
            phone or any other channel. If anyone asks, do not give it and report it to us.
          </Callout>
          <p>
            We do not currently offer two-step verification. Your password and the security of your email account are therefore the
            main protections for your account.
          </p>

          <h3>5.5 Activity on your account</h3>
          <p>
            We treat any instruction given through your account after a valid sign-in as given by you, and you are responsible for
            it. This does not apply to activity that happens because of our own failure, or after you have told us that your account
            may be compromised and we have had a reasonable opportunity to act.
          </p>

          <h3>5.6 Identity verification</h3>
          <p>
            We may ask you to verify your identity at any time, and in particular before you deposit or withdraw real money. We may
            ask for documents such as your national identity card or passport, a photograph of yourself (a "selfie") and proof of
            your address. We will tell you what we need and how to provide it. Your verification status is shown as Not submitted,
            Pending, Approved or Rejected; if your documents are rejected, we will tell you why. Documents are reviewed by authorised
            NeuroOption staff. Until verification is complete, we may restrict real-money services. Our{" "}
            <PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink> explains this in detail.
          </p>
        </>
      ),
    },
    {
      id: "demo-and-real-accounts",
      title: "6. Demo accounts and real accounts",
      body: (
        <>
          <h3>6.1 Demo account</h3>
          <ul>
            <li>Your demo account ("QT Demo") is funded with virtual funds in USD and starts with USD 70,000.</li>
            <li>
              You can top up the demo account only while its balance is below USD 10,000, and only in the fixed amounts offered on the
              platform (currently USD 20,000, 50,000, 60,000 or 100,000).
            </li>
            <li>
              Virtual funds have no monetary value. They cannot be withdrawn, transferred, sold or exchanged for money, real-account
              credit or anything else.
            </li>
            <li>
              Demo results do not predict or guarantee results in a real account. Trading without real money at risk can also feel
              very different from trading with it.
            </li>
            <li>We may change the demo starting balance, top-up rules or amounts, or withdraw the demo account, at any time.</li>
          </ul>

          <h3>6.2 The public demo</h3>
          <p>
            Visitors who are not signed in all share one public demo account. Its balance and trades can be changed by anyone else
            using it at the same time. Do not enter personal information there, and do not rely on its balance or history.
          </p>

          <h3>6.3 Real account</h3>
          <p>
            When real-money accounts are available, your real account ("QT Real") is held in Kenya Shillings (KES). You fund it by
            deposit, trade with it, and withdraw from it as described in sections 8 and 9.
          </p>
          <Callout tone="info" title="Real-money services">
            At the "Last updated" date of these Terms, real-money accounts are not yet available. The platform refuses real-money
            deposits, withdrawals and trades and tells you so. We will make real-money services available only when we are ready to
            provide them lawfully, and we will update these Terms and the platform at that time.
          </Callout>

          <h3>6.4 Choosing the right account</h3>
          <p>
            A trade is placed in whichever account is selected on the trading screen when you confirm it. Check which account is
            selected before every trade. We cannot move a trade from one account to another after it has been accepted.
          </p>

          <h3>6.5 Converted amounts</h3>
          <p>
            Where the platform shows an amount converted into another currency, the conversion uses a fixed indicative rate and is
            for information only. It is not a rate at which we deal, and it does not change the amount held in your account.
          </p>
        </>
      ),
    },
    {
      id: "nature-of-service",
      title: "7. The nature of our service",
      body: (
        <>
          <h3>7.1 Execution only</h3>
          <p>
            We provide an execution-only service. You decide whether to trade, which instrument, which direction, the expiry and the
            stake. We accept and settle trades in line with these Terms and the{" "}
            <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink>. We do not assess whether trading is
            suitable or appropriate for you, and we do not monitor your trading for your benefit.
          </p>

          <h3>7.2 No investment advice</h3>
          <p>
            Nothing on the platform is investment, financial, legal or tax advice, or a recommendation to trade. This includes charts,
            indicators, price movements, payout percentages, help-centre articles, emails and messages from our staff. If you need
            advice, speak to an independent adviser.
          </p>

          <h3>7.3 No fiduciary duty</h3>
          <p>
            When you trade, we act for ourselves as principal. We are not your agent, broker, adviser, trustee or fiduciary, and we
            do not owe you any duty to act in your best interests beyond the duties set out in these Terms and imposed by law.
          </p>

          <h3>7.4 Synthetic OTC instruments</h3>
          <p>
            Every instrument on the platform is a synthetic over-the-counter ("OTC") instrument. The platform offers 67 instruments in
            five groups: currency pairs, cryptocurrencies, stocks, indices and commodities, each labelled "OTC".
          </p>
          <ul>
            <li>
              Their prices are generated by our own price engine, using a computer model that includes random price movement. They
              are not taken from any exchange, interbank market or market-data provider.
            </li>
            <li>
              An instrument's name refers to a real-world currency, asset, company or index only as a label. Its price on NeuroOption
              can differ, sometimes significantly, from the real-world price of that asset at the same moment.
            </li>
            <li>
              The companies, exchanges and index providers whose names appear on the platform have no connection with NeuroOption and
              do not endorse or sponsor our instruments.
            </li>
            <li>A trade gives you no ownership of, or rights in, any real currency, cryptocurrency, share, index or commodity.</li>
          </ul>

          <h3>7.5 We are the counterparty to every trade</h3>
          <p>
            Every trade is a contract between you and us. There is no exchange and no other client on the other side. This means:
          </p>
          <ul>
            <li>if you win a trade, we pay your profit from our own money;</li>
            <li>if you lose a trade, we keep your stake; and</li>
            <li>
              we also operate the price engine that decides the outcome of your trades and set the payout percentages offered to you.
            </li>
          </ul>
          <Callout tone="warn" title="This is a conflict of interest">
            Because we gain when you lose, our interests conflict with yours. Payout percentages are the same for every client, are
            shown before you trade, are locked when your trade is accepted, and always stay within fixed limits of 20% to 92%. Entry
            prices are the platform's mid price, with no spread added. Our{" "}
            <PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink> explains these conflicts and how we
            deal with them.
          </Callout>

          <h3>7.6 How the odds work</h3>
          <p>
            Because a winning trade pays less than 100% of your stake as profit, while a losing trade loses all of it, you need to
            win more than half of your trades just to break even.
          </p>
          <Table
            head={["Example: 10 trades of KES 100 each at an 85% payout", "Result"]}
            rows={[
              ["5 wins", <>5 × KES 85 profit = KES 425</>],
              ["5 losses", <>5 × KES 100 lost = KES 500</>],
              ["Net result after winning half your trades", <>A loss of KES 75</>],
            ]}
          />
          <p>
            At an 85% payout, you would need to win more than about 54% of equal-size trades to avoid a loss overall. The lower the
            payout percentage, the higher that figure.
          </p>

          <h3>7.7 What is not part of the service</h3>
          <ul>
            <li>
              Some pages show features marked "coming soon" or with illustrative examples, such as social or copy trading,
              tournaments, signals and express trades. These are not live services and are not offered under these Terms. Nothing
              shown on those pages is a real trade, a real result or a recommendation.
            </li>
            <li>
              Payment methods marked "coming soon" (such as Airtel Money, Equitel, Binance Pay, Visa and Mastercard) are not available.
            </li>
            <li>
              We do not currently offer bonuses, promotions or an affiliate or introducing-broker programme. If we introduce one, it
              will have its own terms, which we will give you before you take part.
            </li>
          </ul>

          <h3>7.8 Your balance is not a bank deposit</h3>
          <p>
            A real-account balance is a record of the amount we owe you under these Terms. It is not a bank deposit or savings
            account, it does not earn interest, and, unless we tell you otherwise in writing, it is not protected by any
            deposit-insurance or investor-compensation scheme.
          </p>
        </>
      ),
    },
    {
      id: "placing-trades",
      title: "8. Placing trades",
      body: (
        <>
          <p>
            This section summarises how trading works. The full rules are in the{" "}
            <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink>. The same rules apply to demo and real
            accounts, except that demo trades use virtual funds.
          </p>

          <h3>8.1 Setting up a trade</h3>
          <ul>
            <li>
              <strong>Instrument:</strong> choose one of the instruments available on the platform.
            </li>
            <li>
              <strong>Direction:</strong> BUY if you expect the price to be higher at expiry than the entry price, or SELL if you
              expect it to be lower.
            </li>
            <li>
              <strong>Expiry:</strong> from 5 seconds to 5 hours.
            </li>
            <li>
              <strong>Stake:</strong> at least 1 unit of the account currency (USD 1 in a demo account, KES 1 in a real account) and
              no more than your available balance.
            </li>
            <li>
              <strong>Payout percentage:</strong> shown before you confirm. It can change with market conditions and the expiry you
              choose, but always stays between 20% and 92%.
            </li>
          </ul>

          <h3>8.2 When a trade is accepted</h3>
          <ul>
            <li>
              A trade exists only once the platform confirms that it has been accepted. If your request does not reach us, or is
              rejected, no trade is placed.
            </li>
            <li>
              The payout percentage is locked at the moment of acceptance. If it changed between the moment it was shown to you and
              the moment your request arrived, your request is rejected and you must confirm the new payout percentage to trade.
            </li>
            <li>The entry price is the platform's mid price at the moment of acceptance. No spread is added.</li>
            <li>Your stake is taken from your available balance when the trade is accepted.</li>
            <li>
              Once accepted, a trade cannot be cancelled or closed before expiry, by you or by us, except where it is void under
              section 12.
            </li>
          </ul>

          <h3>8.3 Settlement and outcome</h3>
          <p>
            A trade is settled at the settlement price, which is the platform's price when settlement runs at or after expiry.
            Settlement normally happens at expiry. If there is a delay or outage, settlement may happen later and use the price
            available at that later time (see section 12.5).
          </p>
          <Table
            head={["Outcome", "When it happens", "Example: KES 1,000 stake at 85% payout"]}
            rows={[
              ["Win", <>Settlement price is above the entry price for BUY, or below it for SELL.</>, <>KES 1,850 returned (your KES 1,000 stake plus KES 850 profit).</>],
              ["Loss", <>Settlement price is below the entry price for BUY, or above it for SELL.</>, <>Nothing returned. You lose your KES 1,000 stake.</>],
              ["Draw", <>Settlement price equals the entry price.</>, <>KES 1,000 returned. No profit and no loss.</>],
            ]}
          />

          <h3>8.4 When we may decline a trade request</h3>
          <p>We may decline a trade request where, for example:</p>
          <ul>
            <li>your available balance is too low, or the stake or expiry is outside the permitted range;</li>
            <li>the payout percentage has changed since it was shown to you;</li>
            <li>the instrument is unavailable, or the platform is not working normally;</li>
            <li>real-money services are not available, or your account is restricted under section 13; or</li>
            <li>we reasonably suspect conduct prohibited by section 11.</li>
          </ul>

          <h3>8.5 Check before you confirm</h3>
          <p>
            You are responsible for checking the account, instrument, direction, expiry, stake and payout percentage before you
            confirm a trade. A trade placed by mistake is not void just because you did not intend to place it.
          </p>
        </>
      ),
    },
    {
      id: "deposits-and-withdrawals",
      title: "9. Deposits and withdrawals",
      body: (
        <>
          <p>
            This section applies when real-money accounts are available. Full details are in the{" "}
            <PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink>.
          </p>

          <h3>9.1 Deposits</h3>
          <ul>
            <li>
              Deposits are made by M-Pesa. We send a payment prompt (STK Push) to your phone, and you approve it on your phone with
              your M-Pesa PIN. You never give your PIN to us.
            </li>
            <li>Deposits are in KES, in whole shillings, between the minimum shown in the platform and KES 150,000 per deposit.</li>
            <li>
              We credit a deposit only after Safaricom confirms the payment. If the amount paid differs from the amount requested, the
              deposit is held under review until we resolve it.
            </li>
            <li>
              If a deposit fails or is cancelled, nothing is credited to your account. If M-Pesa took money for a failed payment, the
              reversal is handled by M-Pesa.
            </li>
            <li>We email you when a deposit succeeds and when it is not completed.</li>
          </ul>

          <h3>9.2 Withdrawals</h3>
          <ul>
            <li>Withdrawals are paid in KES to a Safaricom M-Pesa number. The minimum withdrawal is KES 1.</li>
            <li>When you request a withdrawal, the amount moves from your available balance to locked funds while it is pending.</li>
            <li>
              NeuroOption staff review every withdrawal. A withdrawal is either processed and completed, or declined with a reason. If
              a withdrawal is declined, fails or is cancelled, the locked amount returns to your available balance.
            </li>
            <li>
              We aim to complete withdrawals within 24 to 48 hours of your request, but we do not guarantee this, particularly where
              we need further information from you.
            </li>
            <li>We email you when we receive your request, when it is being processed, and when it is completed or declined.</li>
          </ul>

          <h3>9.3 Payments in your own name only</h3>
          <p>
            You must deposit only from, and withdraw only to, an M-Pesa account registered in your own name. We may refuse or return
            payments from anyone else. Before paying a withdrawal, we may ask you to verify your identity or to show that the M-Pesa
            account is yours, and we may pay only to an account in your name.
          </p>

          <h3>9.4 Delaying or declining withdrawals</h3>
          <p>We may delay or decline a withdrawal, and will tell you why where the law allows, if:</p>
          <ul>
            <li>we need to verify your identity or the source of the funds;</li>
            <li>the law, a court order or an authority requires us to;</li>
            <li>we reasonably suspect fraud, money laundering or other conduct prohibited by section 11; or</li>
            <li>the amount includes funds credited by mistake, or from trades that are being reviewed under section 12.</li>
          </ul>

          <h3>9.5 Money credited by mistake</h3>
          <p>
            If money is credited to your account by mistake, it does not belong to you. You must not use or withdraw it, and we may
            reverse it under section 12.
          </p>
        </>
      ),
    },
    {
      id: "fees-and-charges",
      title: "10. Fees, charges and taxes",
      body: (
        <>
          <h3>10.1 Our charges</h3>
          <p>We do not currently charge any fees for our services.</p>
          <Table
            head={["Item", "What NeuroOption charges"]}
            rows={[
              ["Opening or holding an account", <>Nothing.</>],
              ["Deposits", <>Nothing. M-Pesa may apply its own tariffs to your transaction.</>],
              ["Withdrawals", <>Nothing. M-Pesa may apply its own tariffs to your transaction.</>],
              ["Trading", <>No commission and no spread. Our income comes from being the counterparty to your trades, as explained in sections 7.5 and 7.6.</>],
              ["Inactivity", <>Nothing.</>],
              ["Currency conversion", <>Nothing. Real accounts, deposits and withdrawals are all in KES.</>],
            ]}
          />

          <h3>10.2 Third-party charges</h3>
          <p>
            Your mobile network, M-Pesa or internet provider may charge you for their services, including data and transaction
            tariffs. Those charges are between you and them, and we do not refund them.
          </p>

          <h3>10.3 New fees</h3>
          <p>
            If we decide to introduce a fee, we will tell you at least 30 days before it takes effect, by email and on the platform.
            If you do not want to pay it, you can close your account before it takes effect.
          </p>

          <h3>10.4 Taxes</h3>
          <p>
            You are responsible for any tax due on your trading results and for reporting them to the relevant tax authority. We do
            not give tax advice. If the law requires us to report information to a tax authority, or to deduct tax from a payment to
            you, we will do so.
          </p>
        </>
      ),
    },
    {
      id: "prohibited-conduct",
      title: "11. Prohibited conduct and abuse",
      body: (
        <>
          <h3>11.1 What you must not do</h3>
          <p>You must not, and must not help or allow anyone else to:</p>
          <ul>
            <li>
              <strong>Hold multiple accounts:</strong> open or use more than one account, or use someone else's account.
            </li>
            <li>
              <strong>Use automation:</strong> place trades or use the platform through bots, scripts, macros, automated trading
              tools or any interface other than the one we provide, or send requests to our systems by automated means.
            </li>
            <li>
              <strong>Exploit errors or delays:</strong> take advantage of a manifest error, a pricing fault, a delay in prices or
              settlement, or any other weakness in the platform, rather than reporting it to us.
            </li>
            <li>
              <strong>Collude:</strong> coordinate trades with other people or accounts, for example by placing opposite trades in
              different accounts so that one is sure to win, or by sharing accounts or trading instructions to abuse the platform.
            </li>
            <li>
              <strong>Use other people's payment methods:</strong> deposit from or withdraw to an M-Pesa account or other payment
              method that is not registered in your name.
            </li>
            <li>
              <strong>Commit fraud:</strong> give false information or documents, impersonate anyone, reverse or dispute a genuine
              payment, or obtain money or services dishonestly.
            </li>
            <li>
              <strong>Launder money or finance terrorism:</strong> use the platform to handle the proceeds of crime, to disguise the
              source of money, or to finance terrorism, or otherwise breach the Proceeds of Crime and Anti-Money Laundering Act, 2009
              or the Prevention of Terrorism Act, 2012.
            </li>
            <li>
              <strong>Reverse engineer:</strong> copy, decompile, disassemble or reverse engineer the platform or the price engine, or
              try to work out how prices or payouts are generated in order to gain an advantage.
            </li>
            <li>
              <strong>Scrape:</strong> collect prices, data or content from the platform by scraping, crawling or other automated
              means, or reuse our price data elsewhere.
            </li>
            <li>
              <strong>Interfere with the platform:</strong> attack, overload, probe or test the security of our systems, introduce
              malicious code, get around reCAPTCHA, rate limits or other security measures, or access any account, data or system you
              are not authorised to access. This may also be an offence under the Computer Misuse and Cybercrimes Act, 2018.
            </li>
            <li>
              <strong>Hide where you are:</strong> use a VPN, proxy or other means to disguise your location or to get around
              section 4.3.
            </li>
            <li>
              <strong>Abuse our staff:</strong> threaten, harass or abuse NeuroOption staff or other users.
            </li>
            <li>
              <strong>Act unlawfully:</strong> use the platform for any purpose that breaks the law where you are or in Kenya.
            </li>
          </ul>

          <h3>11.2 What we may do</h3>
          <p>
            If we have reasonable grounds to suspect that you have done any of the things in section 11.1, we may take one or more of
            the following steps. We will act in proportion to what we reasonably believe has happened.
          </p>
          <ul>
            <li>warn you, or ask you to explain or to provide information or documents;</li>
            <li>decline trade requests, deposits or withdrawals, or restrict, suspend or lock your account under section 13;</li>
            <li>
              void trades that were placed through, or benefited from, the prohibited conduct, returning the stake and reversing any
              profit;
            </li>
            <li>reverse transactions and any profit that resulted from the prohibited conduct;</li>
            <li>close the accounts involved under section 13.4;</li>
            <li>
              report the matter to the police, the Financial Reporting Centre (FRC) or another authority, where the law requires or
              allows us to; and
            </li>
            <li>claim from you any loss we suffer as a result, under section 20.</li>
          </ul>
          <p>
            We will not take your own money from you as a penalty. After any steps under this section, we will return your remaining
            balance to you, unless the law requires us to hold it or pass it to an authority.
          </p>

          <h3>11.3 Your right to respond</h3>
          <p>
            Where the law allows, we will tell you what we have done and why, and you can give us your side of events. If you
            disagree with our decision, you can complain under our{" "}
            <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>.
          </p>
        </>
      ),
    },
    {
      id: "errors-outages-void-trades",
      title: "12. Errors, outages and void trades",
      body: (
        <>
          <h3>12.1 Manifest errors</h3>
          <p>
            A manifest error is an obvious mistake in a price, payout, settlement, credit or debit, caused by a fault in the platform
            or by human error. Whether a price is wrong is judged against how the platform and the instrument normally behave, not
            against real-world markets.
          </p>
          <Table
            head={["Example of a manifest error", "What we may do"]}
            rows={[
              ["The price engine produces a price that is clearly out of line with the instrument's own recent prices on the platform, for example a sudden spike or a frozen price, caused by a fault", <>Void the trades affected, or settle them at the price that should have applied.</>],
              ["A trade is accepted with a payout percentage outside the 20% to 92% limits, or different from the payout locked for it", <>Settle the trade at the correct locked payout percentage, or void it.</>],
              ["A trade is settled at the wrong price, at the wrong time, or with the wrong outcome", <>Settle it again correctly.</>],
              ["A trade is accepted when it should have been declined, for example with a stake above the available balance or on an unavailable instrument", <>Void the trade.</>],
              ["Money is credited or debited by mistake, for example a deposit credited twice", <>Reverse or correct the entry.</>],
            ]}
          />

          <h3>12.2 What is not an error</h3>
          <ul>
            <li>An instrument's price on NeuroOption being different from the real-world price of a similarly named asset.</li>
            <li>A trade that loses.</li>
            <li>A payout percentage that changed before your trade was accepted.</li>
            <li>A problem with your own device, browser, internet connection or mobile network.</li>
          </ul>

          <h3>12.3 Errors work both ways</h3>
          <p>
            We will correct a manifest error whether it is in your favour or ours. Where the error was against you, we will put your
            account in the position it would have been in had the error not happened.
          </p>

          <h3>12.4 Void trades</h3>
          <p>
            A void trade is treated as if it had never been placed: the stake is returned to your balance and any profit paid on it
            is reversed.
          </p>

          <h3>12.5 Outages and delays</h3>
          <ul>
            <li>
              The platform may sometimes be slow or unavailable, for example because of maintenance, a technical failure, a cyber
              attack, or a failure at one of our providers. Where practical, we will give advance notice of planned maintenance.
            </li>
            <li>If a trade request does not reach us, or is not confirmed as accepted, no trade exists.</li>
            <li>
              Trades that have been accepted continue to run during an outage. If settlement is delayed, the trade may be settled
              later, using the price available when settlement runs. That price may differ from the price at the moment of expiry.
            </li>
            <li>
              Where a trade has been materially affected by a clear technical error, including a delayed settlement caused by a fault,
              we may review it and, where fair, void it or settle it at the price that should have applied.
            </li>
          </ul>

          <h3>12.6 How we deal with errors</h3>
          <p>
            We will act within a reasonable time after we discover an error, and normally within 30 days of the trade or transaction
            concerned. We will tell you what we changed and why. If you disagree, you can complain under our{" "}
            <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>. If you notice something you think is an error,
            please tell us as soon as possible through <a href="/support">Support</a>.
          </p>

          <h3>12.7 If a correction leaves a shortfall</h3>
          <p>
            If correcting an error would leave your balance below zero, we will not ask you to pay the shortfall, unless the error
            came from your fraud or other conduct prohibited by section 11, or you withdrew money that you knew, or should reasonably
            have known, had been credited by mistake.
          </p>

          <h3>12.8 Our records</h3>
          <p>
            We keep records of trades, prices, payout percentages, balances and transactions. We will use those records to decide
            what happened, unless they are shown to be wrong. You can ask us for a copy of the records relating to your account.
          </p>
        </>
      ),
    },
    {
      id: "suspension-and-termination",
      title: "13. Account status, suspension, restriction and termination by us",
      body: (
        <>
          <h3>13.1 Account statuses</h3>
          <p>Your account will have one of the following statuses.</p>
          <Table
            head={["Status", "What it means under these Terms"]}
            rows={[
              ["Active", <>You can use all services available to you.</>],
              ["Pending verification", <>We have asked for identity information. We may restrict real-money services until verification is complete.</>],
              ["Suspended", <>Your account is temporarily restricted, for example while we investigate. We may decline new trades, deposits and withdrawals.</>],
              ["Locked", <>Access is blocked, for example because we believe your account has been compromised or because of a serious breach of these Terms.</>],
              ["Deleted", <>The account has been closed at your request and cannot be restored (see section 14).</>],
            ]}
          />

          <h3>13.2 When we may restrict, suspend or lock your account</h3>
          <p>We may restrict, suspend or lock your account, in whole or in part, if:</p>
          <ul>
            <li>you have broken these Terms, or we reasonably suspect that you have;</li>
            <li>we reasonably suspect fraud, money laundering, terrorist financing or other conduct prohibited by section 11;</li>
            <li>you do not give us information or documents we have reasonably asked for;</li>
            <li>we reasonably believe that you do not meet the eligibility requirements in section 4;</li>
            <li>we reasonably believe that your account has been accessed by someone else;</li>
            <li>the law, a court order or an authority requires us to; or</li>
            <li>we are investigating a manifest error affecting your account.</li>
          </ul>

          <h3>13.3 Telling you</h3>
          <p>
            We will normally tell you, by email or through <a href="/support">Support</a>, that we have restricted, suspended or
            locked your account, why, and what you can do about it. We may not do so where the law prevents us (for example, where
            telling you could amount to "tipping off" under anti-money-laundering law), or where telling you would undermine an
            investigation or the security of the platform. We will lift a restriction once the reason for it no longer applies.
          </p>

          <h3>13.4 Termination by us</h3>
          <ul>
            <li>We may end this agreement and close your account for any reason by giving you at least 30 days' notice by email.</li>
            <li>
              We may end this agreement and close your account immediately if you have seriously or repeatedly broken these Terms, if
              we reasonably suspect fraud, money laundering or terrorist financing, if you are not eligible under section 4, or if the
              law or an authority requires us to.
            </li>
          </ul>

          <h3>13.5 What happens when we close your account</h3>
          <ul>
            <li>You will not be able to place new trades.</li>
            <li>Trades already accepted will run to expiry and settle normally, unless they are void under section 11 or 12.</li>
            <li>
              Once open trades and pending payments are settled, we will pay your remaining real-account balance to an M-Pesa account
              in your name, after any checks we are required to carry out and any corrections under section 12, unless the law
              requires us to hold it.
            </li>
            <li>Virtual funds in your demo account end and have no value.</li>
            <li>
              We will keep records as described in the{" "}
              <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink>.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "closing-your-account",
      title: "14. Closing your account",
      body: (
        <>
          <p>
            You can close your account at any time on the <a href="/delete-account">Delete account</a> page. The{" "}
            <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink> explains the process in full.
          </p>

          <h3>14.1 Before you can close your account</h3>
          <p>You can close your account only when:</p>
          <ul>
            <li>your real-account balance is zero (below KES 0.01), so withdraw any money first;</li>
            <li>you have no locked funds;</li>
            <li>you have no open trades in your demo or real account; and</li>
            <li>you have no deposits or withdrawals still pending.</li>
          </ul>
          <p>To confirm, you type DELETE and enter your password.</p>

          <h3>14.2 What closing means</h3>
          <ul>
            <li>
              Closing is permanent. It cannot be undone, and our support team cannot restore a closed account. Any virtual funds in
              your demo account are lost.
            </li>
            <li>All your signed-in sessions end immediately, and we email you a confirmation with a reference number.</li>
            <li>
              Your name, email address and phone number are removed from your profile or anonymised, and your password stops working.
            </li>
            <li>
              We keep records that the law requires us to keep, such as your trades, deposits, withdrawals and ledger entries, any
              identity-verification records, your support messages and a record of your closure request. We keep them for as long as
              the law requires and do not use them for marketing.
            </li>
            <li>You can register again later with the same email address, but this will be a new account with no history.</li>
          </ul>
        </>
      ),
    },
    {
      id: "intellectual-property",
      title: "15. Intellectual property and your licence to use the platform",
      body: (
        <>
          <h3>15.1 Who owns what</h3>
          <p>
            We, or our licensors, own all intellectual property rights in the platform. This includes the NeuroOption name and logo,
            the software, the price engine, the prices and other data it generates, charts, designs, text and other content. Nothing
            in these Terms transfers any of these rights to you.
          </p>

          <h3>15.2 Your licence</h3>
          <p>
            While you comply with these Terms, we give you a personal, non-exclusive, non-transferable and revocable licence to access
            and use the platform through our website, for your own personal use of the services. This licence ends when this
            agreement ends or when we restrict your access under section 13.
          </p>

          <h3>15.3 Restrictions</h3>
          <p>Except as the law expressly allows, you must not:</p>
          <ul>
            <li>copy, modify, translate or create works based on any part of the platform;</li>
            <li>decompile, disassemble or reverse engineer the platform or the price engine;</li>
            <li>
              copy, publish, sell or redistribute our prices or other data, or use them in any other product, service or model;
            </li>
            <li>frame or mirror the platform, or present it as part of another website or service;</li>
            <li>remove or alter any copyright, trade mark or other notice; or</li>
            <li>use the platform, or anything taken from it, to build a competing product or service.</li>
          </ul>

          <h3>15.4 Third-party names and services</h3>
          <p>
            Names of currencies, companies, indices and commodities used to label our instruments, and other third-party names and
            marks, belong to their owners. Their appearance on the platform does not mean that their owners are connected with,
            approve of or sponsor NeuroOption. Third-party services built into the platform, such as Google reCAPTCHA, are also
            subject to their providers' own terms.
          </p>

          <h3>15.5 Your feedback</h3>
          <p>
            If you send us suggestions or feedback, we may use them freely, without owing you anything, and without identifying you.
          </p>
        </>
      ),
    },
    {
      id: "communications-notices-language",
      title: "16. Communications, notices and language",
      body: (
        <>
          <h3>16.1 How we contact you</h3>
          <p>We will contact you:</p>
          <ul>
            <li>by email, to the email address registered on your account;</li>
            <li>through replies to your support tickets, which you can read in the platform; and</li>
            <li>by notices on the platform or website.</li>
          </ul>
          <p>
            You agree to receive notices, statements and other communications from us electronically. They have the same effect as
            communications on paper. Keep your email address up to date and check it regularly: an email we send to your registered
            address counts as received by you, unless we learn that it was not delivered.
          </p>

          <h3>16.2 Service and marketing emails</h3>
          <p>
            We send emails that you need in order to use your account, such as welcome, email-verification, password, identity
            verification, deposit, withdrawal and account-closure emails. You cannot opt out of these while you hold an account. We
            send our newsletter only if you subscribe to it, and every newsletter contains a link to unsubscribe.
          </p>

          <h3>16.3 How you contact us</h3>
          <p>
            You can contact us through <a href="/support">Support</a> in the platform when you are signed in, or by email at{" "}
            <Co field="supportEmail" />. To make a complaint, follow our{" "}
            <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>. Formal legal notices must be sent to our
            registered office at <Co field="registeredAddress" />.
          </p>

          <h3>16.4 Language</h3>
          <p>
            These Terms and our policies are written in English. Some parts of the platform can be shown in other languages for your
            convenience. If a translation differs from the English version, the English version applies.
          </p>
        </>
      ),
    },
    {
      id: "privacy",
      title: "17. Privacy and your data",
      body: (
        <>
          <p>
            We process your personal data in line with the Data Protection Act, 2019 and our{" "}
            <PolicyLink slug="privacy">Privacy Policy</PolicyLink>, which explains what we collect, why, who we share it with, how
            long we keep it and your rights. Our{" "}
            <PolicyLink slug="cookies">Cookie and Browser Storage Policy</PolicyLink> explains what the platform stores in your
            browser.
          </p>
          <ul>
            <li>
              You have rights under the Data Protection Act, 2019, including the rights to be informed, to access and correct your
              data, to ask for it to be deleted, to object to its use and to data portability.
            </li>
            <li>
              To exercise these rights, contact <Co field="privacyEmail" />. Our Data Protection Officer is{" "}
              <Co field="dataProtectionOfficer" />.
            </li>
            <li>
              You can complain to the Office of the Data Protection Commissioner (ODPC). Our ODPC registration details:{" "}
              <Co field="odpcRegistration" />.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "disclaimers",
      title: "18. Disclaimers",
      body: (
        <>
          <p>To the extent the law allows:</p>
          <ul>
            <li>
              We provide the platform "as is" and "as available". We do not promise that it will always be available, uninterrupted,
              fast or free of errors, or that it will work with every device, browser or network.
            </li>
            <li>We do not promise that you will make a profit, or that you will not lose money.</li>
            <li>
              Prices on the platform come from our own price engine. We do not claim that they reflect, track or predict the price of
              any real-world asset.
            </li>
            <li>
              Charts, indicators, help-centre articles and other information on the platform are general information only, and may
              be incomplete or out of date. You should not rely on them as the basis for a trading decision.
            </li>
            <li>
              We are not responsible for the content of websites or services run by others that the platform links to or uses.
            </li>
          </ul>
          <Callout tone="risk" title="Trading risk">
            Each trade can lose your whole stake. Results in the past, including in a demo account, do not predict future results.
            Read the <PolicyLink slug="risk-disclosure">Risk Disclosure</PolicyLink> and the{" "}
            <PolicyLink slug="responsible-trading">Responsible Trading Policy</PolicyLink>.
          </Callout>
        </>
      ),
    },
    {
      id: "limitation-of-liability",
      title: "19. Limitation of liability",
      body: (
        <>
          <h3>19.1 Our responsibility to you</h3>
          <p>
            We will provide the services with reasonable care and skill and in line with these Terms. If we break these Terms or act
            negligently, we are responsible for the loss you suffer as a direct result, as long as that loss was reasonably
            foreseeable to both of us when it happened.
          </p>

          <h3>19.2 How we measure loss on a trade</h3>
          <p>
            If we are responsible for a loss relating to a trade, we will put you in the position you would have been in had the
            trade been accepted, executed and settled correctly under the{" "}
            <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink>. We are not responsible for profits you
            say you would have made from trades you did not place.
          </p>

          <h3>19.3 What we are not responsible for</h3>
          <p>We are not responsible for:</p>
          <ul>
            <li>losses on trades that were accepted and settled correctly, including losing trades;</li>
            <li>losses from your own trading decisions, or from your reliance on any information on the platform;</li>
            <li>problems with your own device, browser, internet connection, mobile network or M-Pesa account;</li>
            <li>
              losses caused by someone using your sign-in details, where you did not keep them secure as required by section 5.4,
              unless you had already told us and we had a reasonable opportunity to act;
            </li>
            <li>the loss of virtual funds in a demo account, which have no value;</li>
            <li>losses caused by events described in section 21; or</li>
            <li>business losses, or losses that were not reasonably foreseeable.</li>
          </ul>

          <h3>19.4 What these Terms do not limit</h3>
          <p>Nothing in these Terms limits or excludes:</p>
          <ul>
            <li>our liability for fraud, gross negligence or wilful misconduct;</li>
            <li>our liability for death or personal injury caused by our negligence;</li>
            <li>our obligation to pay you your balance that was properly credited under these Terms; or</li>
            <li>
              any right you have under the Consumer Protection Act, 2012 or any other law that cannot be limited or excluded by
              agreement.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "indemnity",
      title: "20. Indemnity",
      body: (
        <>
          <p>
            You agree to compensate us for any loss, damage and reasonable costs (including reasonable legal costs) that we suffer as
            a direct result of:
          </p>
          <ul>
            <li>your fraud or any other conduct prohibited by section 11;</li>
            <li>your breach of these Terms; or</li>
            <li>your use of the platform in breach of the law.</li>
          </ul>
          <p>
            This does not apply to the extent that the loss was caused by our own breach of these Terms, negligence or wilful
            misconduct.
          </p>
        </>
      ),
    },
    {
      id: "force-majeure",
      title: "21. Events beyond our control",
      body: (
        <>
          <p>
            We are not responsible for any failure or delay in providing the services that is caused by an event beyond our
            reasonable control, which we could not have avoided by taking reasonable precautions. Examples include:
          </p>
          <ul>
            <li>failure or disruption of M-Pesa, Safaricom, our hosting, database or email providers, or other third-party services;</li>
            <li>failure of internet, telecommunications or power networks;</li>
            <li>cyber attacks, despite the reasonable security measures we take;</li>
            <li>fire, flood, storm, earthquake, epidemic, war, terrorism, riot or civil unrest; and</li>
            <li>action by a government, court or authority, including changes in law.</li>
          </ul>
          <p>
            If such an event happens, we will tell you as soon as reasonably possible, take reasonable steps to limit its effect, and
            restore the services as soon as we can. We may suspend trading, deposits or withdrawals while the event continues. Trades
            affected will be dealt with under section 12. Such an event does not cancel our obligation to pay you your balance once
            we are able to do so.
          </p>
        </>
      ),
    },
    {
      id: "changes",
      title: "22. Changes to these Terms and to the service",
      body: (
        <>
          <h3>22.1 Changes to these Terms</h3>
          <p>We may change these Terms and the policies. When we do, we will update the "Last updated" date.</p>
          <ul>
            <li>
              For a change that is to your disadvantage, we will give you at least 30 days' notice by email and on the platform before
              it takes effect.
            </li>
            <li>
              We may make a change with shorter notice, or with immediate effect, where it is needed to comply with the law or a
              requirement of an authority, to protect the security of the platform or our clients, or where it is to your advantage or
              only minor (for example, a correction or clarification). We will tell you about the change as soon as we reasonably can.
            </li>
            <li>A change will not affect a trade that was accepted before the change took effect.</li>
            <li>
              If you do not agree to a change, you can stop using the platform and close your account before the change takes effect,
              free of charge. If you keep using the platform after the change takes effect, you accept the changed Terms.
            </li>
          </ul>

          <h3>22.2 Changes to the service</h3>
          <p>
            We may change the services, for example by adding or removing instruments, changing available expiries, changing payout
            percentages within the limits in section 8.1, or changing the demo account rules. We will give you reasonable notice of
            any change that significantly affects you, unless we need to act sooner for legal, security or technical reasons.
          </p>
        </>
      ),
    },
    {
      id: "general",
      title: "23. General legal terms",
      body: (
        <>
          <h3>23.1 Transferring this agreement</h3>
          <p>
            We may transfer our rights and obligations under these Terms to another organisation, for example as part of a
            reorganisation or a sale of our business, as long as your rights under these Terms are not reduced. We will tell you
            before this happens. If you do not want to deal with the new organisation, you can close your account. You may not
            transfer your rights or obligations under these Terms to anyone else.
          </p>

          <h3>23.2 Entire agreement</h3>
          <p>
            These Terms, the policies listed in section 1.2 and the details of each trade confirmed by the platform are the whole
            agreement between you and us about the services. They replace any earlier agreement or statement about the same
            subject. Nothing said by our staff changes these Terms unless we confirm it in writing.
          </p>

          <h3>23.3 Severability</h3>
          <p>
            If a court or authority decides that any part of these Terms is invalid or unenforceable, that part will be changed to the
            minimum extent needed, or removed, and the rest of these Terms will continue to apply.
          </p>

          <h3>23.4 No waiver</h3>
          <p>
            If we do not insist on a right, or delay in using it, we do not give up that right and may still use it later.
          </p>

          <h3>23.5 Third parties</h3>
          <p>Only you and we have rights under these Terms. No one else may enforce them.</p>

          <h3>23.6 What continues after the agreement ends</h3>
          <p>
            Sections that by their nature should continue after this agreement ends will continue, including sections 9.5, 11.2,
            12, 15, 19, 20 and 24.
          </p>
        </>
      ),
    },
    {
      id: "governing-law-and-disputes",
      title: "24. Governing law and disputes",
      body: (
        <>
          <h3>24.1 Governing law</h3>
          <p>
            These Terms, and any dispute or claim arising out of or in connection with them, are governed by{" "}
            <Co field="governingLaw" />.
          </p>

          <h3>24.2 Complain to us first</h3>
          <p>
            If you are unhappy with our service, please contact us first so that we can try to put things right. Our{" "}
            <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink> explains how to complain and how we handle
            complaints. If your complaint is about a specific trade or transaction, please raise it as soon as possible, and ideally
            within 30 days, so that we can investigate while the records are fresh. This does not shorten any time limit you have
            under the law.
          </p>

          <h3>24.3 If your complaint is not resolved</h3>
          <ul>
            <li>
              Where it has authority over the matter, you can refer your complaint to our licensing regulator:{" "}
              <Co field="regulator" />.
            </li>
            <li>
              For complaints about your personal data, you can complain to the Office of the Data Protection Commissioner (ODPC).
            </li>
            <li>
              You can bring proceedings in the courts of <Co field="jurisdiction" />. This does not affect any right you have under
              the law to bring proceedings in the courts of the country where you live.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "contact",
      title: "25. Contact us",
      body: (
        <>
          <Table
            head={["For", "How to reach us"]}
            rows={[
              ["Help and answers to common questions", <>The <a href="/help">Help centre</a></>],
              ["Account and trading questions", <><a href="/support">Support</a> in the platform when you are signed in (up to 10 open tickets at a time), or <Co field="supportEmail" /></>],
              ["Phone", <Co field="supportPhone" />],
              ["Complaints", <><Co field="complaintsEmail" />, following our <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink></>],
              ["Personal data and privacy", <><Co field="privacyEmail" /> (Data Protection Officer: <Co field="dataProtectionOfficer" />)</>],
              ["Formal legal notices", <><Co field="legalName" />, <Co field="registeredAddress" /></>],
            ]}
          />
        </>
      ),
    },
  ],
};

export default policy;
