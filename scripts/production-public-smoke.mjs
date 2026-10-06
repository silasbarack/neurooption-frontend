import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
const baseURL=(process.env.QA_BASE_URL || 'https://neurooption-frontend.onrender.com').replace(/\/$/,'');
const frontendOrigin=new URL(baseURL).origin;
const errors=[],mutations=[],backendReads=[],checks=[];
await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce',serviceWorkers:'block'});
await context.route('**/*',async route=>{
  const request=route.request();
  if(!['GET','HEAD','OPTIONS'].includes(request.method())){
    mutations.push(request.method()+' '+new URL(request.url()).pathname);
    return route.abort('blockedbyclient');
  }
  return route.continue();
});
const page=await context.newPage();
page.setDefaultTimeout(15000);
page.on('pageerror',error=>errors.push(error.message));
page.on('response',response=>{
  const url=new URL(response.url());
  if(url.origin!==frontendOrigin && url.pathname==='/market-data/quotes')
    backendReads.push({origin:url.origin,path:url.pathname,method:response.request().method(),status:response.status()});
});
async function checkHome(name,screenshot){
  const previousReads=backendReads.length;
  await page.goto(baseURL+'/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.locator('#app-splash,.app-splash').first().waitFor({state:'hidden',timeout:30000});
  const logo=page.locator('img[src="/neurooption-logo.jpg"]:visible').first();
  await logo.waitFor({state:'visible'});
  await page.waitForFunction(element=>element.complete && element.naturalWidth>0,await logo.elementHandle());
  await page.waitForFunction(()=>document.querySelector('.hp-market-feed')?.textContent.includes('Market feed connected'),undefined,{timeout:45000});
  assert.match(await page.locator('.hp-ticker').first().getAttribute('aria-label') || '',/^Market prices/);
  assert.ok(backendReads.slice(previousReads).some(read=>read.method==='GET' && read.status===200),'Connected feed must use a successful real backend GET');
  const categories=await page.locator('.hp-category-grid a.hp-category-card').evaluateAll(elements=>elements.map(element=>({label:element.innerText.trim(),href:element.href})));
  assert.equal(categories.length,6);
  for(const category of categories){assert.ok(category.label.length>0);assert.equal(new URL(category.href).pathname,'/markets');}
  assert.ok(categories.some(category=>/forex|currencies/i.test(category.label)));
  assert.ok(categories.some(category=>/crypto/i.test(category.label)));
  await page.screenshot({path:screenshot,fullPage:false,animations:'disabled'});
  checks.push({name,feed:'connected',categories:categories.length});
}
try{
  await checkHome('desktop','artifacts/production-public-desktop.png');
  await page.setViewportSize({width:390,height:844});
  await checkHome('mobile','artifacts/production-public-mobile.png');
  const trigger=page.getByRole('button',{name:'Open menu',exact:true}).first();
  await trigger.click();
  const dialog=page.getByRole('dialog',{name:'Menu',exact:true});
  await dialog.waitFor({state:'visible'});
  await page.waitForFunction(()=>document.querySelector('[role="dialog"][aria-label="Menu"]')?.contains(document.activeElement));
  await page.keyboard.press('Escape');
  await dialog.waitFor({state:'hidden'});
  assert.ok(await trigger.evaluate(element=>element===document.activeElement),'Escape must restore menu-trigger focus');
  await page.locator('.hp-hero-cta a[href="/register"]').first().click();
  await page.waitForURL(url=>url.pathname==='/register');
  await page.locator('input[type="email"]').first().waitFor({state:'visible'});
  assert.deepEqual(mutations,[],'Public smoke must make no mutation requests');
  assert.deepEqual(errors,[],'Public pages must have no uncaught JavaScript errors');
  console.log('PRODUCTION_PUBLIC_SMOKE '+JSON.stringify({passed:true,checks,backendReads,menu:'passed',registration:'passed'}));
}catch(error){
  console.error('PRODUCTION_PUBLIC_SMOKE '+JSON.stringify({passed:false,error:error.message,checks,backendReads,mutations,pageErrors:errors}));
  process.exitCode=1;
}finally{await browser.close();}
