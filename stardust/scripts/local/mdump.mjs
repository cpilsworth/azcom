// mdump.mjs <measure.json> [width] — compact one line per selector: rect + non-default computed values
import fs from 'node:fs';
const j = JSON.parse(fs.readFileSync(process.argv[2])); const W = process.argv[3];
const skip = new Set(['gap:normal', 'maxWidth:none', 'margin:0px', 'padding:0px', 'backgroundColor:rgba(0, 0, 0, 0)', 'backgroundImage:none', 'letterSpacing:normal', 'textTransform:none', 'borderRadius:0px', 'boxShadow:none', 'opacity:1', 'objectFit:fill', 'position:static', 'boxSizing:border-box', 'textAlign:start']);
for (const [url, byW] of Object.entries(j.pages)) for (const [w, sels] of Object.entries(byW)) { if (W && w !== W) continue; console.log('== ' + w);
  for (const [sel, ms] of Object.entries(sels)) { const arr = Array.isArray(ms) ? ms : (ms.matches || [ms]); const m = arr[0]; if (!m || !m.rect) { console.log(sel, 'NONE'); continue; }
    const r = m.rect; const st = Object.entries(m.props || {}).map(([k, v]) => `${k}:${v}`).filter((s) => !skip.has(s) && !/^border:0px none/.test(s)).join('; ');
    console.log(`${sel} [${r.x},${r.y},${r.w}x${r.h}] ${st.replace(/"Helvetica Neue", Helvetica, Arial, sans-serif/g, 'HN').replace(/lexia, Times, "Times New Roman", serif/g, 'LX')}`); } }
