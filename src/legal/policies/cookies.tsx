import type { Policy } from "../types";
import { Callout, Co, Definitions, PolicyLink, Table } from "../components";

const policy: Policy = {
  slug: "cookies",
  title: "Cookie and Browser Storage Policy",
  summary:
    "What the NeuroOption website stores in your browser and why: the NeuroOption app sets no cookies of its own and uses no analytics, advertising or tracking, but it keeps a small number of items in your browser's storage to keep you signed in and remember your preferences, and Google services (reCAPTCHA and Google Fonts) may set their own cookies or receive your IP address.",
  updated: "2026-10-16",
  sections: [
    {
      id: "about-this-policy",
      title: "1. About this policy",
      body: (
        <>
          <p>
            In this policy, "NeuroOption", "we", "us" and "our" mean <Co field="legalName" /> (trading as NeuroOption), a company incorporated in <Co field="jurisdiction" /> with registration number <Co field="registrationNumber" /> and its registered office at <Co field="registeredAddress" />. "You" and "your" mean any person who visits the NeuroOption website at neurooption.com or uses a NeuroOption account.
          </p>

          <h3>1.1 What this policy covers</h3>
          <p>
            This policy explains what information the NeuroOption website saves in your web browser, what each saved item is for, how long it stays there, which third-party services that are built into our pages may set cookies or receive technical information such as your IP address, and how you can see, control and delete what is saved. It covers cookies and also the other kind of browser storage that websites commonly use, called "web storage" (localStorage and sessionStorage).
          </p>

          <h3>1.2 How this policy fits with our other documents</h3>
          <p>
            This policy explains one part of how we handle information. The <PolicyLink slug="privacy">Privacy Policy</PolicyLink> explains the personal data we hold in your account and on our servers, who we share it with and your rights under the Data Protection Act, 2019. The <PolicyLink slug="terms">Terms and Conditions</PolicyLink> set out your agreement with us as a whole. If this policy and the Privacy Policy appear to say different things about browser storage, this policy is the more detailed statement on that subject.
          </p>

          <Callout tone="info" title="Key points">
            <ul>
              <li>
                <strong>No cookies of our own.</strong> The NeuroOption app does not set any cookies itself.
              </li>
              <li>
                <strong>No tracking.</strong> We do not use analytics, advertising, retargeting or marketing scripts or cookies.
              </li>
              <li>
                <strong>A few items in browser storage.</strong> We save a sign-in token, a small copy of your basic profile and a few display preferences, because the features you use need them. They are listed in full in section 5.
              </li>
              <li>
                <strong>Google services.</strong> reCAPTCHA (bot protection on some forms) and Google Fonts (the typeface of the website) are provided by Google, which may set its own cookies or receive your IP address.
              </li>
              <li>
                <strong>You are in control.</strong> You can sign out, clear or block storage in your browser at any time. Section 9 explains how, and section 10 explains what stops working.
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
          <p>In this policy, the following words have these meanings.</p>
          <Definitions
            items={[
              ["Cookie", <>A small text file that a website asks your browser to save and send back to that website on later requests. Cookies can be set by the website you are visiting (first-party cookies) or by another service whose content is built into the page (third-party cookies).</>],
              ["Web storage", <>A browser feature that lets a website save small pieces of text on your device. Unlike cookies, web storage items are not automatically sent to the website with every request. Web storage comes in two forms: localStorage and sessionStorage.</>],
              ["localStorage", <>Web storage that stays in your browser until you or the website delete it. It is still there after you close the browser and reopen it.</>],
              ["sessionStorage", <>Web storage that belongs to one browser tab or window and is deleted when that tab or window is closed.</>],
              ["Storage key", <>The name under which an item is saved in web storage, for example "neurooption_token". Anyone can see the keys saved for a website using their own browser's developer tools.</>],
              ["Sign-in token", <>A long random-looking string that our server gives your browser after you sign in successfully. The app sends it with each request to prove that the request comes from your signed-in session, so that you do not have to type your password again for every action.</>],
              ["Remember me", <>The tick box on the sign-in page, which is ticked when the page opens unless you untick it. When it is ticked, your sign-in is saved in localStorage. When it is not ticked, your sign-in is saved in sessionStorage only.</>],
              ["Third-party service", <>A service run by someone other than NeuroOption whose code or files are loaded into our pages, such as Google reCAPTCHA or Google Fonts.</>],
              ["Essential", <>Needed to provide a feature that you have asked for, such as staying signed in or keeping a setting you chose. See section 8.</>],
              ["Tracking", <>Following what a person does across pages or across different websites in order to build a profile, measure behaviour for analytics, or show advertising. We do not do this.</>],
              ["EAT", <>East Africa Time (UTC+3). All times we show on the platform and in our emails are EAT.</>],
            ]}
          />
        </>
      ),
    },
    {
      id: "what-are-cookies-and-storage",
      title: "3. What cookies and browser storage are",
      body: (
        <>
          <h3>3.1 Cookies</h3>
          <p>
            A cookie is a small text file that a website asks your browser to save. Your browser sends it back to the same website each time you make a request, so the website can recognise your browser. Cookies are used for many purposes, from keeping you signed in to measuring audiences and showing advertising. Some cookies are deleted when you close the browser ("session cookies") and others stay for a set time ("persistent cookies").
          </p>

          <h3>3.2 Web storage</h3>
          <p>
            Web storage works like a small notebook that a website keeps in your browser. The website's own code writes items into it and reads them back later. Two features distinguish it from cookies: items are not sent to the website automatically, and they are visible only to pages from the same website address. NeuroOption uses web storage rather than cookies for the items described in this policy.
          </p>
          <ul>
            <li>
              <strong>localStorage</strong> keeps an item until it is deleted. Closing the browser does not delete it. localStorage is shared between all tabs and windows that have the same website open.
            </li>
            <li>
              <strong>sessionStorage</strong> keeps an item only for the life of one tab or window. If you close the tab, the item is deleted. A new tab does not see what another tab saved in sessionStorage.
            </li>
          </ul>

          <h3>3.3 Why we talk about both in one policy</h3>
          <p>
            Many people use the word "cookies" for everything a website saves in a browser. Privacy and data protection rules, including the Data Protection Act, 2019, apply to information that identifies a person however it is stored. For that reason we describe web storage in the same way as cookies, and we list every item that the app saves, not only the cookies.
          </p>

          <Callout tone="info" title="What is not in browser storage">
            <p>
              Your password is never saved in browser storage. Your account balance, trade history and payment records are held on our servers and are loaded when you use the app; they are not saved as items in your browser. Public visitors who are not signed in use a shared public demo session that is kept on our servers and is not tied to any storage item in your browser.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "our-approach",
      title: "4. Our approach to cookies and tracking",
      body: (
        <>
          <h3>4.1 The NeuroOption app sets no cookies</h3>
          <p>
            The NeuroOption website code and our application servers do not set any cookies. When you sign in, your sign-in token is saved in web storage and the app sends it to our servers in a request header, not in a cookie.
          </p>

          <h3>4.2 What we do not use</h3>
          <ul>
            <li>No analytics tools or analytics cookies, and no page-view or usage statistics services from third parties.</li>
            <li>No advertising, retargeting or marketing cookies, pixels or scripts, and no social-media tracking buttons.</li>
            <li>No browser or device fingerprinting.</li>
            <li>No login history based on browser or device identifiers.</li>
            <li>No sale or sharing of browser storage contents with advertisers or data brokers.</li>
          </ul>

          <h3>4.3 What we do use</h3>
          <p>
            The app saves the small set of items listed in section 5. They exist only so that the features you use work: staying signed in, showing your name, remembering the language and display choices you made, and keeping your list of favourite instruments. Our staff area uses one further item that applies to staff only.
          </p>

          <h3>4.4 Keeping this true</h3>
          <p>
            If we ever introduce analytics, advertising or any other optional cookie or storage item, we will first update this policy, tell you what it is for and offer you a clear choice before the item is saved, as described in section 8.3. We will not add such items silently.
          </p>
        </>
      ),
    },
    {
      id: "storage-we-use",
      title: "5. Browser storage we use",
      body: (
        <>
          <h3>5.1 The full list</h3>
          <p>
            The table below lists every item the NeuroOption app saves in your browser. Keys are shown exactly as they appear in your browser's developer tools.
          </p>
          <Table
            head={["Storage key", "What it holds and what it is for", "Where it is saved", "How long it lasts"]}
            rows={[
              [
                "neurooption_token",
                <>Your sign-in token. It proves to our servers that requests come from your signed-in session. Needed to stay signed in.</>,
                <>localStorage if you tick "Remember me" (and always after creating a new account); otherwise sessionStorage.</>,
                <>Until you sign out, until the app removes it after our server rejects it (this happens in some parts of the app only), until you clear your browser's site data, or, for sessionStorage, until you close the tab or window. See section 6.</>,
              ],
              [
                "neurooption_user",
                <>A small copy of your basic account profile as returned by our server when you sign in (everything in your user record except your password): for example your account identifier, email address, name, phone number if you added one, role, account status, verification and identity-verification status, referral code if any, and the dates the account was created and updated. Used to show your name and menu in the app without waiting for the server.</>,
                <>Same as the sign-in token. See section 6.3 for one exception.</>,
                <>Until you sign out, until you clear your browser's site data, or, for sessionStorage, until you close the tab or window.</>,
              ],
              [
                "neurooption_language",
                <>The language you chose on the sign-in and sign-up pages. Used to show those pages in your language.</>,
                <>localStorage.</>,
                <>Until you clear your browser's site data. It is not removed when you sign out.</>,
              ],
              [
                "neurooption_favorite_assets",
                <>The list of trading instruments you marked as favourites on the Markets page or the trading screen. Used to show your favourites first.</>,
                <>localStorage.</>,
                <>Until you clear your browser's site data. It is not removed when you sign out.</>,
              ],
              [
                "neurooption_chart_background",
                <>Your choice of a black or white chart background on the trading screen.</>,
                <>localStorage.</>,
                <>Until you clear your browser's site data. It is not removed when you sign out.</>,
              ],
              [
                "neurooption_country_preference",
                <>The country you selected in your profile, labelled "Country (local preference)". It is a preference kept in your browser; we do not collect or store your country in your account for this setting.</>,
                <>localStorage, only after you save your profile with a country selected.</>,
                <>Until you clear your browser's site data. It is not removed when you sign out.</>,
              ],
              [
                "neurooption_admin_session",
                <>A staff sign-in token used only by NeuroOption staff in the administration area. It is not saved for clients.</>,
                <>sessionStorage only.</>,
                <>Until the staff member signs out, the staff session expires, or the tab or window is closed. Staff sessions last up to 8 hours.</>,
              ],
            ]}
          />

          <h3>5.2 Items we read but do not create</h3>
          <p>
            Some parts of the app can also read items named "token" or "accessToken" from localStorage, in case an older version of the app or another tool on your device saved a sign-in under one of those names. The current app does not create these items. If you see them in your browser, they were not created by the current NeuroOption app.
          </p>

          <h3>5.3 What the items do not contain</h3>
          <ul>
            <li>They do not contain your password, M-Pesa PIN, card details or identity documents.</li>
            <li>They do not contain your balance, your trades or your payment history.</li>
            <li>They are not used to identify you across other websites.</li>
          </ul>

          <h3>5.4 Who can see these items</h3>
          <p>
            Items in web storage can be read by pages of the NeuroOption website in the same browser, by you through your browser's developer tools, and by anyone who can use your device while you are signed in. They are not sent to us automatically. The one exception is the sign-in token, which the app attaches to its requests to our servers so that we can verify your session. The profile copy and preferences stay in your browser; the app does not upload them.
          </p>

          <Callout tone="warn" title="Anyone using your signed-in browser can act as you">
            <p>
              While your sign-in token is saved in your browser, a person who uses that browser can use your account without your password. Sign out when you finish on a shared, public or borrowed device, and do not tick "Remember me" on such a device. See section 11.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "how-long-storage-lasts",
      title: "6. When storage is written, kept and cleared",
      body: (
        <>
          <h3>6.1 When items are saved</h3>
          <ul>
            <li>
              <strong>When you sign in.</strong> The sign-in token and the profile copy are saved. If you tick "Remember me", they go into localStorage. If you do not, they go into sessionStorage.
            </li>
            <li>
              <strong>When you create an account.</strong> After successful sign-up the app signs you in and saves the token and profile copy in localStorage.
            </li>
            <li>
              <strong>When you use the language selector</strong> on the sign-in or sign-up pages, the language is saved.
            </li>
            <li>
              <strong>When you mark or unmark a favourite</strong> instrument, change the chart background, or save a country in your profile, that choice is saved.
            </li>
            <li>
              <strong>When staff sign in</strong> to the administration area, the staff token is saved in sessionStorage.
            </li>
          </ul>

          <h3>6.2 How long a sign-in lasts</h3>
          <p>
            Separately from the browser, our servers limit how long a sign-in token is valid. A client sign-in token is valid for up to 7 days and a staff sign-in token for 8 hours. After that, the token no longer works and you must sign in again. In some parts of the app (for example when the trading screen loads market data), if our server rejects a saved token the app removes the token from your browser and sends you to the sign-in page. It does not necessarily remove the profile copy at that point, and in other parts of the app an expired token may remain in storage. An expired token cannot be used to access your account, and signing in again replaces it.
          </p>
          <Table
            head={["Situation", "What happens to the sign-in items"]}
            rows={[
              ["You sign out using the app's menu or the sign-out button on your profile", <>The sign-in token and profile copy are removed from both localStorage and sessionStorage.</>],
              ["You delete your account", <>The app signs you out and the sign-in token and profile copy are removed. See the <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink>.</>],
              ["Your token expires or is rejected by our servers", <>In some parts of the app the token is removed when this is detected, and you are sent to the sign-in page. The profile copy may stay until you sign in again, sign out or clear site data. An expired token cannot be used to access your account.</>],
              ["You signed in without \"Remember me\" and close the tab or window", <>The sign-in items in sessionStorage are deleted by your browser. You will need to sign in again.</>],
              ["You signed in with \"Remember me\" and close the browser", <>The sign-in items stay in localStorage, so you are still signed in when you return, until the token expires, you sign out, or you clear site data.</>],
              ["You clear your browser's site data for neurooption.com", <>Every item in section 5 is deleted, including preferences.</>],
            ]}
          />

          <h3>6.3 A detail about the profile copy</h3>
          <p>
            When you change your name in your profile, the app updates the saved profile copy. In the current version of the app this update is written to localStorage. This means that if you signed in without "Remember me" and then edited your name, a copy of your basic profile (not your sign-in token) may be saved in localStorage until you sign out or clear site data. Signing out removes it from both places.
          </p>

          <h3>6.4 What signing out does not remove</h3>
          <p>
            Signing out removes the sign-in token and the profile copy. It does not remove your language, favourites, chart background or country preference, because those are display choices and not part of your session. They stay on the device until you clear site data in your browser. They do not contain anything that gives access to your account.
          </p>

          <h3>6.5 Signing out of other devices</h3>
          <p>
            Signing out in one browser removes the items in that browser only. It does not cancel a sign-in token that was issued earlier and is saved in another browser or device. If you think someone else has access to a device where you are signed in, change your password as soon as you can and tell us through <a href="/support">Support</a>.
          </p>
        </>
      ),
    },
    {
      id: "third-party-services",
      title: "7. Third-party services on our pages",
      body: (
        <>
          <p>
            Two Google services are built into the NeuroOption website. We do not control the cookies or other technologies that Google uses, and we do not receive the information Google collects through them for its own purposes. Google acts for itself in deciding how it uses that information, and Google's own terms and privacy policy apply to it. You should read them if you want details.
          </p>

          <h3>7.1 Google reCAPTCHA</h3>
          <ul>
            <li>
              <strong>What it is.</strong> A Google service that shows a "I'm not a robot" checkbox to tell people from automated programs.
            </li>
            <li>
              <strong>Why we use it.</strong> To protect sign-up, sign-in, forgotten-password and password-reset forms, and the account deletion form, from automated abuse such as password guessing, mass fake registrations and attacks on password reset codes.
            </li>
            <li>
              <strong>When it loads.</strong> Only on the pages that have those forms, and only when the check is switched on. The reCAPTCHA script is loaded from Google's servers when you open such a page. The app asks our server whether the check is enabled; if it is not, no reCAPTCHA content is shown.
            </li>
            <li>
              <strong>What Google may receive.</strong> Google may receive your IP address and technical information about your browser and how you interact with the checkbox, and it may set or read its own cookies or similar technologies on your device to decide whether you are a person. When you complete the check, the app sends the result token to our server so that we can verify it with Google before we accept the form.
            </li>
            <li>
              <strong>Our role.</strong> We use the result only to accept or refuse the form.
            </li>
          </ul>

          <h3>7.2 Google Fonts</h3>
          <ul>
            <li>
              <strong>What it is.</strong> A Google service that delivers web typefaces. The NeuroOption website uses the Noto Sans typeface from Google Fonts.
            </li>
            <li>
              <strong>When it loads.</strong> When you open any page of the website, your browser requests the font style sheet and font files from Google's font servers.
            </li>
            <li>
              <strong>What Google may receive.</strong> As with any request to a server, Google receives your IP address and standard browser information (such as the browser type) so that it can send the files. Google has published information about how it handles font requests and we encourage you to read it.
            </li>
          </ul>

          <h3>7.3 Services that do not set cookies in your browser through our pages</h3>
          <p>
            Other service providers, such as the Safaricom M-Pesa payment service (when real-money accounts are available), our email delivery provider and our hosting provider, work with us on our servers. They do not place their own scripts or cookies in your browser through the NeuroOption website. The <PolicyLink slug="privacy">Privacy Policy</PolicyLink> describes how we share personal data with them.
          </p>

          <h3>7.4 Links to other websites</h3>
          <p>
            If you follow a link from our website to another website, that website has its own cookies and its own policy, which we do not control. Read them before you use that site.
          </p>

          <h3>7.5 Blocking third-party content</h3>
          <p>
            You can block Google's scripts and fonts with your browser settings or with a content-blocking extension. If you block reCAPTCHA when the check is switched on, you will not be able to submit the protected forms. If you block Google Fonts, the website shows in a fallback typeface that your device already has, and works normally.
          </p>
        </>
      ),
    },
    {
      id: "essential-and-optional",
      title: "8. Essential and optional storage, and why there is no cookie banner",
      body: (
        <>
          <h3>8.1 All current storage is essential or a choice you make</h3>
          <p>
            Every item in section 5 is used only to provide a feature that you use or a setting you choose. None of it is used for analytics, advertising or tracking. The table classifies each item.
          </p>
          <Table
            head={["Item", "Category", "Reason"]}
            rows={[
              ["neurooption_token, neurooption_user", "Essential", <>Needed to keep you signed in and to show your account in the app.</>],
              ["neurooption_admin_session", "Essential (staff only)", <>Needed to keep a staff member signed in to the administration area.</>],
              ["neurooption_language, neurooption_favorite_assets, neurooption_chart_background, neurooption_country_preference", "Preference you chose", <>Saved only after you pick a language, mark a favourite, choose a chart background or save a country, so that the app remembers your choice.</>],
              ["Google reCAPTCHA", "Security (third party)", <>Used to protect forms from automated abuse. It is loaded only on the pages that have those forms.</>],
              ["Google Fonts", "Appearance (third party)", <>Delivers the typeface of the website.</>],
            ]}
          />

          <h3>8.2 Why there is no cookie banner today</h3>
          <p>
            Cookie banners and consent pop-ups are normally used to ask for permission before a website saves optional items such as analytics or advertising cookies. The NeuroOption app does not save any optional items of that kind, so there is nothing to ask you to accept or refuse, and we do not show a banner. Items that are strictly necessary for a feature you asked for do not depend on a banner. Items that record a choice you made, such as your language, are saved because you made the choice.
          </p>
          <p>
            We take this approach on the basis of what the app does today. It is not a statement that the law never requires consent for any technology we might use in future.
          </p>

          <h3>8.3 If this changes</h3>
          <p>
            If we decide to use any optional cookie or storage item, such as analytics or advertising, we will:
          </p>
          <ol>
            <li>update this policy and its "Last updated" date before the change takes effect;</li>
            <li>describe what the item is, who sets it, what it is for and how long it lasts;</li>
            <li>ask for your consent through a clear choice before the item is saved, with refusing as easy as accepting; and</li>
            <li>leave the optional items switched off until you choose to allow them, and let you change your mind later.</li>
          </ol>
        </>
      ),
    },
    {
      id: "controlling-storage",
      title: "9. How to see, control and clear storage in your browser",
      body: (
        <>
          <p>
            You can see, block and delete cookies and web storage in any modern browser. The names of the menus differ between browsers and versions, so the steps below are general. If you cannot find a setting, use the search box in your browser's settings or look at your browser's help pages.
          </p>

          <h3>9.1 The easiest way: sign out</h3>
          <p>
            Use the sign-out option in the app. It removes your sign-in token and profile copy from the browser you are using (section 6.2). This is the right step if you only want to end your session on a device.
          </p>

          <h3>9.2 Clear everything for neurooption.com</h3>
          <ol>
            <li>Open your browser's settings and go to the privacy, security or site settings area.</li>
            <li>Look for "Cookies and site data", "Site data" or "Website data" and open the list of sites that have stored data.</li>
            <li>Search for neurooption.com and choose to delete or remove its data.</li>
            <li>Reload the website. You will be signed out and your preferences will be reset.</li>
          </ol>

          <h3>9.3 Using developer tools to inspect or delete single items</h3>
          <ol>
            <li>Open the NeuroOption website, then open your browser's developer tools (usually from the browser menu, labelled "Developer tools" or "More tools").</li>
            <li>Open the "Application" tab (called "Storage" in some browsers).</li>
            <li>Under "Local storage" and "Session storage", choose the NeuroOption website address. You will see the keys in section 5.</li>
            <li>Select an item and delete it, or choose to clear all items for the site.</li>
          </ol>

          <h3>9.4 Common browsers</h3>
          <Table
            head={["Browser", "General steps"]}
            rows={[
              ["Chrome and other Chromium-based browsers (including Edge, Brave and Opera)", <>Open the browser menu, go to Settings, then Privacy and security, then Cookies and other site data or Site settings. Use "See all site data and permissions" to find and delete neurooption.com.</>],
              ["Firefox", <>Open the menu, go to Settings, then Privacy and Security, and find "Cookies and Site Data". Use "Manage Data" to search for and remove neurooption.com.</>],
              ["Safari on Mac, iPhone and iPad", <>On a Mac, open Settings (or Preferences), then Privacy, then "Manage Website Data". On an iPhone or iPad, open the Settings app, go to Safari and choose "Advanced", then "Website Data". Search for neurooption.com and remove it.</>],
              ["Samsung Internet and other mobile browsers", <>Open the browser menu, go to Settings, then Privacy or Privacy and security, and choose the option to delete browsing data, cookies or site data. Choose to delete data for individual sites if the option is offered.</>],
            ]}
          />

          <h3>9.5 Private (incognito) windows</h3>
          <p>
            If you browse in a private or incognito window, your browser normally deletes cookies and web storage when you close all private windows. You will need to sign in again each time. This is a convenient way to use a shared device without leaving a signed-in session behind, but it depends on how your browser handles private browsing.
          </p>

          <h3>9.6 Blocking cookies and storage completely</h3>
          <p>
            Browsers can be set to block cookies, block third-party cookies or block site data altogether. Blocking third-party cookies is possible without affecting how the NeuroOption app stores its own items, because the app does not use cookies. Blocking all site data affects the app, as described in section 10.
          </p>

          <h3>9.7 Browser features that affect Google services</h3>
          <p>
            Some browsers and extensions can block third-party scripts or restrict what Google services receive. You can use them if you wish, subject to what section 7.5 says about blocking reCAPTCHA.
          </p>
        </>
      ),
    },
    {
      id: "if-you-block-storage",
      title: "10. What happens if you block or delete storage",
      body: (
        <>
          <p>
            The app is designed to keep working as far as possible when storage is unavailable, but some features depend on it. The table sets out what to expect.
          </p>
          <Table
            head={["If you...", "What happens"]}
            rows={[
              ["Block all site data or web storage for neurooption.com", <>The app depends on storage to keep you signed in, and some browsers refuse storage access with an error. As a result you may be unable to stay signed in, signing in may appear not to work, preferences cannot be saved, and parts of the website may not load correctly.</>],
              ["Delete site data while signed in", <>You are signed out. You can sign in again with your email and password. Your language, favourites, chart background and country preference are reset to their defaults.</>],
              ["Use a private window", <>You sign in each time. Preferences are lost when the window closes.</>],
              ["Do not tick \"Remember me\"", <>You stay signed in while the tab or window is open, and you are signed out when it is closed. Opening the site in a new tab means signing in again in that tab.</>],
              ["Block Google reCAPTCHA when it is switched on", <>You cannot submit the protected forms (sign-up, sign-in, forgotten password, password reset and account deletion).</>],
              ["Block Google Fonts", <>The website shows in a fallback typeface. Everything else works.</>],
            ]}
          />
          <Callout tone="info" title="Your account and money are not stored in the browser">
            <p>
              Deleting browser storage does not delete your account, your balance, your trades or any other record we hold on our servers. To close an account and delete personal data, follow the process in the <PolicyLink slug="account-closure">Account Closure and Data Retention Policy</PolicyLink>. Demo trading with virtual funds does not involve real money and has no value outside the platform.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "shared-devices-and-security",
      title: "11. Shared devices and keeping your session safe",
      body: (
        <>
          <h3>11.1 Practical steps</h3>
          <ul>
            <li>Do not tick "Remember me" on a shared, public or borrowed device, such as an internet cafe computer or a friend's phone.</li>
            <li>Always sign out when you finish on such a device, and close the browser.</li>
            <li>Protect your own phone and computer with a screen lock, so that a person who picks up your device cannot use a signed-in session.</li>
            <li>Do not install browser extensions from sources you do not trust. Extensions can read web storage.</li>
            <li>If you think someone else may have used your account, change your password and contact us through <a href="/support">Support</a>.</li>
          </ul>

          <h3>11.2 Session length limits</h3>
          <p>
            The 7-day limit on a client sign-in token (and the 8-hour limit on a staff token) means that a stolen or forgotten token stops working after that time. These limits are applied on our servers regardless of what your browser still holds.
          </p>

          <h3>11.3 Our responsibility</h3>
          <p>
            We keep the website and servers that issue and verify sign-in tokens protected using appropriate technical and organisational measures, as described in the <PolicyLink slug="privacy">Privacy Policy</PolicyLink>. No method of protection is complete, and the security of the device and browser you use is your responsibility. Sections 5.3 and 5.4 of the <PolicyLink slug="terms">Terms and Conditions</PolicyLink> explain what you must do to protect your credentials.
          </p>
        </>
      ),
    },
    {
      id: "data-protection-and-your-rights",
      title: "12. Data protection and your rights",
      body: (
        <>
          <h3>12.1 Browser storage and personal data</h3>
          <p>
            The profile copy in your browser contains personal data (your name and email address, for example). The sign-in token is linked to your account. We treat this information under the Data Protection Act, 2019 in the same way as the other personal data described in our <PolicyLink slug="privacy">Privacy Policy</PolicyLink>. We use it only to provide the features described in this policy.
          </p>

          <h3>12.2 IP addresses</h3>
          <p>
            Browser storage does not store your IP address. Like every website, our servers and the Google services in section 7 see your IP address when your browser contacts them. How we use IP addresses is described in the <PolicyLink slug="privacy">Privacy Policy</PolicyLink>.
          </p>

          <h3>12.3 Your rights</h3>
          <p>
            Under the Data Protection Act, 2019 you have the right to be informed about how your data is used, to access it, to have it corrected, to have it deleted where the law allows, to object to its use and to receive it in a portable form. You can use these rights in relation to what this policy covers by contacting us at <Co field="privacyEmail" />. The Privacy Policy explains how we handle requests.
          </p>

          <h3>12.4 Complaints</h3>
          <p>
            If you have a concern about how we use browser storage or any other personal data, please tell us first so that we can put it right. Our process is set out in the <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>. You also have the right to complain to the Office of the Data Protection Commissioner (ODPC) in Kenya. Our registration with the ODPC is recorded as <Co field="odpcRegistration" />.
          </p>
        </>
      ),
    },
    {
      id: "changes-to-this-policy",
      title: "13. Changes to this policy",
      body: (
        <>
          <h3>13.1 When we may change it</h3>
          <p>
            We may update this policy when the app changes, for example if we add or remove a storage item, change how long an item lasts, add a third-party service, or change a legal requirement. The "Last updated" date at the top of this page shows when the policy last changed.
          </p>

          <h3>13.2 How we tell you</h3>
          <ul>
            <li>
              For a change that is minor or only clarifies the wording, we will update this page.
            </li>
            <li>
              For a change that adds an optional cookie or storage item, or a new third-party service that receives information about you, we will update this page before the change takes effect and give you a clear notice and, where it applies, a choice, as section 8.3 describes.
            </li>
          </ul>

          <h3>13.3 Earlier versions</h3>
          <p>
            If you want to see an earlier version of this policy, ask us through <a href="/support">Support</a> or at <Co field="supportEmail" />.
          </p>
        </>
      ),
    },
    {
      id: "contact-us",
      title: "14. Contact us",
      body: (
        <>
          <p>If you have a question about this policy or about what is saved in your browser, you can contact us as follows.</p>
          <Table
            head={["Purpose", "How to reach us"]}
            rows={[
              ["Questions about this policy and data protection requests", <><Co field="privacyEmail" /></>],
              ["Data Protection Officer", <><Co field="dataProtectionOfficer" /></>],
              ["General help", <>Open a ticket on the <a href="/support">Support</a> page when you are signed in, visit the <a href="/help">Help Centre</a>, write to <Co field="supportEmail" />, or call <Co field="supportPhone" />.</>],
              ["Complaints", <><Co field="complaintsEmail" />, as explained in the <PolicyLink slug="complaints">Complaints Handling Policy</PolicyLink>.</>],
              ["Registered office", <><Co field="registeredAddress" /></>],
            ]}
          />
          <p>
            Please do not send your password, sign-in token or any item copied from your browser's storage in an email or a support message. We will never ask you for them.
          </p>
        </>
      ),
    },
  ],
};

export default policy;
