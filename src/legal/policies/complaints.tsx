import type { Policy } from "../types";
import { Callout, Co, Definitions, PolicyLink, Table } from "../components";

const policy: Policy = {
  slug: "complaints",
  title: "Complaints Handling Policy",
  summary:
    "How to complain to NeuroOption, what happens to your complaint, how quickly we aim to respond, how we investigate trading complaints, and where you can take your complaint if you are not satisfied. Making a complaint is free and will not count against you.",
  updated: "2026-10-16",
  sections: [
    {
      id: "about-this-policy",
      title: "1. About this policy",
      body: (
        <>
          <p>
            In this policy, "NeuroOption", "we", "us" and "our" mean <Co field="legalName" /> (trading as NeuroOption), a company incorporated in <Co field="jurisdiction" /> with registration number <Co field="registrationNumber" /> and its registered office at <Co field="registeredAddress" />. "You" and "your" mean the person who holds, or has held, a NeuroOption account, or who has been affected by something we have done.
          </p>

          <h3>1.1 What this policy covers</h3>
          <p>
            This policy explains how to tell us that something has gone wrong, what counts as a complaint, how we deal with it, the timelines we work to, the outcomes you can expect, and what you can do if you are not satisfied with our answer. It applies to complaints about demo accounts today and, when real-money accounts are available, to complaints about real accounts as well.
          </p>

          <h3>1.2 How this policy fits with our other documents</h3>
          <p>
            This policy forms part of your agreement with us under the <PolicyLink slug="terms">Terms and Conditions</PolicyLink>, and supports the complaint steps in sections 11.3 and 24 of those Terms. The Terms also deal with errors, outages and void trades (section 12) and with our limits of liability (section 19). Many complaints are about a specific part of the service, and the policy that governs that part decides whether we got it right. You may find the following useful when you prepare a complaint:
          </p>
          <ul>
            <li>
              the <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink>, which explains how trades are priced, accepted and settled;
            </li>
            <li>
              the <PolicyLink slug="risk-disclosure">Risk Disclosure</PolicyLink>, which explains the risks of trading, including that you can lose your whole stake;
            </li>
            <li>
              the <PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink>, which explains that we are the counterparty to every trade;
            </li>
            <li>
              the <PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink>, for payment complaints;
            </li>
            <li>
              the <PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink>, for complaints about identity checks;
            </li>
            <li>
              the <PolicyLink slug="privacy">Privacy Policy</PolicyLink> and the <PolicyLink slug="cookies">Cookie and Browser Storage Policy</PolicyLink>, for complaints about personal data;
            </li>
            <li>
              the <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink>, for complaints about closing or restricting an account; and
            </li>
            <li>
              the <PolicyLink slug="responsible-trading">Responsible Trading Policy</PolicyLink>, if you feel your trading has become a problem for you.
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
            Do not assume that NeuroOption is licensed, regulated or supervised by any authority beyond what is stated in this table. Section 12 explains which outside bodies may be able to help you, and which of them have any power over us depends on our regulatory status shown above.
          </p>

          <h3>1.4 Our commitment and principles</h3>
          <p>
            We want to hear when we get something wrong, because it is the quickest way for us to put it right and stop it happening to someone else. We handle every complaint according to these principles.
          </p>
          <Table
            head={["Principle", "What it means in practice"]}
            rows={[
              ["Free", <>You pay nothing to make a complaint or to have it investigated. We do not ask you to buy anything, deposit anything or accept any condition in order to have your complaint looked at.</>],
              ["Fair", <>We look at the facts and at our own records, not only at what you or we say happened. We tell you the reasons for our decision. We apply the same standard whether you are a new client or a long-standing one, whether your account is large or small.</>],
              ["Timely", <>We acknowledge, investigate and answer within the targets in section 7, and we tell you early if we need more time.</>],
              ["Confidential", <>We share your complaint only with staff and professional advisers who need it to deal with it, and with the bodies described in sections 12 and 13. We handle personal data in line with the <PolicyLink slug="privacy">Privacy Policy</PolicyLink> and the Data Protection Act, 2019.</>],
              ["No retaliation", <>We will not close, suspend, restrict, treat less favourably or threaten you because you made a complaint in good faith, even if we decide that your complaint is not justified. See section 11.</>],
              ["Plain language", <>We write to you in plain English, give reasons, and avoid unexplained technical language.</>],
              ["Learning", <>We use complaints to find and fix the causes of problems. See section 15.</>],
            ]}
          />

          <Callout tone="info" title="Real-money services are not available yet">
            <p>
              Today NeuroOption offers demo trading with virtual funds only. Real-money deposits, withdrawals and trades are switched off on the platform. This policy describes how complaints about real-money services will be handled when real-money accounts are available, as well as how complaints about the demo service and the website are handled now. Nothing in it means that you can deposit, trade or withdraw real money today.
            </p>
          </Callout>

          <Callout tone="risk" title="Key points">
            <ul>
              <li>
                <strong>Complaining is free.</strong> We do not charge for receiving, investigating or answering a complaint.
              </li>
              <li>
                <strong>Two ways to complain.</strong> Open a support ticket at <a href="/support">Support</a> with a subject that starts with "Complaint", or email <Co field="complaintsEmail" />.
              </li>
              <li>
                <strong>No retaliation.</strong> We will not close, restrict or treat your account worse because you complained in good faith.
              </li>
              <li>
                <strong>You get a written final answer.</strong> We aim to acknowledge your complaint within 2 working days and give a final response within 15 working days.
              </li>
              <li>
                <strong>Losing a trade is not a complaint about the service.</strong> A fixed-time option that settles against you is an expected outcome, not a fault. A complaint can still be made about a price, a payout or a settlement that you believe was recorded wrongly.
              </li>
              <li>
                <strong>Prices are ours.</strong> All prices on NeuroOption come from our own synthetic price engine, not from any real market, and NeuroOption is the counterparty to every trade. We therefore explain below how we make sure a complaint about a trade is not decided by the people who gain from it.
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
              ["Acknowledgement", <>Our first written reply to your complaint, confirming that we have received it, giving it a reference and naming who is dealing with it.</>],
              ["Complainant", <>A person who makes a complaint. It includes someone who acts for you with your written permission (see section 4.3).</>],
              ["Complaint", <>Any expression of dissatisfaction with NeuroOption, our staff or our service, made by you in writing, that says or clearly implies that we have done something wrong, failed to do something we should have done, or treated you unfairly. See section 3.</>],
              ["Complaints Officer", <>The member of NeuroOption staff whom we designate to register complaints, assign them and make sure the deadlines in this policy are met. Where we are small enough that one person fills several roles, this person is still the point of contact for every complaint.</>],
              ["Demo account and virtual funds", <>Your "QT Demo" account and the virtual US dollars (USD) in it. Virtual funds are for practice only and have no monetary value.</>],
              ["EAT", <>East Africa Time (UTC+3). All times in this policy and on the Support page are EAT, and we state times in EAT in our replies.</>],
              ["Final response", <>Our written answer that tells you whether we uphold, partly uphold or reject your complaint, explains why, and says what we will do about it. See section 8.</>],
              ["Investigator", <>The member of staff who looks into the facts of a complaint and proposes an outcome.</>],
              ["Real account", <>Your "QT Real" account, held in Kenya Shillings (KES), which you fund with real money when real-money accounts are available.</>],
              ["Reference", <>The unique complaint reference we give you in our acknowledgement. Quote it every time you write to us about the same complaint.</>],
              ["Support ticket", <>A conversation you open with our team on the Support page of the platform, which is available when you are signed in.</>],
              ["Days", <>Calendar days, unless the policy says "working days".</>],
              ["Working day", <>Monday to Friday, excluding public holidays in Kenya. A complaint received after 17:00 EAT, or on a day that is not a working day, is treated as received on the next working day.</>],
            ]}
          />
        </>
      ),
    },
    {
      id: "what-is-a-complaint",
      title: "3. What is a complaint and what is not",
      body: (
        <>
          <h3>3.1 Complaints</h3>
          <p>
            A complaint is more than a question or a request. Examples of matters that we treat as complaints include:
          </p>
          <ul>
            <li>a trade that you believe was accepted, priced, settled or recorded incorrectly, including a payout that differs from the payout shown to you when you placed the trade;</li>
            <li>a trade that you believe was affected by a technical fault on our platform, such as a delayed settlement or a trade that was rejected or not shown correctly;</li>
            <li>a deposit that was taken from your M-Pesa account but not credited, or a withdrawal that is delayed, declined or paid incorrectly (when real-money accounts are available);</li>
            <li>a decision to refuse, suspend, restrict, lock or close your account, or to refuse or delay a payment, that you believe is unfair or wrongly applied;</li>
            <li>a decision on identity verification (KYC) that you believe is wrong, or a request for documents that you believe is unreasonable;</li>
            <li>how we have handled your personal data, or a request you made about your data;</li>
            <li>rude, unhelpful or inappropriate conduct by a member of our staff;</li>
            <li>unreasonable delay or no reply to a support ticket or an email;</li>
            <li>information on the platform, in an email or on our website that you believe is wrong or misleading;</li>
            <li>a failure to follow one of our own policies, or to give you something we said we would give you; and</li>
            <li>a failure to treat you properly because of a disability, a language difficulty, your age or a vulnerable circumstance (see section 14).</li>
          </ul>

          <h3>3.2 Matters that are not complaints</h3>
          <p>The following are normally dealt with as ordinary support requests, not as complaints, although you may still ask us to treat them as one:</p>
          <ul>
            <li>a question about how the platform works, how a payout is calculated, or how to reset a password;</li>
            <li>a request for a statement, a receipt or a copy of a record;</li>
            <li>a suggestion or a request for a new feature; and</li>
            <li>a first report of a technical problem that we have not yet had a chance to fix.</li>
          </ul>
          <p>
            If an ordinary request is not resolved to your satisfaction, or you tell us you are dissatisfied, we will treat it as a complaint from that point.
          </p>

          <h3>3.3 Matters that we cannot treat as justified complaints</h3>
          <p>
            Some things are not faults and we will say so politely if you complain about them. We will still register and answer your complaint, and we will still explain our reasons.
          </p>
          <ul>
            <li>
              <strong>Losing a trade.</strong> A fixed-time option pays out only if your direction is right at expiry. If your trade lost, was a draw or paid at the payout shown, and our records show it was accepted and settled in line with the <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink>, the result stands. A loss is not a refundable error.
            </li>
            <li>
              <strong>The price differing from the real market.</strong> All prices on NeuroOption are synthetic and come from our own price engine. They are not prices from any exchange, interbank market or data vendor, and they may differ from real-world prices of assets with similar names. This is disclosed in the <PolicyLink slug="risk-disclosure">Risk Disclosure</PolicyLink>.
            </li>
            <li>
              <strong>Not being able to cancel a trade.</strong> A trade cannot be closed or cancelled before expiry.
            </li>
            <li>
              <strong>Demo results.</strong> Virtual funds have no value and cannot be withdrawn, and demo results are not a promise of real results.
            </li>
            <li>
              <strong>Provider charges.</strong> Fees charged by M-Pesa or your mobile network are set by them, not by us. We do not charge a fee for deposits or withdrawals.
            </li>
          </ul>

          <Callout tone="warn" title="Complaining does not pause a trade or a deadline">
            <p>
              Making a complaint does not stop a running trade, undo a settled trade, or extend any time limit that applies to you in another policy. If something is urgent, such as a trade that is open right now or a payment that is time-critical, say so in the first line of your complaint so that we can look at it first.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "how-to-complain",
      title: "4. How to make a complaint",
      body: (
        <>
          <h3>4.1 Choose a channel</h3>
          <Table
            head={["Channel", "How to use it", "Best for"]}
            rows={[
              [
                "Support ticket (in the app)",
                <>
                  Sign in, open <a href="/support">Support</a>, choose "New ticket" and start the subject with the word "Complaint", for example "Complaint: trade settled at wrong payout". Describe what happened in the message box. We reply in the ticket and the platform normally also emails you so you know there is a reply, but the reply in the ticket is the one that counts, so check the ticket if you are waiting.
                </>,
                <>Anyone who can sign in to their account. The ticket keeps the full conversation in one place and you can add information at any time.</>,
              ],
              [
                "Email",
                <>
                  Write to <Co field="complaintsEmail" /> from the email address registered on your account, if you still have access to it, and put "Complaint" at the start of the subject line.
                </>,
                <>People who cannot sign in, for example because their account is closed, deleted, locked or suspended, or because they cannot reach the Support page; and people who prefer email. The platform does not send ticket reply emails to deleted accounts.</>,
              ],
            ]}
          />
          <p>
            Only signed-in users can open support tickets, so if you cannot sign in, please use the complaints email address. We do not accept complaints by social media message, in comments or reviews, or by phone call alone, because we need a written record that we can investigate and reply to. If you cannot write, see section 14 for the help we can give.
          </p>

          <h3>4.2 What to include</h3>
          <p>
            The more precise your complaint, the faster we can resolve it. Please include as much as you can of the following:
          </p>
          <ul>
            <li>the email address of your account (and, if you are writing by email, say so if it is different from the email you are writing from);</li>
            <li>a clear description of what went wrong and why you think we are responsible;</li>
            <li>the date and time of each event, in East Africa Time (EAT);</li>
            <li>any references that identify the item: the trade ID (if your trade history shows one) or the instrument, direction, stake, expiry and payout you saw; or the M-Pesa transaction code and amount for a payment;</li>
            <li>screenshots or copies of any message, error or email you received (you can paste the text into the ticket or attach images when you write by email);</li>
            <li>what you have already done to try to put it right, and the answers you were given; and</li>
            <li>the outcome you want, for example a correction, an explanation, a refund of a specific amount or an apology.</li>
          </ul>
          <Callout tone="warn" title="Never send your password or PIN">
            <p>
              Do not put your password, your M-Pesa PIN, a password-reset code or any full card or security detail in a complaint. We will never ask for them. If you included one by mistake, change your password at once and tell us so that we can remove it from view.
            </p>
          </Callout>

          <h3>4.3 Complaining through someone else</h3>
          <p>
            You may ask a relative, a lawyer, an adviser or another representative to complain for you. We will need your written permission, sent from your registered email address or signed by you, naming the person and saying what they may discuss with us. We may contact you directly to confirm it. We will not discuss your account with anyone else without your permission unless the law requires us to, for example under a court order.
          </p>

          <h3>4.4 Practical limits of the support ticket</h3>
          <ul>
            <li>A ticket subject can be 3 to 120 characters and a single message up to 4,000 characters. If you need to say more, add further messages to the same ticket. The Support page shows the first 200 messages of a ticket, so if a ticket becomes very long, start a new one and quote the old subject.</li>
            <li>You can have up to 10 tickets that are not closed at once. If you reach that limit, continue your complaint in one of your open tickets or ask us to close a finished one. You cannot close a ticket yourself.</li>
            <li>A ticket cannot carry file attachments at present. Describe screenshots in words, or include the text of messages, and we may ask you to send images by email to <Co field="complaintsEmail" />.</li>
            <li>Writing in a closed ticket reopens it and puts it back in the queue of our support team.</li>
            <li>The Support page shows who wrote each message and when, in EAT, and the ticket status, which is shown as "Open", "Waiting for support", "Support replied" or "Closed". Replies from our staff appear as "NeuroOption Support" and do not name the member of staff.</li>
          </ul>

          <h3>4.5 Complaints made in the wrong place</h3>
          <p>
            If you tell us about a problem in an ordinary ticket or email without using the word "Complaint", we will still treat it as a complaint if it fits section 3.1. When we realise this, we will register it and tell you the reference. You do not lose any right by using the wrong channel.
          </p>
        </>
      ),
    },
    {
      id: "who-handles",
      title: "5. Who handles your complaint",
      body: (
        <>
          <h3>5.1 Roles</h3>
          <p>
            The platform gives staff different permissions by role (Super Admin, Finance, Support, KYC, Risk and Compliance). As a matter of policy, we allocate the following complaint roles to our staff. In a small team one person may hold more than one of them, subject to the independence rules in section 5.2.
          </p>
          <Table
            head={["Role", "Responsibility in a complaint"]}
            rows={[
              ["Support team", <>Receives complaints sent as tickets, sends the acknowledgement, collects information from you, and resolves simple complaints where the answer is clear and within the support team's powers.</>],
              ["Complaints Officer", <>Registers every complaint, gives it a reference, decides which complaints need an investigation, assigns the Investigator, monitors deadlines, signs off Final responses on ordinary complaints, and keeps the complaints record.</>],
              ["Investigator", <>Collects the records, reviews them, talks to the staff involved and proposes an outcome. The Investigator may be a member of the Support, Finance, Risk, KYC or Compliance team, depending on what the complaint is about. Not every role can see every record, so for a trading or payment complaint the Investigator will be someone whose role gives access to the trading or payment records.</>],
              ["Senior reviewer", <>A senior manager or director whom we appoint to review complaints that you ask us to review again (section 10), complaints about the conduct of staff, and complaints that involve larger sums, repeated issues or a possible legal or regulatory breach.</>],
              ["Compliance function", <>Advises on complaints about identity checks, account restrictions, data protection, suspected breaches of law and anything that may need to be reported to a public body (section 13).</>],
            ]}
          />

          <h3>5.2 Independence</h3>
          <p>
            Wherever we reasonably can, the person who investigates a complaint will not be the person who made the decision or took the action that you are complaining about, and will not report to that person. This matters especially because NeuroOption is the counterparty to every trade and gains when a client's trade loses. We therefore do not let anyone whose pay, targets or performance depends on trading revenue decide a complaint about a trade result. The <PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink> explains this conflict.
          </p>
          <p>
            If you complain about a particular person, that person will not take part in handling your complaint, and the complaint will go to the Senior reviewer. If the Complaints Officer is the subject of the complaint, a director or another senior person will take over that role.
          </p>
          <p>
            Because NeuroOption is an early-stage business with a small team, complete independence is not always possible. When it is not, we will tell you who made the original decision and who has reviewed it, and we will have a second person check the outcome before we send the Final response.
          </p>

          <h3>5.3 Access to your information</h3>
          <p>
            Staff see only what they need. Access to client records on the platform is limited by role, and actions that staff take on accounts, tickets and payments are recorded in an audit log that only some roles can open. An Investigator is given the records that are relevant to your complaint, and the audit log can show who changed what and when.
          </p>
        </>
      ),
    },
    {
      id: "complaints-process",
      title: "6. How we handle a complaint step by step",
      body: (
        <>
          <ol>
            <li>
              <strong>Receipt and registration.</strong> Your complaint arrives as a ticket or an email. The Complaints Officer registers it in our complaints record (kept by our staff, not generated by the platform) and gives it a Reference. The date and time of receipt are the time the ticket message or email reached us, shown in EAT on the ticket or the email.
            </li>
            <li>
              <strong>Acknowledgement.</strong> We write to you confirming receipt, quoting your Reference, naming a contact, summarising our understanding of the complaint, and telling you the date by which we aim to give a Final response. If we have not understood the complaint, we ask you to correct our summary.
            </li>
            <li>
              <strong>Early resolution.</strong> If the problem is simple and the right answer is plain, for example an obvious error on our side that we can correct immediately, the Support team may fix it and send the Final response straight away. If you accept the answer, the complaint is closed. If you do not, tell us and the complaint continues as a full investigation.
            </li>
            <li>
              <strong>Triage.</strong> The Complaints Officer decides how serious and urgent the complaint is, which team's records are needed, and whether a Senior reviewer should be involved. Complaints that involve money which may be wrongly held, an account that is locked or suspended, a possible security problem, a data breach or a vulnerable client are treated as priority complaints (section 7.2).
            </li>
            <li>
              <strong>Investigation.</strong> The Investigator gathers and reviews the records described in section 9, asks you for anything missing, and asks the relevant staff for their account.
            </li>
            <li>
              <strong>Decision.</strong> The Investigator proposes an outcome, and a different person approves it (the Complaints Officer, or the Senior reviewer for complaints they are responsible for).
            </li>
            <li>
              <strong>Final response.</strong> We send you the Final response in writing, in the ticket and by email, as described in section 8, and we carry out any remedy we have promised.
            </li>
            <li>
              <strong>Closing and follow-up.</strong> We close the complaint in our record. If the Final response told you that we would do something, we check that it was done. You can then ask for a review (section 10) or take the matter further (section 12).
            </li>
          </ol>
          <p>
            During the process we may contact you for more information. Please reply promptly. If we have not heard from you after we have written twice, the second time with at least 7 days between messages, we may close the complaint on the basis of the information we have and tell you how to reopen it. If you reply in the ticket after it is closed, it is reopened automatically. We will not do that if the delay is caused by a vulnerable circumstance, an illness or something else that we know about.
          </p>
        </>
      ),
    },
    {
      id: "timelines",
      title: "7. Our response times",
      body: (
        <>
          <h3>7.1 Target times</h3>
          <p>
            These are the times we aim to meet. They count in working days from the day we receive your complaint, and a day on which we are waiting for information that only you can give is not counted. The review request period is in calendar days. We have set the times to be achievable for a small team.
          </p>
          <Table
            head={["Stage", "Standard complaint", "Priority complaint"]}
            rows={[
              ["Acknowledgement", <>Within 2 working days</>, <>Within 1 working day</>],
              ["Investigation update (if the complaint is not yet resolved)", <>Every 5 working days after the acknowledgement</>, <>Every 3 working days after the acknowledgement</>],
              ["Final response", <>Within 15 working days</>, <>Within 5 working days where possible, and in any case within 15 working days</>],
              ["Extension notice", <>Before the 15 working days end, with reasons and a new date</>, <>Before the 5 working days end, with reasons and a new date</>],
              ["Longest time to a Final response, even with an extension (subject to section 7.3)", <>35 working days</>, <>35 working days</>],
              ["Request for internal review (by you)", <>Within 30 days of the Final response</>, <>Within 30 days of the Final response</>],
              ["Answer to an internal review", <>Within 10 working days</>, <>Within 10 working days</>],
            ]}
          />
          <p>
            These are targets, not guarantees. If we miss one, we will tell you why and when to expect an answer, and a late answer does not by itself decide the complaint in your favour or ours.
          </p>

          <h3>7.2 Priority complaints</h3>
          <p>We treat a complaint as a priority if it is about:</p>
          <ul>
            <li>funds that you say have been taken but not credited, or a withdrawal that you say is overdue beyond the time stated in the <PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink> (when real-money accounts are available);</li>
            <li>an account that has been locked, suspended or closed, where you say you cannot access money that belongs to you;</li>
            <li>unauthorised access to your account, or a security concern;</li>
            <li>a trade that is still open or a technical problem that may affect other clients;</li>
            <li>a personal data breach or a request that has a legal deadline (see section 12.2); or</li>
            <li>a client who tells us that they are vulnerable or are in difficulty because of their trading (section 14).</li>
          </ul>

          <h3>7.3 If we need more time</h3>
          <p>
            Some complaints take longer, for example if they involve a technical investigation, records held by Safaricom or another provider, or several teams. If we cannot give you a Final response within the time in section 7.1, we will write to you before the deadline to explain why, what we still need to do, and the date by which you will have the Final response. We will not extend beyond 35 working days from the date of receipt unless the delay is caused by someone outside our control, such as a public authority or a payment provider, or because we are waiting for information from you. If so, we will tell you who and keep you updated.
          </p>

          <h3>7.4 Where the platform and email work</h3>
          <p>
            When our team replies in a support ticket, the ticket status changes to "Support replied" and the platform sends an email to the address on your account that includes the reply. The reply is saved in the ticket even if the email fails to send or is not delivered, and no email is sent to a deleted account. The platform does not send an automatic receipt when you open a ticket or when you reply, so the acknowledgement described in section 6 is a message written by our staff, not an automated message, and the complaint Reference is given by our staff in that message. Check your ticket and your email, including your spam folder, for our replies. If we have not acknowledged your complaint within the time in section 7.1, please write again in the same ticket quoting the date you first wrote, or email <Co field="complaintsEmail" />.
          </p>
        </>
      ),
    },
    {
      id: "final-response",
      title: "8. The Final response",
      body: (
        <>
          <h3>8.1 What it contains</h3>
          <p>A Final response is written, dated in EAT and quotes your Reference. It will:</p>
          <ul>
            <li>list each point of your complaint and say whether we uphold it, partly uphold it or reject it;</li>
            <li>explain our reasons and refer to the records, rules or policies we relied on, in plain language;</li>
            <li>state the outcome and any remedy, with amounts, dates and what you need to do (if anything);</li>
            <li>if we reject all or part of your complaint, say so clearly and explain what you can do next; and</li>
            <li>tell you how to ask for an internal review and which outside bodies you may approach (sections 10 and 12).</li>
          </ul>

          <h3>8.2 How we send it</h3>
          <p>
            We send the Final response in the support ticket, if the complaint was made by ticket, and by email to the address on your account or the address you wrote from. If you complained by email, we reply by email to that address. A Final response is treated as received on the day we send it.
          </p>

          <h3>8.3 Admission and offers</h3>
          <p>
            If we find that we made a mistake, we will say so. An apology or an explanation of what happened is not a legal admission of liability for more than the remedy we offer. If we offer a remedy in full and final settlement of the complaint, we will say so, and you do not have to accept it. Accepting it may limit further claims about the same matter, and we will explain that in the offer so that you can take advice first.
          </p>
        </>
      ),
    },
    {
      id: "trading-complaints",
      title: "9. How we investigate trading and payment complaints",
      body: (
        <>
          <h3>9.1 Records we use</h3>
          <p>
            For a complaint about a trade or an account balance, the Investigator reviews the records that the platform keeps. The records available depend on the type of complaint:
          </p>
          <Table
            head={["Record", "What it shows", "Used for"]}
            rows={[
              ["Trade record", <>The instrument, direction (BUY or SELL), stake, expiry, the payout percentage that was locked when the trade was accepted, the entry price, the settlement price, the outcome (win, loss or draw) and the times of acceptance and settlement.</>, <>Whether the trade was accepted and settled as the rules say, and whether the payout and result are correct.</>],
              ["Account transaction records", <>For each movement on your account, such as a stake placed, a payout or a refund: the type, the amount, the balance after it and the time. Demo trades are recorded in this way only.</>, <>Whether your balance is correct and whether a stake or payout was credited or debited once and only once, for demo and real accounts.</>],
              ["Ledger entries (real accounts)", <>When real-money accounts are available, deposits, withdrawals, stakes, wins, losses and refunds on a real account are also posted to a double-entry ledger. Ledger entries are added and never changed or deleted. The ledger is not used for demo trades.</>, <>Checking a real account balance against an unchangeable record, and that each posting was made only once.</>],
              ["Payout history", <>The payout percentage published for each instrument over time, with a version number and the reason for each change. A trade records the payout version it was accepted at.</>, <>Explaining why the payout on an instrument was what it was when you traded.</>],
              ["Deposit and withdrawal records", <>For real accounts: the amount, the status, the M-Pesa phone number, the M-Pesa receipt and the provider's response, and the review status and any reason for declining a withdrawal.</>, <>Payment complaints: whether a deposit was confirmed by Safaricom, held for review or failed, and whether locked funds were returned.</>],
              ["Account status and KYC records", <>Account status, KYC status and the reason for any rejection, and the dates of changes.</>, <>Complaints about restrictions, locks, closures and identity checks.</>],
              ["Audit log", <>Actions taken by staff on an account or a payment, who took them and when.</>, <>Whether staff acted within their authority and who made a decision.</>],
              ["Support tickets and messages", <>What you wrote, what we replied and when.</>, <>Delay and service complaints, and what you were told.</>],
              ["Email delivery records", <>The recipient, subject and delivery status of emails the platform sent you (not the content).</>, <>Whether a notice, a confirmation or a reply was sent.</>],
              ["System and server records", <>Platform logs and monitoring information for the relevant time, to the extent they are still held.</>, <>Complaints about outages, errors or delays.</>],
            ]}
          />
          <p>
            We can only use records that exist. If a record has been deleted or has not been kept, we will say so in the Final response and explain how we reached our decision without it.
          </p>

          <h3>9.2 How a trade is checked</h3>
          <p>For a complaint about a particular trade, the Investigator will normally check:</p>
          <ol>
            <li>that the trade was accepted at the time you say and that the stake was taken from your available balance;</li>
            <li>that the payout percentage locked at the moment of acceptance is the one that was shown to you. If the payout changed between the moment you saw it and the moment you submitted, the trade is rejected and you have to confirm the new payout, so an accepted trade carries the payout recorded in the trade record;</li>
            <li>that the entry price is the platform price at the moment of acceptance and the settlement price is the platform price at settlement, at or after expiry, and that the outcome follows from them: a win pays the stake plus the stake multiplied by the payout percentage, a loss loses the stake, and a draw (settlement price equal to entry price) refunds the stake;</li>
            <li>that the time between expiry and settlement was normal, and, if not, whether a delay or outage affected the settlement price used; and</li>
            <li>that the account transaction records (and, for a real account, the ledger) show the correct entries, once each.</li>
          </ol>

          <Callout tone="risk" title="The prices are our own, and we are on the other side of the trade">
            <p>
              NeuroOption's prices come from our own synthetic price engine and are not prices from any exchange, bank or data vendor. NeuroOption is the counterparty to every trade, so we gain when you lose. Because you cannot check our prices against an independent market, we explain in the Final response what our own records show for the trade, including the entry price, the settlement price and the time of each, so that you can see the basis for our decision. A different person from the one who benefits from the result reviews the outcome (section 5.2).
            </p>
          </Callout>

          <h3>9.3 Delays, outages and technical errors</h3>
          <p>
            Settlement normally happens at expiry. If there is a delay or an outage, settlement may happen later, using the price available when settlement runs, and the <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink> and the <PolicyLink slug="risk-disclosure">Risk Disclosure</PolicyLink> explain this risk. In a complaint we will check whether the delay was caused by a fault on our side and what effect it had. Section 12 of the Terms and Conditions explains our right to review, correct or void trades that were clearly affected by a technical error, for example a price that was plainly wrong or a trade that was accepted twice. Please raise a complaint about a trade or transaction as soon as you can, and ideally within 30 days, as section 24.2 of the Terms asks, because the records are easier to check while they are recent. A later complaint is still accepted, and this does not shorten any time limit that the law gives you. If we correct a trade, in your favour or against you, we will explain what we did and why, and apply the correction both ways: we will not leave uncorrected an error that favours us.
          </p>

          <h3>9.4 Payment complaints</h3>
          <p>
            When real-money accounts are available, a deposit is credited only after Safaricom confirms it, and a deposit whose paid amount differs from the requested amount is held under review. In a payment complaint we check the deposit or withdrawal record against the M-Pesa receipt you give us. If the money was taken by M-Pesa but the deposit failed or was cancelled, the money is reversed by the provider. If it was not reversed, we help you raise it with Safaricom and we will not charge you for doing so. Each withdrawal is reviewed by our staff before it is paid, and a declined, failed or cancelled withdrawal returns the locked funds to your balance. See the <PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink>.
          </p>

          <h3>9.5 What we ask of you</h3>
          <ul>
            <li>Tell us the facts as accurately as you can and give us any records you have.</li>
            <li>Keep your own copy of anything you may need, such as M-Pesa confirmation messages and screenshots.</li>
            <li>Do not delete messages or emails relating to your complaint.</li>
          </ul>
          <p>
            We will not close or delete records that relate to an open complaint, even if the account is closed in the meantime. See the <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink>.
          </p>
        </>
      ),
    },
    {
      id: "outcomes-remedies",
      title: "10. Outcomes, remedies and internal review",
      body: (
        <>
          <h3>10.1 Possible outcomes</h3>
          <Table
            head={["Outcome", "What it means"]}
            rows={[
              ["Upheld", <>We agree that we were wrong in the way you describe. We put it right with a remedy from the list in section 10.2.</>],
              ["Partly upheld", <>We agree with some of your points but not others. We explain which, and apply a remedy to the points we uphold.</>],
              ["Not upheld", <>Our records and rules show that we acted correctly. We explain why and tell you what you can do next.</>],
              ["Resolved without a finding", <>The matter was solved to your satisfaction before a full investigation, for example by an immediate correction, and you have told us you are content.</>],
            ]}
          />

          <h3>10.2 Remedies we may offer</h3>
          <p>The remedy depends on what went wrong. We may offer one or more of the following:</p>
          <ul>
            <li>an explanation and, where we made a mistake, an apology;</li>
            <li>correcting the record, for example fixing a wrongly recorded trade result, payout, balance or account status;</li>
            <li>crediting your account, for a real account in Kenya Shillings (KES) and for a demo account in virtual funds, with money or funds that you should have received, such as a stake or payout that was wrongly debited or not credited;</li>
            <li>refunding a deposit, a stake or an amount that we should not have taken, according to the <PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink>;</li>
            <li>releasing locked funds, or reversing a restriction that was wrongly applied;</li>
            <li>correcting or deleting personal data, or completing a data request, in line with the <PolicyLink slug="privacy">Privacy Policy</PolicyLink>;</li>
            <li>reimbursing a reasonable, proven out-of-pocket cost that you incurred directly because of our error, such as a provider's charge, where you give us the proof; and</li>
            <li>changing how we do something so the problem does not happen again, and telling you what we changed.</li>
          </ul>
          <p>
            We do not pay compensation for the fact that a trade lost, for a price that differs from real markets, or for losses that are not caused by our error. Section 19 of the Terms and Conditions sets out the limits of our liability. Nothing in this policy or in those Terms limits any right you have under Kenyan law that cannot be limited by agreement, including under the Consumer Protection Act 2012.
          </p>

          <h3>10.3 Internal review</h3>
          <p>
            If you are not satisfied with a Final response, you may ask us to review it again. Do so within 30 days of the date of the Final response, by writing in the same ticket or by emailing <Co field="complaintsEmail" /> with your Reference and saying why you disagree. You do not need to provide new facts, but any you have will help.
          </p>
          <ul>
            <li>The review is carried out by a Senior reviewer who did not take part in the original decision.</li>
            <li>The reviewer looks at the whole file and your reasons, and may talk to you and to the staff concerned.</li>
            <li>We aim to give you the result of the review within 10 working days. If we need more time, we will tell you why and give a date.</li>
            <li>The result is a written review decision. It either confirms, changes or replaces the Final response. This is our last internal word on the matter.</li>
          </ul>
          <p>
            If you ask for a review after 30 days, we will still consider it if you have a good reason for the delay, for example illness, or new evidence.
          </p>
        </>
      ),
    },
    {
      id: "no-retaliation",
      title: "11. No retaliation and good-faith complaints",
      body: (
        <>
          <p>
            You can complain without fear. We will not close, suspend, lock or restrict your account, change your payout, delay a payment, refuse to deal with you or treat you less well than other clients because you made a complaint, asked for a review or contacted an outside body, as long as you acted in good faith. A complaint that turns out to be wrong is still a good-faith complaint.
          </p>
          <p>
            This does not prevent us from acting on a separate matter that has nothing to do with your complaint, for example if our checks show that an account breaches the Terms and Conditions or the law. If we do this while a complaint is open, we will tell you, give you the reasons, and make sure a different person takes that decision from the one handling your complaint.
          </p>
          <p>
            We may stop dealing with a complaint if it is abusive, threatening, repeated without new information after we have given a full answer, or made in bad faith. We will warn you first, explain why, and still tell you how to reach an outside body. Staff who receive abuse are entitled to protection, and we may ask you to communicate in writing only. We will not use this to avoid a justified complaint.
          </p>
          <p>
            Our staff may not take any action against a colleague who reports in good faith that a complaint was mishandled or was hidden.
          </p>
        </>
      ),
    },
    {
      id: "external-escalation",
      title: "12. If you are still not satisfied: outside bodies and courts",
      body: (
        <>
          <p>
            You do not have to use our process first, and you can go to an outside body at any time. We encourage you to give us the chance to put things right, and our Final response will tell you where to go next. Whether an outside body has any power over NeuroOption depends on its legal powers and on our regulatory status shown in section 1.3. We do not give telephone numbers or addresses for outside bodies in this policy, and you should check an organisation's own official website or office for how to contact it.
          </p>

          <h3>12.1 Financial and market-conduct complaints</h3>
          <p>
            Our regulator, if any, is shown in section 1.3 as <Co field="regulator" /> with licence <Co field="licence" />. If a regulator is named there, you may complain to it about the way we have treated you in a matter within its powers, if we have not resolved your complaint, and we will give it full co-operation.
          </p>
          <p>
            The Capital Markets Authority (CMA) is the public body that regulates the capital markets in Kenya. You may report a concern about a financial or investment service to the CMA. We tell you plainly that we cannot promise the CMA will take up a complaint about us, and that, unless section 1.3 shows otherwise, you should not treat NeuroOption as licensed or supervised by it or by any other regulator.
          </p>
          <p>
            You may also contact the Competition Authority of Kenya or the relevant consumer protection body about unfair trading practices under the Consumer Protection Act 2012, and the police or the Directorate of Criminal Investigations about fraud or offences under the Computer Misuse and Cybercrimes Act 2018. If your complaint is about money taken through M-Pesa, Safaricom also has its own complaints process for its own service, which you can use at the same time as ours.
          </p>

          <h3>12.2 Data protection complaints</h3>
          <p>
            If your complaint is about how we have used your personal data, or about our handling of a request such as access, correction or deletion, you may complain to the Office of the Data Protection Commissioner (ODPC) under the Data Protection Act, 2019. We encourage you to contact our data protection contact at <Co field="privacyEmail" /> first (the data protection officer is <Co field="dataProtectionOfficer" />), but you do not have to. Our ODPC registration is <Co field="odpcRegistration" />. A request about your own personal data has legal time limits, so we treat these complaints as priority complaints and do not wait for the standard times in section 7.
          </p>

          <h3>12.3 Courts and other dispute resolution</h3>
          <p>
            You keep the right to take legal action. The Terms and Conditions are governed by <Co field="governingLaw" />. A court of competent jurisdiction can decide a dispute that we have not resolved. You may also agree with us to use mediation, arbitration or another form of alternative dispute resolution, and we are willing to consider a reasonable proposal. In Kenya there are time limits for starting legal action, and the time limit does not stop while we are dealing with your complaint, so you should take your own advice if you are concerned about time. We encourage you to take independent legal advice, and some advice centres and bar associations offer free or low-cost help.
          </p>

          <Callout tone="info" title="Think before you act on a deadline">
            <p>
              Our internal process does not extend any limitation period or other legal deadline that applies to you. If you are close to a deadline, contact an outside adviser at once, and tell us so that we can treat your complaint as a priority.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "serious-issues",
      title: "13. Serious matters and reporting to authorities",
      body: (
        <>
          <p>
            Some complaints reveal a matter that goes beyond your individual case, for example a suspected fraud, a security breach, a data breach, a risk to other clients or a breach of the law. In such a case:
          </p>
          <ul>
            <li>we pass the matter to the Compliance function and a Senior reviewer, who decide what must be done;</li>
            <li>we may need to report it to a public authority, such as the Office of the Data Protection Commissioner for a personal data breach, the Financial Reporting Centre (FRC) for a suspicious transaction under the Proceeds of Crime and Anti-Money Laundering Act 2009, or the police or other investigators, and we may be prohibited by law from telling you that we have done so; and</li>
            <li>we still reply to your complaint, but we may be unable to give you every detail while an investigation is open. We will tell you that, and what we can.</li>
          </ul>
          <p>
            If you believe that someone at NeuroOption is acting dishonestly, or that NeuroOption is breaking the law, tell us through the complaints channels in section 4, marked "Complaint - serious". We will route it to the Senior reviewer and keep your identity confidential as far as we can.
          </p>
          <p>
            If you suspect fraud against you, such as someone pretending to be NeuroOption and asking for money, do not pay. NeuroOption never asks you to pay a fee to unlock a withdrawal or to send money to a personal number. Report it to us through <a href="/support">Support</a> or <Co field="complaintsEmail" /> and to the police.
          </p>
        </>
      ),
    },
    {
      id: "vulnerable-accessibility",
      title: "14. Vulnerable clients and accessibility",
      body: (
        <>
          <h3>14.1 Vulnerable clients</h3>
          <p>
            Anyone can be vulnerable at some point because of illness, bereavement, financial difficulty, disability, a mental health condition, a language or literacy difficulty, being under pressure from others, or a problem with gambling-like trading. We take extra care in these cases.
          </p>
          <ul>
            <li>If you tell us you are vulnerable, or we see signs of it, we treat your complaint as a priority, give you a named contact where we can, and are flexible about deadlines on your side.</li>
            <li>We do not ask for more proof than we need. We will not use medical or other sensitive details for anything other than handling your complaint and supporting you, and we will handle them in line with the <PolicyLink slug="privacy">Privacy Policy</PolicyLink>.</li>
            <li>If your complaint arises from trading that has become harmful to you, see the <PolicyLink slug="responsible-trading">Responsible Trading Policy</PolicyLink> for the guidance and support described there (the platform does not currently offer deposit, loss or time-limit tools), and we will point you to it in our reply. NeuroOption's minimum age to hold an account is 21; if you believe a person under that age has an account, tell us and we will treat it as a priority.</li>
          </ul>

          <h3>14.2 Accessibility and language</h3>
          <ul>
            <li>You can complain in English. We will try to understand a complaint written in Swahili, and we will tell you if we cannot answer in that language.</li>
            <li>If you have difficulty with writing, reading a screen or using the Support page, you can ask a trusted person to help you, or ask us to suggest another way to submit it. Contact <Co field="complaintsEmail" /> and tell us what you need. Where we reasonably can, we will make adjustments, for example by sending larger text, simpler wording, or a reply in a form you can use.</li>
            <li>Because we need a written record, we cannot take a complaint only by phone, but a trusted person may write it down for you and a member of our team may call you to confirm the details if you cannot read or write. The support phone number, <Co field="supportPhone" />, is for general support, not for complaints.</li>
          </ul>
        </>
      ),
    },
    {
      id: "records-learning",
      title: "15. Records, reporting and learning from complaints",
      body: (
        <>
          <h3>15.1 The complaints record</h3>
          <p>For every complaint, we keep a record that includes:</p>
          <ul>
            <li>the Reference, the date and time of receipt, and the channel;</li>
            <li>the account concerned (by email address or account ID) and the subject;</li>
            <li>the category of the complaint (for example trade settlement, payment, account restriction, identity check, data protection, staff conduct, platform error);</li>
            <li>the staff who handled and reviewed it, and the dates of the acknowledgement, updates and Final response;</li>
            <li>the records reviewed, our findings, the outcome and any remedy given, and whether it was carried out; and</li>
            <li>any internal review, outside body or court involvement that we know about.</li>
          </ul>
          <p>
            Support tickets and their messages are kept by the platform as a normal part of the support system. The complaints record is kept in addition to them.
          </p>

          <h3>15.2 How long we keep it</h3>
          <p>
            We keep complaint records, support tickets and the evidence we relied on for as long as the law requires and for as long as we reasonably need them to deal with a claim or a regulator, which is expected to be <Co field="retentionPeriod" /> after the complaint is closed. We keep them even if your account is closed or deleted, because records of complaints, payments and trades are kept for accounting, audit and legal reasons. See the <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink>. We use these records only for the purposes in this policy and where the law requires, and never for marketing.
          </p>

          <h3>15.3 Using complaints to improve</h3>
          <ul>
            <li>The Complaints Officer reviews the complaints record regularly, at least every quarter, to find trends such as repeated platform faults, unclear wording, slow replies or one category rising.</li>
            <li>Findings go to senior management with recommendations, and we track the actions until they are done.</li>
            <li>Where a complaint shows a fault that may affect other clients, we check whether they are affected and correct it for them as well, without waiting for them to complain.</li>
            <li>Where a complaint shows that a policy or a page on the platform is unclear or wrong, we correct it and, if the change matters, tell clients through the platform or by email.</li>
          </ul>

          <h3>15.4 Confidentiality and data protection</h3>
          <p>
            Your complaint contains personal data, and we handle it in line with the <PolicyLink slug="privacy">Privacy Policy</PolicyLink> and the Data Protection Act, 2019. We share it only with staff, advisers and public bodies as described above, and with a payment provider such as Safaricom where we have to ask the provider about a transaction. You may ask for a copy of the records we hold about your complaint, as set out in the Privacy Policy.
          </p>
        </>
      ),
    },
    {
      id: "review-contact",
      title: "16. Review of this policy and how to contact us",
      body: (
        <>
          <h3>16.1 Review and changes</h3>
          <p>
            We review this policy at least once a year, when we start offering real-money accounts, when the law changes, when a regulator or outside body gives us guidance, and after any serious failure in how we handled complaints. The date at the top of the page shows when it was last updated. If we change it in a way that matters to you, we will tell you through the platform or by email. A change does not affect a complaint that you made before the change: we deal with it under the policy that applied when you made it, unless the new policy is better for you.
          </p>

          <h3>16.2 Contact details</h3>
          <Table
            head={["For", "Contact"]}
            rows={[
              ["Complaints (if you can sign in)", <>Open a ticket at <a href="/support">Support</a> with a subject starting "Complaint"</>],
              ["Complaints (if you cannot sign in)", <Co field="complaintsEmail" />],
              ["General support", <><Co field="supportEmail" /> or <Co field="supportPhone" /></>],
              ["Data protection", <><Co field="privacyEmail" /> (Data Protection Officer: <Co field="dataProtectionOfficer" />)</>],
              ["Registered office", <Co field="registeredAddress" />],
            ]}
          />
          <p>
            For answers to common questions before you complain, see the <a href="/help">Help Centre</a>.
          </p>
        </>
      ),
    },
  ],
};

export default policy;
