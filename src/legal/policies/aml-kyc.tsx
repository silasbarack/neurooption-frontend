import type { Policy } from "../types";
import { Callout, Co, Definitions, PolicyLink, Table } from "../components";

const policy: Policy = {
  slug: "aml-kyc",
  title: "AML, CTF and KYC Policy",
  summary:
    "How NeuroOption works to prevent money laundering, terrorism financing and fraud: the identity checks we may ask for, when they apply, how we monitor accounts, what we report, and what happens if we cannot complete our checks.",
  updated: "2026-10-16",
  sections: [
    {
      id: "about-this-policy",
      title: "1. About this policy",
      body: (
        <>
          <p>
            In this policy, "NeuroOption", "we", "us" and "our" mean <Co field="legalName" /> (trading as NeuroOption), a company incorporated in <Co field="jurisdiction" /> with registration number <Co field="registrationNumber" /> and its registered office at <Co field="registeredAddress" />. "You" and "your" mean the person who holds, or applies for, a NeuroOption account.
          </p>

          <h3>1.1 What this policy covers</h3>
          <p>
            This policy explains how we try to prevent our platform from being used for money laundering, the financing of terrorism or proliferation, fraud, or any other crime. It sets out what we ask of you, which checks we carry out and when, how we monitor accounts, what we do when something looks wrong, and how long we keep the records. "AML" means anti-money-laundering, "CTF" means countering the financing of terrorism, and "KYC" means "know your customer", the process by which we establish and verify who our clients are.
          </p>

          <h3>1.2 How this policy fits with our other documents</h3>
          <p>
            This policy forms part of your agreement with us under the <PolicyLink slug="terms">Terms and Conditions</PolicyLink>. Please also read:
          </p>
          <ul>
            <li>
              the <PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink>, which explains how money moves in and out of a real account and how the checks in this policy affect payments;
            </li>
            <li>
              the <PolicyLink slug="privacy">Privacy Policy</PolicyLink>, which explains how we handle the personal data we collect for verification;
            </li>
            <li>
              the <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink>, which explains what happens to your records when an account closes; and
            </li>
            <li>
              the <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>, which explains how to complain about a decision we make under this policy.
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
            Do not assume that NeuroOption is licensed, regulated or supervised by any authority beyond what is stated in this table. Following the standards in this policy does not mean that any authority has approved our business or that we are registered with any authority as a reporting institution.
          </p>

          <Callout tone="risk" title="Key points">
            <ul>
              <li>
                <strong>We may ask you to prove who you are.</strong> If we ask, we may not be able to pay a withdrawal or keep your account open until you do.
              </li>
              <li>
                <strong>Your own account only.</strong> You may deposit only from, and withdraw only to, an M-Pesa line registered in your own name. Third-party payments are prohibited.
              </li>
              <li>
                <strong>We may report to the authorities.</strong> If we suspect a crime, the law may require us to report it to the Financial Reporting Centre, and we are not allowed to tell you that we have done so.
              </li>
              <li>
                <strong>One person, one account.</strong> You must give true information and keep it up to date.
              </li>
              <li>
                <strong>Demo funds are not money.</strong> Nothing in a demo account can be withdrawn or exchanged for value.
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
              ["AML", <>Anti-money-laundering: the laws, rules and controls that aim to stop criminal money from being disguised as legitimate funds.</>],
              ["Authorised staff", <>NeuroOption staff who have been given a role with permission to review verification documents, monitor accounts or make compliance decisions, and whose actions in the administration console are recorded in an audit log.</>],
              ["CTF", <>Countering the financing of terrorism, and of the proliferation of weapons.</>],
              ["Customer due diligence (CDD)", <>The basic steps we take to identify you, verify your identity and understand your purpose for using the platform.</>],
              ["Enhanced due diligence (EDD)", <>Additional steps we take for clients or situations that carry a higher risk, described in section 10.</>],
              ["FATF", <>The Financial Action Task Force, the international body that sets standards against money laundering and terrorism financing.</>],
              ["FRC", <>The Financial Reporting Centre of Kenya, the national body that receives and analyses suspicious transaction reports.</>],
              ["KYC", <>"Know your customer": the process of identifying and verifying a client and keeping that information current.</>],
              ["Money laundering", <>Dealing with money or property that comes from crime, or helping someone to do so, in a way that hides its origin or ownership.</>],
              ["Politically exposed person (PEP)", <>A person who holds, or has recently held, a prominent public position, together with their family members and close associates. Section 10.2 gives a fuller description.</>],
              ["Real account", <>Your "QT Real" account, held in Kenya Shillings (KES), which you fund with real money.</>],
              ["Demo account", <>Your "QT Demo" account and the virtual US dollars (USD) in it. Virtual funds are for practice only and have no monetary value.</>],
              ["Source of funds", <>Where the money used for a particular deposit or transaction comes from, for example your salary or business income.</>],
              ["Source of wealth", <>How your overall wealth was built up, for example employment, business, inheritance or investments.</>],
              ["Suspicious transaction report (STR)", <>A confidential report to the FRC about a transaction or activity that we know or suspect may involve crime, money laundering or terrorism financing.</>],
              ["Tipping-off", <>Telling a person, directly or indirectly, that a report has been or may be made about them, or that an investigation is under way, in a way that may prejudice it.</>],
              ["EAT", <>East Africa Time (UTC+3). All times in this policy and on the platform are EAT.</>],
            ]}
          />
        </>
      ),
    },
    {
      id: "our-commitment",
      title: "3. Our commitment",
      body: (
        <>
          <p>
            NeuroOption does not want to be used by criminals, and we do not knowingly accept money that comes from crime. We commit to:
          </p>
          <ul>
            <li>identify our clients and understand how they use the platform;</li>
            <li>apply checks in proportion to the risk each client and each transaction presents;</li>
            <li>monitor accounts and payments for unusual activity;</li>
            <li>refuse, restrict or close accounts where we cannot satisfy ourselves about a client or a payment;</li>
            <li>report suspicions to the proper authorities when the law requires or allows it;</li>
            <li>keep proper records and protect the personal data we collect; and</li>
            <li>train our staff and review this policy regularly.</li>
          </ul>

          <h3>3.1 What our commitment does not mean</h3>
          <p>
            Our checks are designed to reduce risk. They cannot remove it, and we do not promise that we will detect every attempt to misuse the platform. These checks are also not a service to you: we do not carry them out to protect your funds, to give you advice, or to confirm that a payment is lawful for tax or any other purpose. Obeying the law is your responsibility as well as ours.
          </p>

          <h3>3.2 Why this matters for this kind of platform</h3>
          <p>
            All prices on NeuroOption come from our own synthetic OTC price engine, not from any exchange or market, and NeuroOption is the counterparty to every trade. Because trades are settled against us and not against other market participants, the platform has a particular risk: a person could try to use trading, deposits and withdrawals to move or disguise money, or to use stolen payment credentials, for example by depositing funds, making few or no trades and then asking to withdraw. We take this risk seriously, and it is one reason we may question deposits that are not matched by genuine trading. The <PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink> explains how we manage our interest in client outcomes. Decisions under this policy are made on compliance grounds and not according to whether you have won or lost trades.
          </p>
        </>
      ),
    },
    {
      id: "legal-framework",
      title: "4. Legal and regulatory framework",
      body: (
        <>
          <h3>4.1 Kenyan law</h3>
          <p>
            We take the framework of Kenyan law on financial crime as the standard we follow. In particular we have regard to:
          </p>
          <ul>
            <li>
              the <strong>Proceeds of Crime and Anti-Money Laundering Act, 2009</strong>, which makes money laundering a crime and sets out duties to identify clients, keep records and report suspicious transactions;
            </li>
            <li>
              the <strong>Prevention of Terrorism Act, 2012</strong>, which makes terrorism and the financing of terrorism crimes and deals with the declaration of terrorist groups;
            </li>
            <li>
              the work of the <strong>Financial Reporting Centre (FRC)</strong>, which receives suspicious transaction reports and issues guidance;
            </li>
            <li>
              the <strong>Computer Misuse and Cybercrimes Act, 2018</strong>, which deals with offences such as unauthorised access to accounts and computer fraud; and
            </li>
            <li>
              the <strong>Data Protection Act, 2019</strong>, which governs how we collect, use and keep the personal data that verification involves.
            </li>
          </ul>

          <h3>4.2 International standards</h3>
          <p>
            We also take guidance from the recommendations of the Financial Action Task Force (FATF) on money laundering, terrorism financing and proliferation financing, including the risk-based approach, customer due diligence, the treatment of politically exposed persons and the prompt reporting of suspicion. We also take account of the sanctions lists issued by the United Nations Security Council, which Kenya gives effect to through its own laws and regulations.
          </p>

          <h3>4.3 What this framework does not say about us</h3>
          <Callout tone="warn" title="No claim of registration or approval">
            <p>
              Saying that we follow this framework does not mean that NeuroOption is registered with the FRC, licensed by the Capital Markets Authority or any other regulator, or approved or supervised by any authority. Our regulatory status is stated in section 1.3 only. We apply these standards because we believe they are the right ones for a platform of this kind, not because any authority has certified us.
            </p>
          </Callout>

          <h3>4.4 Changes in the law</h3>
          <p>
            If the law or the guidance of an authority changes, or an authority tells us to do something different, the law and the authority's instruction come before this policy. We will update this policy as soon as is practical.
          </p>
        </>
      ),
    },
    {
      id: "risk-based-approach",
      title: "5. Our risk-based approach",
      body: (
        <>
          <p>
            We do not treat every client and every payment in the same way. We apply light checks where the risk is low and stronger checks where it is higher. We assess risk at three levels.
          </p>

          <h3>5.1 Business-wide risk</h3>
          <p>
            We consider the risks that come from what we do: a fixed-time options product with short expiries (from 5 seconds to 5 hours); mobile-money payments, which move quickly; clients located mainly in Kenya but able to reach the website from anywhere; accounts opened online without meeting the client; and a platform in which we are the counterparty to every trade. We review this assessment when we launch a new service or payment method, and at least once a year.
          </p>

          <h3>5.2 Client risk</h3>
          <p>We consider factors such as:</p>
          <ul>
            <li>who you are, where you live and what you do for a living;</li>
            <li>whether you are, or are linked to, a politically exposed person;</li>
            <li>whether the information you give us is complete, consistent and verifiable;</li>
            <li>how much you deposit and withdraw compared with what we would expect for your circumstances; and</li>
            <li>how you use the platform, including how your deposits relate to your trading.</li>
          </ul>

          <h3>5.3 Transaction and product risk</h3>
          <p>
            We consider the size, frequency and pattern of deposits and withdrawals, the payment method, whether money is paid in and out with little or no trading in between, and whether a request looks inconsistent with what we know about you.
          </p>

          <h3>5.4 Risk levels and what they mean in practice</h3>
          <Table
            head={["Risk level", "Typical features", "What we usually do"]}
            rows={[
              ["Standard", <>Identity consistent with the account; payments in your own name; activity matches your profile; modest amounts.</>, <>Basic customer due diligence and normal monitoring.</>],
              ["Elevated", <>Larger or rising amounts; limited trading compared with deposits; incomplete or hard-to-verify information; a link to a higher-risk country or sector.</>, <>Additional documents, a source-of-funds explanation and closer monitoring.</>],
              ["High", <>A politically exposed person; a connection to a high-risk country; a match against a sanctions list that has not been cleared; repeated red flags (section 14); or a report to the FRC.</>, <>Enhanced due diligence under section 10, approval at senior level, and restrictions or closure where we cannot manage the risk.</>],
            ]}
          />
          <p>
            We may change your risk level at any time as we learn more about you. We do not usually tell you your risk level, and we are not required to explain our assessment where doing so would reveal how we detect misuse or would amount to tipping-off.
          </p>
        </>
      ),
    },
    {
      id: "governance",
      title: "6. Roles, responsibilities and training",
      body: (
        <>
          <h3>6.1 Who is responsible</h3>
          <Table
            head={["Role", "Responsibility under this policy"]}
            rows={[
              ["Board or owners of NeuroOption", <>Approve this policy, make sure there are enough resources and competent staff to carry it out, and receive a report on compliance at least once a year.</>],
              ["Compliance officer (money laundering reporting officer)", <>Day-to-day responsibility for this policy; decides whether a suspicion is reported to the FRC; keeps the register of internal reports; liaises with authorities; has direct access to the board or owners and sufficient independence to decide without commercial pressure.</>],
              ["KYC administrators", <>Review verification submissions and decide whether to approve or reject them. Compliance administrators and the super administrator can also do this; other roles cannot.</>],
              ["Risk and compliance administrators", <>Review client accounts and trading activity, change an account's status (for example suspend or lock it) and escalate concerns to the compliance officer.</>],
              ["Finance administrators", <>Review each withdrawal request and mark it processing, completed or declined. Compliance administrators and the super administrator can also work in the finance area.</>],
              ["Support administrators", <>Answer client queries, tell clients how to submit documents when verification is required, and pass any concern to compliance without discussing suspicions with the client.</>],
              ["All staff", <>Report anything unusual to the compliance officer promptly, never tip off, and keep client information confidential.</>],
            ]}
          />
          <p>
            Staff can use only the parts of the administrator system that their role allows. The platform records actions taken in the administration console, including changes to a client's account status, in an audit log. Some back-office actions, including identity verification decisions, are not recorded in that log (see the <PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink>), so we also rely on written records of each decision. Role names in the administrator system do not by themselves appoint a compliance officer: the compliance officer in this policy is the person we have designated to carry out that function.
          </p>

          <h3>6.2 Training</h3>
          <p>
            Everyone who works for us in a role that touches client accounts, payments or compliance receives training on this policy when they join and a refresher at least once a year. Training covers how to recognise red flags, how to escalate a concern, the offence of tipping-off, and how to handle personal data. We keep a record of who has been trained and when.
          </p>

          <h3>6.3 Independent review</h3>
          <p>
            We will arrange for this policy and the way we carry it out to be reviewed independently of the people who run it, at intervals appropriate to the size and risk of the business.
          </p>
        </>
      ),
    },
    {
      id: "information-we-collect",
      title: "7. What we collect and why",
      body: (
        <>
          <h3>7.1 At sign-up</h3>
          <p>
            When you register, we collect your full name, your email address and a password (which we store only in hashed form). You also tick a box confirming that you are 21 or older and agree to the Terms and the Privacy Policy; the platform does not store a date of birth or check your age at sign-up. You may add a mobile phone number later in your profile. We do not collect your date of birth, nationality, residential address or identity document number when you sign up.
          </p>
          <p>
            At this stage your email address is checked only by a verification link that we send to it, which is valid for 24 hours and can be used once. Confirming your email address shows that you can receive messages at that address. It does not verify your identity.
          </p>

          <h3>7.2 What we may ask for when verification is required</h3>
          <p>
            When we need to verify you, as explained in section 8, we may ask for some or all of the following:
          </p>
          <ul>
            <li>
              <strong>Proof of identity:</strong> a clear copy of your valid Kenyan national identity card or your valid passport, showing your full name, date of birth, photograph and document number;
            </li>
            <li>
              <strong>A selfie:</strong> a photograph of you, sometimes holding your identity document, so that we can compare it with the document;
            </li>
            <li>
              <strong>Proof of address:</strong> a recent document, usually not older than three months, that shows your name and residential address, such as a utility bill or a bank statement;
            </li>
            <li>
              <strong>Proof of M-Pesa ownership:</strong> evidence that the M-Pesa line you use is registered in your name, for example an M-Pesa statement or registration details;
            </li>
            <li>
              <strong>Source of funds or source of wealth:</strong> an explanation of where your money comes from, with supporting documents where appropriate, such as payslips, bank statements, business records or a sale contract; and
            </li>
            <li>
              <strong>Other information:</strong> your occupation, your tax identification number where relevant, and answers to questions that help us understand your activity or clarify an inconsistency.
            </li>
          </ul>
          <p>
            We ask only for what is reasonably needed in your situation. We may ask for different items from different clients, and we may ask for more later.
          </p>

          <h3>7.3 Information we generate</h3>
          <p>
            We also keep records of how you use the platform: deposits and withdrawals (including the M-Pesa phone number and M-Pesa receipt), trades, balances, support messages, verification decisions and the reasons for them, and notes made by our staff in the course of checks and monitoring. We keep records of the emails we send you, including the address, the subject and whether it was delivered, but not their content.
          </p>

          <h3>7.4 Why we need it</h3>
          <p>
            We collect this information to meet our legal and regulatory obligations, to prevent and detect crime, to protect you and other clients from fraud and account takeover, and to enforce our agreement with you. We do not use verification documents for marketing. The <PolicyLink slug="privacy">Privacy Policy</PolicyLink> explains our legal bases and your rights.
          </p>
        </>
      ),
    },
    {
      id: "when-verification-is-required",
      title: "8. When verification is required",
      body: (
        <>
          <Callout tone="warn" title="Document submission is not yet available in the app">
            <p>
              The platform does not yet let you upload verification documents inside the app. The verification button shows "Verification Submission Unavailable". When we need documents from you, we will tell you how to send them securely, by email to your registered address (support tickets are text only and cannot carry attachments, so do not paste identity documents into a ticket). Do not send identity documents by any other route, and never send them to anyone who is not clearly a NeuroOption representative, because criminals pretend to be companies in order to collect identity documents. We never ask for your password, your M-Pesa PIN or a one-time code.
            </p>
          </Callout>

          <h3>8.1 Demo accounts</h3>
          <p>
            You can open and use a demo account without verification. No money moves through a demo account, so the checks in this section do not apply to it. We may still refuse or close any account, including a demo account, for the reasons in section 16.
          </p>

          <h3>8.2 Real accounts</h3>
          <p>
            For real accounts, verification applies as follows.
          </p>
          <Table
            head={["Situation", "What we require"]}
            rows={[
              ["Before your first withdrawal", <>We require you to have completed identity verification (identity document and selfie) and to have an approved KYC status. We may also ask for proof of address and proof that the M-Pesa line is registered in your name. This is company policy: the platform does not itself block a withdrawal because verification is missing, so we check your verification status when staff review the request.</>],
              ["Before your first deposit", <>We may allow deposits before verification, or we may ask you to verify first. If we set a limit for unverified deposits, we will tell you what it is when you are asked to verify.</>],
              ["When your deposits or withdrawals reach a set total", <>When your total deposits or total withdrawals pass the threshold we set for the relevant period, we may require additional documents, including proof of address and source of funds. We will tell you the threshold that applies to you when we ask. We may change the thresholds, and we may apply lower ones to a client or a payment that we consider higher risk.</>],
              ["When you change a key detail", <>If you change your name, phone number or the M-Pesa line you use, we may ask you to re-verify.</>],
              ["When something looks wrong", <>If a red flag arises (section 14), or information we hold does not match, or a document is out of date, we may require verification or fresh documents at any time, whatever the amounts.</>],
              ["Periodic refresh", <>We may ask you to confirm or renew your information and documents from time to time, for example when an identity document expires.</>],
            ]}
          />
          <p>
            Until we complete a check we have asked for, we may delay or decline a withdrawal, restrict deposits or trading, or place a hold on the account, as described in section 16.
          </p>

          <h3>8.3 Verification statuses</h3>
          <p>Your account shows one of four verification statuses.</p>
          <Table
            head={["Status", "Meaning"]}
            rows={[
              ["Not submitted", <>We have not received any verification information from you.</>],
              ["Pending", <>We have received your information and an authorised member of staff has not yet decided. We may ask for more while it is pending.</>],
              ["Approved", <>We are satisfied with the information and documents for now. Approval is not permanent: we may ask you to verify again if circumstances change.</>],
              ["Rejected", <>We could not accept the submission. We give you a reason, for example that a document was unreadable, expired, did not match your profile, or looked altered. You may submit corrected information if we tell you how.</>],
            ]}
          />
          <p>
            An account also carries a separate account status (Active, Pending KYC, Suspended, Locked or Deleted), which our staff can change. The account status is not the same as the verification status. We email you when we receive a verification submission and when it is approved or rejected.
          </p>

          <h3>8.4 What we do not do</h3>
          <p>
            Our checks are carried out by people. The following table states plainly what exists today and what does not.
          </p>
          <Table
            head={["Check", "Position today"]}
            rows={[
              ["Review of identity documents and selfies", <>Done by hand by an authorised member of staff, who looks at the submission. There is no automated identity verification.</>],
              ["Face or biometric matching", <>None. We do not use automated or biometric facial matching. If a selfie is compared with a document, a member of staff does it by eye.</>],
              ["Checks against government or third-party identity databases", <>None. We do not check documents or ID numbers against any government, credit-bureau or commercial database.</>],
              ["Sanctions, PEP and adverse-media screening", <>No automated screening software or screening database is used. Any comparison against sanctions lists is done by hand (section 11.2).</>],
              ["Transaction monitoring", <>No automated monitoring system. Monitoring is by staff (section 13.2).</>],
              ["Approval of deposits and withdrawals", <>Deposits are confirmed with Safaricom before they are credited. Every withdrawal request is reviewed by a member of staff before it is paid. The software does not itself refuse a withdrawal because a verification is missing.</>],
              ["Email verification", <>Confirms only that you can receive email at the address you gave (section 7.1).</>],
            ]}
          />
          <p>
            Because these checks are manual, they can miss things or take time, and we may add automated tools in future. If we do, we will update this section.
          </p>
        </>
      ),
    },
    {
      id: "review-process",
      title: "9. How we review and decide",
      body: (
        <>
          <h3>9.1 Review by authorised staff</h3>
          <p>
            Only authorised staff may see or decide on verification documents. When a reviewer checks a submission, they look at whether:
          </p>
          <ul>
            <li>the document is genuine in appearance, valid and not expired, and readable in full;</li>
            <li>the name, date of birth and photograph match each other and match your account details;</li>
            <li>you are at least 21 years old;</li>
            <li>the selfie appears to show the same person as the document;</li>
            <li>any proof of address or of M-Pesa ownership matches your name; and</li>
            <li>the submission is consistent with everything else we know about you.</li>
          </ul>

          <h3>9.2 Decisions and records</h3>
          <p>
            The reviewer records a decision of approved or rejected, and a reason where it is rejected. The platform stores the decision and the reason on your verification record. Decisions made through the back-office interface are not currently written to the console audit log (see the <PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink>), so the reviewer also keeps a written note of the decision. We then email you the outcome. Where a case is complex, the reviewer passes it to the compliance officer.
          </p>

          <h3>9.3 How long it takes</h3>
          <p>
            We aim to review a complete submission within three working days and will tell you if it is taking longer. This is a target and not a guarantee. A review may take longer when documents are unclear, when we need to ask follow-up questions, or when enhanced due diligence applies. Time spent waiting for information from you is not counted.
          </p>

          <h3>9.4 If your submission is rejected</h3>
          <p>
            You may provide the missing or corrected information if we tell you how. If you believe that we have decided wrongly, you may ask us to look again through Support or make a complaint under the <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>. We may still decline to explain in detail where doing so would help someone avoid our controls or would amount to tipping-off.
          </p>

          <h3>9.5 Forged and altered documents</h3>
          <p>
            Submitting a forged, altered, stolen or someone else's document is a serious matter. We may close your account, keep any funds as the law allows, and report the matter to the police or other authority.
          </p>
        </>
      ),
    },
    {
      id: "enhanced-due-diligence",
      title: "10. Enhanced due diligence",
      body: (
        <>
          <p>
            We apply additional measures where the risk is higher. These may include more documents, a detailed explanation and proof of the source of your funds and wealth, a call or written exchange to understand your activity, approval by the compliance officer or a senior manager before we open or continue the relationship, and closer monitoring.
          </p>

          <h3>10.1 When enhanced due diligence applies</h3>
          <ul>
            <li>You, or a person connected to you, is a politically exposed person.</li>
            <li>You have a link to a country or territory that we treat as high risk (section 10.3).</li>
            <li>Your activity is unusual for your profile or matches a pattern in section 14.</li>
            <li>You cannot, or will not, explain the source of your funds.</li>
            <li>A name match on a sanctions or other screening check has not been cleared.</li>
            <li>Our own risk assessment, or an instruction from an authority, tells us to.</li>
          </ul>

          <h3>10.2 Politically exposed persons</h3>
          <p>
            A politically exposed person is someone who holds, or in the recent past has held, a prominent public function, in Kenya or abroad. Examples include heads of state and government, ministers and their deputies, members of parliament or county assemblies, senior officials of the judiciary, the military, the police and state-owned enterprises, senior officials of political parties, and senior officials of international organisations. The term also covers their immediate family members (spouse, partner, children and parents, and in some cases siblings) and people known to be their close business or personal associates.
          </p>
          <p>
            Being a politically exposed person does not mean that you have done anything wrong. It means that your position can expose you to bribery or corruption pressure, so we take extra care. If you are, or become, a politically exposed person, or are a family member or close associate of one, you must tell us. Where we accept such a client, we require approval at senior level, we establish source of wealth and source of funds, and we monitor the account more closely.
          </p>

          <h3>10.3 High-risk countries</h3>
          <p>
            We treat as high risk any country or territory that FATF has identified as having serious weaknesses in its controls against money laundering and terrorism financing, any that is the subject of United Nations or other sanctions we follow, and any that an authority tells us to treat in this way. These lists change, so we review them regularly. If a client is connected with such a place by residence, citizenship, payment source or the people with whom they deal, we apply enhanced due diligence, and we may decline the relationship.
          </p>
          <p>
            Separately, we do not offer our services where doing so would be unlawful, and we may restrict or refuse clients who live in places where retail binary options are banned or restricted. Section 4.3 of the <PolicyLink slug="terms">Terms and Conditions</PolicyLink> lists the countries and territories in which we do not offer our services, and we may change that list.
          </p>

          <h3>10.4 Unusual activity</h3>
          <p>
            Where monitoring (section 13) raises a concern that we cannot resolve from information we already hold, we may ask you for an explanation and for evidence, such as bank or business records. We may place a hold on the account while we do this, as described in section 16.
          </p>

          <h3>10.5 Example</h3>
          <Callout tone="info" title="Example: a larger withdrawal">
            <p>
              Amina has an approved verification status and has deposited and traded modestly for several months. She then deposits a sum several times larger than usual in one week and asks to withdraw most of it two days later, after only a few trades. We may ask her to explain where the larger deposit came from and to send supporting evidence, such as a payslip, a bank statement or a sale agreement. We may hold the withdrawal until we are satisfied. If she gives a clear, documented explanation, we release the payment as normal. If she cannot, or the evidence is inconsistent, the compliance officer decides whether to restrict the account and whether a report is required. In no case do we tell her that a report has been made.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "sanctions",
      title: "11. Sanctions and terrorism-financing controls",
      body: (
        <>
          <h3>11.1 Our policy</h3>
          <p>
            We do not open or maintain accounts for, or process payments for or to, any person or entity that is listed on a sanctions list that applies to us, or that we know or suspect to be acting for them. This includes persons and entities designated under United Nations Security Council resolutions, as given effect in Kenya, and persons and groups declared or listed by Kenyan authorities in connection with terrorism.
          </p>

          <h3>11.2 How we apply it</h3>
          <p>
            As a matter of policy, we compare the names of our clients, and the names on the identity documents and M-Pesa lines they use, against the sanctions lists that apply to us, when we verify a client and when the lists are updated. At present, the platform does not screen names automatically against sanctions lists. We carry out this comparison through the manual review of authorised staff, and we will say so in this policy if and when automated screening is introduced. Because the process is manual, a match may not be spotted straight away.
          </p>

          <h3>11.3 If there is a possible match</h3>
          <ol>
            <li>We stop the relevant transaction or account activity and escalate the case to the compliance officer.</li>
            <li>We check whether it is a true match or a false positive, for example a person with a similar name.</li>
            <li>If it is a false positive, we record why and continue.</li>
            <li>If it is a true match, or we cannot rule it out, we keep the account restricted, we do not release any funds except as the law allows, and we report to the authorities as the law requires.</li>
          </ol>
          <p>
            We may not be able to tell you the reason, and we may not be able to release your money without the permission of an authority.
          </p>
        </>
      ),
    },
    {
      id: "third-party-payments",
      title: "12. Payments: own name only",
      body: (
        <>
          <h3>12.1 The rule</h3>
          <p>
            You may deposit only from an M-Pesa line that is registered in your own name, and we pay withdrawals only to an M-Pesa line registered in your own name. We do not accept money from, or send money to, another person, a business or a joint account. This rule applies even if the other person is a relative or a friend, and even if they give you permission.
          </p>

          <h3>12.2 Why the rule exists</h3>
          <p>
            Payments through third parties are a common way to hide who owns money, to launder the proceeds of fraud, and to withdraw money from a stolen account. The rule also protects you: if someone else's payment account is used, the money may be reversed or frozen later.
          </p>

          <h3>12.3 How we check it</h3>
          <p>
            M-Pesa shows us the phone number a payment comes from. We may compare the name on your account and verification documents with the name registered to the M-Pesa line, and we may ask for proof of ownership. Note that the name that M-Pesa gives us may be limited or masked, so we may ask you for evidence.
          </p>

          <h3>12.4 If a payment does not meet the rule</h3>
          <ul>
            <li>We may hold or reject the payment, and where we have already received it, we may return it to the line it came from after deducting any cost we cannot avoid.</li>
            <li>We may ask you to explain it and, if we are not satisfied, treat it as a red flag under section 14.</li>
            <li>If you receive a request to deposit on behalf of another person, or to let someone else use your account, refuse it. Allowing another person to use your account breaches the Terms and may involve you in a crime.</li>
          </ul>

          <h3>12.5 Other payment methods</h3>
          <p>
            Methods such as Airtel Money, Equitel, Binance Pay, Visa and Mastercard are shown as "coming soon" and are not available. If we introduce any other method, we will apply this policy to it, and we may add checks that are specific to that method. We do not accept cash, cheques or virtual-currency payments to a real account.
          </p>
        </>
      ),
    },
    {
      id: "ongoing-monitoring",
      title: "13. Ongoing monitoring",
      body: (
        <>
          <p>
            Customer due diligence does not end when an account is approved. We keep a client's information up to date and look at how the account is used for as long as the relationship lasts.
          </p>

          <h3>13.1 What we monitor</h3>
          <ul>
            <li>Deposits and withdrawals, including their size, frequency, timing and payment details.</li>
            <li>The relationship between deposits, trading and withdrawals.</li>
            <li>Changes to profile details, phone numbers and the M-Pesa line used.</li>
            <li>Failed, reversed or disputed payments, and deposits held under review because the amount paid differed from the amount requested.</li>
            <li>The behaviour of several accounts that appear to be linked.</li>
          </ul>

          <h3>13.2 How we monitor</h3>
          <p>
            Monitoring is carried out by authorised risk, finance and compliance staff reviewing client accounts and payment records, assisted by the account, trade, deposit and withdrawal records that the administrator system lets them view. Every withdrawal request is reviewed by a member of staff before it is paid, and that review is one of our main monitoring controls. The platform does not at present have a fully automated transaction-monitoring system, and we do not claim that it detects every unusual pattern. We will tell you in this policy if that changes.
          </p>

          <h3>13.3 What happens when we spot something</h3>
          <ol>
            <li>The reviewer records the concern and decides whether it can be explained from information we already hold.</li>
            <li>If not, they may contact you for an explanation or documents (section 10.4).</li>
            <li>If the concern is serious or remains unexplained, they escalate it to the compliance officer, who decides on any restriction and on whether to report to the FRC.</li>
            <li>The decision and its reasons are recorded.</li>
          </ol>

          <h3>13.4 Keeping information up to date</h3>
          <p>
            We may ask you at intervals, and when a document expires, to confirm or renew your details. How often depends on your risk level. Higher-risk clients are reviewed more often.
          </p>
        </>
      ),
    },
    {
      id: "red-flags",
      title: "14. Red flags",
      body: (
        <>
          <p>
            A red flag does not mean that you have done anything wrong. It is a sign that we should look more closely. The following are examples of the kind of thing we look for. The list is not complete, and one item on its own is often innocent.
          </p>

          <h3>14.1 About identity and information</h3>
          <ul>
            <li>Documents that look forged, altered, copied from the internet or not in your name.</li>
            <li>Information that is inconsistent between your profile, your documents and your payments.</li>
            <li>Reluctance or refusal to provide information, or an explanation that keeps changing.</li>
            <li>Several accounts that share a phone number, a name, a device or a payment line, or one person who appears to operate several accounts.</li>
            <li>An account that seems to be run by someone other than the account holder.</li>
          </ul>

          <h3>14.2 About payments</h3>
          <ul>
            <li>Deposits from, or withdrawal requests to, a phone line that is not in your name.</li>
            <li>Large or round-sum deposits that do not fit what we know about your means.</li>
            <li>Many small deposits that together look like an attempt to stay under a limit ("structuring").</li>
            <li>Deposits that are quickly requested back as a withdrawal with little or no trading.</li>
            <li>Deposits followed by repeated disputes, reversals or claims that a payment was not authorised.</li>
            <li>A sudden change in the amount or pattern of activity.</li>
            <li>Requests to send money to a different account at the last moment.</li>
          </ul>

          <h3>14.3 About trading behaviour</h3>
          <ul>
            <li>Trading that appears to have no purpose except to move money, for example staking the same amount on opposite directions in the same instrument at the same time across linked accounts.</li>
            <li>Accounts that appear to be coordinated so that one wins as another loses.</li>
            <li>Activity that suggests the use of stolen payment details or an account taken over by someone else.</li>
          </ul>

          <h3>14.4 About geography and links</h3>
          <ul>
            <li>Access or payments from a high-risk country, or from a place where our services are not offered.</li>
            <li>Use of tools to hide location where that is inconsistent with the stated profile.</li>
            <li>A connection to a person or organisation named in adverse public reports or on a sanctions list.</li>
          </ul>

          <h3>14.5 About staff and third-party approaches</h3>
          <ul>
            <li>Someone who tells you to deposit on behalf of a third party or offers payment for the use of your account.</li>
            <li>Pressure on a member of our staff to bypass a check.</li>
          </ul>
        </>
      ),
    },
    {
      id: "reporting",
      title: "15. Suspicious transaction reporting and tipping-off",
      body: (
        <>
          <h3>15.1 Internal reporting</h3>
          <p>
            Any member of staff who knows or suspects that a transaction or activity may involve money laundering, terrorism financing or another crime must report it to the compliance officer immediately, and must not discuss the suspicion with the client or anyone outside the team handling it.
          </p>

          <h3>15.2 Reporting to the authorities</h3>
          <p>
            The compliance officer reviews each internal report and decides whether it must be sent to the Financial Reporting Centre as a suspicious transaction report. We make a report where the law requires it or where we judge that it is appropriate to do so, and we may also report to the police or other competent authority. We act promptly. We also respond to lawful requests and orders from the authorities, including court orders, and we may disclose the information they require without notifying you, to the extent the law allows. We keep a record of each internal report, the decision taken and the reasons, whether or not we make an external report.
          </p>

          <h3>15.3 Reporting in good faith</h3>
          <p>
            We report in good faith and without needing to prove that a crime has occurred. Our legal protection when we report in good faith does not depend on the report turning out to be right. You agree that we may make such a report, and that you will not hold us liable for doing so in good faith, to the extent the law permits.
          </p>

          <h3>15.4 No tipping-off</h3>
          <Callout tone="warn" title="Why we cannot always tell you what is happening">
            <p>
              It is a crime to tell a person that a suspicious transaction report has been made about them, or that they are under investigation, if that could prejudice an investigation. Because of this, our staff cannot tell you if your account has been reported, and may give you only a general reason, such as "we are unable to proceed", when we restrict or close an account. This is not a refusal to help you. It is a legal duty.
            </p>
          </Callout>

          <h3>15.5 Freezing of funds</h3>
          <p>
            If an authority or a court orders us to freeze funds, or the law requires us to, we will do so, and we may not be able to release your money until the authority or court permits. We will not be liable for loss caused by complying with such an order.
          </p>
        </>
      ),
    },
    {
      id: "refuse-suspend-close",
      title: "16. Refusing, restricting, suspending or closing accounts",
      body: (
        <>
          <h3>16.1 When we may act</h3>
          <p>We may do any of the following, at any time and without prior notice where the law or the risk requires it:</p>
          <ul>
            <li>refuse to open an account or to accept an application;</li>
            <li>decline, delay or hold a deposit or withdrawal;</li>
            <li>restrict the account, for example by allowing no new trades, no new deposits or no withdrawals;</li>
            <li>suspend or lock the account;</li>
            <li>close the account and return any funds we are free to return; and</li>
            <li>refuse to deal with you in future.</li>
          </ul>
          <p>We may take these steps where:</p>
          <ul>
            <li>we cannot complete, or are not satisfied with, our identity checks, or you do not respond to a request for information or documents within a reasonable time (usually 14 days);</li>
            <li>you give information that is false, misleading or incomplete;</li>
            <li>we suspect that the account or a payment is connected with crime, sanctions, fraud or terrorism financing;</li>
            <li>you break the rule against third-party payments, hold more than one account (see section 4.4 of the <PolicyLink slug="terms">Terms and Conditions</PolicyLink>), or let another person use your account;</li>
            <li>you are, or are linked to, a person we cannot accept for a reason in section 10 or 11;</li>
            <li>an authority or court requires or requests it, or the law prohibits us from dealing with you; or</li>
            <li>continuing would expose us or other clients to unacceptable risk.</li>
          </ul>

          <h3>16.2 What happens to your trades and money</h3>
          <ul>
            <li>
              Trades that are already open continue to expiry and settle under the <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink>, unless the law, an authority or a clear technical error means we must act differently. Trades cannot be closed or cancelled before expiry.
            </li>
            <li>
              Where we hold your funds on a compliance hold, we keep them while the check is carried out. We will not hold them longer than we reasonably need to, but we cannot give a fixed time because it depends on you and on any authority involved.
            </li>
            <li>
              Where we close an account and we are free to do so, we return your available balance, after any amounts you owe us, to the M-Pesa line registered in your name. If we cannot pay it to you because we cannot verify that line, we hold it until you provide what we need.
            </li>
            <li>
              We do not return money to a third party or to an account that we cannot link to you.
            </li>
            <li>
              Where funds are, or we reasonably suspect that they are, the proceeds of crime, we may retain them, hand them to an authority or deal with them as the law requires, and you may lose the right to them.
            </li>
          </ul>

          <h3>16.3 What we tell you</h3>
          <p>
            Section 13 of the <PolicyLink slug="terms">Terms and Conditions</PolicyLink> also covers our right to suspend, restrict and terminate accounts. Where we can, we tell you that we have restricted or closed your account and what we need from you to resolve it. We will not always be able to give detailed reasons (section 15.4). Account closure is also covered by the <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink>.
          </p>

          <h3>16.4 Self-service deletion does not clear our checks</h3>
          <p>
            You can delete your own account only if you have no balance, locked funds, open trades or pending payments. Deleting an account does not erase the records we must keep, and it does not stop us from reporting something that happened before. If we are carrying out a check or a review, or if an authority has asked us to preserve records, we will keep them whatever you ask.
          </p>

          <h3>16.5 Complaints</h3>
          <p>
            If you think that we have wrongly refused, restricted or closed your account, you may complain under the <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>.
          </p>
        </>
      ),
    },
    {
      id: "record-keeping",
      title: "17. Record keeping",
      body: (
        <>
          <h3>17.1 What we keep</h3>
          <Table
            head={["Record", "Examples"]}
            rows={[
              ["Identification and verification", <>Your name, contact details, the documents and selfie you submitted, the dates of submission and decision, the verification status, the reason for any rejection and the identity of the reviewer.</>],
              ["Transactions", <>Deposits, withdrawals, trades, ledger entries and balances, M-Pesa phone numbers and receipts, and provider responses.</>],
              ["Monitoring and decisions", <>Concerns raised, explanations and evidence you give, notes of reviews, sanctions-check results, risk assessments and decisions to restrict or close an account.</>],
              ["Reports and requests", <>Internal suspicion reports, suspicious transaction reports and the compliance officer's decisions, and requests and orders from authorities.</>],
              ["Communications", <>Support tickets and messages, and delivery records of the emails we send you.</>],
              ["Training and governance", <>Training records, risk assessments and the review of this policy.</>],
            ]}
          />

          <h3>17.2 How long we keep them</h3>
          <p>
            We keep these records for <Co field="retentionPeriod" />, counted from the later of the end of our relationship with you (for example, when your account is closed or deleted) and the date of the transaction or report concerned. We may keep them for longer where the law or an authority requires, where there is an ongoing investigation, claim or dispute, or where we reasonably need them to defend a legal claim. Closing or deleting your account does not shorten this period.
          </p>

          <h3>17.3 How we keep them</h3>
          <p>
            We keep records in a form that lets us produce them promptly to an authority that is entitled to them, and in a way that protects their accuracy and confidentiality. Access is limited to authorised staff and recorded.
          </p>

          <h3>17.4 Your account and your data rights</h3>
          <p>
            When you delete your account, we remove or anonymise your name, email address and phone number in your profile and make your password unusable, but we keep the records described in this section for the period above. After that period, we delete or anonymise them unless the law requires us to keep them longer. See the <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink> for details.
          </p>
        </>
      ),
    },
    {
      id: "data-protection",
      title: "18. Protecting your verification data",
      body: (
        <>
          <p>
            Identity documents and selfies are sensitive. We handle them under the Data Protection Act, 2019, and as the <PolicyLink slug="privacy">Privacy Policy</PolicyLink> explains.
          </p>
          <ul>
            <li>We use them only for verification, compliance, fraud prevention and the other purposes described in this policy, and never for marketing.</li>
            <li>Only authorised staff with a need to see them can access them.</li>
            <li>We share them only with people who have a lawful reason to see them, such as our service providers who help us under contract, and authorities that are entitled to ask for them.</li>
            <li>We keep them only as long as section 17 allows.</li>
            <li>
              Your data protection rights, including to access and correct your data, apply. Some of them, such as deletion, are limited where we must keep the data by law. Contact the data protection contact at <Co field="privacyEmail" />, or the Data Protection Officer: <Co field="dataProtectionOfficer" />. You may also complain to the Office of the Data Protection Commissioner (ODPC).
            </li>
            <li>
              Our data may be processed by providers outside Kenya, such as hosting and email providers. The <PolicyLink slug="privacy">Privacy Policy</PolicyLink> explains the safeguards that apply.
            </li>
          </ul>
          <Callout tone="info" title="The law lets us share some data without your consent">
            <p>
              We may share your information with the FRC, the police, courts and other authorities where the law requires or allows it, including for the purpose of preventing or detecting crime. We may do so without telling you (section 15.4).
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "your-obligations",
      title: "19. What we expect from you",
      body: (
        <>
          <p>By opening and using an account, you agree to the following.</p>
          <ol>
            <li>You will give true, complete and current information, and you will not use a false name or someone else's identity.</li>
            <li>You are at least 21 years old and you act for yourself and not for anyone else.</li>
            <li>You will hold only one account.</li>
            <li>You will use the platform only for lawful purposes, and the money you deposit comes from lawful sources and belongs to you.</li>
            <li>You will deposit only from, and withdraw only to, an M-Pesa line registered in your own name.</li>
            <li>You will not let anyone else use your account, and you will keep your password secret.</li>
            <li>You will answer our questions and requests for documents promptly and honestly.</li>
            <li>You will tell us without delay if your name, phone number, contact details or other key details change, if an identity document expires, or if you become a politically exposed person.</li>
            <li>You will not try to avoid our checks, for example by splitting payments to stay under a threshold or by giving us misleading documents.</li>
            <li>You will not use the platform to hide money from tax authorities, to evade a court order or to deal with a sanctioned person.</li>
          </ol>
          <p>
            If you break any of these, we may take the action described in section 16, and you may be liable for any loss we suffer because of it.
          </p>
          <Callout tone="warn" title="Protect yourself from scams">
            <p>
              We will never ask you for your password, your M-Pesa PIN or a one-time code, and we will never ask you to pay a fee to "unlock" a withdrawal or to move money to a personal number. If you receive such a request, do not respond. Report it through <a href="/support">Support</a>.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "review-and-contact",
      title: "20. Review of this policy and how to contact us",
      body: (
        <>
          <h3>20.1 Review</h3>
          <p>
            The compliance officer reviews this policy at least once a year, and sooner if the law changes, if an authority issues new guidance, if we add a service or payment method, or after a serious incident. The board or owners approve material changes. When we change this policy, we change the "Last updated" date shown on this page. Where a change significantly affects your rights or the checks that apply to you, we will tell you by email or on the platform before it takes effect, unless the law requires it to apply sooner.
          </p>

          <h3>20.2 How to contact us</h3>
          <Table
            head={["Matter", "Contact"]}
            rows={[
              ["Verification and general questions", <>Through <a href="/support">Support</a> or at <Co field="supportEmail" />, telephone <Co field="supportPhone" />.</>],
              ["Complaints about a decision under this policy", <><Co field="complaintsEmail" />, as set out in the <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>.</>],
              ["Data protection requests", <><Co field="privacyEmail" /></>],
            ]}
          />
          <p>
            Please do not send identity documents to these addresses unless we have asked you to, and do not describe in a message any suspicion you may have about another client. If you have information about a crime, you may also report it directly to the police.
          </p>
        </>
      ),
    },
  ],
};

export default policy;
