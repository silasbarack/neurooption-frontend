import type { Policy } from "../types";
import { Callout, Co, Definitions, PolicyLink, Table } from "../components";

const policy: Policy = {
  slug: "conflicts-of-interest",
  title: "Conflicts of Interest Policy",
  summary:
    "NeuroOption takes the other side of every trade, generates the prices and sets the payouts, so our interests can conflict with yours. This policy explains each of those conflicts, the controls that exist in the platform today, the rules our staff must follow, and how to raise a concern.",
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
            incorporated in <Co field="jurisdiction" /> with registration number <Co field="registrationNumber" /> and its registered
            office at <Co field="registeredAddress" />. "You" and "your" mean any person who uses the NeuroOption website and platform at
            https://neurooption.com, whether with a demo account or, when real-money accounts are available, a real-money account.
          </p>

          <h3>1.2 Why we have this policy</h3>
          <p>
            NeuroOption is not a neutral marketplace. We take the other side of every trade, we generate the prices of every instrument,
            we set the payout percentages, and we run the systems that settle trades and, when real-money accounts are available, process
            deposits and withdrawals. Each of these puts our interests in tension with yours. This policy explains:
          </p>
          <ul>
            <li>the conflicts of interest we have identified in our business;</li>
            <li>the controls that are built into the platform today, described as they actually work;</li>
            <li>the rules our staff must follow;</li>
            <li>what we tell you when a conflict cannot be prevented; and</li>
            <li>how you, or anyone working for us, can raise a concern.</li>
          </ul>
          <p>
            This policy does not remove these conflicts. Some of them are built into the way fixed-time options are offered on NeuroOption
            and can only be reduced, not eliminated. You should take them into account when you decide whether to trade with us.
          </p>

          <h3>1.3 Who and what this policy covers</h3>
          <ul>
            <li>
              <strong>Services:</strong> the demo account, real-money accounts when they are available, trading, prices and payouts,
              deposits and withdrawals, identity verification, customer support, our website, and our emails and other communications.
            </li>
            <li>
              <strong>People:</strong> our directors, employees and contractors, and anyone else who works for us and has access to our
              administration tools, systems, source code, servers or client information. In this policy we call all of them "staff".
            </li>
            <li>
              <strong>Third parties:</strong> service providers and any business partners, to the extent they act for us or receive
              anything from us in connection with the services we provide to you.
            </li>
          </ul>

          <Callout tone="info" title="Real-money services are not available yet">
            <p>
              Today NeuroOption offers demo trading with virtual US dollars (USD) only. Real-money deposits, withdrawals and trades are
              switched off on the platform. Where this policy describes real-money accounts, deposits or withdrawals, it explains how they
              will work, and how we will manage the related conflicts, when real-money accounts are available. Nothing in this policy means
              that real-money services are available now.
            </p>
          </Callout>

          <h3>1.4 Our regulatory status</h3>
          <Table
            head={["Item", "Details"]}
            rows={[
              ["Licensing regulator", <Co field="regulator" />],
              ["Licence number", <Co field="licence" />],
            ]}
          />
          <p>
            Our regulatory status is stated only in this table. Do not assume that NeuroOption is licensed, regulated, authorised or
            supervised by the Capital Markets Authority (CMA) or any other authority beyond what the table states. A reference in this policy
            to a Kenyan law or public body does not mean that the body has approved, licensed or endorsed NeuroOption or this policy.
          </p>

          <h3>1.5 How this policy fits with our other documents</h3>
          <p>This policy forms part of the information we give you before you trade. Read it together with:</p>
          <ul>
            <li>
              the <PolicyLink slug="terms">Terms and Conditions</PolicyLink>, which are the agreement between you and us and set out our
              rights to correct errors, void trades and restrict accounts;
            </li>
            <li>
              the <PolicyLink slug="risk-disclosure">Risk Disclosure</PolicyLink>, which explains the risks of trading, including the risk
              that comes from us being your counterparty;
            </li>
            <li>
              the <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink>, which explains in detail how trades are
              accepted, priced and settled;
            </li>
            <li>
              the <PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink> and the{" "}
              <PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink>, which explain how payments and identity checks work;
            </li>
            <li>
              the <PolicyLink slug="privacy">Privacy Policy</PolicyLink>, which explains how we handle your personal data; and
            </li>
            <li>
              the <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>, which explains how to complain.
            </li>
          </ul>
          <p>
            This policy explains how we manage conflicts. It does not change your rights or our rights under the Terms and Conditions. If
            this policy and the Terms and Conditions say different things about the same matter, the Terms and Conditions apply, except
            where this policy gives you a stronger protection.
          </p>
        </>
      ),
    },
    {
      id: "key-terms",
      title: "2. Key terms",
      body: (
        <>
          <p>In this policy, these words have the following meanings.</p>
          <Definitions
            items={[
              [
                "Conflict of interest",
                <>
                  A situation in which the interests of NeuroOption, or of a member of our staff, differ from your interests in a way that
                  could lead us, or them, to act against your interests, or to appear to do so. A conflict exists even if nobody acts
                  improperly.
                </>,
              ],
              ["Counterparty", <>The party on the other side of a contract. NeuroOption is the counterparty to every trade on the platform.</>],
              [
                "Synthetic (OTC) price",
                <>
                  A price produced by NeuroOption's own price engine. It is not taken from any exchange, interbank market or data provider.
                  Every instrument on NeuroOption is labelled "OTC" and has a synthetic price.
                </>,
              ],
              ["Price engine", <>The part of our platform software that generates the synthetic price of each instrument.</>],
              [
                "Payout",
                <>
                  The profit you receive if a trade wins, shown as a percentage of your stake. For example, an 85% payout on a stake of KES
                  1,000 means KES 850 profit.
                </>,
              ],
              ["Payout engine", <>The part of our platform software that calculates and publishes the payout for each instrument.</>],
              [
                "Locked payout",
                <>The payout percentage fixed for your trade at the moment our server accepts it. Later payout changes do not affect it.</>,
              ],
              [
                "Settlement",
                <>The automatic process that decides whether a trade has won, lost or ended in a draw, and credits your balance accordingly.</>,
              ],
              [
                "Manifest error",
                <>An obvious error in a price, payout, settlement, credit or debit, as described in the Terms and Conditions.</>,
              ],
              [
                "Staff",
                <>
                  Our directors, employees and contractors, and anyone else working for us who has access to our administration tools,
                  systems, source code, servers or client information.
                </>,
              ],
              [
                "Administration console",
                <>The restricted tool our staff use to look up client accounts and carry out tasks such as identity checks and support.</>,
              ],
              [
                "Audit log",
                <>
                  The record our administration console keeps of the actions staff take in it, showing who did what, to which record, and
                  when.
                </>,
              ],
              [
                "Close associate",
                <>
                  A staff member's spouse or partner, child, parent, sibling, any other member of their household, and any person or
                  business with which they have a close personal or financial relationship.
                </>,
              ],
              [
                "Inducement",
                <>
                  Any fee, commission, gift, hospitality or other benefit, in money or in kind, given or received in connection with our
                  services, which could affect how we or our staff act.
                </>,
              ],
              [
                "Conflicts register",
                <>The internal record of the conflicts we have identified, how we manage them and the decisions we have taken about them.</>,
              ],
            ]}
          />
        </>
      ),
    },
    {
      id: "what-is-a-conflict",
      title: "3. What a conflict of interest is and how we deal with it",
      body: (
        <>
          <h3>3.1 What it means</h3>
          <p>
            A conflict of interest arises when NeuroOption, or someone who works for us, has an interest in an outcome that is different
            from yours. For example, we have a conflict whenever we would gain from a decision that would cost you money, whenever a member
            of staff could benefit personally from something they do in their job, and whenever someone outside NeuroOption gives us a
            reason to act in a particular way.
          </p>

          <h3>3.2 Types of conflict</h3>
          <Table
            head={["Type", "Example"]}
            rows={[
              [
                "Between NeuroOption and you",
                <>We gain when your trade loses, and we produce the price that decides whether it loses.</>,
              ],
              [
                "Between a member of staff and you",
                <>A staff member who reviews your withdrawal is a relative of yours, or could use what they know about the platform to trade.</>,
              ],
              [
                "Between a member of staff and NeuroOption, affecting you",
                <>A staff member accepts a gift from someone who wants a decision to go their way.</>,
              ],
              [
                "Between you and other clients",
                <>
                  Limited today, because no social trading, copy trading or tournaments are live. It could arise if we ever treated some
                  clients more favourably than others.
                </>,
              ],
              [
                "Involving third parties",
                <>A service provider, affiliate or business partner pays us, or is paid by us, in a way that could affect how we treat you.</>,
              ],
            ]}
          />

          <h3>3.3 How we identify conflicts</h3>
          <p>We look for conflicts:</p>
          <ul>
            <li>when we design a new feature or change an existing one, including any change to the price engine or the payout engine;</li>
            <li>before we start a new arrangement with a service provider or business partner;</li>
            <li>when a member of staff joins us, changes role or tells us about a personal interest;</li>
            <li>when we review complaints, errors, incidents and voided or corrected trades; and</li>
            <li>at the regular reviews described in section 17.</li>
          </ul>
          <p>In each case we ask:</p>
          <ul>
            <li>Could NeuroOption make a gain, or avoid a loss, at your expense?</li>
            <li>Do we, or does a member of staff, have an interest in the outcome that differs from yours?</li>
            <li>Is there a reason to favour NeuroOption, or one client, over another client?</li>
            <li>Could a member of staff gain personally?</li>
            <li>Is someone giving us, or a member of staff, something to act in a particular way?</li>
          </ul>

          <h3>3.4 Our approach</h3>
          <p>Once we have identified a conflict, we deal with it in this order:</p>
          <ol>
            <li>
              <strong>Prevent it</strong> where we can, by designing it out of the platform or our processes, for example by making payouts
              the same for everyone so that nobody can be offered worse terms.
            </li>
            <li>
              <strong>Manage it</strong> where it cannot be prevented, using controls such as automatic rules, separation of duties, limits on
              staff access, records and review.
            </li>
            <li>
              <strong>Disclose it</strong> to you clearly, in this policy and, where needed, individually, so that you can make an informed
              decision (section 15).
            </li>
            <li>
              <strong>Decline</strong> to offer a service, feature or arrangement if we cannot manage the conflict adequately.
            </li>
            <li>
              <strong>Record and review</strong> each conflict and the way we deal with it (sections 16 and 17).
            </li>
          </ol>
          <Callout tone="warn" title="Some conflicts cannot be removed">
            <p>
              The three central conflicts described in sections 5 to 7 (we are your counterparty, we generate the prices and we set the
              payouts) are part of how NeuroOption works. Our controls reduce them, but they remain for as long as we offer this product. If
              you are not comfortable trading with a firm in this position, you should not trade with us.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "main-conflicts",
      title: "4. Summary of our main conflicts",
      body: (
        <>
          <p>
            The table below lists the main conflicts we have identified, why each matters to you, and where this policy explains how we deal
            with it.
          </p>
          <Table
            head={["Conflict", "Why it matters to you", "Main controls", "Section"]}
            rows={[
              [
                "We are the counterparty to every trade",
                <>Your profit is our cost and your loss is our gain.</>,
                <>Outcomes decided by fixed system rules; the same conditions for every client.</>,
                <>5</>,
              ],
              [
                "We generate the prices",
                <>There is no independent market price to check our prices against.</>,
                <>The price engine does not see who is trading; one price stream for everyone; no staff function to set prices.</>,
                <>6</>,
              ],
              [
                "We set the payouts",
                <>Lower payouts increase what we expect to earn from your trades.</>,
                <>Same payout for everyone; shown before you trade; locked when your trade is accepted; fixed limits; gradual, recorded changes.</>,
                <>7</>,
              ],
              [
                "We settle trades and decide on errors",
                <>We decide whether an error happened, and errors can affect winning trades.</>,
                <>Automatic settlement; errors corrected whichever way they fall; reasons recorded and given to you.</>,
                <>8</>,
              ],
              [
                "We decide on withdrawals, verification and account restrictions",
                <>We have a financial reason to delay or refuse paying out your winnings.</>,
                <>Decisions only on stated grounds, never because you have been profitable; reasons given and recorded.</>,
                <>9</>,
              ],
              [
                "Our staff can see your data and accounts",
                <>Information could be misused.</>,
                <>Role-based access; audit log of staff actions; confidentiality rules.</>,
                <>10</>,
              ],
              [
                "Staff personal trading and interests",
                <>Staff know more about the platform than you do.</>,
                <>No real-money trading by staff; declarations of interests; no involvement in cases of close associates.</>,
                <>10</>,
              ],
              [
                "Gifts and inducements",
                <>Benefits could influence decisions about you.</>,
                <>Gift rules and register; disclosure of any third-party payments.</>,
                <>11</>,
              ],
              [
                "Marketing and communications",
                <>We earn more when clients trade more.</>,
                <>No advice or trading recommendations; demo uses the same prices and payouts.</>,
                <>12</>,
              ],
              [
                "Referral, affiliate and social trading",
                <>People paid to introduce clients have their own incentives.</>,
                <>None of these is live; review and disclosure before any launch.</>,
                <>13</>,
              ],
              [
                "Service providers",
                <>Providers could be chosen for our benefit rather than yours.</>,
                <>Selection on suitability; we remain responsible.</>,
                <>14</>,
              ],
            ]}
          />
        </>
      ),
    },
    {
      id: "counterparty",
      title: "5. We are the counterparty to every trade",
      body: (
        <>
          <h3>5.1 How it works</h3>
          <p>
            Every trade on NeuroOption is a contract between you and us. There is no exchange, no other client and no liquidity provider on
            the other side, and the platform does not pass your trade to any exchange or other market. When a trade settles:
          </p>
          <ul>
            <li>if it wins, we pay your profit from our own funds;</li>
            <li>if it loses, we keep your stake; and</li>
            <li>if it ends in a draw (the settlement price is exactly equal to the entry price), your stake is returned.</li>
          </ul>

          <h3>5.2 Example</h3>
          <p>
            A stake of KES 1,000 on a real-money account, when real-money accounts are available, with a locked payout of 85%:
          </p>
          <Table
            head={["Result", "What you receive", "Effect on NeuroOption"]}
            rows={[
              ["Win", <>KES 1,850 (your KES 1,000 stake plus KES 850 profit)</>, <>A cost of KES 850</>],
              ["Loss", <>Nothing; the KES 1,000 stake is lost</>, <>A gain of KES 1,000</>],
              ["Draw", <>Your KES 1,000 stake is returned</>, <>No gain or cost</>],
            ]}
          />

          <h3>5.3 Why this is a conflict</h3>
          <p>
            Our trading revenue comes from clients' losses. On every single trade our financial interest is the opposite of yours, and across
            all clients we earn more when payouts are lower and when clients lose more often. Because a winning trade pays less than 100% of
            the stake as profit while a losing trade loses all of it, the average result over many trades favours us. The{" "}
            <PolicyLink slug="risk-disclosure">Risk Disclosure</PolicyLink> explains the effect of this on your chances of making money.
          </p>

          <h3>5.4 How we manage it</h3>
          <ul>
            <li>
              <strong>We do not decide the outcome of individual trades.</strong> The outcome is decided automatically by comparing the
              settlement price with the entry price (section 8).
            </li>
            <li>
              <strong>Prices and payouts do not depend on who you are.</strong> The price engine and the payout engine do not receive
              information about who is trading, what trades are open, client balances or trade results (sections 6 and 7).
            </li>
            <li>
              <strong>The same trading conditions apply to every client.</strong> Every client has access to the same instruments, the same
              expiries (from 5 seconds to 5 hours), the same minimum stake, the same payouts and the same prices. The platform does not
              classify clients by how profitable they are and does not offer different trading conditions to different clients.
            </li>
            <li>
              <strong>We do not penalise you for winning.</strong> Our commitments on withdrawals, verification and account restrictions are
              in section 9.
            </li>
            <li>
              <strong>We tell you about it.</strong> This conflict is disclosed in this policy, in the{" "}
              <PolicyLink slug="terms">Terms and Conditions</PolicyLink> and in the Risk Disclosure.
            </li>
          </ul>

          <h3>5.5 Our ability to pay</h3>
          <p>
            Because we are your counterparty, your winnings and your balance depend on NeuroOption being able to pay. Unless we tell you
            otherwise in writing, do not assume that money in a real-money account is held separately from our own money or is protected by
            any deposit insurance or investor compensation scheme. The Risk Disclosure explains this risk.
          </p>
        </>
      ),
    },
    {
      id: "prices",
      title: "6. We generate the prices",
      body: (
        <>
          <h3>6.1 All prices are synthetic</h3>
          <p>
            All 67 instruments on NeuroOption (currency pairs, cryptocurrencies, stocks, indices and commodities) are "OTC" instruments
            priced by our own price engine, which generates price movements using pseudo-random number generation. These prices do not come
            from any exchange, interbank market or data provider, and they can differ from the real-world price of an asset with a similar
            name. There is no independent market price against which our prices can be checked.
          </p>

          <h3>6.2 Why this is a conflict</h3>
          <p>
            The firm that gains when your trade loses also produces the price that decides whether it loses. A firm in this position could,
            in principle, move prices against clients' open trades. You are entitled to know what stops us from doing so.
          </p>

          <h3>6.3 Controls in the platform today</h3>
          <ul>
            <li>
              The price engine generates each instrument's price from that instrument's own model and the passage of time. It does not receive
              information about who is trading, which trades are open, in which direction, the size of stakes, client balances or trade
              results.
            </li>
            <li>
              The platform publishes one price stream for each instrument, and the same stream goes to every client. The entry price of every
              trade is the platform price at the moment our server accepts it, with no spread or mark-up added, and settlement uses the same
              price stream.
            </li>
            <li>The price engine does not distinguish between demo and real-money accounts.</li>
            <li>
              Our administration console has no function to set, adjust or override a price, or to change the entry price or settlement price
              of a trade.
            </li>
            <li>
              Your trade history shows the entry price and the closing price used for each of your trades, so you can compare them with the
              chart.
            </li>
          </ul>

          <h3>6.4 Changes to the price engine</h3>
          <p>
            The price engine is part of our platform software. It can only be changed by changing that software, which is done by authorised
            technical staff, and a change applies to every client trading the instruments concerned, never to one client. We will:
          </p>
          <ul>
            <li>test each change before it is released;</li>
            <li>keep a record of each change, what it does, why it was made and who approved it;</li>
            <li>never make a change that is designed to make clients' trades lose; and</li>
            <li>
              describe any material change in how prices are generated in the{" "}
              <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink>.
            </li>
          </ul>

          <h3>6.5 Knowledge of how prices are generated</h3>
          <p>
            People with access to the price engine's source code, configuration or servers know more about how prices are generated than
            clients do. We treat this as a conflict. We limit that access to authorised technical staff, and the staff trading rules in
            section 10.5 forbid anyone from using this knowledge to trade or passing it to anyone else.
          </p>

          <h3>6.6 Faults</h3>
          <p>
            If the price engine produces a clearly wrong price because of a fault, for example a sudden spike or a frozen price, it is
            treated as a manifest error under the Terms and Conditions. Section 8 explains how we handle errors fairly.
          </p>
        </>
      ),
    },
    {
      id: "payouts",
      title: "7. We set the payouts",
      body: (
        <>
          <h3>7.1 How payouts are set</h3>
          <p>
            Payouts are calculated by our payout engine. Each instrument has a baseline payout for a 60-second trade, normally around 85% to
            88%. The engine adjusts it using measurements of that instrument's own synthetic price stream: how volatile it has been recently
            compared with its own recent past, its recent price range, how strongly it has been trending, and how much time the price engine
            has spent in more volatile phases. Calmer conditions can raise the payout slightly; unusually volatile or trending conditions
            lower it. The engine then applies an adjustment for the expiry you choose. The result always stays within limits of 20% and 92%.
          </p>
          <Table
            head={["Expiry you choose", "Adjustment to the instrument's payout"]}
            rows={[
              ["5 to 15 seconds", <>3 percentage points lower</>],
              ["16 to 30 seconds", <>2 percentage points lower</>],
              ["31 seconds to under 5 minutes", <>No adjustment</>],
              ["5 minutes to 5 hours", <>1 percentage point higher</>],
            ]}
          />

          <h3>7.2 Why this is a conflict</h3>
          <p>
            The lower the payout, the more we expect to earn from clients' trades. A firm that sets its own payouts could also offer worse
            payouts to clients who win more often, or change the payout at the last moment before accepting a trade.
          </p>

          <h3>7.3 Controls in the platform today</h3>
          <ul>
            <li>
              <strong>The same for every client.</strong> A payout depends only on the instrument, the measured conditions of its price stream
              and the expiry. The payout engine never receives information about users, balances, open trades or trade results. There are no
              personal payouts, and demo and real-money accounts get the same payouts.
            </li>
            <li>
              <strong>Shown before you trade.</strong> The payout for your chosen instrument and expiry is shown before you place a trade.
            </li>
            <li>
              <strong>Locked when your trade is accepted.</strong> If the payout changed between the moment it was shown to you and the moment
              your trade request reached our server, the trade is rejected and you are shown the new payout to confirm. Once a trade is
              accepted, its payout is fixed, and later payout changes do not affect it.
            </li>
            <li>
              <strong>Fixed limits.</strong> A payout can never be below 20% or above 92%.
            </li>
            <li>
              <strong>Gradual changes.</strong> The payout engine is built to move payouts slowly, so that they cannot jump suddenly. The
              current settings are shown in the table below.
            </li>
            <li>
              <strong>Recorded changes.</strong> Each payout the engine publishes is stored with a version number, the time and a reason code,
              and each trade stores the payout version it was accepted at.
            </li>
            <li>
              <strong>No staff override.</strong> Our administration console has no function to set a payout for a particular client or trade.
            </li>
          </ul>
          <Table
            head={["Payout engine setting", "Current value"]}
            rows={[
              ["How often each instrument's payout is reviewed for a change", <>Every 10 minutes</>],
              ["Shortest time a published payout stays unchanged", <>10 minutes</>],
              ["Largest change at one review", <>2 percentage points</>],
              ["Largest total movement in any rolling hour", <>6 percentage points</>],
              ["Largest reduction below the instrument's baseline for market conditions", <>6 percentage points</>],
              ["Largest increase above the instrument's baseline for market conditions", <>3 percentage points</>],
            ]}
          />

          <h3>7.4 Changes to payout settings</h3>
          <p>
            The settings in this section are system-wide. A change to them applies to every client equally and never to one client. A change
            does not affect a trade that has already been accepted. We will describe any change to the 20% and 92% limits or to the expiry
            adjustments in the <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink> before it takes effect, and
            we will give you notice of any change that is to your disadvantage in the way the Terms and Conditions require.
          </p>
        </>
      ),
    },
    {
      id: "settlement-errors",
      title: "8. Settlement, errors and void trades",
      body: (
        <>
          <h3>8.1 Settlement follows fixed rules</h3>
          <p>
            When a trade reaches expiry, the platform settles it automatically by comparing the settlement price with the entry price. A Buy
            trade wins if the settlement price is higher, a Sell trade wins if it is lower, and a trade is a draw if the two prices are equal.
            A winning trade returns your stake plus your stake multiplied by the locked payout; a losing trade returns nothing; a draw returns
            your stake.
          </p>
          <ul>
            <li>Staff do not decide the outcome of trades.</li>
            <li>
              Neither you nor we can close or cancel a trade before expiry. The platform will not settle a trade early, even if you ask it to.
            </li>
            <li>
              Our administration console has no function to change a trade's outcome, entry price, settlement price, payout or stake, or to
              change a client's balance. The parts of the console that show trades and payments are read-only.
            </li>
          </ul>

          <h3>8.2 Delayed settlement</h3>
          <p>
            If settlement is delayed, for example by an outage, the trade is settled using the price available when settlement runs, which may
            differ from the price at the moment of expiry. This can work for or against you. The delay is not caused by, and is not timed
            according to, the direction of your trade.
          </p>

          <h3>8.3 Our discretion over errors is a conflict</h3>
          <p>
            The <PolicyLink slug="terms">Terms and Conditions</PolicyLink> allow us to correct manifest errors and to void or re-settle trades
            that were materially affected by a clear technical error. Because we decide whether an error happened, and because we would gain if
            a winning trade were voided, this discretion is itself a conflict of interest.
          </p>

          <h3>8.4 How we will use that discretion</h3>
          <ul>
            <li>We will apply the same standard whether the error is in your favour or ours, and correct errors that cost you money.</li>
            <li>
              We will judge whether a price was wrong against how the platform and the instrument normally behave, and only where there was a
              fault. A trade is not an error because it won, or because the price moved sharply while the price engine was working normally.
            </li>
            <li>
              We will identify every trade affected by the same error, winning and losing alike, and treat them all in the same way.
            </li>
            <li>
              We will record the error, the evidence, the trades affected, what we did and who decided, and we will tell you what we changed
              and why.
            </li>
            <li>
              Any correction to a trade or a balance will be made only by authorised staff, through restricted back-office processes, with the
              reason recorded.
            </li>
            <li>
              If you disagree, you can complain under the <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "decisions-about-you",
      title: "9. Withdrawals, verification and account restrictions",
      body: (
        <>
          <h3>9.1 Why these decisions involve a conflict</h3>
          <p>
            We decide whether to pay out a withdrawal, whether to approve your identity verification, and whether to restrict, suspend or
            lock your account. Because your winnings are paid from our funds, we have a financial reason to delay or refuse payments to you,
            and to make it harder for profitable clients to keep trading or withdraw. This section sets out how we manage that.
          </p>

          <h3>9.2 Withdrawals</h3>
          <p>When real-money accounts are available:</p>
          <ul>
            <li>
              Every withdrawal request is reviewed by our staff. While it is pending, the amount is moved from your available balance into
              locked funds. The withdrawal is then either processed and completed, or declined.
            </li>
            <li>If a withdrawal is declined, the locked amount is returned to your balance and we tell you the reason by email.</li>
            <li>
              We will decline or delay a withdrawal only for the reasons set out in the{" "}
              <PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink> and the{" "}
              <PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink>, such as outstanding identity verification, a payment to an
              account that is not in your name, suspected fraud or money laundering, a legal requirement, or an investigation into a manifest
              error.
            </li>
            <li>We will record each withdrawal decision, who made it and the reason for any decline.</li>
          </ul>

          <h3>9.3 Identity verification</h3>
          <ul>
            <li>
              Verification decisions are made by authorised staff. Each approval or rejection is recorded in the audit log with the staff
              member who made it and, for a rejection, the reason, and you are told the decision by email.
            </li>
            <li>
              We apply the same verification requirements to every client, whatever their trading results, and we will not ask for further
              documents because you have been profitable.
            </li>
          </ul>

          <h3>9.4 Account restrictions</h3>
          <ul>
            <li>
              Only staff with the Super Admin, Risk Admin or Compliance Admin role can change an account's status to Active, Suspended or
              Locked. A reason must be entered to suspend or lock an account, and each change is recorded in the audit log.
            </li>
            <li>
              We will restrict, suspend or lock an account only on the grounds set out in the Terms and Conditions, and we will tell you why,
              unless the law prevents us (for example, where telling you could amount to "tipping off" under the Proceeds of Crime and
              Anti-Money Laundering Act 2009).
            </li>
          </ul>

          <Callout tone="info" title="We do not penalise you for winning">
            <p>
              We will not restrict, suspend, lock or close your account, give you worse prices, payouts or trading conditions, or delay or
              decline a withdrawal, because you have been making a profit or because of how much you have won. Where a profit came from a
              manifest error or from conduct prohibited by the Terms and Conditions, it is dealt with under those Terms, in the same way as any
              other client's.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "staff",
      title: "10. Our staff",
      body: (
        <>
          <h3>10.1 Separate staff accounts</h3>
          <p>
            Staff use the administration console through staff accounts that are separate from client accounts. Each staff account has one
            role, which decides which parts of the console it can use. A staff session ends automatically after 8 hours. Only a Super Admin
            can create staff accounts, change their roles, or disable or remove them.
          </p>

          <h3>10.2 What staff can see and do</h3>
          <p>As the administration console is currently set up:</p>
          <Table
            head={["Area of the console", "What it allows", "Roles with access"]}
            rows={[
              [
                "Overview",
                <>Totals such as numbers of accounts, pending checks, payment queues and trading activity.</>,
                <>All staff roles</>,
              ],
              [
                "Client accounts",
                <>
                  View a client's name, email, phone, account and verification status, balances, recent trades and trading totals, recent
                  payments, support tickets and audit entries.
                </>,
                <>All staff roles</>,
              ],
              ["Account status", <>Change an account to Active, Suspended or Locked.</>, <>Super Admin, Risk Admin, Compliance Admin</>],
              [
                "Identity verification",
                <>View submitted verification records and approve or reject them.</>,
                <>Super Admin, KYC Admin, Compliance Admin</>,
              ],
              ["Payments", <>View deposits and withdrawals (read-only).</>, <>Super Admin, Finance Admin, Compliance Admin</>],
              ["Trading monitor", <>View trades and trading activity (read-only).</>, <>Super Admin, Risk Admin, Compliance Admin, Finance Admin</>],
              ["Support", <>Read and reply to support tickets and change their status.</>, <>Super Admin, Support Admin</>],
              [
                "Email log",
                <>See which emails were sent, to which address and whether they were delivered (not the content).</>,
                <>Super Admin, Compliance Admin, Support Admin</>,
              ],
              ["Audit log", <>View the record of staff actions.</>, <>Super Admin, Compliance Admin</>],
              ["Team", <>Create, change, disable and remove staff accounts.</>, <>Super Admin</>],
            ]}
          />
          <p>
            No part of the console allows staff to place, close or change a trade, to set a price or payout, or to change a balance.
          </p>

          <h3>10.3 The audit log</h3>
          <p>The administration console records in its audit log:</p>
          <ul>
            <li>changes to an account's status, with the previous status, the new status and the reason;</li>
            <li>identity verification approvals and rejections, with the reason for a rejection;</li>
            <li>replies to support tickets and changes to their status;</li>
            <li>the creation, change, disabling, enabling and removal of staff accounts; and</li>
            <li>test emails sent from the console.</li>
          </ul>
          <p>
            Each entry shows which staff member acted, what they did, which record it concerned and when. Only Super Admins and Compliance
            Admins can view the audit log, and the console has no function to edit or delete entries. The audit log records actions that change
            something; it does not currently record each time a staff member views a client's details. Access to client information is
            therefore also controlled by staff roles and by the confidentiality rules below.
          </p>

          <h3>10.4 Confidentiality and use of client information</h3>
          <ul>
            <li>Staff may only look at client information they need for their job, and only for that purpose.</li>
            <li>
              Staff must not use client information for their own benefit or anyone else's, must not share it outside NeuroOption except as
              the <PolicyLink slug="privacy">Privacy Policy</PolicyLink> allows, and must keep it confidential after they leave us.
            </li>
            <li>
              Staff will never ask you for your password, a password-reset code or your M-Pesa PIN.
            </li>
            <li>We disable a staff account when the person leaves us, and change its role when their job changes.</li>
            <li>Misuse of client information may also be an offence under the Data Protection Act 2019.</li>
          </ul>

          <h3>10.5 Personal trading by staff</h3>
          <p>
            The platform does not automatically stop a member of staff from opening or using a client account, so these rules are enforced
            through staff declarations, checks and discipline rather than by the software. Staff must not:
          </p>
          <ul>
            <li>open, hold or trade on a real-money NeuroOption account, directly or through anyone else;</li>
            <li>
              use the demo account except for testing, training, support or product work, and must not present demo results as evidence of
              what clients can achieve;
            </li>
            <li>place, or offer to place, trades on any client's account, or tell a client when to trade, what to trade or which direction to choose;</li>
            <li>
              use non-public information about the price engine, the payout engine, our trading results or our clients to benefit themselves or
              anyone else, or pass that information to anyone outside NeuroOption; or
            </li>
            <li>
              deal with any withdrawal, verification, account status decision or complaint for a close associate. They must declare any close
              associate who holds a NeuroOption account, and that person's matters are handled by someone else.
            </li>
          </ul>

          <h3>10.6 Personal relationships and outside interests</h3>
          <p>
            Staff must declare, when they join us and whenever it changes, any personal relationship or outside interest that could conflict
            with their duties, including any interest in a business that offers similar products or provides services to us. We record each
            declaration in the conflicts register and decide how to manage it, for example by reassigning work or limiting access.
          </p>

          <h3>10.7 How staff are paid</h3>
          <p>
            We will not pay staff bonuses, commission or other rewards that are linked to clients' trading losses, to the amount clients trade
            or deposit, to the number or value of withdrawals declined, or to the number of verification checks rejected.
          </p>

          <h3>10.8 Breaches</h3>
          <p>
            A breach of these rules is a disciplinary matter and may lead to dismissal or the end of a contract. We will reverse any benefit a
            client lost because of the breach, and we will report the matter to the authorities where the law requires.
          </p>
        </>
      ),
    },
    {
      id: "gifts-inducements",
      title: "11. Gifts, hospitality and inducements",
      body: (
        <>
          <h3>11.1 Gifts and hospitality for staff</h3>
          <ul>
            <li>Staff must never accept cash, M-Pesa or other money transfers, vouchers or anything else that can be converted into money.</li>
            <li>Staff must not accept any gift from a client other than a token item worth less than KES 2,500.</li>
            <li>
              Staff must record in our gifts and hospitality register every gift or hospitality worth KES 2,500 or more that is offered to them
              or that they offer, in connection with their work, whether or not it is accepted.
            </li>
            <li>Staff must get approval from senior management before accepting anything worth more than KES 10,000.</li>
            <li>
              Staff must refuse anything offered by a person whose withdrawal, verification, account status, complaint or contract they are
              dealing with at the time.
            </li>
          </ul>
          <p>
            Offering or accepting a bribe is a criminal offence under Kenya's Bribery Act, 2016. Any gift given or received in breach of these
            rules is a disciplinary matter.
          </p>

          <h3>11.2 Payments from third parties</h3>
          <p>
            Because we are the counterparty to every trade and do not send your trades to any exchange, broker or liquidity provider, nobody
            pays us to direct your trades to them. If we ever receive a fee, commission or other benefit from a third party in connection with
            the services we provide to you, we will tell you what it is and how it is calculated before it affects you.
          </p>

          <h3>11.3 Bonuses and promotions</h3>
          <p>
            We do not offer bonuses or promotions today. A bonus can create a conflict because it can encourage you to trade more than you
            otherwise would, especially if withdrawing depends on trading a minimum amount. If we introduce a bonus or promotion, we will
            first review it under this policy and publish its full terms before you can accept it, including any condition that affects when
            you can withdraw. We will not attach conditions to your own deposited money or prevent you from withdrawing it because you
            accepted a bonus.
          </p>
        </>
      ),
    },
    {
      id: "marketing-communications",
      title: "12. Marketing, education and communications",
      body: (
        <>
          <h3>12.1 Why this is a conflict</h3>
          <p>
            Because our revenue comes from clients' losses, we earn more when clients trade more often, use shorter expiries or keep trading
            after losses. This gives us a reason to encourage trading and to present it more positively than it deserves.
          </p>

          <h3>12.2 Our commitments</h3>
          <ul>
            <li>
              We do not give investment, financial or trading advice. Nothing on the platform, in our{" "}
              <a href="/help">Help Centre</a>, in our emails or from our staff is a recommendation to trade or to choose a particular direction,
              instrument, stake or expiry.
            </li>
            <li>No trading signals service is live. Pages marked "coming soon" or showing illustrative examples, such as social or copy trading, tournaments, signals and express trades, are not live services.</li>
            <li>We will not describe our synthetic prices as real market prices.</li>
            <li>
              Our marketing will include a clear risk warning, will not present demo results as an indication of what you can achieve with real
              money, and will not suggest that trading is a way to earn a regular income.
            </li>
            <li>Our newsletter is optional, and you can unsubscribe at any time.</li>
          </ul>

          <h3>12.3 The demo account</h3>
          <p>
            A firm could make its demo account easier to win on, so that clients move to real money with false confidence. On NeuroOption, the
            price engine and the payout engine do not distinguish between demo and real-money accounts: the demo account uses the same prices
            and payouts that real-money trading will use. Demo funds are virtual, have no value and cannot be withdrawn, and demo results do not
            guarantee real results. Trading with real money can also feel very different from trading with virtual funds.
          </p>

          <h3>12.4 Responsible trading</h3>
          <p>
            Our interest in clients trading more is in direct tension with your interest in keeping control of your trading. The{" "}
            <PolicyLink slug="responsible-trading">Responsible Trading Policy</PolicyLink> explains the warning signs to look out for and what
            you can do.
          </p>
        </>
      ),
    },
    {
      id: "referral-affiliate-social",
      title: "13. Referral, affiliate and social trading arrangements",
      body: (
        <>
          <h3>13.1 What exists today</h3>
          <p>
            No referral, affiliate or introducing-broker programme is live, and nobody is paid by us for introducing clients. Social trading,
            copy trading and tournaments are not live either.
          </p>

          <h3>13.2 If we introduce them</h3>
          <p>These arrangements create their own conflicts. For example:</p>
          <ul>
            <li>an affiliate paid according to what referred clients deposit or trade has a reason to encourage them to deposit and trade more;</li>
            <li>a trader whose trades are copied, or who is featured on the platform, has a reason to take more risk to attract followers; and</li>
            <li>we could decide which traders to feature, or how to rank them, in a way that encourages more trading.</li>
          </ul>
          <p>Before launching any such arrangement, we will:</p>
          <ul>
            <li>review it under this policy and record the conflicts it creates and how we will manage them;</li>
            <li>tell you, before you sign up through an affiliate or start copying anyone, who is paid, by whom, and on what basis;</li>
            <li>
              require affiliates and featured traders not to give investment advice, not to misrepresent our services or the risks, and to use
              our risk warnings; and
            </li>
            <li>give affiliates no access to your account or personal data beyond what is strictly needed to calculate what they are owed.</li>
          </ul>
          <p>We will update this policy before any of these arrangements goes live.</p>
        </>
      ),
    },
    {
      id: "service-providers",
      title: "14. Service providers and outsourcing",
      body: (
        <>
          <h3>14.1 Who we rely on</h3>
          <Table
            head={["Provider", "What it does for us"]}
            rows={[
              ["Safaricom (M-Pesa)", <>Deposits and withdrawals by M-Pesa, when real-money accounts are available.</>],
              ["Google", <>reCAPTCHA checks that may be used on sign-up, sign-in and password pages, and the fonts used on our website.</>],
              ["Email delivery provider", <>Sending account, security, payment and support emails, and the newsletter.</>],
              ["Render", <>Hosting of our website and platform.</>],
              ["Managed database provider", <>Storage of account, trading and payment records.</>],
            ]}
          />
          <p>
            We do not use any external price data provider, liquidity provider or exchange. Prices are generated by our own price engine, so
            no outside party has a role in deciding your trades.
          </p>

          <h3>14.2 Conflicts involving providers</h3>
          <p>
            A conflict could arise if we chose a provider because it benefits us rather than because it serves you well, or if a provider's own
            interests affected how it handles your money or data.
          </p>

          <h3>14.3 How we manage them</h3>
          <ul>
            <li>We choose providers for their reliability, security, cost and compliance with the law.</li>
            <li>
              We will record in the conflicts register any payment, discount or other benefit we receive from a provider that could affect our
              choice, and any personal connection between a provider and a member of our staff.
            </li>
            <li>
              We will require providers that handle personal data for us to protect it as the Data Protection Act 2019 requires. The{" "}
              <PolicyLink slug="privacy">Privacy Policy</PolicyLink> gives more detail.
            </li>
            <li>We remain responsible to you for the services we provide, even where a provider carries out part of them.</li>
          </ul>
        </>
      ),
    },
    {
      id: "disclosure",
      title: "15. Disclosure to you",
      body: (
        <>
          <h3>15.1 When we disclose a conflict</h3>
          <p>
            We disclose a conflict to you when our arrangements are not enough to make sure, with reasonable confidence, that it will not harm
            your interests. The conflicts in sections 5 to 7 fall into this category, which is why we disclose them here and in other
            documents.
          </p>

          <h3>15.2 How we disclose</h3>
          <ul>
            <li>
              <strong>Generally:</strong> in this policy, which is published on our website, and in the{" "}
              <PolicyLink slug="terms">Terms and Conditions</PolicyLink> and the <PolicyLink slug="risk-disclosure">Risk Disclosure</PolicyLink>.
            </li>
            <li>
              <strong>Before real-money trading:</strong> we will draw these conflicts to your attention before you open a real-money account,
              when real-money accounts are available.
            </li>
            <li>
              <strong>Individually:</strong> by email or through <a href="/support">Support</a>, where a specific conflict affects you, for
              example where we discover that a member of staff dealing with your case has a connection with you.
            </li>
          </ul>

          <h3>15.3 What a disclosure contains</h3>
          <p>
            A disclosure will explain the nature and source of the conflict, the risk it creates for you, and the steps we have taken to reduce
            it, in enough detail for you to decide whether to go ahead.
          </p>

          <h3>15.4 Disclosure is a last resort</h3>
          <p>
            Telling you about a conflict does not relieve us of our duty to manage it. We will not rely on disclosure alone where we can
            prevent or manage a conflict by other means.
          </p>

          <h3>15.5 Your choice</h3>
          <p>
            You do not have to trade with us. If, after reading this policy, you are not comfortable with these conflicts, you can stop using
            the platform and close your account as explained in the{" "}
            <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink>.
          </p>
        </>
      ),
    },
    {
      id: "records",
      title: "16. Records",
      body: (
        <>
          <h3>16.1 What we keep</h3>
          <Table
            head={["Record", "What it contains"]}
            rows={[
              [
                "Trade records",
                <>
                  For each trade: the instrument, direction, stake, entry price and time, expiry, locked payout and its version, settlement
                  price and time, and result.
                </>,
              ],
              ["Payout history", <>Each payout published by the payout engine, with its version, time and reason code.</>],
              ["Audit log", <>Staff actions taken in the administration console, as described in section 10.3.</>],
              [
                "Conflicts register",
                <>Each conflict identified, how it is managed, decisions taken, and any disclosure made to clients.</>,
              ],
              ["Staff declarations", <>Declarations of close associates holding accounts, personal relationships and outside interests.</>],
              ["Gifts and hospitality register", <>Gifts and hospitality offered or received, their value, and whether they were accepted or approved.</>],
              [
                "Error and correction records",
                <>Manifest errors, trades voided or re-settled, balance corrections, the reasons and who decided.</>,
              ],
            ]}
          />

          <h3>16.2 How long we keep them</h3>
          <p>
            We keep these records for as long as required by applicable law (for example, the record-keeping periods under anti-money-laundering,
            tax and companies law) and in any case for at least <Co field="retentionPeriod" />. Records relating to an open complaint or dispute
            are kept until it is resolved, even if that is longer.
          </p>

          <h3>16.3 Who can see them</h3>
          <p>
            These records are available to our senior management and to the person responsible for compliance. We may give them to a court,
            regulator or other authority when the law requires. Your own trade records are available to you in your trade history, and you can
            ask for your personal data as explained in the Privacy Policy.
          </p>
        </>
      ),
    },
    {
      id: "governance-review",
      title: "17. Governance, training and review",
      body: (
        <>
          <h3>17.1 Responsibility</h3>
          <p>
            Our senior management is responsible for this policy and for making sure that conflicts are identified and managed. We will appoint
            a person responsible for compliance, who will:
          </p>
          <ul>
            <li>keep the conflicts register and the gifts and hospitality register up to date;</li>
            <li>receive and assess staff declarations;</li>
            <li>advise staff and management on conflicts;</li>
            <li>review new features, arrangements and providers for conflicts before they start; and</li>
            <li>report to senior management on conflicts at least every three months.</li>
          </ul>

          <h3>17.2 Training</h3>
          <p>
            Every member of staff must read this policy and confirm that they understand it when they join us, and again each year or whenever it
            changes significantly.
          </p>

          <h3>17.3 Monitoring</h3>
          <p>At least every three months, the person responsible for compliance will review:</p>
          <ul>
            <li>the audit log, including account restrictions and verification decisions;</li>
            <li>declined and delayed withdrawals, when real-money accounts are available;</li>
            <li>trades voided or re-settled and balances corrected;</li>
            <li>the payout history, to check that payouts stayed within the limits and settings described in section 7; and</li>
            <li>complaints that raise a possible conflict of interest.</li>
          </ul>

          <h3>17.4 Review of this policy</h3>
          <p>We review this policy at least once every 12 months, and also before:</p>
          <ul>
            <li>real-money accounts become available;</li>
            <li>we launch any referral, affiliate, bonus, promotion, social trading, copy trading or tournament feature;</li>
            <li>we add instruments based on real market prices, or new types of product;</li>
            <li>we make a material change to the price engine or the payout engine; and</li>
            <li>we take on a new provider with a role in trading, payments or client data.</li>
          </ul>
          <p>We also review it after any incident or complaint that shows a conflict was not managed properly.</p>

          <h3>17.5 Changes to this policy</h3>
          <p>
            When we change this policy, we will update the date at the top of this page. If a change is to your disadvantage, we will give you
            notice as set out in the <PolicyLink slug="terms">Terms and Conditions</PolicyLink>.
          </p>
        </>
      ),
    },
    {
      id: "raising-concerns",
      title: "18. How to raise a concern",
      body: (
        <>
          <h3>18.1 If you are a client</h3>
          <p>If you think a conflict of interest has affected how we treated you, tell us:</p>
          <ul>
            <li>
              through <a href="/support">Support</a> by opening a support ticket while signed in; or
            </li>
            <li>
              by making a complaint under the <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>, including by email to{" "}
              <Co field="complaintsEmail" />.
            </li>
          </ul>
          <p>
            Where your concern relates to a trade, include the instrument, the trade time in East Africa Time (EAT), the stake and, if you can,
            the trade details shown in your trade history. This helps us check the trade record, the payout version and the price used.
          </p>

          <h3>18.2 If you work for us</h3>
          <p>
            Staff who become aware of a conflict that has not been declared or managed, or of a breach of this policy, must report it to the
            person responsible for compliance or to senior management. Concerns can be raised in confidence. We will not dismiss, discipline or
            otherwise treat anyone unfairly for raising a genuine concern in good faith, even if it turns out to be mistaken.
          </p>

          <h3>18.3 Outside bodies</h3>
          <ul>
            <li>
              Where it has authority over the matter, you can refer a concern to our licensing regulator: <Co field="regulator" />.
            </li>
            <li>For concerns about your personal data, you can complain to the Office of the Data Protection Commissioner (ODPC).</li>
            <li>Nothing in this policy limits any right you have under Kenyan law, including the Consumer Protection Act 2012.</li>
          </ul>

          <h3>18.4 Our contact details</h3>
          <Table
            head={["Contact", "Details"]}
            rows={[
              ["Support", <><a href="/support">Support</a> (signed-in clients), <Co field="supportEmail" />, <Co field="supportPhone" /></>],
              ["Complaints", <Co field="complaintsEmail" />],
              ["Data protection", <Co field="privacyEmail" />],
              ["Registered office", <Co field="registeredAddress" />],
            ]}
          />
        </>
      ),
    },
  ],
};

export default policy;
