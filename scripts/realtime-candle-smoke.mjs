import assert from 'node:assert/strict';
import { io } from 'socket.io-client';

const baseUrl=(process.env.QA_API_URL || 'https://neurooption-backend.onrender.com').replace(/\/$/,'');
const socket=io(baseUrl + '/market',{
  transports:['websocket','polling'],
  tryAllTransports:true,
  upgrade:true,
  reconnection:true,
  timeout:15000,
});

const percentile=(values,ratio)=>{
  if(!values.length) return 0;
  const sorted=[...values].sort((a,b)=>a-b);
  return Number(sorted[Math.min(sorted.length-1,Math.max(0,Math.ceil(sorted.length*ratio)-1))].toFixed(2));
};

let serverOffset=0;
const candleBuckets=new Map();
const networkAgeMs=[];
const tickAgeMs=[];
const globalSequences=[];

await new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>reject(new Error('Timed out waiting for a moving EUR/USD OTC M2 candle')),15000);

  socket.on('connect',()=>{
    const sent=Date.now();
    socket.emit('server_time',{clientSentAt:sent},response=>{
      const received=Date.now();
      if(response && Number.isFinite(response.serverTimestamp)){
        serverOffset=response.serverTimestamp-(sent+(received-sent)/2);
      }
      socket.emit('subscribe_symbol',{symbol:'EUR/USD OTC',timeframe:'M2'});
    });
  });

  socket.on('connect_error',reject);

  socket.on('price_update',message=>{
    if(message?.symbol!=='EUR/USD OTC') return;
    const nowServer=Date.now()+serverOffset;
    if(Number.isFinite(message.timestamp)) tickAgeMs.push(Math.max(0,nowServer-message.timestamp));
  });

  socket.on('candle_update',message=>{
    if(message?.symbol!=='EUR/USD OTC' || message?.timeframe!=='M2') return;
    const c=message?.candle;
    const sequence=Number(message?.sequence);
    if(!c || ![c.time,c.open,c.high,c.low,c.close,sequence].every(Number.isFinite)) return;

    assert.ok(c.high>=Math.max(c.open,c.close),'high must contain open/close');
    assert.ok(c.low<=Math.min(c.open,c.close),'low must contain open/close');
    if(globalSequences.length) assert.ok(sequence>=globalSequences.at(-1),'sequence must not go backwards');
    globalSequences.push(sequence);

    const nowServer=Date.now()+serverOffset;
    if(Number.isFinite(message.serverBroadcastTimestamp)){
      networkAgeMs.push(Math.max(0,nowServer-message.serverBroadcastTimestamp));
    }

    const list=candleBuckets.get(c.time) || [];
    if(list.length){
      const previous=list.at(-1);
      assert.ok(c.high>=previous.high,'high must not decrease inside one candle');
      assert.ok(c.low<=previous.low,'low must not increase inside one candle');
      const relativeMove=Math.abs(c.close-previous.close)/Math.max(previous.close,1e-9);
      assert.ok(relativeMove<0.0003,'single update contains an unrealistic FX spike');
    }
    list.push({open:c.open,high:c.high,low:c.low,close:c.close,sequence});
    candleBuckets.set(c.time,list);

    const distinct=new Set(list.map(item=>item.close)).size;
    if(list.length>=10 && distinct>=3){
      clearTimeout(timeout);
      resolve();
    }
  });
});

const qualifying=[...candleBuckets.entries()]
  .map(([time,updates])=>({time,updates,distinct:new Set(updates.map(item=>item.close)).size}))
  .sort((a,b)=>b.updates.length-a.updates.length)[0];

assert.ok(qualifying,'Expected an active candle bucket');
assert.ok(qualifying.updates.length>=10,'Expected at least 10 updates in one active candle');
assert.ok(qualifying.distinct>=3,'Expected at least 3 distinct close values before rollover');

console.log('REALTIME_CANDLE_SMOKE '+JSON.stringify({
  updates:qualifying.updates.length,
  distinctCloses:qualifying.distinct,
  candleTime:qualifying.time,
  firstClose:qualifying.updates[0].close,
  lastClose:qualifying.updates.at(-1).close,
  transport:socket.io.engine?.transport?.name,
  candleNetworkAgeMs:{count:networkAgeMs.length,p50:percentile(networkAgeMs,.5),p95:percentile(networkAgeMs,.95),p99:percentile(networkAgeMs,.99)},
  tickAgeMs:{count:tickAgeMs.length,p50:percentile(tickAgeMs,.5),p95:percentile(tickAgeMs,.95),p99:percentile(tickAgeMs,.99)},
}));

socket.removeAllListeners();
socket.disconnect();
