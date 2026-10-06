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
await page.route('**/trading-engine/wallet**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({balance:70000})}));
await page.route('**/trading-engine/trades/open**',route=>route.fulfill({status:200,contentType:'application/json',body:'[]'}));
await page.route('**/trading-engine/trades/history**',route=>route.fulfill({status:200,contentType:'application/json',body:'[]'}));
const pageErrors=[];
page.on('pageerror',error=>pageErrors.push(error.message));

try{
  const marketReads=[];
  page.on('response',response=>{
    try{
      const url=new URL(response.url());
      if(url.pathname.startsWith('/market-data/')) marketReads.push({path:url.pathname,status:response.status()});
    }catch{}
  });
  await page.goto(baseURL+'/trading',{waitUntil:'domcontentloaded',timeout:60000});
  assert.equal(new URL(page.url()).pathname,'/trading','QA session must remain on trading route');
  const canvas=page.locator('.nt-chart-canvas').first();
  await canvas.waitFor({state:'visible',timeout:45000});
  const wrapper=page.locator('.nt-chart-canvas-wrap').first();
  const style=await wrapper.evaluate(el=>getComputedStyle(el).backgroundImage);
  const photoRefs=style.split('hero-mountains.jpg').length-1;
  assert.equal(photoRefs,1,'Trading chart must contain exactly one real mountain photograph layer');

  const imageResponse=await page.request.get(baseURL+'/landing/hero-mountains.jpg');
  assert.equal(imageResponse.status(),200,'Mountain photograph must load');
  assert.ok((imageResponse.headers()['content-type'] || '').startsWith('image/'),'Mountain asset must be an image');

  const samples=[];
  const renderDelays=[];
  for(let index=0;index<20;index+=1){
    if(index>0) await page.waitForTimeout(500);
    const live=await canvas.evaluate(el=>el.__neuroLive ?? null);
    if(live && Number.isFinite(live.close) && Number.isFinite(live.candleTime)){
      samples.push(live);
      if(Number.isFinite(live.receiveToRenderMs)) renderDelays.push(live.receiveToRenderMs);
    }
    if([0,4,10,16].includes(index)){
      const label=index===0?'t0':index===4?'t2':index===10?'t5':'t8';
      await page.screenshot({path:out+'/trade-'+label+'.png',fullPage:false,animations:'disabled'});
    }
  }

  const byBucket=new Map();
  for(const sample of samples){
    const list=byBucket.get(sample.candleTime) || [];
    list.push(sample);
    byBucket.set(sample.candleTime,list);
  }
  const activeBucket=[...byBucket.entries()]
    .map(([time,list])=>({time,list,distinct:new Set(list.map(item=>item.close)).size}))
    .sort((a,b)=>b.list.length-a.list.length)[0];

  assert.ok(activeBucket && activeBucket.list.length>=6,'Expected repeated renders from one active candle bucket');
  assert.ok(activeBucket.distinct>=2,'The same active candle must visibly change before rollover');
  for(let index=1;index<activeBucket.list.length;index+=1){
    const previous=activeBucket.list[index-1];
    const current=activeBucket.list[index];
    assert.ok(current.high>=previous.high,'Active candle high must not decrease');
    assert.ok(current.low<=previous.low,'Active candle low must not increase');
  }

  const percentile=(values,ratio)=>{
    if(!values.length) return null;
    const sorted=[...values].sort((a,b)=>a-b);
    return Number(sorted[Math.min(sorted.length-1,Math.max(0,Math.ceil(sorted.length*ratio)-1))].toFixed(2));
  };
  const renderLatency={
    count:renderDelays.length,
    p50:percentile(renderDelays,.5),
    p95:percentile(renderDelays,.95),
    p99:percentile(renderDelays,.99),
  };

  assert.ok(marketReads.some(read=>read.path==='/market-data/assets' && read.status===200),'Trading page must read real production market assets');
  assert.ok(marketReads.some(read=>read.path==='/market-data/candles' && read.status===200),'Trading page must read real production candles');
  assert.deepEqual(pageErrors,[],'Trading page must have no uncaught JavaScript errors');
  console.log('PRODUCTION_TRADING_VISUAL '+JSON.stringify({
    passed:true,
    backgroundImage:style,
    photoRefs,
    screenshots:4,
    marketReads,
    activeCandle:{
      time:activeBucket.time,
      samples:activeBucket.list.length,
      distinctCloses:activeBucket.distinct,
      firstClose:activeBucket.list[0].close,
      lastClose:activeBucket.list.at(-1).close,
    },
    receiveToRenderMs:renderLatency,
  }));
}finally{
  await browser.close();
}
