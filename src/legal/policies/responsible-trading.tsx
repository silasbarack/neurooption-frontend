import type { Policy } from "../types";
import { Callout, Co, Definitions, PolicyLink, Table } from "../components";

const policy: Policy = {
  slug: "responsible-trading",
  title: "Responsible Trading Policy",
  summary:
    "Fixed-time trading is fast, all-or-nothing and can become compulsive, and NeuroOption earns money when you lose. This policy explains how to keep control, the warning signs of harm, the tools that exist on the platform today (and those that do not), what we will do if we see signs of harm, and where to get help.",
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
            at <Co field="registeredAddress" />. "You" and "your" mean any person who uses the NeuroOption website and platform at
            https://neurooption.com, whether with a demo account or, when real-money accounts are available, a real-money account.
          </p>

          <h3>1.2 What this policy is for</h3>
          <p>This policy explains:</p>
          <ul>
            <li>how we approach responsible trading, and the conflict of interest that makes it important;</li>
            <li>why fixed-time trading can feel like gambling, and the habits that help you stay in control;</li>
            <li>the warning signs that your trading may be harming you;</li>
            <li>our minimum age of 21, and how parents and guardians can help keep young people off the platform;</li>
            <li>the tools that actually exist on the platform today, and the tools that do not exist yet;</li>
            <li>what we will do if we see signs that trading is harming you;</li>
            <li>how we support customers in vulnerable circumstances;</li>
            <li>where you can get help; and</li>
            <li>the rules we follow in our marketing.</li>
          </ul>

          <Callout tone="info" title="Real-money services are not available yet">
            <p>
              Today NeuroOption offers demo trading with virtual US dollars (USD) only. Real-money deposits, withdrawals and trades are switched
              off on the platform. Parts of this policy describe how things will work when real-money accounts are available. Nothing in this
              policy means that real-money services are available now. When they are, real-money accounts will be held in Kenya Shillings
              (KES).
            </p>
          </Callout>

          <h3>1.3 How this policy fits with our other policies</h3>
          <p>This policy forms part of the information you should read before you trade, together with:</p>
          <ul>
            <li>
              the <PolicyLink slug="terms">Terms and Conditions</PolicyLink>, which form the agreement between you and us and set out when we
              may restrict, suspend or close an account;
            </li>
            <li>
              the <PolicyLink slug="risk-disclosure">Risk Disclosure</PolicyLink>, which explains the risks of fixed-time options in detail,
              including the break-even win rate;
            </li>
            <li>
              the <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink>, which explains how trades are placed,
              priced and settled;
            </li>
            <li>
              the <PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink>, which explains how our interests can
              conflict with yours;
            </li>
            <li>
              the <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink>, which explains in full what happens
              when you delete your account; and
            </li>
            <li>
              the <PolicyLink slug="privacy">Privacy Policy</PolicyLink>, which explains how we handle your personal information.
            </li>
          </ul>
          <p>
            If this policy and the Terms and Conditions conflict, the Terms and Conditions apply, except where this policy gives you more
            protection. Nothing in this policy limits any right you have under Kenyan law, including the Consumer Protection Act 2012.
          </p>

          <h3>1.4 Our regulatory status</h3>
          <Table
            head={["Item", "Detail"]}
            rows={[
              ["Licensing regulator", <Co field="regulator" />],
              ["Licence number", <Co field="licence" />],
            ]}
          />
          <p>
            Our regulatory status is stated only in this table. Do not assume that NeuroOption is licensed, regulated, authorised or approved
            by the Capital Markets Authority (CMA) or by any other authority, except as stated in this table. A reference in this policy to a
            Kenyan law or public body does not mean that the law licenses us or that the body supervises us.
          </p>
        </>
      ),
    },
    {
      id: "definitions",
      title: "2. Definitions",
      body: (
        <>
          <p>In this policy, these words have the following meanings.</p>
          <Definitions
            items={[
              [
                "Fixed-time option",
                <>
                  A trade in which you choose whether the price of an instrument will be higher (BUY) or lower (SELL) at a fixed expiry time. If
                  you are right you receive your stake back plus a profit equal to your stake multiplied by the payout percentage; if you are
                  wrong you lose your whole stake. Fixed-time options are also called "binary" options.
                </>,
              ],
              ["Stake", <>The amount you put at risk on a single trade. The minimum stake is 1 unit of your account currency.</>],
              [
                "Payout percentage",
                <>
                  The profit you receive on a winning trade, as a percentage of your stake. It is shown before you trade, is locked when your
                  trade is accepted, and is always below 100%.
                </>,
              ],
              ["Expiry", <>The time at which a trade ends. On NeuroOption, expiries range from 5 seconds to 5 hours.</>],
              [
                "Synthetic price",
                <>
                  A price produced by NeuroOption's own price engine. Every instrument on NeuroOption is labelled "OTC" and has a synthetic
                  price. These prices do not come from any exchange, interbank market or data provider.
                </>,
              ],
              [
                "Demo account",
                <>An account that uses virtual US dollars (USD). Virtual funds have no value and cannot be withdrawn.</>,
              ],
              [
                "Real-money account",
                <>An account in Kenya Shillings (KES) funded with real money through M-Pesa, when real-money accounts are available.</>,
              ],
              [
                "Harmful trading",
                <>
                  Trading that causes, or is likely to cause, harm to you or to people who depend on you, such as money problems, debt, stress,
                  loss of sleep, damage to relationships, or problems at work or in your studies. It includes trading that you find hard to
                  control or stop.
                </>,
              ],
              [
                "Customer in vulnerable circumstances",
                <>
                  A person whose personal circumstances make them especially likely to suffer harm, or less able to protect their own interests,
                  for example because of illness, bereavement, financial difficulty or an addiction. Section 12 explains this further.
                </>,
              ],
              [
                "Suspension",
                <>
                  An account status that our authorised staff can set on your account, either at your request or under the Terms and Conditions.
                  Section 9 explains what it does and does not do today.
                </>,
              ],
              [
                "Account deletion",
                <>
                  Permanently closing your account yourself on the <a href="/delete-account">Delete account</a> page. It cannot be undone.
                </>,
              ],
              [
                "Support ticket",
                <>
                  A written conversation with our support team that you start on the <a href="/support">Support</a> page while you are signed
                  in. Our replies appear in the ticket, and we also email you when we reply.
                </>,
              ],
            ]}
          />
        </>
      ),
    },
    {
      id: "our-approach",
      title: "3. Our approach",
      body: (
        <>
          <h3>3.1 What we believe</h3>
          <p>
            Fixed-time options are high-risk products. For most people, over time, they lose money. We believe you should only trade if you
            understand that, if you treat any money you trade as money you may lose completely, and if trading stays something you choose to do
            rather than something you feel you must do.
          </p>

          <h3>3.2 Why this matters more with us</h3>
          <Callout tone="risk" title="We earn when you lose">
            <p>
              NeuroOption is the counterparty to every trade. When you lose a trade, we keep your stake. When you win, we pay you from our own
              funds. We also produce every price you see: all instruments are synthetic "OTC" instruments priced by our own price engine, not
              prices from any real market. This means our income depends on clients' losses, and we have a commercial reason to want you to
              trade more. You should keep this in mind whenever you decide whether, and how much, to trade.
            </p>
          </Callout>
          <p>
            Because of this conflict, we set out in this policy what we commit to do and not do, so that you can hold us to it. The{" "}
            <PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink> explains the conflict in more detail.
          </p>

          <h3>3.3 Our commitments</h3>
          <ul>
            <li>We will describe the product honestly, including the fact that payouts below 100% mean the average result over many trades is a loss.</li>
            <li>We will not describe our synthetic prices as real market prices.</li>
            <li>We will not tell you, or suggest, that trading is a way to earn a regular income, pay off debts or recover losses.</li>
            <li>We will tell you plainly which responsible-trading tools exist on the platform and which do not.</li>
            <li>We will act on your request to suspend or close your account, as described in sections 9 and 10.</li>
            <li>We will not offer you incentives, such as bonuses, to keep trading or to come back after you have asked us to suspend your account.</li>
            <li>We will not market to anyone under 21, and we will close accounts that we believe belong to someone under 21.</li>
            <li>We will never use this policy as a reason to withhold money you are owed, or to restrict you because you are winning.</li>
          </ul>

          <h3>3.4 What we cannot do</h3>
          <p>
            We do not know your income, your debts, your health or your family situation unless you tell us, and we do not currently use
            automated systems to monitor clients' trading for signs of harm. We cannot guarantee that we will notice if trading is harming you.
            The most effective protection is the decisions you make yourself, which is why most of this policy is practical guidance for you.
            If you are worried about your trading, please tell us (section 9) and talk to someone you trust (section 13).
          </p>
        </>
      ),
    },
    {
      id: "why-it-can-feel-like-gambling",
      title: "4. Why fixed-time trading can feel like gambling",
      body: (
        <>
          <h3>4.1 How the product works, in brief</h3>
          <p>
            On NeuroOption you choose an instrument, a direction (BUY if you think the price will be higher at expiry, SELL if lower), a stake
            and an expiry between 5 seconds and 5 hours. The payout percentage is shown before you trade and is locked when your trade is
            accepted. At expiry, a winning trade returns your stake plus your stake multiplied by the payout percentage; a losing trade loses
            the whole stake; if the settlement price equals the entry price, your stake is returned. A trade cannot be closed or cancelled
            before expiry.
          </p>

          <h3>4.2 Features that resemble gambling</h3>
          <Table
            head={["Feature", "Why it matters"]}
            rows={[
              [
                "All-or-nothing results",
                <>Every trade ends in a full win or a full loss of the stake, much like a bet. There is no partial loss to soften the result.</>,
              ],
              [
                "Very short expiries",
                <>
                  A trade can last as little as 5 seconds. Results arrive quickly, one after another, and it is possible to place hundreds of
                  trades in an hour. Fast, repeated results are one of the features that make gambling compulsive.
                </>,
              ],
              [
                "Available at any hour",
                <>
                  Synthetic instruments are not tied to the opening hours of any real market, so trading may be available late at night and at
                  weekends, when you may be tired or alone.
                </>,
              ],
              [
                "Near misses",
                <>
                  A trade lost by the smallest price movement can feel as if you "almost won", which invites another try. It is still a full
                  loss.
                </>,
              ],
              [
                "Random price movements",
                <>
                  Our price engine generates prices using random processes. Over very short periods, especially, there may be no pattern to find,
                  yet the mind tends to see patterns anyway.
                </>,
              ],
              [
                "Payouts below 100%",
                <>
                  You win less on a winning trade than you lose on a losing one. Like the house edge in a casino, this means the average result
                  over many trades is a loss.
                </>,
              ],
              [
                "Points, levels and streaks",
                <>
                  Our Achievements page awards experience points (XP), levels and badges. See section 4.5.
                </>,
              ],
            ]}
          />

          <h3>4.3 The numbers are against you</h3>
          <p>
            Because payouts are below 100%, you must win more than half of your trades just to break even. At an 85% payout you need to win
            about 54.1% of your trades. The <PolicyLink slug="risk-disclosure">Risk Disclosure</PolicyLink> explains how this is calculated.
          </p>
          <Callout tone="warn" title="Example: right half the time, and still losing">
            <p>
              You place 100 trades of KES 100 each at an 85% payout, and you win exactly 50 of them. Your 50 winning trades make a profit of
              50 × KES 85 = KES 4,250. Your 50 losing trades lose 50 × KES 100 = KES 5,000. You have traded KES 10,000 in total, been right
              half of the time, and lost KES 750. With shorter expiries, these 100 trades could take less than an hour.
            </p>
          </Callout>

          <h3>4.4 Thinking traps to watch for</h3>
          <ul>
            <li>
              <strong>"I am due a win."</strong> Each trade is separate. A run of losses does not make the next trade more likely to win.
            </li>
            <li>
              <strong>"I can win it back."</strong> Increasing stakes or trading more to recover losses (chasing losses) usually makes losses
              bigger. See section 5.3.
            </li>
            <li>
              <strong>"I have a system."</strong> A run of wins is not proof that a strategy works. Over a small number of trades, luck can look
              like skill.
            </li>
            <li>
              <strong>"It is only small amounts."</strong> Small stakes placed many times add up quickly. Look at your total losses, not the size
              of each trade.
            </li>
            <li>
              <strong>"It is not real money."</strong> On the demo account it is not, and that is exactly why demo trading can build habits and
              confidence that do not survive the switch to real money (section 5.6).
            </li>
          </ul>

          <h3>4.5 Achievements, XP and streaks</h3>
          <p>
            Our Achievements page awards XP for each completed trade, extra XP for each winning trade and XP for each day in your current
            trading streak, with a new level for every 300 XP. Badges are awarded for things such as completing 10, 100 or 1,000 trades, trading
            on 7 or 30 days in a row, and placing a single trade with a stake worth USD 100 or more (the "High Roller" badge). XP, levels and badges
            have no cash value and are not a measure of trading skill.
          </p>
          <p>
            Features like these can encourage you to trade more often, on more days, or with larger stakes than you intended. We recommend that
            you ignore them when deciding whether to trade. Never trade just to keep a streak going or to unlock a badge.
          </p>
        </>
      ),
    },
    {
      id: "principles",
      title: "5. Principles for keeping control",
      body: (
        <>
          <p>
            The principles below apply to every client. They are not a guarantee that you will avoid losses: you can follow all of them and
            still lose all the money you trade.
          </p>

          <h3>5.1 Only risk money you can afford to lose</h3>
          <p>
            Treat any money you put into trading as money that is already spent, in the same way you would treat money spent on entertainment.
            Before you trade, ask yourself: "If I lost all of this, would I or my family go without anything we need?" If the answer is yes, do
            not trade with it.
          </p>
          <p>Never trade with money you need for:</p>
          <ul>
            <li>rent, food, electricity, water or transport;</li>
            <li>school fees or your children's needs;</li>
            <li>medical costs or health insurance;</li>
            <li>loan repayments, savings, group (chama) contributions or SACCO contributions; or</li>
            <li>your business stock or working capital.</li>
          </ul>

          <h3>5.2 Never borrow to trade</h3>
          <p>
            Never trade with borrowed money. This includes bank loans, mobile and digital loans, M-Pesa overdraft services, credit cards, salary
            advances, and money borrowed from family, friends or a group. Borrowing to trade turns a trading loss into a debt that you must
            repay, often with interest, after the money has already gone.
          </p>

          <h3>5.3 Never chase losses</h3>
          <p>
            After a loss, it is natural to want to win the money back quickly. Increasing your stakes, trading more often or switching to
            shorter expiries to recover losses usually makes the losses larger. A common pattern is doubling the stake after every loss. Because
            payouts are below 100%, doubling does not even reliably recover what you lost, and the stakes grow very fast.
          </p>
          <Table
            head={["Starting at KES 100 and doubling after each loss (85% payout)", "Result"]}
            rows={[
              ["After 6 losses in a row", <>You have lost KES 6,300 (100 + 200 + 400 + 800 + 1,600 + 3,200).</>],
              ["The 7th trade, with a stake of KES 6,400, wins", <>You make a profit of KES 5,440 on that trade, but you are still KES 860 down overall.</>],
              ["The 7th trade loses instead", <>You have lost KES 12,700 trying to win KES 85.</>],
            ]}
          />
          <p>
            If you have lost more than you planned, the right decision is to stop for the day. Accept the loss as the cost of trading, and do not
            try to win it back.
          </p>

          <h3>5.4 Set a budget before you start, and keep to it</h3>
          <p>
            Decide in advance how much money you are prepared to lose in a given period, such as a week or a month, and stop when you reach that
            amount. Decide also how much you will stake on each trade. Write your limits down. Do not change them while you are trading, and
            never increase them after a loss.
          </p>
          <Callout tone="warn" title="The platform will not enforce your budget">
            <p>
              NeuroOption does not currently offer tools to set deposit, loss, stake or time limits. Any limit you set is one you must keep
              yourself. If you find that hard, use the steps in sections 9 and 10.
            </p>
          </Callout>

          <h3>5.5 Set a time limit</h3>
          <p>
            Decide how long you will trade before you start, and set an alarm on your phone to tell you when to stop. Take regular breaks.
            Decide on days when you will not trade at all. Avoid trading late at night, and never let trading take the place of sleep, work,
            study, meals or time with your family.
          </p>

          <h3>5.6 Use the demo account first</h3>
          <p>
            The demo account lets you learn how fixed-time options and the platform work without risking money. It uses the same synthetic
            prices and the same payout percentages that real-money trading will use. To get the most from it:
          </p>
          <ul>
            <li>
              practise with stake sizes that match the budget you would use with real money, not the full virtual balance. The demo account
              starts with USD 70,000 of virtual funds, which is far more than most people would ever trade;
            </li>
            <li>keep a note of your results over many trades, including your total losses, not only your wins;</li>
            <li>check your win rate against the break-even win rate explained in the Risk Disclosure; and</li>
            <li>notice how you feel after a run of losses. If you are tempted to raise your stakes to win it back on demo, you are likely to feel the same with real money.</li>
          </ul>
          <p>
            Remember that demo results do not predict real results, and that losing virtual funds can feel very different from losing your own
            money. You can top up the virtual balance (section 8.2), so losing on demo has no consequence. Do not move to real money because of a
            good run on demo.
          </p>

          <h3>5.7 Other good habits</h3>
          <ul>
            <li>Do not trade when you are tired, angry, upset, lonely, stressed, or after drinking alcohol or taking drugs.</li>
            <li>Do not trade to escape problems, boredom or low mood.</li>
            <li>Do not see trading as a way to earn a living, pay bills or clear debts.</li>
            <li>Review your trade history regularly and honestly (section 8.3).</li>
            <li>Keep other interests and activities in your life that have nothing to do with trading.</li>
            <li>Be open with your family or someone you trust about how much time and money you spend on trading.</li>
          </ul>

          <h3>5.8 An example of a personal trading plan</h3>
          <p>
            The table below is an illustration of how you might write down your own limits. The figures are examples only, not advice or a
            recommendation to trade. Your own limits should be based on your own circumstances, and may well be lower or zero.
          </p>
          <Table
            head={["Plan item", "Example"]}
            rows={[
              ["Money left after all essentials, savings and commitments this month", <>KES 4,000</>],
              ["Most I will lose from trading this month", <>KES 1,000, and I will stop for the month when I reach it</>],
              ["Most I will stake on one trade", <>KES 50</>],
              ["When I stop for the day", <>After 30 minutes, or after losing KES 250, whichever comes first</>],
              ["When I will not trade", <>After 10 pm EAT, on Sundays, and whenever I have been drinking or feel upset</>],
              ["How I will check myself", <>Every Sunday I will look at my trade history, including the total of my losses</>],
              ["Who I will tell", <>A family member, who can ask me how I am keeping to this plan</>],
            ]}
          />
        </>
      ),
    },
    {
      id: "warning-signs",
      title: "6. Warning signs checklist",
      body: (
        <>
          <h3>6.1 Ask yourself these questions</h3>
          <p>Answer honestly. Do any of these apply to you?</p>
          <ul>
            <li>I trade for longer, or with larger stakes, than I planned.</li>
            <li>I have increased my stakes, or kept trading, to win back money I lost.</li>
            <li>I have deposited again soon after losing, or I have broken my own budget.</li>
            <li>I have borrowed money, used credit or sold something to trade, or I am thinking about doing so.</li>
            <li>I have used money meant for rent, food, school fees, bills, savings or my business.</li>
            <li>I think about trading most of the day, or I feel restless or irritable when I cannot trade.</li>
            <li>I trade to escape stress, boredom, loneliness or low mood.</li>
            <li>I trade late at night, and it is affecting my sleep.</li>
            <li>I hide my trading, or how much I have lost, from my family or friends, or I have lied about it.</li>
            <li>Trading is affecting my work, studies, relationships or ability to pay my bills.</li>
            <li>I feel guilty, ashamed or anxious about my trading.</li>
            <li>I have tried to cut down or stop, and could not.</li>
            <li>I trade only to keep a streak going or to reach the next level or badge.</li>
            <li>Someone close to me has told me they are worried about my trading.</li>
          </ul>

          <h3>6.2 What to do if any of these apply</h3>
          <Callout tone="risk" title="If even one of these applies to you, stop and take action">
            <ol>
              <li>Stop trading now. Sign out and close the platform.</li>
              <li>Talk to someone you trust about what is happening (section 13).</li>
              <li>
                Ask us to suspend your account (section 9), or close it permanently (section 10). If you are not sure, ask for a suspension
                first.
              </li>
              <li>If you have debts because of trading, get advice early (section 13.4).</li>
              <li>Consider speaking to a doctor or a qualified counsellor (section 13.2).</li>
            </ol>
          </Callout>
          <p>
            Ticking a box on this list does not mean that you have a medical condition. It means your trading may be causing you harm, and that
            it is time to take a break and talk to someone.
          </p>
        </>
      ),
    },
    {
      id: "age-restriction",
      title: "7. Age restriction: 21 and over",
      body: (
        <>
          <h3>7.1 Our minimum age</h3>
          <p>
            You must be at least 21 years old to open or use a NeuroOption account, including a demo account. When you register, you must tick
            a box to confirm that you are 21 or older and that you agree to the Terms and Conditions and the Privacy Policy. If you are under 21,
            you must not register and you must not use the platform, even with someone else's permission.
          </p>

          <h3>7.2 Why our minimum age is 21</h3>
          <p>
            Kenyan law treats you as an adult from the age of 18. We have chosen a higher minimum age of 21 because fixed-time options are
            high-risk, fast and can become compulsive, and because younger adults are more likely to have little financial experience, irregular
            income and fewer savings to fall back on.
          </p>

          <h3>7.3 How we check age today</h3>
          <p>We want to be clear about the limits of what we do today:</p>
          <ul>
            <li>We do not ask for your date of birth when you register, and we do not check your age automatically.</li>
            <li>We rely on your confirmation at registration that you are 21 or older.</li>
            <li>Uploading identity documents in the platform is not available yet.</li>
          </ul>
          <p>
            We may ask you at any time for an identity document, such as your national identity card or passport, to confirm your age. When
            real-money accounts are available, we may ask for this before you deposit or withdraw. The{" "}
            <PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink> explains how we verify identity.
          </p>

          <h3>7.4 If we believe an account holder is under 21</h3>
          <p>If we have reasonable grounds to believe that an account holder is under 21, for example because they or someone else tells us, we will:</p>
          <ul>
            <li>suspend the account while we look into it (section 9.4 explains what a suspension does today), and may ask for proof of age;</li>
            <li>close the account if the holder does not give us satisfactory proof of age within a reasonable time, or if we confirm that they are under 21;</li>
            <li>
              when real-money accounts are available, deal with any money in the account as the Terms and Conditions set out for accounts that
              we close, after any checks the law requires us to carry out; and
            </li>
            <li>keep the records we are required to keep by law, as described in the Account Closure and Data Retention Policy.</li>
          </ul>
          <p>Virtual funds in a demo account end when the account is closed and have no value.</p>

          <h3>7.5 Advice for parents and guardians</h3>
          <p>You can help prevent young people from using trading platforms, including ours:</p>
          <ul>
            <li>
              Talk to the young people in your care about online trading and betting, how quickly money can be lost, and how advertisements and
              social media posts can make it look easy.
            </li>
            <li>Use the parental controls, content filters and website-blocking settings available on phones, computers and home internet routers.</li>
            <li>
              Keep your own phone, M-Pesa PIN, email and passwords private. Never let a young person use your M-Pesa account, your phone or your
              NeuroOption account.
            </li>
            <li>
              On a shared device, untick "Remember me" when you sign in to NeuroOption, so that you are signed out when the browser is closed,
              and always sign out when you finish. Do not let the browser save your NeuroOption password.
            </li>
            <li>
              Watch for signs such as unexplained M-Pesa transactions, requests to borrow money, secretive use of a phone late at night, or
              talk of quick profits from trading.
            </li>
          </ul>
          <p>
            Letting anyone else use your account breaks the Terms and Conditions. If you believe that someone under 21 is using a NeuroOption
            account, please tell us. If you have an account, open a ticket on the <a href="/support">Support</a> page. If you do not, email{" "}
            <Co field="supportEmail" />. Give us as much detail as you can, such as the name or email address on the account. We will look into
            every report and act under section 7.4. We will not tell the account holder who made the report, unless the law requires us to.
          </p>
        </>
      ),
    },
    {
      id: "tools-available",
      title: "8. Tools available on NeuroOption today",
      body: (
        <>
          <h3>8.1 Summary</h3>
          <p>This table lists every responsible-trading tool and option that exists on the platform today, and where to find it.</p>
          <Table
            head={["Tool", "What it does", "Where"]}
            rows={[
              [
                "Demo account",
                <>Lets you learn and practise with virtual US dollars, using the same prices and payouts as real-money trading.</>,
                <><a href="/trading">Trading</a> (demo is the default account)</>,
              ],
              [
                "Trade History",
                <>Shows your most recent completed trades and their results, with totals of trades, wins, losses and net profit or loss.</>,
                <><a href="/history">History</a></>,
              ],
              ["Open Trades", <>Shows trades that are still running.</>, <><a href="/open-trades">Open Trades</a></>],
              [
                "Transaction history",
                <>Shows your deposits and withdrawals, when real-money accounts are available.</>,
                <>The History tab on the <a href="/finance">Finance</a> page</>,
              ],
              [
                "Asking us to suspend your account",
                <>A request, through a support ticket, for our authorised staff to mark your account as suspended. See section 9 for what this does and does not do today.</>,
                <><a href="/support">Support</a></>,
              ],
              [
                "Deleting your account",
                <>Closes your account permanently. It cannot be undone.</>,
                <><a href="/delete-account">Delete account</a></>,
              ],
              [
                "Unsubscribing from the newsletter",
                <>Stops our marketing newsletter. Every newsletter email contains an unsubscribe link.</>,
                <>The link in any newsletter email</>,
              ],
            ]}
          />

          <h3>8.2 The demo account</h3>
          <ul>
            <li>The demo account starts with USD 70,000 of virtual funds.</li>
            <li>
              You can top up the virtual balance only while it is below USD 10,000, in fixed amounts of USD 20,000, USD 50,000, USD 60,000 or
              USD 100,000.
            </li>
            <li>Virtual funds have no value, cannot be withdrawn and cannot be moved to a real-money account.</li>
            <li>Results on the demo account do not guarantee or predict results with real money.</li>
          </ul>
          <p>Section 5.6 explains how to use the demo account in a way that prepares you realistically.</p>

          <h3>8.3 Reviewing your trade history</h3>
          <p>
            The Trade History page shows your most recent completed trades (currently up to your last 100), with the instrument, direction,
            entry and closing prices, stake, payout percentage, profit or loss, result and the time each trade closed, in East Africa Time
            (EAT). At the top of the page you can see the number of trades, the number won and lost, and the net profit or loss for the trades
            shown. You can filter the list to show only won, lost, BUY or SELL trades.
          </p>
          <p>
            Use it to check yourself regularly against your plan. Look first at the net figure and the number of losing trades, not only at your
            wins, and compare your win rate with the break-even win rate. If you want a fuller record of your trading than the page shows, ask
            us through <a href="/support">Support</a>.
          </p>

          <h3>8.4 Tools that are not available yet</h3>
          <Callout tone="warn" title="These tools do not exist on NeuroOption today">
            <ul>
              <li>deposit limits;</li>
              <li>loss limits or stake limits that you set for yourself;</li>
              <li>session time limits, or reminders of how long you have been trading;</li>
              <li>cooling-off periods or "time-out" buttons that you can switch on yourself;</li>
              <li>self-exclusion, meaning a tool that stops you from using the platform, or from opening a new account, for a fixed period; and</li>
              <li>
                reality checks or warnings during trading. The platform does not interrupt your trading to warn you, and the only cap on a
                stake is your available balance.
              </li>
            </ul>
            <p>
              We are considering tools of this kind for the future. Until they exist, please do not rely on the platform to stop you: set your
              own limits (section 5) and use the options in sections 9 and 10. If we introduce any of these tools, we will update this policy
              and describe exactly how they work.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "suspending-your-account",
      title: "9. Asking us to suspend your account",
      body: (
        <>
          <h3>9.1 When to ask</h3>
          <p>
            Ask us to suspend your account if you want to take a break from trading, if any of the warning signs in section 6 apply to you, or if
            you are not yet sure whether you want to close your account permanently. A suspension can be ended later; deleting your account
            cannot be undone.
          </p>

          <h3>9.2 How to ask</h3>
          <ol>
            <li>Sign in and go to the <a href="/support">Support</a> page.</li>
            <li>Choose "New ticket", and use a subject such as "Please suspend my account".</li>
            <li>
              Tell us how long you want the suspension to last, for example 7 days, 30 days, 6 months, or until you tell us otherwise. You do not
              have to give a reason, but if you are suspending your account because of concerns about your trading, telling us helps us support
              you.
            </li>
            <li>Send the ticket. Never include your password or M-Pesa PIN in a ticket.</li>
          </ol>
          <p>
            If you cannot sign in, email us at <Co field="supportEmail" /> from the email address registered on your account.
          </p>

          <h3>9.3 What we will do</h3>
          <ul>
            <li>
              Our support team will pass your request to a member of staff who is authorised to change account status. That person will mark your
              account as suspended and record the reason. Account status changes made in the administration console are recorded in our audit log, with the name of the
              staff member who made them.
            </li>
            <li>We will act on your request as soon as we can, and at the latest by the end of the next business day after we receive it.</li>
            <li>We will confirm in your ticket when your account has been suspended, and we will email you to let you know that we have replied.</li>
            <li>We will not try to talk you out of a suspension, and we will not offer you anything to change your mind.</li>
          </ul>
          <p>In this policy, a business day means Monday to Friday, excluding public holidays in Kenya, in East Africa Time (EAT).</p>

          <h3>9.4 What a suspension does and does not do today</h3>
          <Callout tone="warn" title="A suspension does not yet block sign-in or demo trading automatically">
            <p>
              Today, marking your account as suspended records your request and tells our staff to treat your account as suspended. It does not
              yet automatically stop you from signing in or from placing trades on the demo account. If you want to be certain that you can no
              longer use your account, the only option today is to delete it (section 10), which is permanent. You can also take the practical
              steps in section 9.6.
            </p>
          </Callout>
          <p>When real-money accounts are available, while your account is suspended at your request:</p>
          <ul>
            <li>we will not accept deposits to your account and we will not accept real-money trades from it;</li>
            <li>trades already accepted before the suspension will run to expiry and settle normally, because trades cannot be closed early; and</li>
            <li>
              you will still be able to ask to withdraw your available balance, subject to the checks described in the{" "}
              <PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink>.
            </li>
          </ul>

          <h3>9.5 Ending a suspension</h3>
          <ul>
            <li>We will not end a suspension that you asked for before the end of the period you chose, even if you ask us to.</li>
            <li>
              When that period has ended, or if you chose "until I tell you otherwise", you can ask us to end the suspension through a support
              ticket. We will not end it sooner than 24 hours after your request, so that you have time to be sure.
            </li>
            <li>
              Before we end it, we may ask you a few questions about your reasons and remind you of this policy. If you told us that trading was
              harming you, we may decline to end the suspension, or may close your account under section 11.
            </li>
            <li>Suspensions do not end automatically. Your account stays suspended until our staff change its status.</li>
          </ul>

          <h3>9.6 Practical steps that help</h3>
          <ul>
            <li>Sign out of NeuroOption on every device you use.</li>
            <li>Delete saved NeuroOption passwords from your browser, and remove any bookmark or home-screen shortcut.</li>
            <li>Use website-blocking settings or apps on your phone and computer to block trading and betting sites.</li>
            <li>Unsubscribe from our newsletter using the link in any newsletter email.</li>
            <li>Ask someone you trust to check in with you during the break.</li>
          </ul>
        </>
      ),
    },
    {
      id: "closing-your-account",
      title: "10. Closing your account permanently",
      body: (
        <>
          <h3>10.1 How to close your account</h3>
          <p>
            You can close your account yourself at any time on the <a href="/delete-account">Delete account</a> page. You will be asked to choose
            a reason (this is optional, and the choices include "I want to stop trading to protect my finances" and "I'm taking a break and may
            come back"), then to type the word DELETE and enter your password to confirm.
          </p>

          <h3>10.2 When you cannot close your account yet</h3>
          <p>The page will not let you close your account while any of these apply:</p>
          <ul>
            <li>your real-money account holds a balance of KES 0.01 or more;</li>
            <li>some of your money is reserved for a pending withdrawal or an open position;</li>
            <li>you have any open trades, on the demo account or a real-money account;</li>
            <li>a deposit or withdrawal is still being processed; or</li>
            <li>the account is a staff account.</li>
          </ul>
          <p>
            The page tells you what is in the way and links you to the right place to deal with it. A balance of virtual funds in your demo
            account does not prevent you from closing your account. If you want to stop trading straight away but cannot close your account yet,
            ask us to suspend it (section 9) while you wait for open trades and payments to finish.
          </p>

          <h3>10.3 What happens when you close your account</h3>
          <ul>
            <li>Closing your account is permanent. Our support team cannot restore it.</li>
            <li>You are signed out everywhere immediately, and your password stops working.</li>
            <li>Your name, email address and phone number are removed from your profile, and virtual funds in your demo account end.</li>
            <li>We send you an email confirming the closure, with a reference number.</li>
            <li>
              We keep the records the law requires us to keep, such as your trades, deposits, withdrawals and support tickets, for as long as
              the law requires. The <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink> explains this in
              full.
            </li>
          </ul>

          <h3>10.4 What closing your account does not do</h3>
          <Callout tone="warn" title="Closing your account is not self-exclusion">
            <ul>
              <li>
                Nothing on the platform currently stops you from opening a new account later, including with the same email address. If you are
                worried that you may come back, put the practical steps in section 9.6 in place and tell someone you trust.
              </li>
              <li>
                Closing your account does not unsubscribe you from our newsletter. Use the unsubscribe link in any newsletter email as well.
              </li>
            </ul>
          </Callout>
        </>
      ),
    },
    {
      id: "signs-of-harm",
      title: "11. What we will do if we see signs of harm",
      body: (
        <>
          <h3>11.1 How we may become aware</h3>
          <p>
            We do not currently use automated systems to detect harmful trading. Our staff may become aware of signs of harm when, for example:
          </p>
          <ul>
            <li>you, or someone close to you, tells us about it;</li>
            <li>we read or reply to your support tickets;</li>
            <li>we review your account for another reason, such as identity verification or a suspected breach of the Terms and Conditions;</li>
            <li>we review a withdrawal request, when real-money accounts are available, since every withdrawal is reviewed by a member of our staff; or</li>
            <li>someone close to you contacts us with a concern (section 13.5).</li>
          </ul>
          <p>
            We do not currently review clients' trading activity on a routine basis, so we may not see a pattern of stakes, deposits or trading
            hours unless one of the situations above leads us to look at your account.
          </p>

          <h3>11.2 Signs we take seriously if we see them</h3>
          <ul>
            <li>you tell us that you have lost control of your trading, that you are in financial difficulty, or that trading is harming you or your family;</li>
            <li>you tell us that you have borrowed money to trade, or are trading with money meant for essentials;</li>
            <li>you show distress, anger or desperation in your messages to us, or say that you need to win back losses;</li>
            <li>you make repeated deposits soon after losing, or deposit again soon after withdrawing, when real-money accounts are available;</li>
            <li>you sharply increase your stakes after losses, or trade for very long periods, including through the night;</li>
            <li>you repeatedly ask us to end a suspension early, or to reopen your account after closing it; or</li>
            <li>there are signs that you may be under 21 (section 7.4).</li>
          </ul>

          <h3>11.3 Steps we may take</h3>
          <p>
            What we do will depend on what we see and on how serious it is. We may take one or more of the following steps. Where we can, we will
            start with the least restrictive step that is likely to help.
          </p>
          <Table
            head={["Step", "What it means", "Example of when"]}
            rows={[
              [
                "Contact you",
                <>We send you a message through a support ticket or by email to check in, point you to this policy and to sources of help, and ask whether you would like a suspension.</>,
                <>You mention in a ticket that you have been trading all night to win back losses.</>,
              ],
              [
                "Suggest a break",
                <>We suggest that you take a break, use only the demo account, or ask us to suspend your account.</>,
                <>Your messages suggest you are trading when upset.</>,
              ],
              [
                "Decline deposits",
                <>When real-money accounts are available, we decline further deposits for a period.</>,
                <>You tell us you are depositing money meant for rent.</>,
              ],
              [
                "Restrict or suspend your account",
                <>We restrict some services or suspend your account, and tell you why and for how long.</>,
                <>You tell us you have taken loans to trade and cannot stop.</>,
              ],
              [
                "Close your account",
                <>We close your account under the Terms and Conditions.</>,
                <>Harm continues after a suspension, or you are under 21.</>,
              ],
            ]}
          />
          <p>
            We may take these steps where we reasonably believe that trading is causing you, or people who depend on you, serious harm. This is
            in addition to the grounds for restricting, suspending or closing an account set out in the Terms and Conditions. Restrictions and
            suspensions we set for these reasons are subject to the same limitations described in section 9.4.
          </p>

          <h3>11.4 Your money and your rights</h3>
          <ul>
            <li>
              When real-money accounts are available, if we restrict, suspend or close your account under this section, you will still be able to
              withdraw your available balance, subject to the checks in the Deposit, Withdrawal and Refund Policy. We will not hold back money
              you are owed because of this policy.
            </li>
            <li>We will tell you what we have done and why, unless the law prevents us from doing so.</li>
            <li>
              If you disagree with our decision, reply in your ticket and tell us why, and we will review it. You can also make a complaint under
              our <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>.
            </li>
          </ul>

          <h3>11.5 If you tell us you are thinking about harming yourself</h3>
          <p>
            If you tell us that you are thinking about harming yourself or ending your life, we will urge you to contact the emergency services
            or go to the nearest hospital straight away, and to talk to someone you trust. Where we believe there is a serious and immediate risk
            to your life, we may share the information needed to protect you with the emergency services, as the Data Protection Act 2019
            allows.
          </p>
        </>
      ),
    },
    {
      id: "vulnerable-customers",
      title: "12. Customers in vulnerable circumstances",
      body: (
        <>
          <h3>12.1 What we mean</h3>
          <p>
            Anyone can find themselves in vulnerable circumstances, sometimes for a short time and sometimes for longer. Circumstances that can
            make trading especially harmful, or make it harder for you to make decisions in your own interests, include:
          </p>
          <ul>
            <li>a gambling problem, now or in the past, or another addiction;</li>
            <li>mental health conditions such as depression or anxiety, or a period of severe stress;</li>
            <li>serious or long-term physical illness, or a disability that affects how you use the platform;</li>
            <li>bereavement, divorce or separation, or other major life events;</li>
            <li>losing your job or income, money problems or debt;</li>
            <li>caring for others, especially with limited income;</li>
            <li>difficulty reading English, or limited experience of online services or financial products; and</li>
            <li>being pressured or controlled by someone else, including being pushed to trade or to hand over money.</li>
          </ul>

          <h3>12.2 Telling us</h3>
          <p>
            You do not have to tell us about your circumstances. If you choose to, open a ticket on the <a href="/support">Support</a> page and
            tell us as much or as little as you are comfortable with, and how we can help.
          </p>

          <h3>12.3 How we will support you</h3>
          <ul>
            <li>We will treat you with respect and patience, and explain things in plain language.</li>
            <li>We will give you more time to respond to us where you need it.</li>
            <li>
              Our communications are in English. If you would find it easier to communicate in Kiswahili, tell us in your ticket and we will try to
              help.
            </li>
            <li>We will not encourage you to trade, to deposit, or to move from the demo account to a real-money account.</li>
            <li>
              Where we think it is in your interests, we may suggest that you use only the demo account, take a break, or suspend your account, and
              we may take the steps in section 11.
            </li>
          </ul>

          <h3>12.4 Someone helping you</h3>
          <p>
            Only you may use your account and trade through it. However, you may ask someone you trust, such as a family member or a carer, to
            help you communicate with us. Tell us in a support ticket who they are and what you would like them to help with. We will need your
            permission before we discuss your account with them, and we may ask you to confirm it. We will never let another person trade,
            deposit or withdraw on your behalf.
          </p>

          <h3>12.5 How we handle what you tell us</h3>
          <p>
            Information about your health, including information about a gambling problem or an addiction, is sensitive personal data under the
            Data Protection Act 2019. We will use it only to support you and protect you from harm, share it within NeuroOption only with staff
            who need it for that purpose, and never use it for marketing. Your support tickets and messages are kept even if you later close your
            account. The <PolicyLink slug="privacy">Privacy Policy</PolicyLink> explains how we handle personal information and your rights,
            including your right to complain to the Office of the Data Protection Commissioner (ODPC).
          </p>
        </>
      ),
    },
    {
      id: "getting-help",
      title: "13. Getting help",
      body: (
        <>
          <h3>13.1 Talk to someone you trust</h3>
          <p>
            Problems with trading or gambling are common, and they are easier to deal with when they are shared. Talking to a family member, a
            friend, a faith leader or a community elder you trust is often the most helpful first step. Tell them honestly how much time and
            money you have spent, and ask them to help you keep to your decision to take a break or stop.
          </p>

          <h3>13.2 Professional help</h3>
          <p>
            A doctor, a qualified counsellor or a psychologist can help you understand why trading has become hard to control and how to stop.
            You can ask at a hospital, health centre or clinic about counselling and mental health services. Problem gambling and compulsive
            trading are recognised problems that can be treated, and asking for help is nothing to be ashamed of.
          </p>

          <h3>13.3 If you are in crisis</h3>
          <Callout tone="risk" title="If you feel unsafe">
            <p>
              If you are thinking about harming yourself, or you feel you cannot cope, contact the emergency services or go to the nearest
              hospital emergency department now, and tell someone close to you. Do not wait for a reply from us.
            </p>
          </Callout>

          <h3>13.4 Money and debt</h3>
          <ul>
            <li>Stop trading before you try to deal with the debt. Do not try to trade your way out of debt.</li>
            <li>
              List what you owe and to whom, and contact your lenders early to explain your situation and ask about repayment arrangements. Lenders
              are often more flexible when you contact them before you miss payments.
            </li>
            <li>Do not take a new loan to repay an old one without getting advice first.</li>
            <li>If you can, ask someone you trust to help you manage your money for a while.</li>
          </ul>

          <h3>13.5 If you are worried about someone else</h3>
          <ul>
            <li>Choose a calm moment to talk, and tell them what you have noticed and why you are worried, without blaming them.</li>
            <li>Encourage them to read this policy, to ask us for a suspension, and to speak to a doctor or counsellor.</li>
            <li>Do not lend them money to trade or to cover trading losses.</li>
            <li>Look after yourself too, and consider talking to a counsellor about the effect on you.</li>
          </ul>
          <p>
            For privacy reasons we cannot discuss another person's account with you without their permission, but we will read any concern you
            send us. If you believe that someone is being harmed by trading on NeuroOption, or is under 21, email <Co field="supportEmail" /> or,
            if you have an account, open a ticket on the <a href="/support">Support</a> page.
          </p>
        </>
      ),
    },
    {
      id: "marketing-principles",
      title: "14. Our marketing principles",
      body: (
        <>
          <h3>14.1 Why we have marketing rules</h3>
          <p>
            Because we earn when clients lose, we have a reason to make trading look more attractive than it is. These rules apply to our
            website, emails, social media posts, advertisements and any other promotional material, whoever produces it for us.
          </p>

          <h3>14.2 No marketing to anyone under 21</h3>
          <ul>
            <li>We will not design, target or place marketing so that it appeals mainly to people under 21.</li>
            <li>
              We will not advertise in places, programmes, games, apps or websites aimed mainly at children or young people, or at schools,
              colleges or universities.
            </li>
            <li>We will not use people who are, or appear to be, under 25 in our marketing.</li>
            <li>If we learn that a newsletter subscriber is under 21, we will remove them from our mailing list.</li>
          </ul>

          <h3>14.3 No misleading claims</h3>
          <Table
            head={["We will not", "What we will do instead"]}
            rows={[
              [
                "Claim or suggest that profits are guaranteed, likely or easy",
                <>Make clear that you can lose the whole of every stake and that most people lose money over time.</>,
              ],
              [
                "Describe real-money trading as safe, low-risk or risk-free",
                <>Use "risk-free" only to describe the demo account, and make clear that it uses virtual funds with no value.</>,
              ],
              [
                "Suggest that trading is a way to earn an income, pay bills, clear debts or escape money problems",
                <>Describe trading as a high-risk activity that is only suitable with money you can afford to lose.</>,
              ],
              [
                "Describe our synthetic prices as real market prices, or suggest that you are trading on real-world markets",
                <>State that all instruments are synthetic OTC instruments priced by NeuroOption.</>,
              ],
              [
                "Use demo results, or selected winning trades, as evidence of what you can achieve",
                <>State that demo results and past results do not predict future results.</>,
              ],
              [
                "Hide or play down that NeuroOption is the counterparty to every trade",
                <>Disclose it plainly where it is relevant.</>,
              ],
              [
                "Say or suggest that we are licensed, regulated or approved, except as stated in section 1.4",
                <>Describe our regulatory status only as stated in section 1.4.</>,
              ],
              [
                "Use pressure, such as countdowns, \"last chance\" messages or prompts to deposit after a loss",
                <>Let you decide in your own time whether to trade.</>,
              ],
            ]}
          />
          <p>All our marketing will include a clear risk warning.</p>

          <h3>14.4 Bonuses, promotions and partners</h3>
          <p>
            We do not offer bonuses or promotions today, and no affiliate or introducing-partner programme is live. Pages on the platform marked
            "coming soon" or showing illustrative examples, such as tournaments, signals, social trading and express trades, are not live
            services. If we introduce any of these, they will follow this policy, and anyone who promotes NeuroOption for us will be required to
            follow the rules in this section. We will not offer a bonus or promotion to anyone who has asked us to suspend or close their account,
            or who has told us that trading is harming them.
          </p>

          <h3>14.5 Marketing emails</h3>
          <ul>
            <li>We send our newsletter only to people who subscribe to it, and every newsletter email contains a link to unsubscribe.</li>
            <li>We do not make marketing phone calls or send marketing text messages.</li>
            <li>
              Emails that you need in order to use your account, such as verification, password, deposit, withdrawal and account-closure emails,
              are not marketing, and they will not encourage you to trade.
            </li>
            <li>
              We will not knowingly send marketing to anyone who has asked us to suspend or close their account, or who has told us that trading is
              harming them. If you are in this position, please also use the unsubscribe link, because closing your account does not unsubscribe
              you automatically (section 10.4).
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "applying-this-policy",
      title: "15. How we apply this policy",
      body: (
        <>
          <h3>15.1 Our staff</h3>
          <ul>
            <li>
              Staff who handle support tickets, account reviews and, when real-money accounts are available, withdrawals will be made familiar with
              this policy, the warning signs in section 6 and the steps in section 11.
            </li>
            <li>Our staff will not encourage you to trade, to deposit more, to use shorter expiries or to raise your stakes.</li>
            <li>
              We do not pay staff bonuses, commission or other rewards linked to clients' losses or to how much clients trade, as the Conflicts of
              Interest Policy explains.
            </li>
          </ul>

          <h3>15.2 Records</h3>
          <p>
            We keep records of suspension and closure requests in your support tickets, and changes to your account status made in the administration console are recorded in our
            audit log with the reason given. We use these records to make sure that requests are acted on and to review how well this policy is
            working.
          </p>

          <h3>15.3 Review</h3>
          <p>
            We will review this policy at least once a year, and sooner if we change the product, introduce new features or tools, or if the law
            changes.
          </p>
        </>
      ),
    },
    {
      id: "changes",
      title: "16. Changes to this policy",
      body: (
        <>
          <p>
            We may update this policy, for example when we introduce new responsible-trading tools, when real-money accounts become available, or
            when the law changes. The date at the top of this page shows when it was last updated. If we make a significant change, we will take
            reasonable steps to tell you, for example by email or a notice on the platform. We will not reduce the protections in this policy for a
            suspension or closure you have already asked for.
          </p>
        </>
      ),
    },
    {
      id: "contact",
      title: "17. Contact us",
      body: (
        <>
          <Table
            head={["For", "How to reach us"]}
            rows={[
              [
                "Asking for a suspension, or any concern about your trading",
                <><a href="/support">Support</a> in the platform when you are signed in, or <Co field="supportEmail" /></>,
              ],
              ["Reporting that someone under 21 may be using an account", <><Co field="supportEmail" />, or <a href="/support">Support</a> if you have an account</>],
              ["Phone", <Co field="supportPhone" />],
              ["Help and answers to common questions", <>The <a href="/help">Help centre</a></>],
              [
                "Complaints",
                <><Co field="complaintsEmail" />, following our <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink></>,
              ],
              [
                "Personal data and privacy",
                <><Co field="privacyEmail" /> (Data Protection Officer: <Co field="dataProtectionOfficer" />)</>,
              ],
              ["Formal legal notices", <><Co field="legalName" />, <Co field="registeredAddress" /></>],
            ]}
          />
        </>
      ),
    },
  ],
};

export default policy;
