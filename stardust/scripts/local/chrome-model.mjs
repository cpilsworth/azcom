// chrome-model.mjs <rendered.html> <out.json> — the header/footer CONTENT (labels, hrefs, alt text, spotlights)
// read verbatim from a captured page's settled DOM. No layout is copied: the prototype and the EDS
// nav/footer documents are re-authored from this model.
import fs from 'node:fs';
import * as cheerio from 'cheerio';

const [src, out] = process.argv.slice(2);
const $ = cheerio.load(fs.readFileSync(src, 'utf8'));
const t = (el) => $(el).text().replace(/\s+/g, ' ').trim();
const img = (s) => (s || '').split('/').pop();

const nav = $('.navigation__link-list--primary > li').map((i, li) => {
  const top = $(li).children('a').first();
  const panel = $(li).children('.navigation__link-list--secondary').first();
  const wrapper = panel.find('.navigation__link-list-wrapper').first();
  const items = wrapper.children('ul').children('li').map((j, it) => {
    const a = $(it).children('a').first();
    const child = $(it).children('.navigation__secondary-child').first();
    return {
      label: t(a), href: a.attr('href'),
      children: child.length ? {
        parent: { label: t(child.children('a').first()), href: child.children('a').first().attr('href') },
        items: child.find('ul > li > a').map((k, c) => ({ label: t(c), href: $(c).attr('href') })).get(),
      } : null,
    };
  }).get();
  const spotlight = panel.find('.navigation__link-list-spotlight-item').map((j, s) => ({
    href: $(s).attr('href'), target: $(s).attr('target') || null,
    subTitle: t($(s).find('.navigation__link-list-spotlight-subTitle')),
    title: t($(s).find('.navigation__link-list-spotlight-title')),
    img: img($(s).find('img').attr('src')), imgSrc: $(s).find('img').attr('src'), alt: $(s).find('img').attr('alt') || '',
  })).get();
  return {
    label: t(top), href: top.attr('href'), current: /current-section/.test(top.attr('class') || ''),
    parent: { label: t(wrapper.children('a').first()), href: wrapper.children('a').first().attr('href') },
    items, spotlight,
  };
}).get();

const region = $('.navigation__link-list--region a').map((i, a) => ({ label: t(a), href: $(a).attr('href'), global: /--global/.test($(a).attr('class') || '') })).get();
const f = $('#footer');
const footer = {
  sites: { label: t(f.find('.footer__global-sites')), href: f.find('.footer__global-sites').attr('href') },
  colophon: f.find('.footer__colophon p').map((i, p) => $(p).html().replace(/\s+/g, ' ').trim()).get(),
  columns: f.find('.footer__accordion-panel').map((i, p) => ({
    title: t($(p).find('.footer__accordion-title')),
    links: $(p).find('.footer__links a').map((j, a) => ({ label: t(a), href: $(a).attr('href') })).get(),
  })).get(),
  social: f.find('.footer__social-channel').map((i, a) => ({ label: t(a), href: $(a).attr('href'), kind: ($(a).attr('class').match(/--([a-z]+)-link/) || [])[1] })).get(),
  utility: f.find('.footer__utility-links a').map((i, a) => ({ label: t(a), href: $(a).attr('href') })).get(),
  copyright: t(f.find('.footer__copyright')),
};
const skip = $('#skip-shortcuts a').map((i, a) => ({ label: t(a), href: $(a).attr('href') })).get();
const search = { action: $('.navigation__search-form').attr('action'), name: $('.navigation__search-input').attr('name'), placeholder: $('.navigation__search-input').attr('placeholder') };
fs.writeFileSync(out, JSON.stringify({ _provenance: { from: src, writtenAt: new Date().toISOString() }, skip, logo: { href: $('.navigation__logo-link').attr('href'), alt: $('.navigation__logo--color').attr('alt') }, region, search, nav, footer }, null, 1));
console.log(`chrome-model: ${nav.length} nav items, ${nav.reduce((n, x) => n + x.items.length, 0)} second-level, ${footer.columns.length} footer columns → ${out}`);
