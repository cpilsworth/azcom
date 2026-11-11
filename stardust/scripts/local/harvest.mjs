// Harvest stylesheets, fonts and images by intercepting the live pages' own responses.
import { chromium } from 'playwright';
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const out = 'stardust/current/assets'; const urls = process.argv.slice(2);
const manifest = [];
const browser = await chromium.launch({ channel: 'chrome' });
for (const url of urls) {
  for (const width of [1440, 360]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    page.on('response', async (r) => {
      try {
        const u = r.url(); const ct = r.headers()['content-type'] || ''; if (r.status() !== 200) return;
        const p = new URL(u).pathname; let dir = null;
        if (/text\/css/.test(ct) || /\.css$/.test(p)) dir = 'css';
        else if (/font|woff|ttf|otf/.test(ct) || /\.(woff2?|ttf|otf)$/.test(p)) dir = 'fonts';
        else if (/^image\//.test(ct) && !/facebook|linkedin|tiqcdn|mouseflow|doubleclick|google/.test(u)) dir = 'media';
        if (!dir) return;
        const body = await r.body(); if (dir === 'media' && body.length < 200) return;
        const h = crypto.createHash('sha1').update(u).digest('hex').slice(0, 8);
        const base = path.basename(p).replace(/[^\w.-]/g, '_') || 'file';
        const file = `${out}/${dir}/${h}-${base}`;
        if (!fs.existsSync(file)) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, body); manifest.push({ url: u, file, type: dir, contentType: ct, bytes: body.length, page: url, width }); }
      } catch {}
    });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    const acc = page.locator('text=Accept All').first(); if (await acc.isVisible().catch(() => false)) await acc.click().catch(() => {});
    for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 900); await page.waitForTimeout(300); }
    await page.waitForTimeout(2000);
    if (width === 1440) {
      const svgs = await page.evaluate(() => [...document.querySelectorAll('svg')].map((s) => ({ cls: s.getAttribute('class'), parent: s.parentElement?.className?.toString(), label: s.closest('a,button')?.getAttribute('aria-label') || s.closest('a,button')?.textContent?.trim().slice(0, 40), html: s.outerHTML.slice(0, 6000) })));
      fs.writeFileSync(`${out}/svgs-${urls.indexOf(url)}.json`, JSON.stringify(svgs, null, 1));
    }
    await ctx.close();
  }
}
await browser.close();
const mf = `${out}/harvest-manifest.json`; const prev = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf)) : [];
fs.writeFileSync(mf, JSON.stringify([...prev, ...manifest], null, 1));
console.log('harvested', manifest.length, Object.entries(manifest.reduce((a, m) => (a[m.type] = (a[m.type] || 0) + 1, a), {})).map((e) => e.join(':')).join(' '));
