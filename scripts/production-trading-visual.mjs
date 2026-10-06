import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseURL=(process.env.QA_BASE_URL || 'https://neurooption-frontend.onrender.com').replace(/\/$/,'');
const out=process.env.QA_ARTIFACT_DIR || 'artifacts/production-trading';
await mkdir(out,{recursive:true});

const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
await context.addInitScript(()=>localStorage.setItem('neurooption_token','qa-readonly-token'));
const page=await context.newPage();
const pageErrors=[];
page.on('pageerror',error=>pageErrors.push(error.message));

try{
  await page.goto(baseURL+'/trading',{waitUntil:'domcontentloaded',timeout:60000});
  const canvas=page.locator('.nt-chart-canvas').first();
  await canvas.waitFor({state:'visible',timeout:45000});
  const wrapper=page.locator('.nt-chart-canvas-wrap').first();
  const style=await wrapper.evaluate(el=>getComputedStyle(el).backgroundImage);
  const photoRefs=style.split('hero-mountains.jpg').length-1;
  assert.equal(photoRefs,1,'Trading chart must contain exactly one real mountain photograph layer');

  const imageResponse=await page.request.get(baseURL+'/landing/hero-mountains.jpg');
  assert.equal(imageResponse.status(),200,'Mountain photograph must load');
  assert.ok((imageResponse.headers()['content-type'] || '').startsWith('image/'),'Mountain asset must be an image');

  const schedule=[['t0',0],['t2',2000],['t5',3000],['t8',3000]];
  for(const [label,delay] of schedule){
    if(delay) await page.waitForTimeout(delay);
    await page.screenshot({path:out+'/trade-'+label+'.png',fullPage:false,animations:'disabled'});
  }

  assert.deepEqual(pageErrors,[],'Trading page must have no uncaught JavaScript errors');
  console.log('PRODUCTION_TRADING_VISUAL '+JSON.stringify({passed:true,backgroundImage:style,photoRefs,screenshots:4}));
}finally{
  await browser.close();
}
