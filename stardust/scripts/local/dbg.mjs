import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:8791/media-centre-press-releases-2026-trixeo-recommended-for-approval-in-the-eu-by-chmp-for-the-maintenance-treatment-of-asthma-htmlhttps--proposed.html');
console.log(await p.evaluate(() => { const u = document.querySelector('header'); return [u.className, getComputedStyle(u).backgroundColor, getComputedStyle(u).position]; }));
await b.close();
