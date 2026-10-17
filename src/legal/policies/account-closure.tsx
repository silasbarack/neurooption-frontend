import type { Policy } from "../types";
import { Callout, Co, Definitions, PolicyLink, Table } from "../components";

const policy: Policy = {
  slug: "account-closure",
  title: "Account Closure and Data Retention Policy",
  summary:
    "How you can close your NeuroOption account yourself, what has to be settled first, exactly what is deleted or anonymised and what we must keep, how long retained records are kept, when we may close or restrict an account, and how your data protection rights continue after closure.",
  updated: "2026-10-16",
  sections: [
    {
      id: "about-this-policy",
      title: "1. About this policy",
      body: (
        <>
          <p>
            In this policy, "NeuroOption", "we", "us" and "our" mean <Co field="legalName" /> (trading as NeuroOption), registration number <Co field="registrationNumber" />, incorporated in <Co field="jurisdiction" />, with its registered office at <Co field="registeredAddress" />. "You" and "your" mean the person who holds a NeuroOption account.
          </p>

          <h3>1.1 What this policy covers</h3>
          <p>
            This policy explains your right to close your account, what you must settle before you do, how the self-service closure works step by step, what happens to your information when the account is closed, which records we keep and why, how long we keep them, and what we do with them. It also explains when we may close, suspend or restrict an account ourselves, how inactive accounts are treated, and how your data protection rights work after closure.
          </p>

          <h3>1.2 How this policy fits with our other documents</h3>
          <p>
            This policy forms part of your agreement with us under the <PolicyLink slug="terms">Terms and Conditions</PolicyLink>. Please also read:
          </p>
          <ul>
            <li>
              the <PolicyLink slug="privacy">Privacy Policy</PolicyLink>, which explains in general what personal data we collect, why we use it, who receives it and what your rights are;
            </li>
            <li>
              the <PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink>, which explains how you take your money out before closing a real account;
            </li>
            <li>
              the <PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink>, which explains the anti-money-laundering rules that require us to keep certain records and that can prevent or delay a payout; and
            </li>
            <li>
              the <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>, which explains what to do if you are unhappy with how we handled your closure or your data.
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
            Do not assume that NeuroOption is licensed, regulated or supervised by any authority beyond what is stated in this table. Nothing in this policy limits any right you have under Kenyan law that cannot be limited by agreement, including your rights under the Data Protection Act, 2019 and the Consumer Protection Act 2012.
          </p>

          <Callout tone="info" title="Real-money services are not available yet">
            <p>
              Today NeuroOption offers demo trading with virtual funds only. Real-money deposits, withdrawals and trades are switched off on the platform. Where this policy talks about real balances, payouts or financial records, it describes how things will work when real-money accounts are available. Closing an account today works in the same way. Demo funds have no value and cannot be recovered after closure.
            </p>
          </Callout>

          <Callout tone="risk" title="Key points">
            <ul>
              <li>
                <strong>You can close your account yourself at any time</strong> at <a href="/delete-account">/delete-account</a>, provided nothing is still open on it (see section 4).
              </li>
              <li>
                <strong>Closure is permanent.</strong> Nobody, including our Support team, can bring a closed account back.
              </li>
              <li>
                <strong>Your name, email address and phone number are removed from your profile</strong> and your password is made unusable.
              </li>
              <li>
                <strong>Some records must be kept</strong> (money movements, trades, ledger entries, identity verification records, support tickets, email delivery records, any newsletter subscription record and a record of the closure itself, which includes your IP address and browser user-agent). They are kept for the period in section 8, are not erased at closure and are never used for marketing.
              </li>
              <li>
                <strong>Demo funds have no value</strong> and disappear with the account. Real funds must be withdrawn first.
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
              ["Account", <>Your NeuroOption profile, with its demo account ("QT Demo") and, when real-money accounts are available, its real account ("QT Real").</>],
              ["Anonymise", <>To replace your personal details in our system with neutral placeholders so that the remaining record no longer shows who you are on its face. It does not delete the underlying record.</>],
              ["Available balance", <>The part of your real-account balance that you can use to trade or withdraw.</>],
              ["Closure", <>The permanent closing of your account. The platform provides a self-service page for you to do this (sections 4 to 6). Section 11 explains what we may do ourselves. The platform records an account that you have closed with the status "Deleted".</>],
              ["Demo account and virtual funds", <>Your practice account and the virtual US dollars (USD) in it. Virtual funds have no monetary value and cannot be withdrawn.</>],
              ["EAT", <>East Africa Time (UTC+3). All times in this policy, on the platform and in our emails are EAT.</>],
              ["Locked funds", <>Money in your real account that is reserved and cannot be used or withdrawn, for example the amount of a withdrawal while it is being reviewed and paid, or the stake of a trade that is still open.</>],
              ["Open trade", <>A trade that has been accepted but has not yet reached its expiry and been settled. A trade cannot be cancelled or closed early.</>],
              ["Pending deposit or withdrawal", <>A deposit or withdrawal that has been started but is not yet finished (for example, a deposit that is still being confirmed, or a withdrawal that is waiting for review or is being processed).</>],
              ["Personal data", <>Any information that relates to an identified or identifiable person, as defined in the Data Protection Act, 2019.</>],
              ["Retained records", <>The records described in section 7 that we keep after closure.</>],
              ["Staff account", <>An account held by a NeuroOption administrator or team member with a staff role (for example Finance, Support, KYC, Risk or Compliance).</>],
            ]}
          />
        </>
      ),
    },
    {
      id: "your-right-to-close",
      title: "3. Your right to close your account",
      body: (
        <>
          <h3>3.1 You may close at any time</h3>
          <p>
            You may close your account whenever you wish, for any reason or for no reason, and we will not charge a fee for closing it. You do not need to give us a reason, although the closure page offers an optional list of reasons that helps us improve. Choosing a reason, or not, does not affect your closure.
          </p>

          <h3>3.2 Closure is your choice and is permanent</h3>
          <p>
            We will never close your account on your behalf because you asked us a question about closing it. The closure takes effect only when you complete the steps in section 5 yourself. Once it is complete it is irreversible: a closed account cannot be reopened, restored or merged with another account, and its balances, trades and history cannot be moved to a new account.
          </p>

          <h3>3.3 If you only want a break</h3>
          <p>
            You do not have to close your account to stop trading. If you are worried about your trading habits, or you want to take a break, you can simply stop using the platform and sign out. Our <PolicyLink slug="responsible-trading">Responsible Trading Policy</PolicyLink> explains our approach to helping you control your trading. Closing the account is the right choice only if you are sure you do not want to use that account again.
          </p>

          <h3>3.4 Demo-only accounts</h3>
          <p>
            If you have only used the demo account, you can close your account in the same way. Your virtual funds have no value and are discarded. Closing a demo-only account does not require a withdrawal because there is no real money in it.
          </p>

          <h3>3.5 The public demo session</h3>
          <p>
            Visitors who are not signed in share one public demo session. That session does not belong to any individual and has no account to close.
          </p>
        </>
      ),
    },
    {
      id: "before-you-close",
      title: "4. Before you close: what must be settled first",
      body: (
        <>
          <p>
            We do not allow an account to be closed while money or an open position is still tied to it. This protects you: it makes sure nothing you are owed is left behind on an account that you can no longer sign in to. The platform checks the following conditions when you open the closure page and again at the moment you confirm, so a deposit or trade that started a moment ago is not missed.
          </p>

          <Table
            head={["Condition", "What it means for you", "What to do"]}
            rows={[
              [
                "Funds in your real account",
                <>Your real-account balance (including any funds held with the trading engine) must be below KES 0.01. A balance of KES 0.01 or more blocks closure. Amounts smaller than that cannot be withdrawn and count as empty.</>,
                <>Withdraw the balance first, as explained in the <PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink>.</>,
              ],
              [
                "Locked funds",
                <>No part of your money may be reserved. Locked funds of KES 0.01 or more block closure. Funds are locked, for example, for a withdrawal that is waiting to be paid or declined, or for the stake of a trade that has not expired.</>,
                <>Wait until the withdrawal is paid or declined, or the trade expires and settles. Declined or failed withdrawals return the locked funds to your balance, and you then withdraw them.</>,
              ],
              [
                "Open trades",
                <>You must have no open trades, whether they were placed on your demo account or on your real account. A trade cannot be cancelled or closed early, so you must wait for it to expire and settle. Expiry times run from 5 seconds up to 5 hours.</>,
                <>Check <a href="/open-trades">Open trades</a> and wait for each trade to expire.</>,
              ],
              [
                "Pending withdrawals",
                <>No withdrawal may be waiting for review or in processing.</>,
                <>Wait until the withdrawal is completed or declined.</>,
              ],
              [
                "Pending deposits",
                <>No deposit may be waiting for confirmation or in processing.</>,
                <>Wait until the deposit completes or fails.</>,
              ],
              [
                "Staff accounts",
                <>An account held by a member of our staff cannot be closed through the self-service page.</>,
                <>Staff accounts are not closed through this page. The company handles them separately.</>,
              ],
            ]}
          />

          <h3>4.1 How the platform tells you what is in the way</h3>
          <p>
            If any of these conditions applies, the closure page lists exactly what is blocking you in a box headed "Sort these out first", with a link to the page where you can fix it (for example, to withdraw funds, view your transactions or view your open trades). The "Continue" button stays disabled until everything is settled. If something changes while you are completing the steps, for example a trade is opened in another browser window, the page returns you to the first step and shows the new list.
          </p>

          <h3>4.2 Amounts below KES 0.01</h3>
          <p>
            A balance below KES 0.01 cannot be paid out and does not prevent closure. It is below the smallest amount that can be withdrawn, so it is not paid out.
          </p>

          <h3>4.3 Demo balances and demo trades</h3>
          <p>
            Virtual funds in your demo account never block closure, because they have no monetary value. However, a trade that is still open blocks closure whichever account it was placed on, so wait for it to expire before you continue.
          </p>

          <Callout tone="warn" title="Withdraw first">
            <p>
              When real-money accounts are available, a real balance must be withdrawn before you can close. Withdrawals are reviewed by our staff and are typically paid within 24 to 48 hours, although this is not guaranteed. We may require identity verification before we pay you (see the <PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink>). Start the withdrawal well before you plan to close, because you cannot close until it is completed or declined.
            </p>
          </Callout>

          <h3>4.4 Settle other matters first if you need to</h3>
          <p>
            Closure does not end a dispute or a complaint that you have already raised with us. If you have an unresolved complaint or support ticket, we keep the ticket and its messages (section 7), but you will no longer be able to sign in to read or add to it, and the platform does not email you a reply that staff add to a ticket belonging to a closed account. Please get your matter resolved before you close, or write to us by email after closure and quote your ticket subject and closure reference (section 16). Keep any reference numbers we gave you.
          </p>
        </>
      ),
    },
    {
      id: "how-to-close",
      title: "5. How to close your account: step by step",
      body: (
        <>
          <p>
            Closing your account is a self-service process at <a href="/delete-account">/delete-account</a>, which you can reach from your profile page. You must be signed in. The process has three steps and a progress indicator shows where you are.
          </p>

          <h3>5.1 Step 1: Before you go</h3>
          <p>
            The first screen is headed "Delete your NeuroOption account". It states plainly that deletion is permanent and lists what happens when you delete (summarised in section 6 of this policy). If anything is blocking closure under section 4, it appears here with links to fix it. If nothing is blocking you, you can choose "Keep my account" to return to your profile, or "Continue" to move on. The screen also shows a masked version of your email address, for example "s***@example.com", so that you can see which account you are about to close and where the confirmation will be sent.
          </p>

          <h3>5.2 Step 2: Your reason</h3>
          <p>
            The second screen asks why you are leaving. This is optional: you may select one of the listed reasons or skip it. The reasons offered are:
          </p>
          <ul>
            <li>I'm no longer trading</li>
            <li>I'm switching to another platform</li>
            <li>I'm worried about my data or the safety of my money</li>
            <li>I had a problem with a deposit or withdrawal</li>
            <li>Payouts or trading conditions weren't what I expected</li>
            <li>I want to stop trading to protect my finances</li>
            <li>The platform is hard to use</li>
            <li>I have another NeuroOption account</li>
            <li>I'm taking a break and may come back</li>
            <li>Another reason</li>
          </ul>
          <p>
            You may also add a comment of up to 500 characters. Please do not put sensitive personal information, passwords, card or M-Pesa PINs in the comment box. Your reason and comment are stored with the record of your closure (section 7) and are used to understand why people leave and to improve the service. They do not delay or change your closure.
          </p>

          <h3>5.3 Step 3: Confirm</h3>
          <p>
            The final screen is headed "Confirm deletion". To complete the closure you must:
          </p>
          <ol>
            <li>type the word <strong>DELETE</strong> in the confirmation box (capital or small letters are accepted);</li>
            <li>enter your current account password; and</li>
            <li>where the security check is switched on, complete the Google reCAPTCHA checkbox.</li>
          </ol>
          <p>
            You then select "Permanently delete my account". The button stays disabled until the word and the password have been entered.
          </p>

          <h3>5.4 Limits on password attempts</h3>
          <p>
            Because closing an account cannot be undone, we protect it against misuse by someone who has gained access to a signed-in device. If you enter an incorrect password, the closure is refused and your password field is cleared. After 5 incorrect passwords within 15 minutes, further attempts are blocked and you will see the message "Too many incorrect passwords. Try again in a few minutes." Wait for a while and try again. If you have forgotten your password, use the password reset on the sign-in page first, and then return to the closure page.
          </p>

          <h3>5.5 If something goes wrong</h3>
          <ul>
            <li>
              <strong>The page cannot load.</strong> A message appears with a "Try again" button. If it keeps failing, contact Support (section 16).
            </li>
            <li>
              <strong>A condition changed.</strong> If a deposit, withdrawal or trade appeared after the page loaded, the closure is refused, nothing is changed and you are returned to the first step with the new list of blockers.
            </li>
            <li>
              <strong>You clicked twice.</strong> The closure is carried out only once. A second click does not create a second closure.
            </li>
            <li>
              <strong>The confirmation email does not arrive.</strong> The closure still stands (section 6.3 explains this).
            </li>
          </ul>

          <h3>5.6 Closing by request instead</h3>
          <p>
            Closure is designed to be done by you on the self-service page, because the password and typed confirmation are how we know the request is really yours. If you cannot use the page (for example, because you can no longer sign in), contact Support (section 16). We may ask you to prove that you control the account, for example by writing from the email address registered on it, and we may decline to act on a request that we cannot verify. Our support staff do not have a tool that performs the self-service closure for you, so we cannot promise that a request sent to us will lead to the same result or the same speed.
          </p>
        </>
      ),
    },
    {
      id: "what-happens-immediately",
      title: "6. What happens when you close your account",
      body: (
        <>
          <h3>6.1 Immediately</h3>
          <p>As soon as you confirm, and the checks in section 4 pass, the following happens straight away in a single operation:</p>
          <ul>
            <li>
              <strong>You are signed out everywhere.</strong> The platform stops accepting every sign-in token issued for the account straight away, and you cannot sign in to that account again. On the device where you closed the account, the token and basic profile stored in the browser are removed.
            </li>
            <li>
              <strong>Your profile is anonymised.</strong> Your name is replaced with "Deleted user", your email address is replaced with a placeholder address that cannot receive mail, and your phone number, if you added one, is removed.
            </li>
            <li>
              <strong>Your password is made unusable.</strong> It is replaced with a random value that nobody knows, so even the old password no longer opens anything.
            </li>
            <li>
              <strong>Password reset codes are deleted</strong> and your referral code is cleared.
            </li>
            <li>
              <strong>Social following and any affiliate profile are switched off.</strong> Any following connections you had with other traders are stopped, and any affiliate profile is disabled. These features are not live services today, but this is what the platform does if records exist.
            </li>
            <li>
              <strong>The account is marked "Deleted".</strong> The underlying record is kept (it is the anchor for the financial records in section 7) but it no longer shows who you are.
            </li>
            <li>
              <strong>A record of the closure is created</strong> (section 7).
            </li>
          </ul>

          <h3>6.2 The result page</h3>
          <p>
            After closing, you are taken to a public confirmation page that shows a closure reference in the form DEL-XXXXXXXX (DEL followed by eight letters and numbers) and tells you whether the confirmation email was sent. Keep this reference; the page cannot be reopened later. If you need to contact us later about the closure, quote it.
          </p>

          <h3>6.3 The confirmation email</h3>
          <p>
            We send a confirmation email to the address your account had immediately before closure, containing the closure reference, the account email address, the date and time of closure (in EAT and in UTC) and the reason you selected, if any. It also lists what was removed or switched off and what is kept, and tells you to contact Support at once, quoting the reference, if you did not ask for the closure. The email is sent after the closure is complete. If sending the email fails, your account stays closed; the result page tells you honestly whether the email went out. The email is a courtesy and a receipt, not a condition of closure.
          </p>

          <h3>6.4 What does not happen</h3>
          <ul>
            <li>Closure does not cancel or reverse past trades, deposits or withdrawals, which remain valid and final.</li>
            <li>Closure does not give you a refund of trading losses or of any deposit. Refunds are governed by the <PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink>.</li>
            <li>Closure does not remove information that is held by other organisations, such as Safaricom's own M-Pesa records, Google, or your email provider. Those organisations keep their own records under their own policies.</li>
            <li>Closure does not remove every setting stored in your own browser by earlier visits. See section 6.5.</li>
          </ul>

          <h3>6.5 Information in your browser</h3>
          <p>
            When you close your account, the page removes your sign-in token and basic profile from the browser you used. Other preferences that the website stores locally in your browser (such as language, favourite assets, chart background and country preference) are not personal records on our servers and stay on your device until you clear your browser data. You can clear them in your browser settings at any time. The website sets no cookies of its own.
          </p>
        </>
      ),
    },
    {
      id: "what-we-remove-and-keep",
      title: "7. What is removed and what we keep",
      body: (
        <>
          <p>
            The law requires us to keep certain records even after you close your account, and some records must remain linked to the account record so that they are complete and can be audited. The table below states clearly what is removed or anonymised and what is kept, and why.
          </p>

          <h3>7.1 Removed or anonymised at closure</h3>
          <Table
            head={["Information", "What happens"]}
            rows={[
              ["Your name", <>Replaced with "Deleted user" in your profile.</>],
              ["Your email address", <>Replaced in your profile with a placeholder address that cannot receive mail. (Your real address may still appear in the retained records listed in section 7.2 below.)</>],
              ["Your phone number", <>Removed from your profile, if you had added one.</>],
              ["Your password", <>Replaced with an unusable random value, so the old password no longer works.</>],
              ["Password reset codes", <>Deleted.</>],
              ["Referral code", <>Cleared.</>],
              ["Social following and affiliate profile", <>Following connections are stopped and any affiliate profile is disabled.</>],
              ["Sign-in sessions", <>Ended immediately. The token in your browser is removed.</>],
              ["Demo balance and virtual funds", <>Have no value and are no longer available to you after closure. Demo trade and balance records are not deleted by the closure (see section 7.2).</>],
            ]}
          />

          <h3>7.2 Kept after closure</h3>
          <Table
            head={["Record", "What it contains", "Why we keep it"]}
            rows={[
              [
                "Deposits, withdrawals, trades and ledger entries",
                <>The history of money movements and trading on the account, with amounts, dates, payout percentages, prices and results, including demo trades and demo balance records (demo trades are not posted to the ledger; only real-money postings are). This includes payment records such as the M-Pesa phone number used, the M-Pesa receipt reference and the provider's response. The records are linked to the closed account record, which no longer shows your name or email address.</>,
                <>Accounting, audit, tax and anti-money-laundering record-keeping duties; the ability to answer a dispute, a regulator, a court or law enforcement; and to protect ourselves in legal claims.</>,
              ],
              [
                "Identity verification (KYC) records, if any",
                <>Your verification status, the document type and number and the links to any document images (front, back, selfie, proof of address) you provided, review decisions, rejection reasons and which staff member reviewed it and when.</>,
                <>Customer due diligence and record-keeping duties under anti-money-laundering law (see the <PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink>).</>,
              ],
              [
                "Record of the closure request",
                <>The closure reference, the date and time, the reason you selected, any comment you wrote, whether the confirmation email was sent, the IP address from which the closure was made, and your browser's user-agent (a technical description of your browser and device, limited to 300 characters). It is linked to the closed account record but does not contain your email address.</>,
                <>To prove that the account was closed by its owner, to deal with later disputes or claims of unauthorised closure, to detect fraud and abuse, and for audit.</>,
              ],
              [
                "Support tickets and messages",
                <>The tickets you opened, your messages, our replies and their dates.</>,
                <>To handle any unresolved issue, to defend complaints and claims, and to show how we dealt with you.</>,
              ],
              [
                "Records of emails we sent you",
                <>The recipient address (your original email address remains in these records), the email type, the subject line, the delivery status and any provider error details. The text of an email is cleared once it has been accepted by the email provider or has finally failed; it is held only while a failed send is waiting to be retried.</>,
                <>To prove that we sent you required notices and confirmations (for example the closure confirmation and deposit and withdrawal notices) and to investigate delivery problems and complaints.</>,
              ],
              [
                "Newsletter subscription record, if any",
                <>The email address you subscribed with, how you signed up, and the dates you subscribed or unsubscribed. See section 10.</>,
                <>To honour your unsubscribe choice and avoid sending you newsletters you have declined.</>,
              ],
              [
                "Other records linked to the account",
                <>In-app notifications, chart and indicator settings, trading account records and email verification token records (the token itself is stored only in hashed form). The closure does not delete these, and they stay linked to the anonymised account record.</>,
                <>They are part of the account record that holds the retained records together. They no longer show your name, email address or phone number.</>,
              ],
              [
                "Administrative audit records",
                <>Records of actions staff took on your account in the administration console (for example a status change), with the date and time. Some back-office actions are not recorded in this log.</>,
                <>Internal control, fraud prevention and audit.</>,
              ],
            ]}
          />

          <h3>7.3 Why the account record itself is kept</h3>
          <p>
            The closed account record is not erased. Your deposits, withdrawals, trades and ledger entries are tied to it and must be kept, so the record stays in our system with the status "Deleted". It carries no name, no email address that can receive mail, no phone number and no usable password. It exists only to hold the retained records together.
          </p>

          <h3>7.4 Where your email address may remain</h3>
          <p>
            Even though your profile no longer shows your email address, the address may remain in the email delivery records, in the newsletter subscription record and in support tickets and messages, because the address is part of those records. We keep it there only for the purposes listed above. The closure record itself does not contain your email address.
          </p>

          <Callout tone="warn" title="Closing an account does not erase everything">
            <p>
              Please do not assume that closing your account deletes every trace of your history. Records that the law requires us to keep are retained, and we say so openly. If you want to know what we hold about you after closure, use the rights described in section 13.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "retention-periods",
      title: "8. How long we keep retained records",
      body: (
        <>
          <h3>8.1 General rule</h3>
          <p>
            We keep retained records only for as long as the law requires, and for as long afterwards as is reasonably necessary to deal with claims and disputes that may still arise from the period the records cover. When the period ends, we intend to delete the records or anonymise them irreversibly so that they can no longer be linked to you. The platform does not yet delete retained records automatically, so this is done by our staff as part of our record-keeping procedures. We do not keep personal data for longer than needed for the purposes in this policy.
          </p>

          <h3>8.2 Retention periods</h3>
          <Table
            head={["Type of record", "How long we keep it"]}
            rows={[
              [
                "Financial, trading, ledger, payment and KYC records",
                <>For <Co field="retentionPeriod" /> after your account is closed, or for any longer period that the law, a court or a regulator requires. These periods follow the record-keeping duties in anti-money-laundering, tax and companies law, for example under the Proceeds of Crime and Anti-Money Laundering Act 2009.</>,
              ],
              [
                "Record of the closure request",
                <>For as long as we keep the financial records of the same account, because the closure record is needed to explain them.</>,
              ],
              [
                "Support tickets and messages",
                <>For as long as needed to handle your issue and any complaint or claim about it, and no longer than the period for the financial records.</>,
              ],
              [
                "Email delivery records",
                <>For as long as needed to show that required notices were sent, and no longer than the period for the financial records.</>,
              ],
              [
                "Newsletter subscription record",
                <>While you are subscribed. If you unsubscribe, emails stop and we keep the record that you unsubscribed so that we do not email you again.</>,
              ],
              [
                "Administrative audit records and other records linked to the account",
                <>For the same period as the financial records, or longer if needed to deal with a dispute, investigation or legal claim.</>,
              ],
              [
                "Records held for an investigation, dispute or legal claim",
                <>Until the matter is concluded and any appeal period has ended, even if that is longer than the period above.</>,
              ],
            ]}
          />

          <h3>8.3 We do not promise permanent erasure</h3>
          <p>
            We do not claim that every record about you is erased when you close your account, and closing it does not start an automatic deletion of the retained records in section 7. They stay on our systems for the periods above. When a period ends we will delete or anonymise the record, but backup copies may take additional time to be overwritten in the ordinary course of our backup cycle.
          </p>

          <h3>8.4 Longer retention</h3>
          <p>
            We may need to keep a record for longer than the usual period if, for example, a regulator, court, law enforcement body or the Financial Reporting Centre has asked us to preserve it, if we have reason to suspect an offence, or if a complaint or claim is pending. We will keep the record only for the extra time that is needed.
          </p>
        </>
      ),
    },
    {
      id: "protection-and-use-of-retained-data",
      title: "9. How retained data is protected and used",
      body: (
        <>
          <h3>9.1 Permitted uses</h3>
          <p>We use retained records only where the law requires it, and only for the following purposes:</p>
          <ul>
            <li>meeting our legal, tax, accounting and anti-money-laundering obligations;</li>
            <li>responding to lawful requests and orders from courts, regulators, the Financial Reporting Centre, tax authorities and law enforcement;</li>
            <li>audit, internal control and risk management;</li>
            <li>establishing, exercising or defending legal claims, and handling complaints and disputes;</li>
            <li>detecting, preventing and investigating fraud, abuse and unauthorised closure of accounts; and</li>
            <li>answering your own requests about your data (section 13).</li>
          </ul>

          <h3>9.2 What we do not do</h3>
          <ul>
            <li>We do not use retained records for marketing, and we do not send marketing to you because of them.</li>
            <li>We do not use them to build a new profile of you or to take decisions about you unrelated to the purposes above.</li>
            <li>We do not sell them.</li>
            <li>We do not use analytics, advertising or tracking scripts of our own on the platform that would add to them.</li>
          </ul>

          <h3>9.3 Access and security</h3>
          <p>
            Access to retained records is limited to authorised staff whose role requires it (for example Finance, Compliance or Support), and actions that staff take in the administration console are recorded in an audit log. Our website and interface are hosted by Render and our data is held in a managed database, and we apply technical and organisational measures that are appropriate to the risk, including password hashing and role-based access to staff functions. No system is completely secure, but we take care to protect the records that we hold.
          </p>

          <h3>9.4 Sharing</h3>
          <p>
            We share retained records only where necessary: with service providers who host or process them for us under our instructions, with professional advisers and auditors under a duty of confidentiality, and with courts, regulators and authorities when the law requires or allows it. Some of our service providers are located outside Kenya. The <PolicyLink slug="privacy">Privacy Policy</PolicyLink> explains who receives personal data and the safeguards that apply when data leaves Kenya under the Data Protection Act, 2019.
          </p>
        </>
      ),
    },
    {
      id: "newsletter-and-emails",
      title: "10. Emails and the newsletter after closure",
      body: (
        <>
          <h3>10.1 Newsletter</h3>
          <p>
            Our newsletter is a separate, optional subscription. Closing your account does not by itself unsubscribe an email address that you subscribed through the newsletter form, and unsubscribing does not close your account. If you receive our newsletter and no longer want it, use the one-click unsubscribe link in any newsletter email. We promise never more than a few emails a month. If you unsubscribe, we keep a record of that decision so that we do not email you again.
          </p>

          <h3>10.2 Emails after closure</h3>
          <p>
            After closure we do not send you marketing. The closure confirmation is the last service email we expect to send you in connection with the account, other than replies to messages you send to Support. We may still contact you by email if we must for legal reasons, to deal with a complaint or dispute you have raised, to respond to a request you have made, or to give you a notice that the law requires. Your sign-up email address in the profile is replaced, so we would use the address in the retained records for this purpose.
          </p>

          <h3>10.3 Transactional emails</h3>
          <p>
            While your account is open, we send service emails regardless of newsletter choices, such as welcome, email verification, password, identity verification, deposit, withdrawal and closure emails. These are not marketing and are needed to operate the account.
          </p>
        </>
      ),
    },
    {
      id: "closure-by-us",
      title: "11. Closure, suspension or restriction by us",
      body: (
        <>
          <h3>11.1 When we may act</h3>
          <p>
            This section matches section 13 of the <PolicyLink slug="terms">Terms and Conditions</PolicyLink>, which prevails if the two differ. We may suspend, lock, restrict or close an account, in whole or in part (for example, by blocking trading, deposits or withdrawals while allowing you to sign in), if we reasonably believe that any of the following applies:
          </p>
          <ul>
            <li>you have broken the Terms and Conditions, the <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink> or this policy;</li>
            <li>you are under the minimum age of 21, or you gave false or misleading information when you registered or when we asked you to verify your identity;</li>
            <li>you hold more than one account, or you allow another person to use your account or use someone else's;</li>
            <li>we suspect fraud, money laundering, terrorism financing, sanctions evasion, market abuse, manipulation of our prices or exploitation of a system error, or any other unlawful activity;</li>
            <li>you did not provide documents or information that we reasonably requested under the <PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink> within a reasonable time;</li>
            <li>your use of the platform is abusive, threatening or harmful to our staff, other clients or the platform, or puts the security or stability of our systems at risk;</li>
            <li>we are required to do so by law, by a court order, or by a direction from a regulator or law enforcement body;</li>
            <li>you live in, or use the platform from, a place where our services are not offered or are prohibited (see section 4 of the <PolicyLink slug="terms">Terms and Conditions</PolicyLink>);</li>
            <li>we decide to stop providing the service in whole or in part for commercial, technical or legal reasons.</li>
          </ul>

          <h3>11.2 Notice</h3>
          <p>
            Where it is lawful and does not put anyone at risk, we will tell you before or promptly after we take the action, by email to the address on your account or in the app, and we will give you the reason in general terms. We may not give a reason, or notice, if doing so could tip off a person suspected of an offence, compromise an investigation or breach a legal duty. In particular, the law may forbid us from telling you that we have made a report to the authorities.
          </p>
          <p>
            Where we end our agreement with you and close your account for a reason that does not involve a serious breach, suspected wrongdoing or a legal requirement, we will give you at least 30 days' notice by email, as set out in section 13.4 of the <PolicyLink slug="terms">Terms and Conditions</PolicyLink>, so that you can settle your account.
          </p>

          <h3>11.3 What the statuses mean</h3>
          <Table
            head={["Account status", "Meaning"]}
            rows={[
              ["Active", <>The account works normally.</>],
              ["Pending verification", <>The account is waiting for identity verification to be completed or reviewed.</>],
              ["Suspended", <>We have paused the account while we look into a matter. You may be unable to trade, deposit or withdraw.</>],
              ["Locked", <>The account has been locked, for example for security reasons. You may be unable to sign in or operate it until we have resolved the issue.</>],
              ["Deleted", <>The account has been closed through the self-service page and cannot be reopened.</>],
            ]}
          />
          <p>
            Administrators can set an account to Active, Suspended or Locked, and each change is recorded in an audit log. The platform does not currently have an administrator tool that performs the full closure described in section 6 on your behalf. If we end our agreement with you, we will restrict or lock the account and then deal with the records as described in this policy; the removal of personal details from the profile is then carried out by our staff and may not happen at the same moment as the restriction.
          </p>

          <h3>11.4 Open trades when we act</h3>
          <p>
            If we suspend or restrict your account, trades already open at that moment will, unless the law or a clear technical error requires otherwise, normally be settled at their expiry in the usual way in accordance with the <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink>. If we have reasonable grounds to believe a trade was made through abuse, a clear technical error or a breach of the rules, we may review it and, as explained in section 12 of the <PolicyLink slug="terms">Terms and Conditions</PolicyLink>, void it.
          </p>

          <h3>11.5 Your balance when we close or restrict your account</h3>
          <p>
            When real-money accounts are available, we will not keep a real balance that belongs to you merely because we closed your account. Unless the law prevents us, we will pay the balance to which you are entitled to your M-Pesa line after we have completed our checks, which may include identity verification and anti-money-laundering checks, and after any amount you owe us has been deducted. We pay only to an M-Pesa line in your own name.
          </p>
          <p>We may delay, withhold or refuse a payout, and we may freeze all or part of a balance, where:</p>
          <ul>
            <li>the law, a court order or an authority requires or permits us to do so;</li>
            <li>we are investigating a reasonable suspicion of fraud, money laundering, terrorism financing or another offence;</li>
            <li>we cannot complete identity verification or confirm that the payout account belongs to you;</li>
            <li>the funds arose from a clear technical error, an unauthorised payment or abuse of the platform, in which case we may recover them as explained in the <PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink>.</li>
          </ul>
          <p>
            Demo funds have no value and are never paid out whatever the reason for closure.
          </p>

          <h3>11.6 Challenging our decision</h3>
          <p>
            If you think we have wrongly suspended, restricted or closed your account, contact Support (section 16) and, if you are not satisfied, make a complaint under the <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>. You may also take your concern to the regulator named in section 1.3, if there is one, and, for data matters, to the Office of the Data Protection Commissioner (ODPC).
          </p>

          <h3>11.7 Reopening</h3>
          <p>
            If we close an account, we may refuse to let the same person open another one, to protect other clients, to comply with the law or to protect our systems. Where we have closed your account for serious misconduct, we may keep a record of the closure and its reason, and use it only to stop the same person from returning, for fraud prevention and to comply with legal duties.
          </p>
        </>
      ),
    },
    {
      id: "inactive-accounts",
      title: "12. Inactive accounts",
      body: (
        <>
          <h3>12.1 No dormancy rules or fees today</h3>
          <p>
            NeuroOption does not currently have any rules or charges for inactive accounts. We do not charge inactivity, dormancy or maintenance fees, and we do not close an account only because you have not used it. Your account stays open until you or we close it under this policy.
          </p>

          <h3>12.2 Possible future rules</h3>
          <p>
            If we decide to introduce rules for inactive or dormant accounts, we will tell you in advance by email and on the platform, publish them in this policy, and apply them only after a reasonable notice period. Any such rule would be applied in a way that is fair and lawful and, when real-money accounts exist, would not cause a real balance to be forfeited. We will not apply a new inactivity fee or closure to an existing account without that prior notice.
          </p>

          <h3>12.3 Keep your details up to date</h3>
          <p>
            We may need to contact you, for example about a balance on an account that you have not used. Please keep your email address and, if you added one, your phone number up to date in your profile.
          </p>
        </>
      ),
    },
    {
      id: "your-data-rights-after-closure",
      title: "13. Your data rights after closure",
      body: (
        <>
          <h3>13.1 Your rights continue</h3>
          <p>
            Closing your account does not end your rights under the Data Protection Act, 2019. Those rights still apply to the personal data that we keep about you in the retained records. They are:
          </p>
          <ul>
            <li><strong>To be informed</strong> about how we use your personal data.</li>
            <li><strong>Access</strong> to your personal data that we hold.</li>
            <li><strong>Correction</strong> of data that is inaccurate or misleading.</li>
            <li><strong>Deletion</strong> of data that we no longer need or are not entitled to keep.</li>
            <li><strong>To object</strong> to certain processing.</li>
            <li><strong>Data portability</strong>, in the cases the Act provides for.</li>
          </ul>
          <p>The <PolicyLink slug="privacy">Privacy Policy</PolicyLink> explains these rights in more detail.</p>

          <h3>13.2 Limits that apply to retained records</h3>
          <p>
            Your right to deletion and to object is not absolute. We are not required to delete, and we will refuse to delete, a record that we must keep to meet a legal obligation (for example anti-money-laundering, tax or accounting record-keeping) or that we need to establish, exercise or defend legal claims, for as long as that obligation or need continues. When we refuse a request in whole or in part, we will tell you which records we are keeping and why, and we will tell you that you may complain to the ODPC. We will delete the record when the retention period in section 8 ends.
          </p>

          <h3>13.3 How to make a request</h3>
          <ol>
            <li>Write to <Co field="privacyEmail" /> and, if available, mark your message for the attention of the Data Protection Officer (<Co field="dataProtectionOfficer" />).</li>
            <li>Quote your closure reference (DEL-XXXXXXXX) if you have it, and state which right you want to use and what you are asking for.</li>
            <li>Write from the email address that was registered on the account, or give us enough detail to confirm who you are. We may ask you for additional information to confirm your identity, because we must not give personal data to the wrong person. We will only ask for what is necessary.</li>
          </ol>
          <p>
            Because a closed account cannot be signed in to, a request after closure is handled by email. We will respond within the time that the Data Protection Act, 2019 and its regulations require, and in any event as soon as reasonably possible. We do not charge a fee for an ordinary request, but we may refuse or charge a reasonable fee for requests that are clearly unfounded or excessive, as far as the law allows.
          </p>

          <h3>13.4 Complaints about your data</h3>
          <p>
            If you are unhappy with how we use your personal data, first contact us. If you are still not satisfied, you have the right to complain to the Office of the Data Protection Commissioner (ODPC). Our registration with the ODPC is: <Co field="odpcRegistration" />.
          </p>
        </>
      ),
    },
    {
      id: "opening-a-new-account",
      title: "14. Opening a new account later",
      body: (
        <>
          <h3>14.1 A fresh start</h3>
          <p>
            Because closure removes your email address from the profile, you may register again later with the same email address, if you are eligible. The new account is completely new. It does not inherit balances, trades, history, identity verification status, support tickets, referral code or settings from the closed account, and the closed account's records are not merged with it. You will receive a new demo balance and you will go through sign-up, email verification and any identity checks again.
          </p>

          <h3>14.2 Our checks on new accounts</h3>
          <p>
            Even though the new account is new, we may compare it with retained records of the old one (for example, by email address or phone number where they remain in those records) for legitimate purposes such as fraud prevention, anti-money-laundering checks and complying with the law. If your earlier account was closed by us for misconduct (section 11), we may decline your registration.
          </p>

          <h3>14.3 Eligibility</h3>
          <p>
            You must be at least <strong>21</strong> years old and otherwise eligible under the Terms and Conditions to open an account. Closing an account does not give you a way around any restriction, limit or rule that applied to you.
          </p>

          <h3>14.4 One account per person</h3>
          <p>
            Our rule is one account per person. If you hold two accounts, you may close one of them; the closure reason list includes "I have another NeuroOption account". If we find that you hold multiple accounts, we may act on them under section 11.
          </p>
        </>
      ),
    },
    {
      id: "special-situations",
      title: "15. Special situations",
      body: (
        <>
          <h3>15.1 You have died or lost capacity</h3>
          <p>
            An account cannot be passed on to another person. If an account holder dies or loses legal capacity, a family member or legal representative may contact Support. We may ask for documents such as a death certificate, a grant of probate or letters of administration, or a court order, and proof of the representative's identity, before we deal with the account or pay any real balance, which we will pay only to the lawful estate or representative after the checks described in section 11.5. This is a company practice, and it is handled case by case.
          </p>

          <h3>15.2 You suspect someone else closed your account</h3>
          <p>
            Contact Support immediately and quote the closure reference if you have one. We cannot restore the account, but we hold the record of the closure, including its date, IP address and user-agent, which we can use to investigate a claim that the closure was unauthorised, and which we can give to the police if appropriate. To protect your account, use a strong password, sign out on shared devices and do not share your password with anyone.
          </p>

          <h3>15.3 You have a complaint or claim against us</h3>
          <p>
            Closing your account does not waive any right you have to complain or to bring a claim. We keep the records we need to deal with them (section 7). Time limits that apply to complaints or claims continue to run after closure, so do not delay.
          </p>

          <h3>15.4 Legal holds</h3>
          <p>
            If we receive a legal notice, a court order or a request from an authority that relates to your account, we may need to prevent closure, suspend self-service closure, or keep additional records. Where the law allows, we will tell you.
          </p>
        </>
      ),
    },
    {
      id: "contact",
      title: "16. Contact us and changes to this policy",
      body: (
        <>
          <h3>16.1 How to contact us</h3>
          <Table
            head={["For", "Contact"]}
            rows={[
              ["Closing your account, or problems with the closure page", <>Use the <a href="/support">Support</a> page while signed in, or write to <Co field="supportEmail" />. Phone: <Co field="supportPhone" />. The public <a href="/help">Help Centre</a> also answers common questions.</>],
              ["Data protection requests", <><Co field="privacyEmail" />. Data Protection Officer: <Co field="dataProtectionOfficer" />.</>],
              ["Complaints", <><Co field="complaintsEmail" />. See the <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>.</>],
              ["Registered office", <><Co field="registeredAddress" /></>],
            ]}
          />
          <p>
            Signed-in clients can open support tickets in the app. If you have closed your account, you can no longer sign in, so please use the email contacts above and quote your closure reference.
          </p>

          <h3>16.2 Changes to this policy</h3>
          <p>
            We may update this policy, for example when real-money accounts become available, when the law changes or when we change how closure works. We will change the "Last updated" date at the top of the page. If a change is material and affects your rights (for example, a new retention period or new rules for inactive accounts), we will tell you in advance by email or on the platform where we can. A change does not apply retroactively to a closure that has already been completed, but it may apply to the retained records we still hold.
          </p>

          <h3>16.3 If part of this policy cannot be enforced</h3>
          <p>
            If any part of this policy is found to be unlawful or unenforceable, the rest of it continues to apply. This policy is governed by <Co field="governingLaw" />, as set out in the Terms and Conditions, and does not take away any right that you have under the law that cannot be excluded by agreement.
          </p>
        </>
      ),
    },
  ],
};

export default policy;
