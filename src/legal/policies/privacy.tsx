import type { Policy } from "../types";
import { Callout, Co, Definitions, PolicyLink, Table } from "../components";

const policy: Policy = {
  slug: "privacy",
  title: "Privacy Policy",
  summary:
    "What personal data NeuroOption collects, why we use it, who we share it with, how long we keep it, how we protect it, and how you can exercise your rights under the Kenya Data Protection Act, 2019.",
  updated: "2026-10-16",
  sections: [
    {
      id: "who-we-are",
      title: "1. Who we are and what this policy covers",
      body: (
        <>
          <p>
            In this policy, "NeuroOption", "we", "us" and "our" mean <Co field="legalName" /> (trading as NeuroOption), a company incorporated in <Co field="jurisdiction" /> with registration number <Co field="registrationNumber" /> and its registered office at <Co field="registeredAddress" />. "You" and "your" mean the person who visits our website or holds a NeuroOption account.
          </p>

          <h3>1.1 Our role under the Data Protection Act</h3>
          <p>
            For the personal data described in this policy, NeuroOption is the "data controller" under the Data Protection Act, 2019 of Kenya (the "Data Protection Act"). That means we decide why and how your personal data is used. Some companies that help us run the service act as "data processors" on our behalf; they are described in section 8.
          </p>
          <Table
            head={["Item", "Details"]}
            rows={[
              ["Data controller", <><Co field="legalName" /> (trading as NeuroOption)</>],
              ["Registered office", <Co field="registeredAddress" />],
              ["Registration with the Office of the Data Protection Commissioner", <Co field="odpcRegistration" />],
              ["Data Protection Officer", <Co field="dataProtectionOfficer" />],
              ["Data protection contact", <Co field="privacyEmail" />],
              ["Website", <>https://neurooption.com</>],
            ]}
          />

          <h3>1.2 What this policy covers</h3>
          <p>
            This policy explains what personal data we collect when you visit neurooption.com, create an account, use demo trading, use a real account, contact support or subscribe to our newsletter. It explains why we use the data, who we share it with, how long we keep it, how we protect it and what rights you have.
          </p>

          <h3>1.3 How this policy fits with our other documents</h3>
          <p>
            This policy forms part of your agreement with us under the <PolicyLink slug="terms">Terms and Conditions</PolicyLink>. Please also read:
          </p>
          <ul>
            <li>
              the <PolicyLink slug="cookies">Cookie and Browser Storage Policy</PolicyLink>, which explains the browser storage the platform uses and the cookies that third-party services may set;
            </li>
            <li>
              the <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink>, which explains what happens to your data when you close your account;
            </li>
            <li>
              the <PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink>, which explains the identity and financial-crime checks that require us to collect and keep some data;
            </li>
            <li>
              the <PolicyLink slug="deposits-withdrawals">Deposit, Withdrawal and Refund Policy</PolicyLink>, which explains how payments work; and
            </li>
            <li>
              the <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>, which explains how to complain to us.
            </li>
          </ul>

          <Callout tone="info" title="Key points">
            <ul>
              <li>
                <strong>We never sell your personal data.</strong> We do not share it for advertising.
              </li>
              <li>
                <strong>No tracking.</strong> The platform has no analytics, advertising or tracking scripts, no location tracking, no device fingerprinting and no login history.
              </li>
              <li>
                <strong>You have rights.</strong> You can ask to see, correct or delete your data, object to its use, and more (section 12).
              </li>
              <li>
                <strong>Some records must be kept.</strong> Even after you delete your account, we keep financial, verification and support records that the law requires us to keep (section 10).
              </li>
              <li>
                <strong>You can complain.</strong> You can complain to us or to the Office of the Data Protection Commissioner (section 18).
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
              ["Personal data", <>Any information that identifies you or can be used to identify you, directly or indirectly, such as your name, email address, phone number or account records.</>],
              ["Processing", <>Anything we do with personal data, including collecting, recording, storing, using, sharing, changing, restricting, deleting or destroying it.</>],
              ["Data controller", <>The person or company that decides why and how personal data is processed. For this policy, that is NeuroOption.</>],
              ["Data processor", <>A person or company that processes personal data on behalf of a data controller, under its instructions.</>],
              ["ODPC", <>The Office of the Data Protection Commissioner of Kenya, the authority that oversees the Data Protection Act.</>],
              ["Demo account", <>Your "QT Demo" account and the virtual US dollars (USD) in it. Virtual funds are for practice only and have no monetary value.</>],
              ["Real account", <>Your "QT Real" account, held in Kenya Shillings (KES), which you fund with real money.</>],
              ["KYC", <>"Know your customer": the process of verifying who you are, as explained in the <PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink>.</>],
              ["M-Pesa", <>The mobile money service operated by Safaricom.</>],
              ["EAT", <>East Africa Time (UTC+3). All times in this policy and in our emails are EAT.</>],
            ]}
          />
        </>
      ),
    },
    {
      id: "principles",
      title: "3. The principles we follow",
      body: (
        <>
          <p>We handle your personal data in line with the principles in the Data Protection Act. In practice, this means that we:</p>
          <ul>
            <li>process your data lawfully, fairly and in a transparent way, which is the purpose of this policy;</li>
            <li>collect your data only for specific purposes that we explain, and do not use it in ways that are incompatible with those purposes;</li>
            <li>collect only what is adequate, relevant and limited to what we need. For example, we do not ask for your date of birth, address or country when you register;</li>
            <li>keep your data accurate and give you ways to correct it;</li>
            <li>keep your data only for as long as we need it for the purposes described, or for as long as the law requires;</li>
            <li>protect your data with appropriate security measures (section 11); and</li>
            <li>do not transfer your data outside Kenya unless the safeguards in the Data Protection Act are met (section 9).</li>
          </ul>
        </>
      ),
    },
    {
      id: "data-we-collect",
      title: "4. The personal data we collect",
      body: (
        <>
          <p>
            The table below lists the categories of personal data we hold, with examples and where each comes from. We collect most of it directly from you. Some is created by the platform when you use it, and some comes from Safaricom or our email provider.
          </p>

          <h3>4.1 Categories of personal data</h3>
          <Table
            head={["Category", "Examples", "Source"]}
            rows={[
              [
                "Identity",
                <>Your full name, as you enter it when you register.</>,
                "You, at sign-up or in your profile.",
              ],
              [
                "Contact details",
                <>Your email address. Your phone number, only if you add one to your profile.</>,
                "You, at sign-up or in your profile.",
              ],
              [
                "Login credentials",
                <>Your password, stored only in hashed form (a one-way scrambled form that we cannot turn back into your password). Short-lived verification links and password-reset codes that we email you.</>,
                "You, when you set or change your password. Generated by the platform for verification and reset.",
              ],
              [
                "Account and trading records",
                <>Your account status, your demo and real balances, each trade you place (instrument, direction, stake, expiry, entry and settlement prices, payout and result), ledger entries for real-money postings (demo trades are not ledgered), your favourite instruments and your demo top-ups.</>,
                "You, through your use of the platform. Generated by the platform when trades are accepted and settled.",
              ],
              [
                "Payment records",
                <>Your M-Pesa phone number, the M-Pesa receipt or reference for a transaction, the amount, the status, and the response we receive from the payment provider. Withdrawal requests and the reasons for any decline.</>,
                "You, when you request a deposit or withdrawal. Safaricom, when it confirms or rejects a payment.",
              ],
              [
                "Verification (KYC) records",
                <>Your verification status (not submitted, pending, approved or rejected), the reason for any rejection, and, when we ask for them, documents and details such as a national ID or passport (and its number), selfie or proof of address, together with the review decision and, where the system records it, the staff member who made it.</>,
                "You, when you submit documents. Our authorised staff, when they review them. In-app document upload is not yet available.",
              ],
              [
                "Support records",
                <>Support tickets you open (subject and status), the messages you and our staff exchange, which staff member replied, and any details you choose to include in your messages. The support page does not accept file attachments.</>,
                "You, through the support page. Our support staff.",
              ],
              [
                "Email delivery records",
                <>The email address we sent an email to, its subject line, the type of email, and its delivery status, including the sending provider, its message reference and any delivery, bounce or spam-complaint report the provider returns. We do not keep the body of an email once the provider has accepted it, and we never keep the body of emails that carry codes or one-time links.</>,
                "Generated by the platform; delivery reports come from our email provider.",
              ],
              [
                "Newsletter subscription",
                <>Your email address, the page you subscribed from, when you subscribed, and, if you later unsubscribe, when you did. A private unsubscribe token is created for each subscriber.</>,
                "You, when you subscribe.",
              ],
              [
                "Audit records",
                <>Records of actions taken by our staff on accounts, such as changing an account status or deciding a verification, with the time and the staff account involved. For a deleted account, a record of the deletion request containing your reason, any comment you chose to add, your IP address and your browser's user-agent text at the time of deletion.</>,
                "Generated by the platform. For deletion records, your browser at the time you delete your account.",
              ],
              [
                "Browser storage",
                <>Small items kept in your own browser, such as your sign-in token, basic profile details, language, favourite instruments, chart background and country preference. See section 6.</>,
                "Your browser, set by the platform when you use it.",
              ],
            ]}
          />

          <h3>4.2 Information about our own staff and support interactions</h3>
          <p>
            When our staff act on your account, the platform records which staff role performed the action, what was done and when. Staff accounts are separate from client accounts and are limited to the permissions their role needs (section 11).
          </p>

          <h3>4.3 Data you give us about other people</h3>
          <p>
            Please do not give us personal data about anyone else unless you have a good reason to and the person would reasonably expect it. For example, a payment must be made from, and to, an M-Pesa line registered in your own name. If a support message includes someone else's information, we use it only to handle your request.
          </p>

          <h3>4.4 Sensitive personal data</h3>
          <p>
            We do not ask you for sensitive personal data such as health information, religious or political beliefs, ethnic origin or biometric templates. If you send us such information in a support message or in a document, we will use it only to deal with your request. We do not use automated or biometric face-matching to verify your identity. If you submit a photo or selfie, authorised staff review it manually.
          </p>
        </>
      ),
    },
    {
      id: "what-we-do-not-collect",
      title: "5. What we do not collect",
      body: (
        <>
          <p>To be clear about the limits of what we do, the platform does not:</p>
          <ul>
            <li>
              <strong>use analytics, advertising or tracking scripts.</strong> We do not use tools that follow you across pages or sites to build a profile of you, and we set no marketing cookies;
            </li>
            <li>
              <strong>track your location.</strong> The platform does not read your location. The country preference you may choose is stored only in your own browser and is not sent to us;
            </li>
            <li>
              <strong>fingerprint your device.</strong> We do not collect combinations of device and browser characteristics to identify you;
            </li>
            <li>
              <strong>keep a login history.</strong> We do not store a record of when and from where you signed in; or
            </li>
            <li>
              <strong>ask for your date of birth, residential address or country when you register.</strong> At sign-up you confirm that you are 21 or older by ticking a box. That confirmation is checked in your browser and is not stored on our servers.
            </li>
          </ul>
          <p>
            We do use your IP address in two limited ways. First, we store it in the record of an account-deletion request (section 4.1). Second, we use it to limit repeated requests to the newsletter sign-up. For that purpose it is held only in the memory of our server for about a minute and is not written to our database. Like any website, our hosting provider's network and the services of Google that we use (section 8) necessarily receive your IP address when your browser connects to them, and they may handle it under their own terms.
          </p>
        </>
      ),
    },
    {
      id: "browser-storage-and-cookies",
      title: "6. Browser storage and cookies",
      body: (
        <>
          <p>
            The NeuroOption platform does not set any cookies itself. It stores a small number of items in your browser's local storage (or in session storage if you sign in without choosing "Remember me"). These stay on your device. The table lists them.
          </p>
          <Table
            head={["Item", "What it is for"]}
            rows={[
              ["neurooption_token", "Keeps you signed in. The token expires after up to 7 days."],
              ["neurooption_user", "Basic profile details so the interface can show your name and account."],
              ["neurooption_language", "Your chosen language."],
              ["neurooption_favorite_assets", "Your favourite instruments."],
              ["neurooption_chart_background", "Your chosen chart background."],
              ["neurooption_country_preference", "Your chosen country preference for display. It is not sent to us."],
              ["neurooption_admin_session", "Used only by staff, in session storage, to keep a staff session."],
            ]}
          />
          <p>
            You can clear this storage at any time in your browser settings, or by signing out. If you do, you will need to sign in again and set your preferences again. The reCAPTCHA check and Google Fonts are provided by Google, which may set its own cookies and receive your IP address. For details, see the <PolicyLink slug="cookies">Cookie and Browser Storage Policy</PolicyLink> and section 8 below.
          </p>
        </>
      ),
    },
    {
      id: "purposes-lawful-bases",
      title: "7. Why we use your data and our lawful basis",
      body: (
        <>
          <p>
            The Data Protection Act allows us to process personal data only when we have a lawful basis. The table shows each purpose, the data used, and the basis we rely on.
          </p>

          <h3>7.1 Purposes and lawful bases</h3>
          <Table
            head={["Purpose", "Data used", "Lawful basis"]}
            rows={[
              [
                "Creating and running your account, signing you in and keeping your account secure",
                "Identity, contact details, login credentials, browser storage, account status",
                "Performing our contract with you (the Terms and Conditions).",
              ],
              [
                "Verifying your email address, resetting your password and sending service emails (welcome, verification, password, verification decisions, deposit and withdrawal notices, deletion confirmation)",
                "Contact details, login credentials, email delivery records",
                "Performing our contract with you. These emails are sent whether or not you subscribe to the newsletter.",
              ],
              [
                "Offering demo and real-money trading, accepting, pricing and settling trades and keeping your balances",
                "Account and trading records, ledger entries",
                "Performing our contract with you.",
              ],
              [
                "Processing deposits and withdrawals",
                "Payment records, contact details, identity",
                "Performing our contract with you; complying with our legal obligations.",
              ],
              [
                "Verifying your identity and carrying out anti-money-laundering, counter-terrorism-financing and sanctions checks",
                "Identity, contact details, verification records, payment records, trading records",
                "Complying with our legal obligations; our legitimate interest in preventing fraud and financial crime.",
              ],
              [
                "Answering your support requests and complaints and keeping a record of them",
                "Support records, contact details, relevant account records",
                "Performing our contract with you; our legitimate interest in handling disputes properly.",
              ],
              [
                "Keeping accounting, tax and audit records, and responding to lawful requests from authorities",
                "Account, trading, ledger and payment records, verification records",
                "Complying with our legal obligations.",
              ],
              [
                "Protecting the platform and our clients: preventing abuse, fraud, repeated login or code-guessing attempts, and unauthorised access; investigating technical errors that affect trades",
                "Account and trading records, audit records, brief technical use of IP addresses, email delivery records",
                "Our legitimate interests in security and in operating a fair platform; complying with our legal obligations where they apply.",
              ],
              [
                "Keeping records of staff actions on accounts",
                "Audit records",
                "Our legitimate interests in accountability and security; complying with our legal obligations.",
              ],
              [
                "Establishing, exercising or defending legal claims",
                "Any records relevant to the claim",
                "Our legitimate interests; complying with our legal obligations.",
              ],
              [
                "Sending you our newsletter",
                "Email address, subscription record",
                "Your consent, which you can withdraw at any time (section 15).",
              ],
              [
                "Improving the service using information you send us, such as support feedback",
                "Support records",
                "Our legitimate interest in improving the service. We do not use tracking tools for this.",
              ],
            ]}
          />

          <h3>7.2 Legitimate interests</h3>
          <p>
            Where we rely on our legitimate interests, we have considered whether they are outweighed by your interests, rights and freedoms, and we use only the data needed for the purpose. You can object to processing based on legitimate interests as described in section 12.
          </p>

          <h3>7.3 What we do not do</h3>
          <ul>
            <li>We do not use your personal data to advertise third-party products.</li>
            <li>We do not sell your personal data, or rent it or trade it.</li>
            <li>We do not use your trading records to market to you. Marketing email is sent only to people who have subscribed to the newsletter.</li>
          </ul>

          <h3>7.4 Automated processing</h3>
          <p>
            Some parts of the platform work automatically, without a person making a decision about you:
          </p>
          <ul>
            <li>
              <strong>Payout calculation.</strong> The payout percentage shown before you trade is calculated automatically from market conditions and the expiry you choose. It is the same for every client. It is not personalised and does not depend on your identity, your past results or your balance.
            </li>
            <li>
              <strong>Trade settlement.</strong> Each trade is settled automatically by comparing the entry price with the settlement price, as explained in the <PolicyLink slug="trading-rules">Trading Rules and Execution Policy</PolicyLink>.
            </li>
            <li>
              <strong>Security limits.</strong> The platform limits repeated requests, for example how many verification emails you can request and how many wrong password-reset codes you can enter in a set time. These limits apply equally to everyone.
            </li>
          </ul>
          <p>
            We do not make decisions based solely on automated processing, including profiling, that produce legal effects for you or significantly affect you. Decisions about verification, account status, withdrawals and complaints are made or reviewed by authorised staff. If this changes, we will update this policy and tell you, and you will have the rights given by the Data Protection Act in relation to such decisions.
          </p>
        </>
      ),
    },
    {
      id: "sharing-and-processors",
      title: "8. Who we share your data with",
      body: (
        <>
          <p>
            We share personal data only where it is needed to run the service, where the law requires it, or where you ask us to. We do not sell personal data. We require every company that processes personal data for us to protect it and to use it only on our instructions.
          </p>

          <h3>8.1 Service providers and other recipients</h3>
          <Table
            head={["Recipient", "What they do", "Data involved"]}
            rows={[
              [
                "Safaricom (M-Pesa, through its Daraja service)",
                "Processes deposits and withdrawals made by M-Pesa. Safaricom handles payment data under its own privacy terms as well.",
                "Your M-Pesa phone number, the amount, and the transaction reference and status.",
              ],
              [
                "Email delivery provider",
                "Delivers service emails and newsletter emails. At present we send email through Gmail's mail service; we may move to another email delivery provider, such as Resend or Brevo.",
                "Your email address, your name where used in a greeting, the content of the email while it is being delivered, and delivery reports returned to us.",
              ],
              [
                "Google (reCAPTCHA)",
                "Checks that sign-up, sign-in and password-reset requests come from a person and not an automated program, when this check is switched on. Google may set its own cookies and receives technical information about your browser, including your IP address.",
                "Technical information from your browser, handled under Google's own privacy terms.",
              ],
              [
                "Google (Google Fonts)",
                "Supplies the fonts used on the website. Google may receive your IP address when your browser fetches them.",
                "Your IP address and browser details, handled under Google's own privacy terms.",
              ],
              [
                "Render (hosting)",
                "Hosts the website and the application that runs the platform.",
                "All data held by, or passing through, the platform.",
              ],
              [
                "Managed database provider",
                "Runs the database in which account, trading, payment, verification and support records are stored.",
                "All records described in section 4.",
              ],
              [
                "Professional advisers",
                "Lawyers, accountants and auditors who advise us or review our records, under duties of confidentiality.",
                "Only the records needed for the advice or audit.",
              ],
              [
                "Authorities, courts and regulators",
                "We disclose data where the law requires or permits it, for example in response to a court order or a lawful request from a law-enforcement or regulatory authority, or when we make a report required under anti-money-laundering law. See section 8.2.",
                "Only the data the law requires or permits us to disclose.",
              ],
            ]}
          />

          <h3>8.2 Disclosure required by law</h3>
          <p>
            Kenyan law may require us to give personal data to public bodies, for example the Financial Reporting Centre under the Proceeds of Crime and Anti-Money Laundering Act, 2009, the Kenya Revenue Authority, the Capital Markets Authority, the police and other investigative bodies, or a court. We will disclose only what is required or permitted, and, where the law allows, we will tell you. In some cases the law forbids us from telling you that a report has been made.
          </p>

          <h3>8.3 Business changes</h3>
          <p>
            If NeuroOption is involved in a merger, acquisition, restructuring or sale of assets, personal data may be transferred to the new owner, who must continue to protect it under terms no less protective than this policy. We will tell you before your data becomes subject to a different privacy policy.
          </p>

          <h3>8.4 Other disclosures</h3>
          <p>
            We will not share your personal data with anyone else unless you ask us to, or we have another lawful basis and we have told you. Public pages on the platform do not display your personal data.
          </p>
        </>
      ),
    },
    {
      id: "international-transfers",
      title: "9. Transfers of data outside Kenya",
      body: (
        <>
          <p>
            Some of the companies that host our platform, store our data or deliver our emails operate servers outside Kenya, for example in Europe or the United States. Google's services are also provided from outside Kenya. This means your personal data may be processed in other countries.
          </p>
          <h3>9.1 Safeguards</h3>
          <p>
            The Data Protection Act allows transfers of personal data outside Kenya only where certain safeguards or conditions are met. Before we use a provider outside Kenya, we take steps to make sure that your data is protected to a standard that is appropriate to the risk. Depending on the case, these steps include:
          </p>
          <ul>
            <li>choosing providers that are subject to data protection laws or commitments comparable to the Data Protection Act;</li>
            <li>relying on the provider's written terms, which we expect to require it to protect the data, to use it only on our instructions and to keep it confidential;</li>
            <li>encrypting data in transit between your browser, our servers and our providers;</li>
            <li>transferring only the data the provider needs for its task; and</li>
            <li>relying on your consent for a transfer only where the law allows it and we have told you the risks.</li>
          </ul>
          <h3>9.2 Your choice</h3>
          <p>
            A transfer outside Kenya is a necessary part of operating the platform with the providers described in section 8. If you do not want your data to be processed outside Kenya, you should not use the platform. You can ask us about the safeguards for a particular transfer by contacting us as described in section 19.
          </p>
        </>
      ),
    },
    {
      id: "retention",
      title: "10. How long we keep your data",
      body: (
        <>
          <p>
            We keep personal data only for as long as we need it for the purposes in section 7, or for as long as the law requires. No fixed period is built into the platform for every category, so the periods below are based on the purpose and on legal record-keeping duties, for example under anti-money-laundering, tax and companies law. Where we say a record is kept for "the retention period", this means <Co field="retentionPeriod" /> after your account closes, or for any longer period that the law requires.
          </p>

          <h3>10.1 Retention table</h3>
          <Table
            head={["Data", "How long we keep it"]}
            rows={[
              [
                "Name, email address and phone number on an active account",
                "While your account is open.",
              ],
              [
                "Name, email address and phone number after you delete your account",
                "Removed or anonymised in your profile when your account is deleted. Your password is made unusable, password-reset codes are cleared, and your sessions end immediately. Your email address may remain in the other records listed in this table (for example email delivery records, support records and newsletter records). See section 10.2.",
              ],
              [
                "Deposits, withdrawals, trades and ledger entries",
                <>Kept after account deletion for the retention period, for accounting, audit and anti-money-laundering purposes.</>,
              ],
              [
                "Payment records, including M-Pesa phone number, receipt and provider response",
                <>Kept for the retention period, as part of the financial records above.</>,
              ],
              [
                "Verification (KYC) records, if any",
                <>Kept for the retention period after your account closes.</>,
              ],
              [
                "Record of an account-deletion request (reason, optional comment, IP address and browser user-agent)",
                "Kept so that we can show who requested the deletion and when, and to protect you and us against fraud and disputes.",
              ],
              [
                "Support tickets and messages",
                "Kept so that we can handle complaints, disputes and legal claims, and to evidence what was agreed. Kept for as long as needed to handle your issue and any complaint or claim about it, and no longer than the period for the financial records.",
              ],
              [
                "Email delivery records (recipient address, subject and delivery status)",
                "Kept as a record of what we sent you, for as long as needed to show that required notices were sent and no longer than the period for the financial records. The body of an email is not kept once the provider has accepted it (it is held only while a failed send waits to be retried).",
              ],
              [
                "Newsletter subscription record",
                "Kept while you are subscribed. If you unsubscribe, emails stop and we keep the record that you unsubscribed.",
              ],
              [
                "Other records linked to your account",
                <>In-app notifications, chart and indicator settings, trading account records and email verification token records (the token itself is stored only in hashed form) are not deleted when you delete your account. They stay linked to the anonymised account record, no longer show your name, email address or phone number, and are kept for the same period as the financial records.</>,
              ],
              [
                "Demo balance and demo trade records",
                "Demo trade and demo balance records are not deleted by account deletion and stay linked to the anonymised account record. Demo funds have no value and are no longer available to you.",
              ],
              [
                "Audit records of staff actions",
                "Kept for the retention period, or longer if needed to deal with a dispute, investigation or legal claim.",
              ],
              [
                "Browser storage on your device",
                "Stays on your device until you clear it or sign out. The sign-in token expires after up to 7 days.",
              ],
            ]}
          />

          <h3>10.2 What happens when you delete your account</h3>
          <p>
            You can delete your account yourself at /delete-account by typing DELETE and entering your password. Deletion is blocked while you have a balance of KES 0.01 or more, locked funds, open trades or pending deposits or withdrawals. Deletion cannot be undone, and our support team cannot restore a deleted account. The same email address can later be used to register a new account, which will be a fresh account with none of the old history.
          </p>
          <p>When your account is deleted:</p>
          <ul>
            <li>your name, email address and phone number are removed or anonymised in your profile;</li>
            <li>your password is made unusable and password-reset codes and referral code are cleared;</li>
            <li>social follows and any affiliate profile are switched off;</li>
            <li>your sessions end immediately; and</li>
            <li>we send you a confirmation email with a reference number.</li>
          </ul>
          <p>
            The records listed in section 10.1 as kept after deletion are not erased. We keep them securely, we use them only where the law requires it (for example to meet accounting, audit and anti-money-laundering duties, or to establish or defend a legal claim) and we never use them for marketing. See the <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink> for the full explanation.
          </p>

          <h3>10.3 When retention ends</h3>
          <p>
            When a record is no longer needed and the law no longer requires us to keep it, we delete it or anonymise it so that it can no longer be linked to you. If we need to keep a record longer, for example because of a dispute, an investigation or a legal claim, we keep it until the matter has ended.
          </p>
        </>
      ),
    },
    {
      id: "security",
      title: "11. How we protect your data",
      body: (
        <>
          <p>
            We take reasonable technical and organisational steps to protect your personal data against loss, misuse, unauthorised access and disclosure. The measures that exist today are listed below.
          </p>

          <h3>11.1 Technical measures</h3>
          <ul>
            <li>
              <strong>Password hashing.</strong> Passwords are stored only as bcrypt hashes. We cannot read your password, and our staff cannot see it.
            </li>
            <li>
              <strong>Encrypted connections.</strong> The website and the platform are served over HTTPS, so data between your browser and our servers is encrypted in transit.
            </li>
            <li>
              <strong>Limited sign-in lifetime.</strong> Your sign-in token expires after up to 7 days. If you do not choose "Remember me", it is kept in session storage and ends with the browser session. Staff sessions last up to 8 hours.
            </li>
            <li>
              <strong>Short-lived codes.</strong> Email verification links are valid for 24 hours and work once. Password-reset codes are six digits, valid for 10 minutes, limited to one request a minute, and the code can be entered wrongly only five times in 15 minutes before a lockout applies.
            </li>
            <li>
              <strong>Abuse limits.</strong> Resending verification emails is limited to one a minute and five an hour. A reCAPTCHA check may be required at sign-up, sign-in and password reset.
            </li>
          </ul>

          <h3>11.2 Organisational measures</h3>
          <ul>
            <li>
              <strong>Role-based access for staff.</strong> Our staff use separate staff accounts with roles (Super Admin, Finance, Support, KYC, Risk and Compliance). Each role can reach only the functions it needs.
            </li>
            <li>
              <strong>Audit logs.</strong> Actions that staff take in the administration console, including changes to an account's status, are recorded in an audit log. Some back-office actions are not recorded in that log (see the <PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink>).
            </li>
            <li>
              <strong>Confidentiality.</strong> Staff who can see personal data are required to keep it confidential and to use it only for their work.
            </li>
          </ul>

          <h3>11.3 What we do not yet have</h3>
          <p>
            The platform does not yet offer two-factor authentication. It is planned but not available. Until it is, the strength of your password and the security of your email account are important protections for your NeuroOption account.
          </p>

          <h3>11.4 Your part in keeping data safe</h3>
          <ul>
            <li>Use a long, unique password that you do not use anywhere else.</li>
            <li>Do not share your password, your password-reset code, or the verification links we email you.</li>
            <li>Sign out on shared or public devices and do not tick "Remember me" on them.</li>
            <li>Keep your email account and phone secure, because we send reset codes and notices there.</li>
            <li>Never give your M-Pesa PIN to anyone. We will never ask for it. You enter it only on your own phone when you approve a payment prompt.</li>
            <li>Tell us promptly through <a href="/support">Support</a> if you think someone else has accessed your account.</li>
          </ul>

          <h3>11.5 Data breaches</h3>
          <p>
            No system is completely secure. If a breach of security leads to the unauthorised access to, or loss of, personal data that is likely to put your rights and freedoms at risk, we will notify the Office of the Data Protection Commissioner and tell you, in each case within the time limits and in the manner set by the Data Protection Act and its regulations. Our notice to you will explain what happened, what data is affected, what we are doing about it and what you can do to protect yourself.
          </p>
        </>
      ),
    },
    {
      id: "your-rights",
      title: "12. Your rights",
      body: (
        <>
          <p>The Data Protection Act gives you the following rights over your personal data.</p>

          <h3>12.1 Your rights in summary</h3>
          <Table
            head={["Right", "What it means"]}
            rows={[
              ["To be informed", "To know how and why we use your personal data. This policy is our main way of telling you."],
              ["Access", "To ask whether we hold personal data about you and to receive a copy of it."],
              ["Correction", "To ask us to correct personal data that is wrong, out of date or incomplete."],
              ["Deletion", "To ask us to delete or destroy personal data that we are not entitled to keep, or that we no longer need. Section 12.5 explains the limits."],
              ["Objection", "To object to our processing of your personal data, including for direct marketing. We must stop unless we can show a compelling legitimate reason or the processing is needed for legal claims."],
              ["Restriction", "Where the law provides, to ask us to limit how we use your data, for example while we check its accuracy or while you challenge our use of it."],
              ["Data portability", "To receive the personal data you gave us in a structured, commonly used, machine-readable format, or to ask us to send it to another controller where that is technically possible."],
              ["Withdraw consent", "Where we rely on your consent, to withdraw it at any time. For example, you can unsubscribe from the newsletter. Withdrawal does not affect what we did before you withdrew."],
              ["Not to be subject to certain automated decisions", "As described in section 7.4, we do not make decisions based solely on automated processing that significantly affect you."],
            ]}
          />

          <h3>12.2 How to make a request</h3>
          <p>You can make a request in either of these ways:</p>
          <ul>
            <li>
              open a ticket through <a href="/support">Support</a> while signed in to your account. This is the quickest way because we can confirm who you are; or
            </li>
            <li>
              email <Co field="privacyEmail" /> from the email address registered on your account.
            </li>
          </ul>
          <p>
            Please say which right you want to use and give enough detail for us to find your data. You can make a request in English. You do not need to give a reason for an access request.
          </p>

          <h3>12.3 Checking your identity</h3>
          <p>
            To protect your data from being given to someone else, we may need to confirm that you are the person the data is about. A request made through your signed-in account is normally enough. For an email request, we may ask you to confirm details that only you should know, or to reply from your registered email address, and, if that is not enough, to provide proof of identity. We will not ask for more information than we need for this purpose, and we will use what you send only to deal with your request. If someone makes a request on your behalf, we will ask for proof that they are authorised to do so.
          </p>

          <h3>12.4 Timing and cost</h3>
          <p>
            We will respond to your request within the time limits set by the Data Protection Act and its regulations. If we need more time, or we cannot do what you ask, we will tell you and explain why. We do not charge a fee for reasonable requests. If a request is clearly unfounded or excessive, for example because it is repeated without good reason, the law may allow us to refuse it or to charge a reasonable fee. If we do, we will explain.
          </p>

          <h3>12.5 Limits on your rights</h3>
          <p>Your rights are strong but not unlimited. We may refuse or limit a request where the law allows or requires it. In particular:</p>
          <ul>
            <li>
              <strong>Records we must keep.</strong> We cannot delete financial, trading, payment, verification, audit and similar records that the law requires us to keep (section 10), or that we need to establish, exercise or defend a legal claim. We will explain what we are keeping and why. Where you ask for deletion, we will delete or anonymise what we are allowed to delete.
            </li>
            <li>
              <strong>Other people's data.</strong> We may withhold information if giving it to you would reveal personal data about someone else, unless they agree or it is reasonable to disclose it.
            </li>
            <li>
              <strong>Legal and security reasons.</strong> We may withhold information where disclosing it would break the law, would prejudice the prevention or investigation of a crime (including a report under anti-money-laundering law), or would put the security of the platform at risk.
            </li>
            <li>
              <strong>Open balances and trades.</strong> You cannot delete your account while you have a balance, locked funds, open trades, or pending deposits or withdrawals, because we must complete the transactions first.
            </li>
          </ul>

          <h3>12.6 If we cannot help</h3>
          <p>
            If we refuse a request, we will tell you why, and we will tell you that you can complain to us or to the Office of the Data Protection Commissioner (section 18).
          </p>
        </>
      ),
    },
    {
      id: "children",
      title: "13. Children and minimum age",
      body: (
        <>
          <p>
            NeuroOption is not for children. You must be at least 21 years old to create an account. When you register, you must confirm that you are 21 or older and that you agree to the Terms and Conditions and this policy. We do not knowingly collect personal data from anyone under 21.
          </p>
          <p>
            We do not check your age against a date of birth when you register, because we do not collect one. When we ask for identity documents, we may check that the documents show you are at least 21. If we learn that an account belongs to a person under 21, we may restrict or close it, and we will delete or anonymise the personal data we hold about that person unless the law requires us to keep it. If you believe a child has given us personal data, please contact us through <a href="/support">Support</a> or at <Co field="privacyEmail" />.
          </p>
        </>
      ),
    },
    {
      id: "verification-data",
      title: "14. Identity verification and financial-crime checks",
      body: (
        <>
          <p>
            The law requires us to know who our clients are and to guard against money laundering, terrorist financing and fraud. This is explained in the <PolicyLink slug="aml-kyc">AML, CTF and KYC Policy</PolicyLink>. This section explains how the personal data involved is handled.
          </p>

          <h3>14.1 What we may ask for</h3>
          <p>
            We may ask you for documents such as a national ID or passport, a selfie, and proof of address, and for information about your payment method. At present the platform does not accept document uploads, and the button is shown as unavailable. We do not use automated, face-matching or biometric verification. Authorised staff review documents manually.
          </p>

          <h3>14.2 Who sees it</h3>
          <p>
            Verification records are available only to staff whose roles need them, such as the KYC and Compliance roles. A decision (approved or rejected, with a reason if rejected) is recorded on your verification record, and we email you the result. Administration console actions are recorded in an audit log, but some back-office actions are not (see the <PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink>). We may share verification data with authorities, as described in section 8.2.
          </p>

          <h3>14.3 Why we keep it</h3>
          <p>
            We keep verification records for the retention period (section 10) because the law requires us to be able to show that we checked who our clients were.
          </p>

          <h3>14.4 Consequences of not providing it</h3>
          <p>
            If you do not provide information that we are required by law to collect, or that we reasonably need to run your real account safely, we may be unable to open or keep open your real account, or to process a withdrawal. Demo trading is not affected.
          </p>
        </>
      ),
    },
    {
      id: "marketing",
      title: "15. Emails, marketing and the newsletter",
      body: (
        <>
          <h3>15.1 Service emails</h3>
          <p>
            We send emails that are necessary for the service: a welcome message, email verification, password-reset codes, notices that your password was changed, verification submissions and decisions, deposit and withdrawal notices, support replies, account-deletion confirmation, and notices about changes to our terms or policies that affect you. These are sent regardless of your marketing choices, because they are part of providing the service and keeping your account secure. You cannot unsubscribe from them while you hold an account.
          </p>

          <h3>15.2 The newsletter</h3>
          <ul>
            <li>
              <strong>Single opt-in.</strong> We add your email address to the newsletter only when you subscribe. We then send a welcome email.
            </li>
            <li>
              <strong>Frequency.</strong> We aim never to send more than a few emails a month.
            </li>
            <li>
              <strong>One-click unsubscribe.</strong> The welcome email and every later newsletter email contains an unsubscribe link. Clicking it stops the newsletter. You do not need to sign in.
            </li>
            <li>
              <strong>Consent.</strong> Our legal basis is your consent. You can withdraw it at any time by unsubscribing, and this does not affect your account.
            </li>
          </ul>

          <h3>15.3 No sale of contact details</h3>
          <p>
            We do not sell, rent or pass your email address or phone number to third parties for their own marketing. We do not send marketing text messages or make marketing calls.
          </p>

          <Callout tone="info" title="Trading is not promoted through the newsletter">
            <p>
              Newsletter emails are information only. They do not contain personal trading recommendations or promises of profit. Trading involves a high risk of loss. See the <PolicyLink slug="risk-disclosure">Risk Disclosure</PolicyLink>.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "third-party-links",
      title: "16. Other websites and services",
      body: (
        <>
          <p>
            The platform may link to websites or services run by others. This policy does not apply to them, and we are not responsible for how they handle personal data. Check their privacy notices before you give them any data. This also applies to Safaricom's own handling of your M-Pesa data and to the services of Google described in section 8.
          </p>
          <p>
            Prices on NeuroOption are produced by our own price engine and not taken from any exchange or data vendor. Because of that, no market data provider receives your personal data from us.
          </p>
        </>
      ),
    },
    {
      id: "conflict-and-fairness",
      title: "17. How we use trading data",
      body: (
        <>
          <p>
            NeuroOption is the counterparty to every trade: when you win, we pay you, and when you lose, we keep your stake. This is explained in the <PolicyLink slug="conflicts-of-interest">Conflicts of Interest Policy</PolicyLink>. Because of this conflict of interest, we want to be open about how we use your trading records.
          </p>
          <ul>
            <li>
              We use trading records to run the service: to accept and settle trades, keep balances correct, show you your history, and investigate technical errors or complaints.
            </li>
            <li>
              We use trading records to meet our legal duties, for example accounting and anti-money-laundering monitoring.
            </li>
            <li>
              We may use aggregated and anonymised trading data (data that cannot be linked to you) to understand how the platform is used, to manage our risk and to improve the service.
            </li>
            <li>
              The payout percentage shown for a trade is not set according to who you are or how you have traded. It is the same for every client.
            </li>
          </ul>
          <p>
            Our staff may look at an individual account's trading records only where they need to for one of the purposes above, such as handling your support request, reviewing a withdrawal, investigating suspected abuse, or investigating a technical error.
          </p>
        </>
      ),
    },
    {
      id: "complaints-odpc",
      title: "18. Questions and complaints",
      body: (
        <>
          <h3>18.1 Complain to us first</h3>
          <p>
            If you have a concern about how we handle your personal data, please tell us so that we can put it right. You can open a ticket through <a href="/support">Support</a>, or email <Co field="privacyEmail" />. We will deal with your concern under the <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>.
          </p>

          <h3>18.2 Complain to the regulator</h3>
          <p>
            You also have the right to complain to the Office of the Data Protection Commissioner (ODPC), the Kenyan authority that supervises the Data Protection Act. You may complain to the ODPC at any time, and you do not have to complain to us first. You can find the ODPC's current contact details on its official website.
          </p>
          <p>
            You may also have other rights under Kenyan law, including under the Consumer Protection Act, 2012 and through the courts. Nothing in this policy limits any right you have that cannot be limited by agreement.
          </p>
          <Table
            head={["Item", "Details"]}
            rows={[
              ["Our registration with the ODPC", <Co field="odpcRegistration" />],
              ["Financial regulator (if any)", <Co field="regulator" />],
              ["Licence (if any)", <Co field="licence" />],
            ]}
          />
          <p>
            Do not assume that NeuroOption is licensed, regulated or supervised by any authority beyond what is stated in this table.
          </p>
        </>
      ),
    },
    {
      id: "changes",
      title: "19. Changes to this policy and how to contact us",
      body: (
        <>
          <h3>19.1 Changes to this policy</h3>
          <p>
            We may update this policy, for example when we add a feature, change a provider, introduce two-factor authentication, or when the law changes. The "Last updated" date at the top of this page shows when it was last changed. If a change significantly affects how we use your personal data, we will notify you in advance by email or by a notice on the platform, and where the law requires your consent for the new use, we will ask for it. Past versions are available on request.
          </p>

          <h3>19.2 Contact us</h3>
          <Table
            head={["For", "Contact"]}
            rows={[
              ["Data protection requests and questions", <Co field="privacyEmail" />],
              ["Data Protection Officer", <Co field="dataProtectionOfficer" />],
              ["General support", <><a href="/support">Support page</a>, or <Co field="supportEmail" /></>],
              ["Complaints", <><Co field="complaintsEmail" /></>],
              ["Post", <><Co field="legalName" />, <Co field="registeredAddress" /></>],
            ]}
          />
          <p>
            For the fastest response, open a ticket through <a href="/support">Support</a> while signed in. You can also find general answers in our <a href="/help">Help centre</a>.
          </p>
        </>
      ),
    },
  ],
};

export default policy;
