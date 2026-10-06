import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

// Browser-only fixtures. The shipped app never imports this script. No trade,
// deposit, withdrawal, authentication, or profile mutation is sent to a server.
const baseURL = (process.env.QA_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const origin = new URL(baseURL).origin;
const artifactDir = process.env.QA_ARTIFACT_DIR || 'artifacts/browser-qa';
const widths = [1920, 1440, 1366, 1280, 1024, 768, 430, 412, 390, 375, 360];
const results = [];
const user = {id:'qa-synthetic-user', fullName:'QA Trader', email:'qa@example.invalid', role:'USER', status:'ACTIVE', kycStatus:'NOT_SUBMITTED'};
const account = {
  ...user, accountNumber:'QA-00001', phone:null, verified:false,
  memberSince:'2026-01-01T00:00:00.000Z',
  profile:{completion:40,checklist:[{key:'email',label:'Verify email',done:true},{key:'kyc',label:'Verify identity',done:false}]},
  real:{currency:'KES',balance:9876.54,locked:0},
  demo:{currency:'USD',balance:10000},
};
const quoteSeeds = [
  ['EUR/USD OTC','Euro / US Dollar','Currencies',5,1.08543,0.23,92],
  ['GBP/USD OTC','British Pound / US Dollar','Currencies',5,1.24561,-0.11,87],
  ['BTC/USD OTC','Bitcoin / US Dollar','Cryptocurrencies',2,68432.1,1.42,85],
  ['ETH/USD OTC','Ethereum / US Dollar','Cryptocurrencies',2,3842.21,0.63,85],
  ['USD/JPY OTC','US Dollar / Japanese Yen','Currencies',3,148.321,-0.21,82],
  ['AUD/USD OTC','Australian Dollar / US Dollar','Currencies',5,0.66312,0.18,80],
  ['Gold OTC','Gold','Commodities',2,2657.84,0.42,80],
  ['US 500 OTC','US 500','Indices',1,5862.4,0.38,80],
  ['WTI Oil OTC','WTI Crude Oil','Commodities',2,71.84,-0.21,79],
  ['Tesla OTC','Tesla','Stocks',2,249.38,1.18,78],
  ['Apple OTC','Apple','Stocks',2,182.16,-0.12,78],
  ['US100 OTC','US Tech 100','Indices',1,19421.5,0.27,80],
  ['EUR/GBP OTC','Euro / British Pound','Currencies',5,0.85921,0.09,76],
];
const quotes = quoteSeeds.map(([symbol,label,category,precision,price,changePercent,payout]) => ({symbol,label,category,precision,price,changePercent,payout}));
const assets = quotes.map(q => ({symbol:q.symbol,label:q.label,displayName:q.label,category:q.category,basePrice:q.price,precision:q.precision,payoutBoost:q.payout-80,payout:q.payout,isActive:true,market:'OTC',volatility:0.001}));
const protectedPaths = ['/trading','/profile','/finance','/social-trading','/achievements'];
const routes = [
  {path:'/',auth:false,heading:/trade|trading/i},
  {path:'/markets',auth:false,heading:/markets/i},
  {path:'/trading',auth:true},
  {path:'/profile',auth:true,heading:/my account/i},
  {path:'/finance',auth:true,heading:/deposit|finance/i},
  {path:'/social-trading',auth:true,heading:/social trading/i},
  {path:'/achievements',auth:true,heading:/achievements|level/i},
];

await mkdir(artifactDir,{recursive:true});
let ready = false;
for (let attempt=0; attempt<30; attempt++) {
  try { ready = (await fetch(baseURL,{signal:AbortSignal.timeout(5000)})).ok; } catch {}
  if (ready) break;
  await new Promise(resolve => setTimeout(resolve,1000));
}
assert.ok(ready,'QA_BASE_URL did not become available: '+baseURL);
const browser = await chromium.launch();

function fixtureCandles(url) {
  const symbol = url.searchParams.get('asset') || url.searchParams.get('symbol') || 'EUR/USD OTC';
  const asset = assets.find(item => item.symbol === symbol) || assets[0];
  const lastTime = Math.floor(Date.now()/60000)*60000;
  return Array.from({length:160},(_,index) => {
    const open = asset.basePrice*(1+Math.sin(index/11)*0.0009);
    const close = open+asset.basePrice*Math.sin(index/3)*0.00015;
    return {time:lastTime-(159-index)*60000,open,close,high:Math.max(open,close)+asset.basePrice*0.0002,low:Math.min(open,close)-asset.basePrice*0.0002};
  });
}

async function makeContext(options) {
  const width = options.width || 390;
  const context = await browser.newContext({viewport:{width,height:options.height || (width>=1024?900:844)},deviceScaleFactor:1,reducedMotion:'reduce',serviceWorkers:'block'});
  const telemetry = {pageErrors:[],consoleErrors:[],fixtureHits:[],mutations:[],unexpectedRequests:[],externalRequestsBlocked:0};
  await context.addInitScript(({auth,user}) => {
    if (auth) {
      // Exercise the app's supported sessionStorage token path.
      sessionStorage.setItem('neurooption_token','qa-synthetic-token-not-a-live-credential');
      localStorage.setItem('neurooption_user',JSON.stringify(user));
    }
  },{auth:options.auth !== false,user});
  // Closing intercepted sockets prevents connections to real backend transports.
  await context.routeWebSocket('**/*',socket => socket.close());
  await context.route('**/*',async route => {
    const request = route.request();
    const url = new URL(request.url());
    const endpoint = url.pathname.replace(/^\/api(?=\/)/,'');
    const method = request.method();
    const headers = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type, Authorization, Accept','Access-Control-Allow-Methods':'GET, HEAD, OPTIONS'};
    const fulfill = (body,status=200) => route.fulfill({status,headers,contentType:'application/json',body:JSON.stringify(body)});
    const isAPI = /^\/(?:account|finance|payments|market-data|market|trading-engine|wallet|auth|users)\//.test(endpoint);
    if (url.pathname.includes('/socket.io/')) return fulfill({message:'Sockets isolated by QA'},503);
    if (isAPI && method === 'OPTIONS') return route.fulfill({status:204,headers});
    if (isAPI && !['GET','HEAD','OPTIONS'].includes(method)) {
      telemetry.mutations.push(method+' '+url.href);
      return fulfill({message:'QA blocks every backend mutation'},405);
    }
    if (isAPI && method === 'GET') {
      telemetry.fixtureHits.push(endpoint);
      if (endpoint === '/account/me') return fulfill(account);
      if (endpoint === '/finance/me') return fulfill({wallet:account.real,mpesa:{configured:Boolean(options.mpesaConfigured),environment:'sandbox',minAmount:1,maxAmount:100000},transactions:[]});
      if (endpoint === '/market-data/quotes') {
        if (options.payout === 'unavailable') return fulfill({message:'Quote feed unavailable in this QA scenario'},503);
        const data = options.payout === 'invalid' ? quotes.map(quote=>({...quote,payout:999})) : quotes;
        return fulfill({serverTime:new Date().toISOString(),quotes:data});
      }
      if (endpoint === '/market-data/assets' || endpoint === '/market/assets') return fulfill({assets});
      if (endpoint === '/market-data/candles') {
        if (options.candles === 'unavailable') return fulfill({message:'Market unavailable in this QA scenario'},503);
        return fulfill({candles:fixtureCandles(url)});
      }
      if (endpoint === '/trading-engine/wallet') {
        if (options.wallet === 'unavailable') return fulfill({message:'Wallet unavailable in this QA scenario'},503);
        const balance = options.wallet === 'invalid' ? 'invalid-balance' : 1234.56;
        return fulfill({userId:user.id,accountType:url.searchParams.get('accountType') || 'QT Demo',currency:url.searchParams.get('currency') || 'USD',balanceUsd:balance,balance,updatedAt:new Date().toISOString()});
      }
      if (['/trading-engine/trades/open','/trading-engine/trades/history','/trading-engine/open','/trading-engine/history','/wallet/transactions'].includes(endpoint)) return fulfill([]);
      if (endpoint === '/market-data/stream') return fulfill({message:'SSE isolated; historical fixture is authoritative'},503);
      telemetry.unexpectedRequests.push(method+' '+url.href);
      return fulfill({message:'Missing read-only QA fixture'},503);
    }
    if (url.origin === origin || (method === 'GET' && ['fonts.googleapis.com','fonts.gstatic.com'].includes(url.hostname))) return route.continue();
    if (['xhr','fetch','eventsource'].includes(request.resourceType())) telemetry.unexpectedRequests.push(method+' '+url.href);
    telemetry.externalRequestsBlocked++;
    return route.abort('blockedbyclient');
  });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  page.on('pageerror',error => telemetry.pageErrors.push(error.message));
  page.on('console',message => {if (message.type() === 'error') telemetry.consoleErrors.push(message.text());});
  return {context,page,telemetry};
}

async function settle(page) {
  await page.locator('body').waitFor({state:'visible'});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => !document.getElementById('app-splash') || document.getElementById('app-splash').classList.contains('is-hidden'));
  await page.waitForTimeout(180);
}

async function scenario(name,options,test) {
  const started = Date.now();
  const slug = name.replace(/[^a-z0-9_-]+/gi,'-').toLowerCase();
  const {context,page,telemetry} = await makeContext(options);
  let failure;
  try {
    await page.goto(baseURL+(options.path || '/'),{waitUntil:'domcontentloaded',timeout:20000});
    await settle(page);
    await test(page,telemetry);
    assert.deepEqual(telemetry.mutations,[],'No browser test may submit a backend mutation');
    assert.deepEqual(telemetry.unexpectedRequests,[],'Every backend read must use an explicit isolated fixture');
  } catch (error) { failure = error.stack || String(error); }
  try {
    await page.screenshot({path:path.join(artifactDir,slug+'.png'),fullPage:true,animations:'disabled',timeout:12000});
    if (['responsive-home-1440','responsive-home-390','responsive-trading-390','responsive-markets-390','responsive-profile-390','responsive-finance-390','responsive-social-trading-390','responsive-achievements-390'].includes(name)) {
      // Full PNGs remain in the artifact. Export a bounded viewport image for
      // reviewing Actions logs when filesystem/artifact downloads are unavailable.
      let buffer = await page.screenshot({type:'png',fullPage:false,animations:'disabled'});
      let mimeType = 'image/png';
      if (buffer.length > 160000) {buffer = await page.screenshot({type:'jpeg',quality:35,fullPage:false,animations:'disabled'}); mimeType='image/jpeg';}
      if (buffer.length <= 160000) console.log('QA_SCREENSHOT '+JSON.stringify({name,mimeType,data:buffer.toString('base64')}));
      else console.log('QA_SCREENSHOT_ARTIFACT '+slug+'.png');
    }
  } catch (error) {failure ||= 'Screenshot failed: '+error.message;}
  if (telemetry.pageErrors.length) failure ||= 'Uncaught page errors: '+JSON.stringify(telemetry.pageErrors);
  const applicationErrors=telemetry.consoleErrors.filter(message => /TypeError|ReferenceError|SyntaxError|uncaught|invalid hook|maximum update depth/i.test(message));
  if (applicationErrors.length) failure ||= 'Application console errors: '+JSON.stringify(applicationErrors);
  await writeFile(path.join(artifactDir,slug+'.json'),JSON.stringify(telemetry,null,2));
  await context.close();
  results.push({name,status:failure?'failed':'passed',durationMs:Date.now()-started,error:failure});
  console.log((failure?'FAIL ':'PASS ')+name+(failure?'\n'+failure:''));
}

async function noOverflow(page) {
  const dimensions = await page.evaluate(() => ({viewport:innerWidth,html:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
  assert.ok(dimensions.html<=dimensions.viewport+1 && dimensions.body<=dimensions.viewport+1,'Horizontal page overflow: '+JSON.stringify(dimensions));
}

async function officialLogo(page) {
  const image = page.locator('img.neurooption-logo:visible').first();
  await image.waitFor({state:'visible'});
  const data = await image.evaluate(element => ({loaded:element.complete && element.naturalWidth>0,source:element.currentSrc,width:element.getBoundingClientRect().width,height:element.getBoundingClientRect().height}));
  assert.ok(data.loaded,'Official logo must load');
  assert.ok(data.source.endsWith('/neurooption-logo.png'),'Official wordmark must be retained: '+data.source);
  assert.ok(data.width>40 && data.height>10,'Logo must have usable dimensions');
  assert.ok(Math.abs(data.width/data.height-900/173)<0.05,'Official logo must retain its aspect ratio');
}

async function goldTheme(page) {
  const colors = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const probe = document.createElement('span');
    probe.style.color = 'var(--neo-accent)'; document.body.append(probe);
    const accent = getComputedStyle(probe).color;
    probe.style.color = 'var(--brand-gold)';
    const brandGold = getComputedStyle(probe).color;
    probe.remove();
    return {accent,brandGold,token:root.getPropertyValue('--brand-gold').trim()};
  });
  const isGold = color => {
    const components = color.match(/[\d.]+/g)?.map(Number) || [];
    const [red,green,blue] = components;
    return red>=150 && green>=90 && red>=green && red>blue*1.25 && green>blue*1.1;
  };
  assert.ok(colors.token && isGold(colors.brandGold),'Computed --brand-gold must be gold: '+JSON.stringify(colors));
  assert.ok(isGold(colors.accent),'Primary --neo-accent must resolve to gold: '+JSON.stringify(colors));
}

async function chartDimensions(page) {
  const canvas = page.locator('.nt-chart-canvas');
  await canvas.waitFor({state:'visible'});
  await page.waitForFunction(() => {
    const canvas=document.querySelector('.nt-chart-canvas');
    return canvas && canvas.width>0 && canvas.height>0;
  });
  const dimensions = await canvas.evaluate(element => {
    const rect = element.getBoundingClientRect();
    return {cssWidth:rect.width,cssHeight:rect.height,pixelWidth:element.width,pixelHeight:element.height,dpr:Math.min(devicePixelRatio,2)};
  });
  assert.ok(dimensions.cssWidth>=200 && dimensions.cssHeight>=180,'Chart collapsed: '+JSON.stringify(dimensions));
  assert.ok(Math.abs(dimensions.pixelWidth-dimensions.cssWidth*dimensions.dpr)<=2 && Math.abs(dimensions.pixelHeight-dimensions.cssHeight*dimensions.dpr)<=2,'Canvas backing dimensions must follow its displayed size: '+JSON.stringify(dimensions));
}

async function trapFocus(page,dialog) {
  const focusables = dialog.locator('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]').filter({visible:true});
  const count = await focusables.count();
  assert.ok(count>=2,'Dialog must expose usable focus targets');
  await focusables.nth(count-1).focus();
  await page.keyboard.press('Tab');
  assert.ok(await focusables.first().evaluate(element => element===document.activeElement),'Tab must wrap to first dialog control');
  await page.keyboard.press('Shift+Tab');
  assert.ok(await focusables.nth(count-1).evaluate(element => element===document.activeElement),'Shift+Tab must wrap to last dialog control');
}
try {
  // Seven product screens at all eleven requested widths: 77 real DOM cases.
  for (const width of widths) {
    for (const route of routes) {
      const routeName = route.path === '/' ? 'home' : route.path.slice(1);
      await scenario('responsive-'+routeName+'-'+width,{...route,width},async (page,telemetry) => {
        assert.equal(new URL(page.url()).pathname,route.path,'Route must render without an unexpected redirect');
        await page.locator('main').first().waitFor({state:'visible'});
        if (route.heading) await page.getByRole('heading',{name:route.heading}).first().waitFor({state:'visible'});
        await officialLogo(page);
        await noOverflow(page);
        await goldTheme(page);
        if (route.path === '/') {
          await page.locator('.hp-hero').waitFor({state:'visible'});
          const primaryInk=await page.locator('.hp-hero-cta .hp-btn-primary').evaluate(element=>getComputedStyle(element).color.match(/\\d+/g).slice(0,3).map(Number));
          assert.ok(primaryInk.every(channel=>channel<90),'Gold CTA needs dark text for accessible contrast');
          assert.ok(await page.locator('.hp-hero-cta a').count()>=2,'Hero must provide account and demo actions');
          assert.ok(await page.locator('.hp-stage,.hp-laptop,.hp-hero-phone,.hp-hero-art,.hp-hero-visual,.hp-hero-devices,.hp-hero-laptop,.hd').count()>0,'Hero must include the trading/device preview');
          assert.ok(await page.locator('.hp-ticker,.hp-ticker-strip,.hp-ticker-track,.hp-quotes,.hd-tickers,[data-qa="ticker"]').count()>0,'Homepage must retain a quote ticker');
          assert.ok(await page.locator('#devices,.hp-devices').count()>0,'Homepage must retain its device section');
          const text=await page.locator('main').innerText();
          for (const category of [/Forex|Currencies/i,/Crypto/i,/Stocks/i,/Indices/i,/Commodities/i]) assert.match(text,category,'Homepage must present asset categories');
        }
        if (route.path === '/markets') {
          await page.getByRole('button',{name:/Add .* to favou?rites/i}).first().waitFor({state:'visible'});
          assert.ok(telemetry.fixtureHits.includes('/market-data/quotes'),'Markets must consume the isolated quotes endpoint');
          assert.match(await page.locator('main').innerText(),/1\.08543/,'Fixture quote must replace the fallback');
        }
        if (route.path === '/trading') {
          await chartDimensions(page);
          await page.waitForFunction(() => document.body.innerText.includes('1,234.56'));
          assert.ok(telemetry.fixtureHits.includes('/market-data/candles'),'Trading must consume authoritative historical candles');
          assert.ok(telemetry.fixtureHits.includes('/trading-engine/wallet'),'Trading must consume its wallet endpoint');
          assert.equal(await page.locator('.nt-buy').isDisabled(),false,'Valid fixture wallet and candles must enable Buy');
          assert.equal(await page.locator('.nt-sell').isDisabled(),false,'Valid fixture wallet and candles must enable Sell');
        }
        if (route.path === '/profile') {
          await page.getByText(user.fullName,{exact:true}).first().waitFor({state:'visible'});
          assert.ok(telemetry.fixtureHits.includes('/account/me'),'Account must consume the account endpoint');
        }
        if (route.path === '/finance') assert.ok(telemetry.fixtureHits.includes('/finance/me'),'Finance must consume the overview endpoint');
      });
    }
  }

  for (const pathname of protectedPaths) {
    await scenario('guest-redirect-'+pathname.slice(1),{path:pathname,width:390,auth:false},async page => {
      await page.waitForURL(url => url.pathname === '/login');
      await page.locator('input[type="password"]').waitFor({state:'visible'});
    });
  }

  for (const pathname of ['/login','/register']) {
    await scenario('auth-route-'+pathname.slice(1),{path:pathname,width:390,auth:false},async page => {
      assert.equal(new URL(page.url()).pathname,pathname);
      await page.locator('input[type="email"]').first().waitFor({state:'visible'});
      await page.locator('input[type="password"]').first().waitFor({state:'visible'});
      await officialLogo(page);
      await noOverflow(page);
    });
  }

  for (const width of [1440,390]) {
    await scenario('guest-hero-actions-'+width,{path:'/',width,auth:false},async page => {
      await page.locator('.hp-hero-cta a[href="/register"]').first().click();
      await page.waitForURL(url => url.pathname === '/register');
      await page.locator('input[type="email"]').waitFor({state:'visible'});
      await page.goto(baseURL+'/',{waitUntil:'domcontentloaded'});
      await settle(page);
      await page.locator('.hp-hero-cta a[href="/trading"]').first().click();
      await page.waitForURL(url => url.pathname === '/login');
    });
  }

  for (const pathname of ['/','/markets','/trading']) {
    await scenario('drawer-keyboard-'+(pathname==='/'?'home':pathname.slice(1)),{path:pathname,width:390,auth:pathname==='/trading'},async page => {
      const closedIsInert = await page.evaluate(() => {
        const drawer=document.querySelector('.neo-drawer');
        return !drawer || drawer.inert;
      });
      assert.ok(closedIsInert,'Closed drawer must be unmounted or inert, so offscreen links cannot receive focus');
      const trigger=page.getByRole('button',{name:'Open menu',exact:true}).first();
      await trigger.click();
      const dialog=page.getByRole('dialog',{name:'Menu',exact:true});
      await dialog.waitFor({state:'visible'});
      assert.equal(await dialog.getAttribute('aria-modal'),'true');
      console.log('QA_DRAWER_STATE '+JSON.stringify(await page.evaluate(()=>({
        focus:document.activeElement?.outerHTML?.slice(0,300),
        drawers:[...document.querySelectorAll('.neo-drawer')].map(node=>({class:node.className,inert:node.inert,visibility:getComputedStyle(node).visibility,close:node.querySelector('.neo-drawer-head button')?.outerHTML?.slice(0,200)})),
        rootInert:document.getElementById('root')?.inert
      }))));
      await page.waitForFunction(() => document.querySelector('[role="dialog"][aria-label="Menu"]')?.contains(document.activeElement));
      assert.ok(await page.evaluate(() => Boolean(document.getElementById('root')?.inert)),'Background must be inert while drawer is open');
      await trapFocus(page,dialog);
      await page.keyboard.press('Escape');
      await dialog.waitFor({state:'hidden'});
      assert.ok(await trigger.evaluate(element => element===document.activeElement),'Escape must return focus to menu trigger');
      assert.equal(await page.evaluate(() => document.getElementById('root')?.inert),false,'Closing drawer must release background');
      for (let i=0;i<6;i++) {
        await page.keyboard.press('Tab');
        assert.ok(await page.evaluate(() => !document.activeElement?.closest('.neo-drawer')),'Closed drawer must stay outside keyboard navigation');
      }
    });
  }

  for (const width of [1440,390]) {
    await scenario('favorite-enter-'+width,{path:'/markets',width,auth:false},async page => {
      const star=page.getByRole('button',{name:'Add EUR/USD OTC to favourites',exact:true});
      await star.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(120);
      assert.equal(new URL(page.url()).pathname,'/markets','Enter on a favourite must not activate the trade link');
      assert.equal(await page.getByRole('button',{name:'Remove EUR/USD OTC from favourites',exact:true}).getAttribute('aria-pressed'),'true');
      const saved=await page.evaluate(() => JSON.parse(localStorage.getItem('neurooption_favorite_assets')||'[]'));
      assert.ok(saved.includes('EUR/USD OTC'),'Favourite must persist');
      await page.reload({waitUntil:'domcontentloaded'});
      await page.getByRole('button',{name:'Remove EUR/USD OTC from favourites',exact:true}).waitFor({state:'visible'});
    });
    await scenario('market-search-and-filter-'+width,{path:'/markets',width,auth:false},async page => {
      await page.getByRole('tab',{name:'All',exact:true}).waitFor({state:'visible'});
      for (const name of ['All','Forex','Crypto','Stocks','OTC','Favorites','Indices','Commodities']) assert.ok(await page.getByRole('tab',{name,exact:true}).isVisible(),'Market category must remain accessible: '+name);
      await page.getByRole('tab',{name:'Crypto',exact:true}).click();
      await page.getByRole('searchbox',{name:'Search assets',exact:true}).fill('Bitcoin');
      await page.getByRole('button',{name:/Add BTC\/USD OTC to favourites/i}).waitFor({state:'visible'});
      assert.equal(await page.getByRole('button',{name:/Add .* to favourites/i}).count(),1,'Search and category filter must narrow the visible assets');
      await page.getByRole('searchbox',{name:'Search assets',exact:true}).fill('qa-no-such-asset');
      await page.getByText('No assets match your search.',{exact:true}).waitFor({state:'visible'});
      await noOverflow(page);
    });
    await scenario('unavailable-payments-'+width,{path:'/finance',width,auth:true,mpesaConfigured:false},async page => {
      const controls=page.locator('button.fin-pay');
      await controls.first().waitFor({state:'visible'});
      assert.ok(await controls.count()>=2,'Finance must show payment choices');
      for (const control of await controls.all()) assert.equal(await control.isDisabled(),true,'Unconfigured and unavailable payment methods must be disabled');
      assert.match(await page.locator('main').innerText(),/coming soon|unavailable|not configured/i,'Unavailable payment choices must explain their state');
      assert.equal(await page.getByRole('dialog').count(),0,'Disabled payment choices must not open a payment flow');
    });
    for (const wallet of ['unavailable','invalid']) {
      await scenario('wallet-'+wallet+'-'+width,{path:'/trading',width,auth:true,wallet},async (page,telemetry) => {
        await chartDimensions(page);
        await page.waitForTimeout(350);
        assert.ok(telemetry.fixtureHits.includes('/trading-engine/wallet'),'Scenario must exercise wallet loading');
        assert.doesNotMatch(await page.locator('body').innerText(),/70,?000(?:\.00)?/,'An unavailable wallet must never invent a $70,000 balance');
        assert.equal(await page.locator('.nt-buy').isDisabled(),true,'Buy must remain disabled without a valid wallet');
        assert.equal(await page.locator('.nt-sell').isDisabled(),true,'Sell must remain disabled without a valid wallet');
        assert.match(await page.locator('body').innerText(),/unavailable|loading|could not|failed|try again/i,'Wallet state must be readable');
      });
    }
    await scenario('market-unavailable-'+width,{path:'/trading',width,auth:true,candles:'unavailable'},async (page,telemetry) => {
      await chartDimensions(page);
      await page.waitForFunction(() => document.body.innerText.includes('1,234.56'));
      assert.ok(telemetry.fixtureHits.includes('/market-data/candles'),'Scenario must exercise historical market failure');
      assert.equal(await page.locator('.nt-buy').isDisabled(),true,'A valid wallet alone must not enable Buy without authoritative market data');
      assert.equal(await page.locator('.nt-sell').isDisabled(),true,'A valid wallet alone must not enable Sell without authoritative market data');
      assert.match(await page.locator('body').innerText(),/connecting|loading|unavailable|waiting/i,'Unavailable market must show its connection state');
    });
  }

  for (const payout of ['unavailable','invalid']) {
    await scenario('payout-'+payout,{path:'/trading',width:390,auth:true,payout},async(page,telemetry)=>{
      await chartDimensions(page);
      await page.waitForFunction(()=>document.body.innerText.includes('1,234.56'));
      assert.ok(telemetry.fixtureHits.includes('/market-data/quotes'));
      assert.equal(await page.locator('.nt-buy').isDisabled(),true,'Unavailable payout must block Buy');
      assert.equal(await page.locator('.nt-sell').isDisabled(),true,'Unavailable payout must block Sell');
      assert.match(await page.locator('.nt-white-payout').innerText(),/Unavailable/);
      assert.match(await page.locator('.nt-trade-status').innerText(),/payout/i);
    });
  }
  await scenario('terminal-short-viewport',{path:'/trading',width:360,height:640,auth:true},async page=>{
    await chartDimensions(page);
    await page.waitForFunction(()=>document.querySelector('.nt-buy')?.disabled===false);
    await officialLogo(page);
    await noOverflow(page);
    for(const selector of ['.nt-buy','.nt-sell','.nt-white-payout','.nt-bottom-nav','.nt-menu-btn']){
      const rect=await page.locator(selector).boundingBox();
      assert.ok(rect && rect.y>=0 && rect.y+rect.height<=640,selector+' must stay usable on a short phone');
    }
  });
  await scenario('terminal-controls-and-indicator-dialog',{path:'/trading',width:390,auth:true},async page=>{
    await chartDimensions(page);
    await page.waitForFunction(()=>document.querySelector('.nt-buy')?.disabled===false);
    assert.match(await page.locator('.nt-white-payout').innerText(),/92%/,'Backend payout must drive the preview');
    await page.getByRole('button',{name:'Select chart style',exact:true}).click();
    await page.locator('.nt-chart-types').getByRole('button',{name:'Line',exact:true}).click();
    assert.ok((await page.locator('.nt-chart-types').getByRole('button',{name:'Line',exact:true,includeHidden:true}).getAttribute('class')).includes('active'));
    await page.getByRole('button',{name:'Indicators',exact:true}).click();
    const editorTrigger=page.getByTitle('Edit indicator settings',{exact:true}).first();
    await editorTrigger.click();
    const dialog=page.getByRole('dialog',{name:'Indicator settings',exact:true});
    await dialog.waitFor({state:'visible'});
    assert.ok(await dialog.evaluate(element=>element.contains(document.activeElement)),'Indicator editor must own focus');
    const period=dialog.locator('input[type="number"]').first();
    await period.fill('18');
    assert.ok(await period.evaluate(element=>element===document.activeElement),'Editing must retain input focus');
    await page.keyboard.press('Escape');
    await dialog.waitFor({state:'hidden'});
    await editorTrigger.click();
    await dialog.waitFor({state:'visible'});
    await dialog.getByRole('button',{name:'Cancel',exact:true}).click();
    await dialog.waitFor({state:'hidden'});
    await noOverflow(page);
  });

  await scenario('deposit-dialog-keyboard',{path:'/finance',width:390,auth:true,mpesaConfigured:true},async page => {
    const trigger=page.locator('button.fin-pay').filter({hasText:'M-Pesa'}).first();
    await page.waitForFunction(() => [...document.querySelectorAll('button.fin-pay')].some(button => button.textContent.includes('M-Pesa') && !button.disabled));
    await trigger.click();
    const dialog=page.getByRole('dialog',{name:/Deposit.*M.Pesa/i});
    await dialog.waitFor({state:'visible'});
    assert.equal(await dialog.getAttribute('aria-modal'),'true');
    assert.ok(await dialog.evaluate(element => element.contains(document.activeElement)),'Deposit dialog must receive focus');
    await trapFocus(page,dialog);
    await page.keyboard.press('Escape');
    await dialog.waitFor({state:'hidden'});
    assert.ok(await trigger.evaluate(element => element===document.activeElement),'Closing deposit dialog must restore focus');
    assert.equal(await page.evaluate(() => document.getElementById('root')?.inert),false,'Deposit dialog must release background');
  });

  await scenario('client-navigation-trading-to-markets',{path:'/trading',width:390,auth:true},async page => {
    await chartDimensions(page);
    const links=page.locator('a[href="/markets"]').filter({visible:true});
    if (await links.count()) await links.first().click();
    else await page.getByRole('button',{name:/markets/i}).first().click();
    await page.waitForURL(url => url.pathname==='/markets');
    await page.getByRole('heading',{name:'Markets',exact:true}).waitFor({state:'visible'});
    const overflow=await page.evaluate(() => ({body:getComputedStyle(document.body).overflowY,html:getComputedStyle(document.documentElement).overflowY}));
    assert.ok(!['hidden','clip'].includes(overflow.body) && !['hidden','clip'].includes(overflow.html),'Trading CSS must release vertical scrolling after client-side navigation: '+JSON.stringify(overflow));
    await page.evaluate(() => window.scrollTo(0,document.documentElement.scrollHeight));
    assert.ok(await page.evaluate(() => window.scrollY>0),'Markets must actually scroll after leaving Trading');
    await noOverflow(page);
  });

  for (const pathname of ['/open-trades','/history','/tournaments','/settings']) {
    await scenario('legacy-route-'+pathname.slice(1),{path:pathname,width:390,auth:true},async page => {
      assert.equal(new URL(page.url()).pathname,pathname);
      await page.locator('main').first().waitFor({state:'visible'});
      await officialLogo(page);
      await goldTheme(page);
      await noOverflow(page);
    });
  }
} finally {
  await browser.close();
  const failed=results.filter(result => result.status==='failed');
  const report={baseURL,widths,fixtureIsolation:true,scenarioCount:results.length,passed:results.length-failed.length,failed:failed.length,results};
  await writeFile(path.join(artifactDir,'report.json'),JSON.stringify(report,null,2));
  console.log('QA_RESULT '+JSON.stringify({baseURL,scenarios:report.scenarioCount,passed:report.passed,failed:report.failed}));
  if (failed.length) process.exitCode=1;
}
