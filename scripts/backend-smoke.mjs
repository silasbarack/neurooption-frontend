import assert from 'node:assert/strict';
const base = process.env.QA_API_URL || 'https://neurooption-backend.onrender.com';
for (const path of ['/market-data/quotes','/market-data/assets','/account/me']) {
  let response, body;
  for (let attempt=0;attempt<3;attempt++) {
    try { response=await fetch(base+path,{signal:AbortSignal.timeout(45000)}); body=await response.json().catch(()=>null); if (response.ok || path==='/account/me') break; } catch {}
  }
  assert.ok(response,path+' did not respond');
  console.log(JSON.stringify({path,status:response.status}));
  if(path==='/account/me'){assert.equal(response.status,401);continue;}
  assert.equal(response.status,200);
  const records=path.endsWith('quotes')?body?.quotes:body?.assets;
  assert.ok(Array.isArray(records)&&records.length>0,path+' must return records');
  assert.ok(records.every(item=>typeof item.symbol==='string'));
  if(path.endsWith('quotes')){
    console.log('PUBLIC_QUOTE_CONTRACT '+JSON.stringify(records.slice(0,3).map(({symbol,price,payout})=>({symbol,price,payout}))));
    assert.ok(records.every(item=>Number.isFinite(item.price)&&Number.isFinite(item.payout)),'Quotes need numeric price/payout');
    globalThis.quoteSymbols=new Set(records.map(item=>item.symbol));
  } else {
    console.log('PUBLIC_ASSET_CONTRACT '+JSON.stringify(records.slice(0,3).map(({symbol})=>({symbol}))));
    assert.ok(records.some(item=>globalThis.quoteSymbols.has(item.symbol)),'Asset and quote symbols must share the execution contract');
  }
}
