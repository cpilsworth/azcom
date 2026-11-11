// build-proto.mjs <article|results> — writes stardust/prototypes/<slug>-proposed.html.
// Chrome from stardust/replica/chrome-model.json; page content verbatim from the captured settled DOM
// (stardust/current/pages/<slug>.html), sanitized to content elements only — no source layout markup.
import fs from 'node:fs';
import * as cheerio from 'cheerio';

const kind = process.argv[2] || 'article';
const PAGES = {
  article: 'media-centre-press-releases-2026-trixeo-recommended-for-approval-in-the-eu-by-chmp-for-the-maintenance-treatment-of-asthma-htmlhttps-',
  results: 'media-centre-press-releases-2026-h1-and-q2-2026-results-html',
};
const slug = PAGES[kind];
const model = JSON.parse(fs.readFileSync('stardust/replica/chrome-model.json', 'utf8'));
const $ = cheerio.load(fs.readFileSync(`stardust/current/pages/${slug}.html`, 'utf8'));
const rec = JSON.parse(fs.readFileSync(`stardust/current/pages/${slug}.json`, 'utf8'));
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (h) => (!h ? h : h.startsWith('/') && !h.startsWith('//') ? `https://www.astrazeneca.com${h}` : h);
const asset = (name) => `assets/${name}`;

// ---- content sanitizer: keep the content vocabulary, drop wrappers/classes/styles
const KEEP = new Set(['p', 'h2', 'h3', 'h4', 'b', 'strong', 'i', 'em', 'u', 'sup', 'sub', 'a', 'br', 'ol', 'ul', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'span']);
export function clean(html) {
  const c = cheerio.load(`<div id="r">${html}</div>`, null, false);
  c('script,style,noscript,meta,link').remove();
  c('#r *').each((i, el) => {
    const tag = el.tagName.toLowerCase();
    if (!KEEP.has(tag)) { c(el).replaceWith(c(el).contents()); return; }
    const keep = {};
    if (tag === 'a') { keep.href = c(el).attr('href'); if (c(el).attr('target')) keep.target = c(el).attr('target'); if (c(el).attr('rel')) keep.rel = c(el).attr('rel'); }
    if (tag === 'img') { keep.src = c(el).attr('src'); keep.alt = c(el).attr('alt') || ''; }
    if (['td', 'th'].includes(tag)) { for (const a of ['colspan', 'rowspan']) if (c(el).attr(a)) keep[a] = c(el).attr(a); }
    const style = c(el).attr('style') || '';
    for (const a of Object.keys(el.attribs)) c(el).removeAttr(a);
    for (const [k, v] of Object.entries(keep)) if (v != null) c(el).attr(k, v);
    if (/text-align:\s*center/.test(style)) c(el).addClass('is-center');
    if (tag === 'span' && !Object.keys(c(el).attr() || {}).length) c(el).replaceWith(c(el).contents());
  });
  return c('#r').html().replace(/\s+\n/g, '\n').trim();
}

// ---- chrome
function header() {
  const nav = model.nav.map((n, i) => {
    const items = n.items.map((it, j) => {
      if (!it.children) return `<li><a class="az-nav__link" href="${esc(abs(it.href))}">${esc(it.label)}</a></li>`;
      const kids = it.children.items.map((k) => `<li><a class="az-nav__link" href="${esc(abs(k.href))}">${esc(k.label)}</a></li>`).join('');
      return `<li><a class="az-nav__link az-nav__link--parent" href="${esc(abs(it.href))}" aria-expanded="false" aria-controls="nav-${i}-${j}">${esc(it.label)}</a>
            <div class="az-nav__child" id="nav-${i}-${j}"><a class="az-nav__parent" href="${esc(abs(it.children.parent.href))}">${esc(it.children.parent.label)}</a><ul class="az-nav__links">${kids}</ul></div></li>`;
    }).join('\n            ');
    const spots = n.spotlight.map((s) => `<a class="az-nav__spot" href="${esc(abs(s.href))}"${s.target ? ` target="${s.target}"` : ''}><span class="az-nav__spot-sub">${esc(s.subTitle)}</span><span class="az-nav__spot-title">${esc(s.title)}</span><span class="az-nav__spot-img"><img src="${asset(s.img)}" alt="${esc(s.alt)}" loading="lazy"></span></a>`).join('');
    return `<li class="az-nav__item">
        <a class="az-nav__top${n.current ? ' is-current' : ''}" href="${esc(abs(n.href))}" aria-expanded="false" aria-controls="nav-${i}"> ${esc(n.label)} </a>
        <div class="az-nav__panel" id="nav-${i}">
          <div class="az-nav__inner">
            <div class="az-nav__col">
            <a class="az-nav__parent" href="${esc(abs(n.parent.href))}">${esc(n.parent.label)}</a>
            <ul class="az-nav__links">
            ${items}
            </ul>
            </div>
            <div class="az-nav__spotlight">${spots}</div>
          </div>
          <div class="az-nav__close"><div><button type="button">Close</button></div></div>
        </div>
      </li>`;
  }).join('\n      ');
  const region = model.region.map((r) => `<li><a class="${r.global ? 'is-global' : ''}" href="${esc(abs(r.href))}">${esc(r.label)}</a></li>`).join('');
  return `<ul class="az-skip">${model.skip.map((s) => `<li><a href="${s.href}">${esc(s.label)}</a></li>`).join('')}</ul>
  <header class="az-header" id="navigation">
    <div class="az-header__bar">
      <div class="az-header__logo"><a href="${esc(model.logo.href)}"><img src="${asset('logo-az.png')}" alt="${esc(model.logo.alt)}" width="88" height="23"></a></div>
      <ul class="az-header__region">${region}</ul>
      <div class="az-header__toggles">
        <button class="az-header__button az-header__button--search" type="button" aria-expanded="false"><span class="visuallyhidden">Search</span></button>
        <button class="az-header__button az-header__button--menu" type="button" aria-expanded="false"><span class="visuallyhidden">Menu</span></button>
      </div>
      <div class="az-search">
        <button class="az-search__open" type="button" aria-expanded="false"><span class="visuallyhidden">Search</span></button>
        <form action="${esc(abs(model.search.action))}" method="get" role="search">
          <label for="az-search-input">Search</label>
          <input type="text" id="az-search-input" aria-label="Search" name="${esc(model.search.name)}" placeholder="${esc(model.search.placeholder)}">
          <button type="submit"><span>Search</span></button>
        </form>
        <button class="az-search__close" type="button"><span class="visuallyhidden">Close</span></button>
      </div>
    </div>
    <nav class="az-nav" aria-label="Main">
      <ul class="az-nav__list">
      ${nav}
      </ul>
      <ul class="az-nav__region">${region}</ul>
    </nav>
  </header>`;
}

function footer() {
  const f = model.footer;
  const cols = f.columns.map((c, i) => `<div class="az-footer__panel">
          <h3 class="az-footer__title" aria-expanded="false" aria-controls="footer-links-${i}">${esc(c.title)}<span class="az-footer__icon" aria-hidden="true"></span></h3>
          <ul class="az-footer__links" id="footer-links-${i}">${c.links.map((l) => `<li><a href="${esc(abs(l.href))}">${esc(l.label)}</a></li>`).join('')}</ul>
        </div>`).join('\n        ');
  return `<footer class="az-footer" id="footer">
    <div class="az-footer__inner">
      <div class="az-footer__top">
        <div class="az-footer__sites">
          <h3 class="az-footer__title"><a href="${esc(abs(f.sites.href))}">${esc(f.sites.label)}</a></h3>
          <div class="az-footer__colophon"><p>${f.colophon[0]}</p><hr><p>${f.colophon[1]}</p></div>
        </div>
        <div class="az-footer__columns">
        ${cols}
        </div>
        <div class="az-footer__social">
          <h3 class="visuallyhidden">Social Media</h3>
          <ul>${f.social.map((s) => `<li><a class="is-${s.kind}" href="${esc(s.href)}"><span class="visuallyhidden">${esc(s.label)}</span></a></li>`).join('')}</ul>
        </div>
      </div>
      <div class="az-footer__bottom">
        <div class="az-footer__logo"><span role="img" aria-label="AstraZeneca"></span></div>
        <h4 class="visuallyhidden">utility links</h4>
        <ul class="az-footer__utility">${f.utility.map((u) => `<li><a href="${esc(abs(u.href))}">${esc(u.label)}</a></li>`).join('')}</ul>
        <p class="az-footer__copyright">${esc(f.copyright)}</p>
      </div>
    </div>
  </footer>`;
}

// ---- page bodies
function article() {
  const h1 = $('.hero-feature__header').first().text().replace(/\s+/g, ' ').trim();
  const pub = $('.date__title').first().text().trim();
  const date = $('.date__date').first().text().trim();
  const blocks = $('.l-three-block-c2 .par').first().children().map((i, el) => {
    const cls = $(el).attr('class') || '';
    if (/spacer/.test(cls)) return '<hr class="az-spacer az-spacer--sml">';
    const rt = $(el).find('.rich-text').first();
    if (!rt.length || !rt.text().trim()) return '';
    return `<div class="az-rich-text">\n${clean(rt.html())}\n</div>`;
  }).get().filter(Boolean).join('\n');
  const tags = $('.l-three-block-c2 > .tags li').map((i, li) => `<li>${esc($(li).text().trim())}</li>`).get().join('');
  const tagBlock = tags ? `\n<div class="az-tags"><h3 class="visuallyhidden">${esc($('.l-three-block-c2 > .tags h3').text().trim())}</h3><ul>${tags}</ul></div>` : '';
  return `<main id="main" class="main-section">
    <article>
      <section class="az-hero"><h1 class="az-hero__title"><span class="az-constrained">${esc(h1)}</span></h1></section>
      <section class="az-article">
        <div class="az-article__meta"><div class="az-date"><time class="az-date__region"><span class="az-date__title">${esc(pub)}</span><span class="az-date__date">${esc(date)}</span></time></div></div>
        <div class="az-article__body">
${blocks}${tagBlock}
        </div>
      </section>
    </article>
  </main>`;
}

const body = kind === 'article' ? article() : (await import('./build-results.mjs')).results($, clean, esc, abs);
const css = kind === 'article' ? 'article.css' : 'results.css';
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(rec.title)}</title>
  <link rel="icon" href="assets/favicon.ico">
  <link rel="stylesheet" href="https://use.typekit.net/ddz3ptv.css">
  <link rel="stylesheet" href="canon.css">
  <link rel="stylesheet" href="${css}">
</head>
<body>
  ${header()}
  ${body}
  ${footer()}
  <script src="chrome.js"></script>
</body>
</html>
`;
const out = `stardust/prototypes/${slug}-proposed.html`;
fs.writeFileSync(out, html);
console.log(`build-proto: ${kind} → ${out} (${html.length} bytes)`);
