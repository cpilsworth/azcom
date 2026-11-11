import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Footer — astrazeneca.com chrome (template-slotted). The authored /footer document is
 * classified by content:
 *   sites      a heading holding a link, then the colophon paragraphs
 *   columns    two or more heading + link-list pairs (accordions below 960px)
 *   social     a heading + a list of links to social hosts
 *   utility    a heading (visually hidden), the utility link list, the copyright paragraph
 * Authored nodes are MOVED into the prototype's footer DOM (canon.css classes, kebab-cased).
 */

const desktop = window.matchMedia('(width >= 960px)');

const SOCIAL = [
  ['linkedin.', 'is-linkedin'],
  ['instagram.', 'is-instagram'],
  ['facebook.', 'is-fb'],
  ['x.com', 'is-tw'],
  ['twitter.', 'is-tw'],
  ['youtube.', 'is-youtube'],
  ['glassdoor.', 'is-gd'],
];

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function socialClass(a) {
  let host = '';
  try {
    host = new URL(a.href, window.location).hostname;
  } catch {
    return '';
  }
  const hit = SOCIAL.find(([needle]) => host.includes(needle));
  return hit ? hit[1] : '';
}

function classify(fragment) {
  const found = {};
  fragment.querySelectorAll(':scope > .section').forEach((section) => {
    const wrapper = section.querySelector('.default-content-wrapper') || section;
    const lists = wrapper.querySelectorAll(':scope > ul');
    const heading = wrapper.querySelector(':scope > :is(h2, h3, h4, h5, h6)');
    const links = [...wrapper.querySelectorAll('ul a[href]')];
    if (heading && heading.querySelector('a') && !lists.length) found.sites = wrapper;
    else if (lists.length > 1) found.columns = wrapper;
    else if (links.length && links.every((a) => socialClass(a))) found.social = wrapper;
    else if (lists.length) found.utility = wrapper;
  });
  return found;
}

function buildSites(wrapper) {
  const sites = el('div', 'az-footer-sites');
  if (!wrapper) return sites;
  const title = wrapper.querySelector(':scope > :is(h2, h3, h4, h5, h6)');
  if (title) {
    title.classList.add('az-footer-title');
    sites.append(title);
  }
  const colophon = el('div', 'az-footer-colophon');
  const paras = [...wrapper.querySelectorAll(':scope > p')];
  paras.forEach((p, i) => {
    if (i > 0) colophon.append(el('hr'));
    colophon.append(p);
  });
  sites.append(colophon);
  return sites;
}

function buildColumns(wrapper) {
  const columns = el('div', 'az-footer-columns');
  if (!wrapper) return columns;
  let panel = null;
  let n = 0;
  [...wrapper.children].forEach((node) => {
    if (/^H[1-6]$/.test(node.tagName)) {
      panel = el('div', 'az-footer-panel');
      node.classList.add('az-footer-title');
      node.setAttribute('aria-expanded', 'false');
      node.setAttribute('aria-controls', `footer-links-${n}`);
      node.append(el('span', 'az-footer-icon', { 'aria-hidden': 'true' }));
      panel.append(node);
      columns.append(panel);
    } else if (node.tagName === 'UL' && panel) {
      node.className = 'az-footer-links';
      node.id = `footer-links-${n}`;
      n += 1;
      panel.append(node);
    }
  });
  return columns;
}

function buildSocial(wrapper) {
  const social = el('div', 'az-footer-social');
  if (!wrapper) return social;
  const heading = wrapper.querySelector(':scope > :is(h2, h3, h4, h5, h6)');
  if (heading) {
    heading.classList.add('visuallyhidden');
    social.append(heading);
  }
  const list = wrapper.querySelector(':scope > ul');
  if (list) {
    list.querySelectorAll('a[href]').forEach((a) => {
      const cls = socialClass(a);
      if (cls) a.classList.add(cls);
      const label = el('span', 'visuallyhidden');
      label.append(...a.childNodes);
      a.append(label);
    });
    social.append(list);
  }
  return social;
}

function buildBottom(wrapper) {
  const bottom = el('div', 'az-footer-bottom');
  const logo = el('div', 'az-footer-logo');
  logo.append(el('span', '', { role: 'img', 'aria-label': 'AstraZeneca' }));
  bottom.append(logo);
  if (!wrapper) return bottom;
  const heading = wrapper.querySelector(':scope > :is(h2, h3, h4, h5, h6)');
  if (heading) {
    heading.classList.add('visuallyhidden');
    bottom.append(heading);
  }
  const list = wrapper.querySelector(':scope > ul');
  if (list) {
    list.className = 'az-footer-utility';
    bottom.append(list);
  }
  wrapper.querySelectorAll(':scope > p').forEach((p) => {
    p.classList.add('az-footer-copyright');
    bottom.append(p);
  });
  return bottom;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  if (block.querySelector('.az-footer')) return; // re-entrant (EW9)
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;
  fragment.querySelectorAll('.metadata').forEach((m) => m.remove());
  const parts = classify(fragment);

  block.textContent = '';
  const footer = el('div', 'az-footer', { id: 'footer' });
  const inner = el('div', 'az-footer-inner');
  const top = el('div', 'az-footer-top');
  top.append(buildSites(parts.sites), buildColumns(parts.columns), buildSocial(parts.social));
  inner.append(top, buildBottom(parts.utility));
  footer.append(inner);
  block.append(footer);

  footer.querySelectorAll('.az-footer-panel .az-footer-title').forEach((title) => {
    title.addEventListener('click', () => {
      if (desktop.matches) return;
      const panel = title.parentElement;
      panel.classList.toggle('is-open');
      title.setAttribute('aria-expanded', String(panel.classList.contains('is-open')));
    });
  });
}
