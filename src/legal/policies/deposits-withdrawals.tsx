import type { Policy } from "../types";
import { Callout, Co, Definitions, PolicyLink, Table } from "../components";

const policy: Policy = {
  slug: "deposits-withdrawals",
  title: "Deposit, Withdrawal and Refund Policy",
  summary:
    "How money moves into and out of a NeuroOption real account: M-Pesa deposits and withdrawals in KES, the limits, checks and timings that apply, and when a deposit can be refunded or corrected. Demo funds can never be deposited or withdrawn.",
  updated: "2026-10-16",
  sections: [
    {
      id: "about-this-policy",
      title: "1. About this policy",
      body: (
        <>
          <p>
            In this policy, "NeuroOption", "we", "us" and "our" mean <Co field="legalName" /> (trading as NeuroOption), a company incorporated in <Co field="jurisdiction" /> with registration number <Co field="registrationNumber" /> and its registered office at <Co field="registeredAddress" />. "You" and "your" mean the person who holds a NeuroOption account.
          </p>

          <h3>1.1 What this policy covers</h3>
          <p>
            This policy explains how money moves into and out of a NeuroOption real account: the payment method we accept, how deposits and withdrawals work step by step, the limits that apply, the checks we carry out before we pay you, how long payments take, what happens when a payment fails or is wrong, when a deposit can be refunded, and how we correct mistakes. It also explains what you can and cannot do with demo funds.
          </p>

          <h3>1.2 How this policy fits with our other documents</h3>
          <p>
            This policy forms part of your agreement with us under the <PolicyLink slug="terms">Terms and Conditions</PolicyLink> and gives the full detail behind section 9 of those Terms. If two documents say different things about the same matter, the order of priority in section 1.3 of the Terms and Conditions applies. Please also read:
          </p>
          <ul>
            <li>
              the <PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink>, which explains identity verification and the anti-money-laundering checks that can affect deposits and withdrawals;
            </li>
            <li>
              the <PolicyLink slug="risk-disclosure">Risk Disclosure</PolicyLink> and the <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink>, which explain the risks of trading and how trades are priced and settled;
            </li>
            <li>
              the <PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink>, which explains why we gain when clients lose;
            </li>
            <li>
              the <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink> and the <PolicyLink slug="privacy">Privacy Policy</PolicyLink>, which explain what happens to your money and your records when an account closes; and
            </li>
            <li>
              the <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>, which explains how to complain if something goes wrong.
            </li>
          </ul>

          <h3>1.3 Our regulatory status</h3>
          <Table
            head={["Item", "Details"]}
            rows={[
              ["Regulator", <Co field="regulator" />],
              ["Licence", <Co field="licence" />],
            ]}
          />
          <p>
            Do not assume that NeuroOption is licensed, regulated or supervised by any authority beyond what is stated in this table. Nothing in this policy limits any right you have under Kenyan law that cannot be limited by agreement, including under the Consumer Protection Act 2012.
          </p>

          <Callout tone="risk" title="Key points">
            <ul>
              <li>
                <strong>Demo funds are not money.</strong> They can never be deposited, withdrawn or exchanged for money.
              </li>
              <li>
                <strong>M-Pesa is the only payment method.</strong> Other methods shown as "Coming soon" are not available.
              </li>
              <li>
                <strong>Your own name only.</strong> You must pay from, and be paid to, an M-Pesa line registered in your own name.
              </li>
              <li>
                <strong>Deposits are credited only after Safaricom confirms the payment.</strong> Every withdrawal is reviewed by NeuroOption staff and is typically paid within 24 to 48 hours, but this is not guaranteed.
              </li>
              <li>
                <strong>No NeuroOption fees.</strong> We charge nothing to deposit or withdraw. M-Pesa may charge its own tariffs.
              </li>
              <li>
                <strong>Trading losses are not refundable.</strong> All prices on NeuroOption come from our own synthetic price engine, not from any real market, and NeuroOption is the counterparty to every trade, so we gain when you lose.
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
          <p>In this policy, the following words have these meanings. Other capitalised words have the meanings given in the Terms and Conditions.</p>
          <Definitions
            items={[
              ["Available balance", <>The part of your real-account balance that you can use to trade or withdraw. It does not include locked funds or the stakes of trades that are still open.</>],
              ["Demo account and virtual funds", <>Your "QT Demo" account and the virtual US dollars (USD) in it. Virtual funds are for practice only and have no monetary value.</>],
              ["Deposit", <>A payment of real money from your M-Pesa account into your NeuroOption real account.</>],
              ["EAT", <>East Africa Time (UTC+3). All times in this policy, on the platform and in our emails are EAT.</>],
              ["Locked funds", <>Money in your real account that is reserved and cannot be used or withdrawn, in particular the amount of a withdrawal while we review and pay it. The Finance page shows it as "reserved for withdrawals".</>],
              ["M-Pesa", <>The mobile money service operated by Safaricom.</>],
              ["M-Pesa line", <>A Safaricom mobile number that is registered for M-Pesa.</>],
              ["M-Pesa transaction code", <>The reference code of letters and numbers that M-Pesa gives each transaction and shows in its confirmation SMS. Our records and emails call it the M-Pesa receipt or reference.</>],
              ["Real account", <>Your "QT Real" account, held in Kenya Shillings (KES), which you fund with real money.</>],
              ["Refund", <>The return of all or part of a specific deposit to the M-Pesa line it came from, for one of the reasons in section 14. A refund is not the same as a withdrawal.</>],
              ["Reversal", <>The undoing of an M-Pesa transaction, either by M-Pesa itself or at the request of the person who made it.</>],
              ["STK Push", <>A payment prompt that M-Pesa sends to your phone at our request. You approve it by entering your M-Pesa PIN on your own phone.</>],
              ["Withdrawal", <>A payment, at your request, of money from your available balance to your M-Pesa line.</>],
              ["Working day", <>Monday to Friday, excluding public holidays in Kenya.</>],
            ]}
          />
        </>
      ),
    },
    {
      id: "availability",
      title: "3. Availability of real-money services and demo funds",
      body: (
        <>
          <h3>3.1 Real-money services</h3>
          <p>
            Real-money deposits, withdrawals and trades take place in your real account, which is held in Kenya Shillings (KES) (section 4). Deposits and withdrawals are made by M-Pesa only, started from the <a href="/finance">Finance</a> page (section 5).
          </p>

          <h3>3.2 How this policy applies</h3>
          <p>
            This policy describes how deposits, withdrawals and refunds work on your real account. A payment method is available only if this policy says it is (section 5.2), and deposits and withdrawals depend on M-Pesa and Safaricom's systems (section 8.7).
          </p>

          <h3>3.3 Demo funds cannot be deposited or withdrawn</h3>
          <ul>
            <li>
              Your demo account starts with USD 70,000 of virtual funds. You can top it up only while its balance is below USD 10,000, and only in the fixed amounts offered on the platform (currently USD 20,000, 50,000, 60,000 or 100,000). A demo top-up is free and is not a deposit.
            </li>
            <li>You cannot put real money into a demo account.</li>
            <li>
              You cannot withdraw, transfer, sell or exchange virtual funds, or any virtual profit, for money, real-account credit or anything else. Demo results are never paid out and do not predict results in a real account.
            </li>
            <li>Visitors who are not signed in share one public demo account. Nothing in it belongs to any individual.</li>
          </ul>

          <Callout tone="warn" title="Beware of scams">
            <p>
              Nobody can turn demo funds into money. NeuroOption will never ask you to pay a fee to "activate" or "unlock" a withdrawal, to upgrade your account, or to send money to a personal number in our name. If anyone asks you to do this, it is a scam: do not pay, and report it to us through <a href="/support">Support</a>.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "real-account-and-currency",
      title: "4. Your real account, balance and currency",
      body: (
        <>
          <h3>4.1 Currency</h3>
          <p>
            Your real account is held in Kenya Shillings (KES). Deposits, your balance, stakes, payouts and withdrawals are all in KES, so no currency conversion takes place and we charge nothing for conversion. Where the platform shows an amount converted into another currency, it uses a fixed indicative rate for information only. That rate is not a rate at which we deal, and it does not change the KES amount in your account.
          </p>

          <h3>4.2 How your balance moves</h3>
          <ul>
            <li>A deposit increases your available balance once Safaricom confirms the payment (section 7).</li>
            <li>
              When a trade is accepted, its stake is taken from your available balance. When the trade settles, any amount due to you is added back: your stake plus the profit for a winning trade, or your stake alone for a draw. A losing trade returns nothing. The <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink> explains how results are calculated.
            </li>
            <li>
              When you request a withdrawal, the amount moves from your available balance into locked funds until the withdrawal is completed, declined, failed or cancelled (section 10).
            </li>
          </ul>

          <h3>4.3 Your balance is not a bank deposit</h3>
          <p>
            Your real-account balance is a record of the amount we owe you under the Terms and Conditions. It is not a bank deposit or a savings account, it does not earn interest, and it is not protected by any deposit-insurance or investor-compensation scheme.
          </p>

          <h3>4.4 No bonuses and no trading conditions on withdrawals</h3>
          <p>
            We do not offer bonuses, free credit or promotions. No bonus terms, trading-volume targets or similar conditions apply to your money: you can ask to withdraw your available balance at any time, subject to the checks in sections 11 and 12.
          </p>

          <h3>4.5 Inactive accounts</h3>
          <p>
            We do not charge inactivity or dormancy fees, and your balance stays in your account if you stop trading. If we cannot contact you for a long period, we will deal with any balance as the law requires.
          </p>
        </>
      ),
    },
    {
      id: "payment-methods",
      title: "5. Payment methods",
      body: (
        <>
          <h3>5.1 M-Pesa is the only method</h3>
          <Table
            head={["Method", "Deposits", "Withdrawals", "Status"]}
            rows={[
              ["M-Pesa (Safaricom)", <>By STK Push prompt to your phone, started from the Finance page</>, <>To your own Safaricom M-Pesa line</>, <>The only method we accept</>],
              ["Airtel Money, Equitel, Binance Pay, Visa and Mastercard", <>Not accepted</>, <>Not available</>, <>Shown on the Finance page as "Coming soon". Not available.</>],
              ["Bank transfer, cash, cheque, cryptocurrency or any other method", <>Not accepted</>, <>Not available</>, <>Not offered</>],
            ]}
          />

          <h3>5.2 Methods shown as coming soon</h3>
          <p>
            A method shown as "Coming soon", or mentioned anywhere else on our website or in the app, is not available until this policy says it is. If any other page appears to suggest otherwise, this policy is correct. Before we add a new method, we will update this policy with that method's limits, timings and any charges.
          </p>

          <h3>5.3 Pay only through the platform</h3>
          <p>
            Deposits are started only from the Finance page, which asks M-Pesa to send a payment prompt to your phone. We will never ask you to send money to a personal phone number, an M-Pesa agent, a member of staff or an "account manager", or to pay us by any other route. A payment made outside the in-app deposit process is not credited automatically (section 8.5).
          </p>
        </>
      ),
    },
    {
      id: "own-name-payments",
      title: "6. Payments in your own name only",
      body: (
        <>
          <h3>6.1 The rule</h3>
          <p>
            Every deposit must come from, and every withdrawal must go to, an M-Pesa line registered in your own name: the same full legal name as on your NeuroOption account and on your national identity card or passport. You must not deposit from, or ask us to pay to, a line registered to anyone else, including a family member, friend, employer or agent.
          </p>

          <h3>6.2 Why we have this rule</h3>
          <p>
            Paying only to and from your own name protects you from fraud and from someone else taking your money, and helps us meet our anti-money-laundering obligations, which are explained in the <PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink>.
          </p>

          <h3>6.3 Payments from other people</h3>
          <ul>
            <li>We may refuse a deposit that we know, or reasonably believe, comes from someone else's M-Pesa line.</li>
            <li>
              If such a payment reaches us, we may decline to credit it, or reverse the credit, and return the money to the M-Pesa line it came from as described in section 14. We do not deduct any fee from the amount we return.
            </li>
            <li>
              If the money has already been used to trade or has been withdrawn, we may take the steps described in section 15 of this policy and section 11 of the Terms and Conditions.
            </li>
            <li>Where the law requires us to hold or report a payment instead of returning it, we will do what the law requires.</li>
          </ul>

          <h3>6.4 Showing that a line is yours</h3>
          <p>
            We may ask you at any time to show that an M-Pesa line is registered in your name, for example by sending us an M-Pesa statement for that line together with your identity document. Until you do, we may decline deposits from, or withdrawals to, that line. The platform does not check automatically whose name a line is registered in; these checks are carried out by our staff, and the rule in section 6.1 applies whether or not we have checked.
          </p>

          <h3>6.5 Using the same line for deposits and withdrawals</h3>
          <p>
            We may require you to withdraw to an M-Pesa line that you have deposited from, and we may ask you to explain a withdrawal to any other line, even one in your own name.
          </p>

          <h3>6.6 Changing your M-Pesa number</h3>
          <p>
            If your M-Pesa number changes, update the phone number in your <a href="/profile">profile</a> and tell us through <a href="/support">Support</a> before you ask us to pay a withdrawal to the new number. We may ask you to show that the new line is yours before we pay to it.
          </p>

          <Callout tone="warn" title="Your M-Pesa PIN stays with you">
            <p>
              You approve every deposit on your own phone by entering your M-Pesa PIN in the M-Pesa prompt. You never type your PIN into the NeuroOption app or website, and NeuroOption staff will never ask you for it. If you receive an M-Pesa prompt that you did not start, do not enter your PIN.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "making-a-deposit",
      title: "7. Making a deposit",
      body: (
        <>
          <h3>7.1 Before you deposit</h3>
          <ul>
            <li>You must be signed in to your own account and be eligible under section 4 of the Terms and Conditions, including being 21 or older.</li>
            <li>
              Read the <PolicyLink slug="risk-disclosure">Risk Disclosure</PolicyLink> and deposit only money you can afford to lose. Decide in advance how much you are prepared to deposit; the <PolicyLink slug="responsible-trading">Responsible Trading Policy</PolicyLink> explains how to keep control.
            </li>
            <li>Have your phone with you, switched on and with network signal, and enough money in M-Pesa for the deposit and any M-Pesa charges.</li>
            <li>We may ask you to verify your identity before you deposit (section 11).</li>
          </ul>

          <h3>7.2 Step by step</h3>
          <ol>
            <li>
              Open <a href="/finance">Finance</a> and choose the <strong>Deposit</strong> tab.
            </li>
            <li>
              Select <strong>M-Pesa</strong>. The screen shows the minimum deposit, the maximum per transaction and that NeuroOption charges no commission.
            </li>
            <li>Enter the amount in whole Kenya Shillings, or tap one of the quick amounts.</li>
            <li>
              Enter the Safaricom M-Pesa number you will pay from, for example 0712 345 678 or +254 712 345 678. If you have added a phone number to your profile it may be filled in for you; check that it is the line you want to pay from and that it is registered in your name.
            </li>
            <li>
              Press <strong>Deposit</strong>. We ask M-Pesa to send a payment prompt (STK Push) to that phone. If M-Pesa cannot start the payment, the app tells you and no money is taken.
            </li>
            <li>
              On your phone, check that the amount is the amount you entered and that you have just asked for this payment. Then enter your M-Pesa PIN to approve it, or cancel the prompt if anything is wrong.
            </li>
            <li>The app shows "Waiting for you to enter your M-Pesa PIN" and then "Confirming your payment" while we confirm the payment with Safaricom.</li>
            <li>
              When Safaricom confirms the payment, the app shows "Deposit received" with the M-Pesa receipt, your available balance increases by the amount paid, and we send you a "Deposit Successful" email. M-Pesa also sends you its own confirmation SMS.
            </li>
          </ol>

          <h3>7.3 Deposit limits</h3>
          <Table
            head={["Item", "Rule"]}
            rows={[
              ["Currency", <>KES only</>],
              ["Amount", <>Whole shillings only</>],
              ["Minimum per deposit", <>The minimum shown on the M-Pesa deposit screen at the time you deposit</>],
              ["Maximum per deposit", <>KES 150,000</>],
              ["Number of deposits", <>We do not currently limit how many deposits you make. M-Pesa's own transaction, daily and balance limits apply to your M-Pesa account.</>],
              ["Time to credit", <>Normally within moments of you approving the prompt, once Safaricom confirms the payment</>],
              ["NeuroOption fee", <>None</>],
            ]}
          />
          <p>
            We may change the minimum or maximum deposit. The limits that apply to a deposit are those shown on the deposit screen when you make it, and we will update this policy if we change the maximum.
          </p>

          <h3>7.4 How we confirm a deposit</h3>
          <p>
            We credit a deposit only after we have confirmed with Safaricom that the payment succeeded. A payment notification on its own is not enough: when M-Pesa tells us a payment succeeded, we check the result with Safaricom before we credit your account, and we check that the amount paid matches the amount you asked to deposit. A deposit that cannot yet be confirmed stays Pending and is not credited until it is confirmed.
          </p>

          <h3>7.5 Deposit statuses</h3>
          <Table
            head={["Status in your history", "What it means", "Added to your balance?"]}
            rows={[
              ["Pending", <>We have asked M-Pesa to send the prompt and are waiting for you to approve it, or for Safaricom to confirm the result.</>, <>No</>],
              ["Processing", <>Safaricom has reported a result and we are confirming and recording it. This normally lasts only moments.</>, <>Not yet</>],
              ["Completed", <>Safaricom has confirmed the payment and the amount has been added to your available balance.</>, <>Yes</>],
              ["Failed", <>The payment was not completed, for example because the prompt was cancelled or timed out, the PIN was wrong, there was not enough money in M-Pesa, or the amount paid did not match the amount requested (section 8.4).</>, <>No</>],
              ["Cancelled", <>The deposit was cancelled before any payment was made. A prompt that you cancel on your phone normally shows as Failed rather than Cancelled.</>, <>No</>],
            ]}
          />

          <h3>7.6 If you leave the deposit screen</h3>
          <p>
            The deposit screen waits about two minutes for confirmation, but you can leave it at any time. If Safaricom confirms the payment later, your balance updates automatically and we send you the "Deposit Successful" email. You can check the status at any time on the History tab of the <a href="/finance?tab=history">Finance</a> page. Do not start a second deposit for the same money while the first is still Pending, because both prompts could end up being paid.
          </p>

          <h3>7.7 Deposit emails</h3>
          <Table
            head={["Email", "When we send it", "What it contains"]}
            rows={[
              ["NeuroOption Deposit Successful", <>After Safaricom confirms the payment and we credit your account</>, <>The amount, date and time (EAT), payment method and M-Pesa reference</>],
              ["NeuroOption Deposit Not Completed", <>After a deposit fails</>, <>The amount, date and time, payment method, deposit reference and the reason recorded, and confirmation that nothing was added to your account</>],
            ]}
          />
          <p>
            We send these emails to the email address on your account. They are notifications only: emails can be delayed, filtered as spam or fail to arrive, so always check your history as well. We do not send them after an account has been deleted.
          </p>
        </>
      ),
    },
    {
      id: "deposit-problems",
      title: "8. When a deposit does not go as expected",
      body: (
        <>
          <h3>8.1 The payment is not completed</h3>
          <p>
            If you cancel the prompt, do not respond in time, enter a wrong PIN, do not have enough money in M-Pesa, or M-Pesa cannot process the payment, the deposit is marked Failed and nothing is added to your account. You receive a "Deposit Not Completed" email with the reason M-Pesa gave. You can try again whenever you wish.
          </p>

          <h3>8.2 Money left your M-Pesa but your account was not credited</h3>
          <p>
            If M-Pesa took money for a payment that then failed, the reversal is handled by M-Pesa, not by us. If the money has not come back to your M-Pesa, or a deposit stays Pending even though you received an M-Pesa confirmation SMS, contact <a href="/support">Support</a> with the M-Pesa transaction code, the amount, the date and time, and the number you paid from. We will check the payment with Safaricom and, if we received it, either credit it to your account or return it to the line it came from. We aim to give you an answer within 5 working days of receiving these details.
          </p>

          <h3>8.3 You did not receive the prompt</h3>
          <ul>
            <li>Check that you entered the right number and that the phone is switched on, unlocked and has network signal.</li>
            <li>Wait for the deposit to show as Failed before trying again, so that you do not end up paying twice.</li>
            <li>No money leaves your M-Pesa unless you approve a prompt with your PIN.</li>
          </ul>

          <h3>8.4 The amount paid does not match the amount requested</h3>
          <p>
            If Safaricom reports that the amount paid differs from the amount you asked to deposit, we do not credit the deposit automatically. It is marked Failed with the reason "Amount mismatch, under review", you receive a "Deposit Not Completed" email, and our staff review it. Although that email says in general terms that M-Pesa reverses money taken for failed payments, M-Pesa will not reverse a payment of this kind on its own. Once we have checked the payment with Safaricom, we will either credit the amount we actually received or return it to the line it came from, and we will tell you which.
          </p>

          <h3>8.5 Payments made outside the app</h3>
          <p>
            If you pay us in any way other than approving a prompt started from the Finance page, for example by entering our business number in the M-Pesa menu yourself, the platform cannot match the payment to your account and will not credit it automatically. Contact <a href="/support">Support</a> with the M-Pesa transaction code. After checking the payment, we will either credit it to your account or return it to the line it came from.
          </p>

          <h3>8.6 Paying twice</h3>
          <p>
            Each deposit that Safaricom confirms is credited to your account. If you paid twice by mistake, you can withdraw the extra amount in the normal way, or ask us to refund it to the line it came from under section 14. If M-Pesa took money twice for a single deposit, we will credit or refund the second payment once we have confirmed it with Safaricom.
          </p>

          <h3>8.7 M-Pesa outages</h3>
          <p>
            Deposits depend on M-Pesa and Safaricom's systems. If they are slow or unavailable, deposits may be delayed or unavailable, and the app may show a message such as "Could not reach M-Pesa". We are not responsible for failures of M-Pesa or Safaricom, except where the law says otherwise.
          </p>

          <Callout tone="info" title="Example: a deposit that stays Pending">
            <p>
              You deposit KES 2,000, approve the prompt and receive an M-Pesa SMS, but your Finance history still shows the deposit as Pending an hour later. Send us the M-Pesa transaction code through Support. We check the payment with Safaricom; if it succeeded, we credit KES 2,000 to your account and you receive the "Deposit Successful" email.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "fees-and-charges",
      title: "9. Fees and charges",
      body: (
        <>
          <h3>9.1 Our charges</h3>
          <Table
            head={["Item", "What NeuroOption charges"]}
            rows={[
              ["Deposits", <>Nothing. The deposit screen shows "Commission: 0%".</>],
              ["Withdrawals", <>Nothing</>],
              ["Refunds of deposits", <>Nothing. We return the amount we received.</>],
              ["Currency conversion", <>Nothing. Real accounts, deposits and withdrawals are all in KES.</>],
              ["Inactivity", <>Nothing</>],
            ]}
          />

          <h3>9.2 M-Pesa and other third-party charges</h3>
          <p>
            M-Pesa may charge you its own tariffs, for example for sending money or for withdrawing cash from an M-Pesa agent, and your mobile network or internet provider may charge for data. Those charges are between you and them, and we do not refund them.
          </p>

          <h3>9.3 New fees</h3>
          <p>
            If we decide to introduce a fee, we will tell you at least 30 days before it takes effect, by email and on the platform, as section 10.3 of the Terms and Conditions explains.
          </p>

          <h3>9.4 Taxes</h3>
          <p>
            You are responsible for any tax due on your trading results. If the law requires us to report information to a tax authority, or to deduct tax from a payment to you, we will do so.
          </p>

          <h3>9.5 How we earn money</h3>
          <p>
            Although we charge no fees, NeuroOption is the counterparty to every trade: when you win, we pay you; when you lose, we keep your stake. All prices come from our own synthetic OTC price engine, not from any exchange or real market. The <PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink> explains the conflicts this creates and how we manage them.
          </p>
        </>
      ),
    },
    {
      id: "making-a-withdrawal",
      title: "10. Making a withdrawal",
      body: (
        <>
          <h3>10.1 What you can withdraw</h3>
          <ul>
            <li>You can withdraw any amount from KES 1 up to your available balance (amounts are recorded to two decimal places). A request for more than your available balance is refused.</li>
            <li>You cannot withdraw locked funds, the stakes of trades that are still open, or virtual funds.</li>
            <li>Withdrawals are paid in KES to a Safaricom M-Pesa line registered in your name (section 6).</li>
          </ul>

          <h3>10.2 Step by step</h3>
          <ol>
            <li>
              Open <a href="/finance?tab=withdraw">Finance</a> and choose the <strong>Withdraw</strong> tab.
            </li>
            <li>Enter the Safaricom M-Pesa number to be paid, for example 0712 345 678. It must be registered in your name.</li>
            <li>Enter the amount in KES.</li>
            <li>
              Press <strong>Request withdrawal</strong>.
            </li>
            <li>
              The amount moves from your available balance into locked funds, shown under your balance as "reserved for withdrawals". The request appears on the History tab as Pending, and we send you a "Withdrawal Request Received" email.
            </li>
            <li>NeuroOption staff review the request (sections 10.4 and 11).</li>
            <li>If we approve it, we send the money to your M-Pesa line. We may first mark the withdrawal Processing and send you a "Withdrawal Processing" email.</li>
            <li>
              When the payment has been sent, we mark the withdrawal Completed, the locked amount leaves your account, and we send you a "Withdrawal Completed" email, with the M-Pesa reference where available. M-Pesa also sends you its own SMS.
            </li>
            <li>If we decline the withdrawal, it is marked Rejected, the locked amount returns to your available balance, and we send you a "Withdrawal Declined" email with the reason (section 12).</li>
          </ol>

          <h3>10.3 Example</h3>
          <Table
            head={["Stage", "Available balance", "Locked funds"]}
            rows={[
              ["Before the request", <>KES 5,000</>, <>KES 0</>],
              ["You request a withdrawal of KES 3,000", <>KES 2,000</>, <>KES 3,000</>],
              ["Completed: KES 3,000 sent to your M-Pesa", <>KES 2,000</>, <>KES 0</>],
              ["Or: declined, failed or cancelled", <>KES 5,000</>, <>KES 0</>],
            ]}
          />

          <h3>10.4 Review by our staff</h3>
          <p>
            Every withdrawal is reviewed by authorised NeuroOption staff before it is paid; payouts are not automatic. Before we pay, we may check that the request was made from your account, that the M-Pesa number is valid and registered in your name, that your identity has been verified where we require it, that the amount does not include money credited by mistake or from a deposit or trade that is under review, and that there is no legal, fraud or anti-money-laundering reason to delay or decline it.
          </p>

          <h3>10.5 How long it takes</h3>
          <p>
            We aim to complete withdrawals within 24 to 48 hours of your request, as the Withdraw screen states. This is a target, not a guarantee. A withdrawal can take longer, for example:
          </p>
          <ul>
            <li>if we need information or documents from you, from when we ask until you provide them;</li>
            <li>for requests made at night, at weekends or on public holidays in Kenya, because each withdrawal is reviewed by a person;</li>
            <li>if M-Pesa or Safaricom's systems are slow or unavailable, or our platform has a technical problem; or</li>
            <li>in any of the situations in section 12.</li>
          </ul>
          <p>
            Once we mark a withdrawal Completed, the money has been sent through M-Pesa. M-Pesa normally delivers it promptly, but its delivery time is outside our control.
          </p>

          <h3>10.6 Withdrawal statuses and emails</h3>
          <Table
            head={["Status in your history", "What it means", "Your locked funds", "Email you receive"]}
            rows={[
              ["Pending", <>We have received your request and it is waiting for review.</>, <>Held</>, <>NeuroOption Withdrawal Request Received</>],
              ["Processing", <>We have approved the withdrawal and are sending the payment through M-Pesa.</>, <>Held</>, <>NeuroOption Withdrawal Processing</>],
              ["Completed", <>We have sent the payment to your M-Pesa line.</>, <>Paid out and removed from your account</>, <>NeuroOption Withdrawal Completed</>],
              ["Rejected", <>We have declined the withdrawal.</>, <>Returned to your available balance</>, <>NeuroOption Withdrawal Declined, with the reason</>],
              ["Failed", <>We tried to pay, but the payment did not go through.</>, <>Returned to your available balance</>, <>NeuroOption Withdrawal Declined, with the reason</>],
              ["Cancelled", <>The withdrawal was cancelled before payment, for example at your request (section 13).</>, <>Returned to your available balance</>, <>NeuroOption Withdrawal Declined, with the reason</>],
            ]}
          />
          <p>
            Not every withdrawal passes through Processing; we may move it straight from Pending to Completed. Each email shows the withdrawal reference, the date and time (EAT), the amount and the method. If you receive a "Withdrawal Request Received" email for a request you did not make, contact <a href="/support">Support</a> straight away (section 13.4).
          </p>

          <h3>10.7 Large withdrawals and M-Pesa limits</h3>
          <p>
            M-Pesa limits how much can be sent in one transaction and how much an M-Pesa account can receive or hold. If your withdrawal is larger than M-Pesa allows, we may pay it in more than one M-Pesa payment or ask you to request smaller amounts, and we will tell you if this applies.
          </p>

          <h3>10.8 Locked funds and trading</h3>
          <p>
            While a withdrawal is pending, the locked amount cannot be used to trade. You can keep trading with your available balance, but remember that any stake you lose reduces the balance left after the withdrawal.
          </p>

          <Callout tone="warn" title="Check the number before you press Request withdrawal">
            <p>
              We pay to the M-Pesa number you enter. A payment sent to a wrong number may be impossible to recover (section 13.3).
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "verification-and-checks",
      title: "11. Identity verification and other checks",
      body: (
        <>
          <h3>11.1 Identity verification</h3>
          <p>
            We may require you to complete identity verification before we pay a withdrawal, and we may also ask for it before you deposit. We may ask for documents such as your national identity card or passport, a photograph of yourself (a "selfie") and proof of your address. Documents cannot yet be uploaded in the app, so we will tell you exactly what we need and how to send it. Your verification status is shown as Not submitted, Pending, Approved or Rejected; if your documents are rejected, we will tell you why. Documents are reviewed by authorised NeuroOption staff. The <PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink> explains this in detail.
          </p>

          <h3>11.2 Ownership of the M-Pesa line</h3>
          <p>We may ask you to show that the M-Pesa line you deposit from or withdraw to is registered in your name, as described in section 6.4.</p>

          <h3>11.3 Source of funds</h3>
          <p>
            If a deposit or withdrawal is large or unusual for your account, or the pattern of your payments raises questions (for example, depositing and withdrawing with little or no trading in between), we may ask you to explain where the money came from and to provide evidence such as payslips or bank or M-Pesa statements.
          </p>

          <h3>11.4 Legal obligations</h3>
          <p>
            Kenyan law, including the Proceeds of Crime and Anti-Money Laundering Act 2009 and the Prevention of Terrorism Act 2012, may require us to verify our clients, keep records of payments, check clients and payments against sanctions lists, report suspicious transactions to the Financial Reporting Centre (FRC), and in some cases hold funds. Where the law requires it, we will do these things, and the law may prevent us from telling you that we have done so.
          </p>

          <h3>11.5 While checks are under way</h3>
          <p>
            Your withdrawal stays Pending and the amount stays locked. We will contact you at the email address on your account, or through <a href="/support">Support</a>, to tell you what we need. If you do not provide it within 30 days of our request, we may decline the withdrawal. The amount then returns to your available balance, but we may decline later withdrawals until the checks are complete.
          </p>
        </>
      ),
    },
    {
      id: "delayed-or-declined-withdrawals",
      title: "12. When we may delay or decline a withdrawal",
      body: (
        <>
          <h3>12.1 Reasons we may delay or decline</h3>
          <p>We may delay a withdrawal, or decline it, if:</p>
          <ul>
            <li>we need to verify your identity, the ownership of the M-Pesa line or the source of your funds, or verification has failed or not been completed (section 11);</li>
            <li>the M-Pesa line is not registered in your name, or the details you gave are incorrect or incomplete, for example a number that is not a valid Safaricom M-Pesa line;</li>
            <li>we reasonably suspect fraud, unauthorised use of your account, money laundering, terrorist financing or other conduct prohibited by section 11 of the Terms and Conditions;</li>
            <li>the amount includes money credited by mistake, money from a deposit that is under review, disputed or being reversed, or the results of trades that are being reviewed under section 12 of the Terms and Conditions;</li>
            <li>there is an open investigation, complaint or dispute that concerns your account or the payment;</li>
            <li>your account is suspended or locked;</li>
            <li>the law, a court order or a competent authority requires us to; or</li>
            <li>M-Pesa, Safaricom or our platform is unavailable, in which case we delay the withdrawal rather than decline it.</li>
          </ul>

          <h3>12.2 What happens to your money</h3>
          <p>
            While a withdrawal is delayed, the amount stays locked. If a withdrawal is declined, fails or is cancelled, the full locked amount returns to your available balance as soon as its status changes, with no charge. The only exception is where the law requires us to freeze funds; we may then restrict your account so that the balance cannot be used or withdrawn while the legal requirement applies.
          </p>

          <h3>12.3 Telling you why</h3>
          <p>
            The "Withdrawal Declined" email gives the reason for the decision. We will not give a reason where the law prevents us, for example where telling you could prejudice an investigation by an authority.
          </p>

          <h3>12.4 Making a new request</h3>
          <p>Once you have dealt with the reason for a decline, for example by correcting the number or completing verification, you can submit a new withdrawal request.</p>
        </>
      ),
    },
    {
      id: "cancelling-a-withdrawal",
      title: "13. Cancelling a withdrawal",
      body: (
        <>
          <h3>13.1 You cannot cancel a withdrawal in the app</h3>
          <p>Once you have submitted a withdrawal request, the app does not let you cancel it yourself.</p>

          <h3>13.2 Asking us to cancel</h3>
          <p>
            If you want to cancel a withdrawal, contact <a href="/support">Support</a> as soon as possible and give the withdrawal reference from the "Withdrawal Request Received" email. If we have not yet sent the payment, we will cancel it: the withdrawal is marked Cancelled, the locked amount returns to your available balance, and you receive a "Withdrawal Declined" email, which is the email the system sends for every cancelled, failed or rejected withdrawal and which states the reason we record.
          </p>

          <h3>13.3 After the payment has been sent</h3>
          <p>
            Once we have sent a payment through M-Pesa, we cannot cancel or recall it. If you entered a wrong number, we are not responsible for a payment correctly sent to the number you gave us. We will give you the payment details and help where we reasonably can, for example by asking Safaricom about a reversal, but we cannot guarantee that the money will be recovered.
          </p>

          <h3>13.4 A withdrawal you did not request</h3>
          <p>
            If you receive a withdrawal email for a request you did not make, contact <a href="/support">Support</a> immediately and change your password in your <a href="/profile">profile</a>. We will cancel the withdrawal if it has not yet been paid, and we will investigate.
          </p>
        </>
      ),
    },
    {
      id: "refunds",
      title: "14. Refunds",
      body: (
        <>
          <h3>14.1 Trading losses are not refundable</h3>
          <p>
            When you place a trade, you risk your stake. We do not refund a stake lost on a losing trade, including where you regret the trade, placed it by mistake, misread the instrument or expiry, or where the price moved against you. Prices on NeuroOption come from our own synthetic price engine, so a difference between an instrument's price on NeuroOption and the real-world price of a similarly named asset is not a reason for a refund. An accepted trade cannot be closed or cancelled before expiry.
          </p>
          <p>
            Two situations return a stake to your balance, and neither is a refund of a deposit: a trade that ends in a draw returns your stake, and a trade that we void under section 12 of the Terms and Conditions or the <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink> is treated as if it had never been placed.
          </p>

          <h3>14.2 When we may refund a deposit</h3>
          <Table
            head={["Situation", "What we do"]}
            rows={[
              ["M-Pesa took your money but the deposit was not credited, and M-Pesa has not reversed it", <>After confirming with Safaricom that we received it, we credit it to your account or return it to the line it came from (section 8.2).</>],
              ["You paid twice, or M-Pesa took money twice for one deposit", <>We return the extra payment to the line it came from if you ask us to, or you can withdraw it in the normal way (section 8.6).</>],
              ["The amount paid did not match the amount requested", <>We credit the amount we actually received or return it to the line it came from (section 8.4).</>],
              ["You paid outside the in-app deposit process", <>We credit it after checks, or return it to the line it came from (section 8.5).</>],
              ["The payment came from someone else's M-Pesa line", <>We return it to the line it came from (section 6.3).</>],
              ["We have anti-money-laundering or fraud concerns about a deposit", <>We may return it to the line it came from instead of crediting it or letting you trade with it, unless the law requires us to hold or report it instead.</>],
              ["Your account is closed before you have traded with a deposit", <>We may return the deposit to the line it came from instead of paying it as a withdrawal.</>],
              ["You were not eligible to open an account, for example because you are under 21", <>We return the money you deposited, after any corrections under the Terms and Conditions.</>],
            ]}
          />

          <h3>14.3 How refunds are paid</h3>
          <ul>
            <li>A refund is paid only to the M-Pesa line the money came from, in KES. We do not pay a refund to a different line or to another person, unless the law requires otherwise.</li>
            <li>We refund the amount we received. We do not refund M-Pesa or other third-party charges.</li>
            <li>If the refunded deposit was credited to your account, the refund is deducted from your balance.</li>
            <li>We aim to send a refund within 5 working days of deciding to make it and completing any checks we need. We will tell you when it has been sent.</li>
          </ul>

          <h3>14.4 Asking for a refund</h3>
          <p>
            Contact <a href="/support">Support</a> with the M-Pesa transaction code, the amount, the date and time of the payment and the number you paid from, and tell us why you believe a refund is due.
          </p>

          <h3>14.5 A refund is not a withdrawal</h3>
          <p>
            If a deposit was credited correctly and you simply want your money back, request a withdrawal in the normal way (section 10). There is no charge for this and no trading requirement.
          </p>
        </>
      ),
    },
    {
      id: "incorrect-credits-and-corrections",
      title: "15. Incorrect credits, corrections and recovery",
      body: (
        <>
          <h3>15.1 Money credited by mistake is not yours</h3>
          <p>
            If money is credited to your account by mistake, for example a deposit credited twice, credited for the wrong amount or credited to the wrong account, it does not belong to you. You must not trade with it or withdraw it, and you should tell us as soon as you notice.
          </p>

          <h3>15.2 Our right to correct</h3>
          <p>
            We may reverse or correct any credit or debit made in error, and any trade result affected by a manifest error under section 12 of the Terms and Conditions. We correct errors whether they are in your favour or ours, and we will tell you what we changed and why. Where an error was against you, we will put your account in the position it would have been in had the error not happened.
          </p>

          <h3>15.3 If the money has already been used or withdrawn</h3>
          <p>
            If you have already traded with or withdrawn money credited by mistake, we may deduct the amount from your balance. If your balance is not enough, the shortfall is a debt you owe us and you must repay it. Until it is repaid, we may decline your withdrawals, and we may take lawful steps to recover it.
          </p>

          <h3>15.4 Overpaid withdrawals</h3>
          <p>
            If we pay you more than you asked to withdraw, or pay the same withdrawal twice, you must return the excess. Section 15.3 applies to any amount you do not return.
          </p>

          <h3>15.5 Check your history</h3>
          <p>
            Check your Finance history and emails regularly and tell us promptly about anything that looks wrong. Prompt reports are easier to investigate with Safaricom.
          </p>
        </>
      ),
    },
    {
      id: "reversals-and-disputes",
      title: "16. Reversals and payment disputes",
      body: (
        <>
          <h3>16.1 Contact us first</h3>
          <p>
            If a deposit or withdrawal looks wrong, contact <a href="/support">Support</a> before you ask Safaricom to reverse anything. Most problems can be resolved directly with us, and a reversal request can delay the outcome.
          </p>

          <h3>16.2 A deposit that is reversed after it was credited</h3>
          <p>
            If a deposit is reversed through M-Pesa after we credited it, we will deduct the reversed amount from your balance. If you have already traded with or withdrawn that money and your balance is not enough, section 15.3 applies, and we may restrict your account until the matter is resolved.
          </p>

          <h3>16.3 Reversing a genuine payment is not allowed</h3>
          <p>
            Asking for a reversal of a payment you made and authorised, for example to recover money after losing trades, may be fraud and is prohibited by section 11 of the Terms and Conditions. We may close your account, recover the amount and report the matter to the relevant authorities.
          </p>

          <h3>16.4 Unauthorised use of your M-Pesa</h3>
          <p>
            If someone used your phone or M-Pesa to deposit with us without your permission, tell Safaricom and us immediately. We will investigate, and we may review or void trades placed with that money under the Terms and Conditions.
          </p>

          <h3>16.5 A completed withdrawal you did not receive</h3>
          <p>
            If a withdrawal shows Completed but the money has not reached your M-Pesa, contact <a href="/support">Support</a> with the withdrawal reference and the date. We will check the payment with Safaricom. If it did not go through, we will either send it again or return the amount to your available balance, and tell you which.
          </p>

          <h3>16.6 Card chargebacks</h3>
          <p>We do not accept card payments, so card chargeback rules do not apply. If we add card payments in future, we will update this policy first.</p>
        </>
      ),
    },
    {
      id: "restrictions-and-closure",
      title: "17. Account restrictions, closure and your balance",
      body: (
        <>
          <h3>17.1 Suspended or locked accounts</h3>
          <p>
            If your account is suspended or locked under section 13 of the Terms and Conditions, we may decline deposits and withdrawals, and pending withdrawals may stay pending while we investigate. We will tell you why, unless the law prevents us.
          </p>

          <h3>17.2 Closing your account yourself</h3>
          <p>
            You can delete your account yourself at <a href="/delete-account">Delete account</a>. Deletion is possible only when your real-account balance is zero (below KES 0.01), you have no locked funds and no open trades, and no deposits or withdrawals are still pending. Withdraw your money first. Deletion cannot be undone. The <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink> explains the process.
          </p>

          <h3>17.3 Small balances</h3>
          <p>
            If your balance is less than the KES 1 minimum withdrawal but not zero, you cannot withdraw it or use self-service deletion. Contact <a href="/support">Support</a> and we will help you close your account.
          </p>

          <h3>17.4 If we close your account</h3>
          <p>
            Once open trades and pending payments are settled, we will pay your remaining real-account balance to an M-Pesa line in your name, after any checks we are required to carry out and any corrections under section 15, unless the law requires us to hold it. A deposit you have not traded with may be returned to the line it came from under section 14.
          </p>
        </>
      ),
    },
    {
      id: "records-and-statements",
      title: "18. Records, statements and history",
      body: (
        <>
          <h3>18.1 What you can see in the app</h3>
          <ul>
            <li>
              The History tab of the <a href="/finance?tab=history">Finance</a> page lists your 100 most recent deposits and withdrawals, with the date and time, method, amount, status and, for completed payments, the payment reference.
            </li>
            <li>
              Your <a href="/history">trade history</a> lists your trades, with the instrument, direction, entry and closing prices, stake, payout percentage, profit or loss, result and closing time.
            </li>
          </ul>

          <h3>18.2 Statements</h3>
          <p>
            The app does not currently offer a downloadable statement. If you need a statement of your real-account transactions, ask through <a href="/support">Support</a> and we will provide one. You also have the right to ask for a copy of your personal data under the Data Protection Act 2019, as explained in the <PolicyLink slug="privacy">Privacy Policy</PolicyLink>.
          </p>

          <h3>18.3 Keep your own records</h3>
          <p>Keep our emails and your M-Pesa confirmation SMS messages. The M-Pesa transaction code is the quickest way for us to trace a payment.</p>

          <h3>18.4 What we keep</h3>
          <p>
            For each payment we keep the M-Pesa number used, the amount, the status, the M-Pesa reference and the information Safaricom sends us about the payment, together with the entries it created in your account. We keep these records, including after your account is closed or deleted, for as long as required by applicable law (for example, the record-keeping periods under anti-money-laundering, tax and companies law). Our record retention period is <Co field="retentionPeriod" />. The <PolicyLink slug="privacy">Privacy Policy</PolicyLink> and the <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink> explain how we handle these records.
          </p>
        </>
      ),
    },
    {
      id: "help-and-complaints",
      title: "19. Help, complaints and contact",
      body: (
        <>
          <h3>19.1 Getting help with a payment</h3>
          <p>When you contact us about a payment, include:</p>
          <ul>
            <li>whether it is a deposit, withdrawal or refund;</li>
            <li>the amount and the date and time (EAT);</li>
            <li>the M-Pesa number used;</li>
            <li>the M-Pesa transaction code, or the reference shown in our email; and</li>
            <li>what went wrong.</li>
          </ul>
          <p>Never send us your M-Pesa PIN, your NeuroOption password or a password-reset code.</p>

          <h3>19.2 Complaints</h3>
          <p>
            If you are unhappy with how we handled a deposit, withdrawal or refund, you can make a complaint under our <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>, which explains how we investigate complaints and where you can go if you are not satisfied with our answer. Complaints about how we handle your personal data can also be made to the Office of the Data Protection Commissioner (ODPC).
          </p>

          <h3>19.3 Contact details</h3>
          <Table
            head={["For", "How to reach us"]}
            rows={[
              ["Answers to common questions", <>The <a href="/help">Help centre</a></>],
              ["Deposits, withdrawals and refunds", <><a href="/support">Support</a> in the platform when you are signed in (up to 10 open tickets at a time), or <Co field="supportEmail" /></>],
              ["Phone", <Co field="supportPhone" />],
              ["Complaints", <><Co field="complaintsEmail" />, following our <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink></>],
              ["Personal data and privacy", <Co field="privacyEmail" />],
            ]}
          />
        </>
      ),
    },
    {
      id: "changes-to-this-policy",
      title: "20. Changes to this policy",
      body: (
        <>
          <ul>
            <li>
              We may change this policy, for example when we add a payment method, when we change limits or timings, or when the law changes. The "Last updated" date shows when it last changed.
            </li>
            <li>
              We will tell you about important changes by email or on the platform before they take effect, unless we must make a change sooner for legal or security reasons. New fees will always be announced at least 30 days in advance (section 9.3).
            </li>
            <li>A change does not affect a deposit or withdrawal you have already started, unless the law requires otherwise.</li>
          </ul>
        </>
      ),
    },
  ],
};

export default policy;
