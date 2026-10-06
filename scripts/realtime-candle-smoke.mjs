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

const closes=[];
const sequences=[];
const deadline=Date.now()+20000;

await new Promise((resolve,reject)=>{
  const timer=setInterval(()=>{
    if(Date.now()>deadline){
      clearInterval(timer);
      reject(new Error('Timed out waiting for changing M2 candle updates'));
    }
  },250);

  socket.on('connect',()=>{
    socket.emit('subscribe_symbol',{symbol:'EUR/USD OTC',timeframe:'M2'});
  });

  socket.on('connect_error',reject);

  socket.on('candle_update',message=>{
    if(message?.symbol!=='EUR/USD OTC' || message?.timeframe!=='M2') return;
    const close=Number(message?.candle?.close);
    const sequence=Number(message?.sequence);
    if(!Number.isFinite(close) || !Number.isFinite(sequence)) return;
    closes.push(close);
    sequences.push(sequence);

    if(closes.length>=8 && new Set(closes).size>=2){
      clearInterval(timer);
      resolve();
    }
  });
});

assert.ok(closes.length>=2,'Expected multiple live candle updates');
assert.ok(new Set(closes).size>=2,'Active candle close must change over live ticks');
for(let i=1;i<sequences.length;i++){
  assert.ok(sequences[i]>=sequences[i-1],'Candle sequences must not go backwards');
}
console.log('REALTIME_CANDLE_SMOKE '+JSON.stringify({
  updates:closes.length,
  distinctCloses:new Set(closes).size,
  first:closes[0],
  last:closes[closes.length-1],
  transport:socket.io.engine?.transport?.name,
}));
socket.removeAllListeners();
socket.disconnect();
