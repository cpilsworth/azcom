// GET every href once in one real headless Chrome (the source answers plain HTTP clients with 403).
import { chromium } from 'playwright';
import fs from 'node:fs';
const urls = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean);
const b = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
const ctx = await b.newContext();
await ctx.route('**/*', (r) => (['image', 'media', 'font', 'stylesheet', 'script'].includes(r.request().resourceType()) ? r.abort() : r.continue()));
const p = await ctx.newPage();
const out = [];
for (const u of urls) {
  let status = 0; let final = '';
  try {
    const res = await p.goto(u, { waitUntil: 'commit', timeout: 30000 });
    status = res ? res.status() : 0; final = p.url();
  } catch (e) { status = /ERR_ABORTED/.test(e.message) && /\.pdf/i.test(u) ? 200 : 0; final = e.message.split('\n')[0].slice(0, 80); }
  out.push({ url: u, status, final });
  await p.waitForTimeout(700);
}
fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1));
const bad = out.filter((r) => !(r.status >= 200 && r.status < 400));
console.log(`checked ${out.length}, non-2xx/3xx ${bad.length}`);
bad.forEach((r) => console.log(r.status, r.url.slice(0, 110), '→', r.final.slice(0, 60)));
await b.close();
