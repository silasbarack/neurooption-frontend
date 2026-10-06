// Browser regressions for defects found before the redesign. Fixtures stay in QA.
import assert from "node:assert/strict";
import { chromium } from "playwright";
const browser = await chromium.launch();
const failures = [];
const context = await browser.newContext({ viewport: { width:390, height:844 } });
await context.route("**/*", async (route) => {
  const url = new URL(route.request().url());
  if (url.pathname.includes("/market-data/quotes")) return route.fulfill({json:{serverTime:new Date().toISOString(),quotes:[{symbol:"EUR/USD OTC",label:"Euro / US Dollar",category:"Currencies",precision:5,price:1.08231,changePercent:.12,payout:92}]}});
  if (url.pathname.includes("/trading-engine/") || url.pathname.includes("/market-data/") || url.pathname.includes("/account/me")) return route.fulfill({status:503,json:{message:"QA simulated service unavailable"}});
  if (url.pathname.includes("socket.io")) return route.abort();
  return route.continue();
});
const page = await context.newPage();
async function check(name, fn) {
  try { await fn(); console.log("PASS "+name); } catch(error) { failures.push(name); console.error("FAIL "+name+": "+error.message); }
}
await page.goto("http://127.0.0.1:4173/markets");
await page.locator(".mk-star").first().waitFor();
await check("gold accent matches approved brand", async () => {
  const value = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--neo-accent").trim());
  // Resolve aliases through actual computed color rather than compare CSS spelling.
  const color = await page.evaluate(() => { const el=document.createElement("span");el.style.color="var(--neo-accent)";document.body.append(el);const color=getComputedStyle(el).color;el.remove();return color; });
  assert.equal(color,"rgb(244, 199, 81)",value);
});
await check("closed drawer controls cannot receive keyboard focus", async () => {
  assert.equal(await page.locator(".neo-drawer").evaluate(el=>el.inert),true);
});
await check("pressing Enter on favourite does not navigate", async () => {
  const star=page.locator(".mk-star").first();await star.focus();await page.keyboard.press("Enter");await page.waitForTimeout(300);
  assert.equal(new URL(page.url()).pathname,"/markets");
});
await context.addInitScript(() => { sessionStorage.setItem("neurooption_token","qa-placeholder");sessionStorage.setItem("neurooption_user",JSON.stringify({id:"qa-only",name:"QA Trader"})); });
await page.goto("http://127.0.0.1:4173/trading");
await page.locator(".nt-page").waitFor();await page.waitForTimeout(1500);
await check("unavailable wallet never fabricates balance", async () => {
  assert.equal((await page.locator(".nt-header").innerText()).includes("70,000"),false);
  const controls=page.locator(".nt-buy-btn, .nt-sell-btn, .nt-pocket-buy, .nt-pocket-sell, .nt-pocket-actions button");
  if(await controls.count()) {
    for(const button of await controls.all()) { if(/buy|sell/i.test(await button.innerText())) assert.equal(await button.isDisabled(),true); }
  }
});
await browser.close();
if(failures.length) { console.error("Regression failures: "+failures.join(", "));process.exitCode=1; }
