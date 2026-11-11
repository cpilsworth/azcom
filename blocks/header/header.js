import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Header — astrazeneca.com chrome (template-slotted). The authored /nav document is
 * classified by content, never by index:
 *   skip links   a list whose links are all in-page hashes
 *   brand        the paragraph holding the logo picture
 *   region       a flat list of links (utility row: AstraZeneca Websites / Global site)
 *   search       a link to the search results page + a paragraph with the placeholder
 *   menu         a list whose items nest lists — top item, then per panel a list whose first
 *                item is the overview link; an item that nests a list opens a child column
 *   spotlights   headings named after a top item, each followed by triples of
 *                paragraphs: label, title link, picture
 * Authored nodes are MOVED into the prototype's chrome DOM (canon.css classes, kebab-cased).
 * @ew-exempt Search / Menu / Close button labels are UI strings of the chrome, not content.
 * @ew-exempt the search placeholder paragraph becomes the input's placeholder attribute.
 * @ew-exempt spotlight headings are grouping keys, not rendered.
 */

const desktop = window.matchMedia('(width >= 960px)');

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function hiddenLabel(text) {
  const span = el('span', 'visuallyhidden');
  span.textContent = text;
  return span;
}

function stripInstrumentation(root) {
  [root, ...root.querySelectorAll('*')].forEach((n) => {
    [...n.attributes].forEach((a) => {
      if (/^data-(prose|image|block)-index$/.test(a.name)) n.removeAttribute(a.name);
    });
  });
  return root;
}

/** the item's own link: `li > a` (authored) or `li > p > a` (delivered, #98) */
function itemLink(li) {
  const p = li.querySelector(':scope > p');
  if (p && p.querySelector(':scope > a')) {
    const a = p.querySelector(':scope > a');
    p.replaceWith(a);
    return a;
  }
  return li.querySelector(':scope > a');
}

function classify(fragment) {
  const found = {};
  fragment.querySelectorAll(':scope > .section').forEach((section) => {
    const wrapper = section.querySelector('.default-content-wrapper') || section;
    const lists = wrapper.querySelectorAll(':scope > ul');
    const links = [...wrapper.querySelectorAll('a[href]')];
    if (wrapper.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)')) {
      found.spotlights = wrapper;
    } else if (wrapper.querySelector('picture, img') && !found.brand) {
      found.brand = wrapper;
    } else if (lists.length && [...lists].some((ul) => ul.querySelector('li ul'))) {
      found.menu = wrapper;
    } else if (lists.length && links.length
      && links.every((a) => (a.getAttribute('href') || '').startsWith('#'))) {
      found.skip = wrapper;
    } else if (lists.length) {
      found.region = wrapper;
    } else if (links.length) {
      found.search = wrapper;
    }
  });
  return found;
}

function isExternal(a) {
  try {
    const { hostname } = new URL(a.href, window.location);
    return hostname !== window.location.hostname && hostname !== 'www.astrazeneca.com';
  } catch {
    return false;
  }
}

function isCurrent(a) {
  try {
    const url = new URL(a.href, window.location);
    const section = url.pathname.replace(/\.html$/, '').replace(/\/$/, '');
    const here = window.location.pathname.replace(/\.html$/, '');
    return section.length > 1 && (here === section || here.startsWith(`${section}/`));
  } catch {
    return false;
  }
}

/** builds `.az-nav-parent` + `ul.az-nav-links` from an authored sub-list */
function buildColumn(col, ul, idBase) {
  const items = [...ul.querySelectorAll(':scope > li')];
  const overview = items.shift();
  if (overview) {
    const a = itemLink(overview);
    if (a) {
      a.className = 'az-nav-parent';
      col.append(a);
    }
    overview.remove();
  }
  ul.className = 'az-nav-links';
  items.forEach((li, i) => {
    const a = itemLink(li);
    const childList = li.querySelector(':scope > ul');
    if (!a) return;
    a.className = 'az-nav-link';
    if (childList) {
      const id = `${idBase}-${i}`;
      a.classList.add('az-nav-link-parent');
      a.setAttribute('aria-expanded', 'false');
      a.setAttribute('aria-controls', id);
      const child = el('div', 'az-nav-child', { id });
      buildColumn(child, childList, id);
      li.append(child);
    }
  });
  col.append(ul);
}

function buildSpotlights(wrapper) {
  const byLabel = new Map();
  if (!wrapper) return byLabel;
  let current = null;
  let spot = null;
  [...wrapper.children].forEach((node) => {
    if (/^H[1-6]$/.test(node.tagName)) {
      current = [];
      byLabel.set(node.textContent.trim().toLowerCase(), current);
      spot = null;
      return;
    }
    if (!current) return;
    const a = node.querySelector('a[href]');
    const pic = node.querySelector('picture, img');
    if (pic && spot) {
      const box = el('span', 'az-nav-spot-img');
      box.append(node);
      spot.append(box);
    } else if (a && spot) {
      const title = el('span', 'az-nav-spot-title');
      title.append(node);
      spot.href = a.href;
      spot.target = isExternal(a) ? '_blank' : '_self';
      // the card is the link (EW6): keep the authored text, drop the inner anchor
      a.replaceWith(...a.childNodes);
      spot.append(title);
    } else if (!a && !pic) {
      spot = el('a', 'az-nav-spot');
      const sub = el('span', 'az-nav-spot-sub');
      sub.append(node);
      spot.append(sub);
      current.push(spot);
    }
  });
  return byLabel;
}

function buildMenu(menuWrapper, spotlights) {
  const nav = el('nav', 'az-nav', { 'aria-label': 'Main' });
  const list = menuWrapper && menuWrapper.querySelector(':scope > ul');
  if (!list) return nav;
  list.className = 'az-nav-list';
  [...list.querySelectorAll(':scope > li')].forEach((item, i) => {
    const top = itemLink(item);
    const sub = item.querySelector(':scope > ul');
    if (!top) return;
    const id = `nav-${i}`;
    item.className = 'az-nav-item';
    top.className = 'az-nav-top';
    if (isCurrent(top)) top.classList.add('is-current');
    top.setAttribute('aria-expanded', 'false');
    top.setAttribute('aria-controls', id);
    const panel = el('div', 'az-nav-panel', { id });
    const inner = el('div', 'az-nav-inner');
    const col = el('div', 'az-nav-col');
    if (sub) buildColumn(col, sub, id);
    const spot = el('div', 'az-nav-spotlight');
    (spotlights.get(top.textContent.trim().toLowerCase()) || []).forEach((s) => spot.append(s));
    inner.append(col, spot);
    const close = el('div', 'az-nav-close');
    const closeRow = el('div');
    const closeBtn = el('button', '', { type: 'button' });
    closeBtn.textContent = 'Close';
    closeRow.append(closeBtn);
    close.append(closeRow);
    panel.append(inner, close);
    item.append(panel);
  });
  nav.append(list);
  return nav;
}

function buildSearch(wrapper) {
  const search = el('div', 'az-search');
  const a = wrapper && wrapper.querySelector('a[href]');
  const placeholderP = wrapper && [...wrapper.querySelectorAll(':scope > p')]
    .find((p) => !p.querySelector('a'));
  const label = a ? a.textContent.trim() : 'Search';
  const open = el('button', 'az-search-open', { type: 'button', 'aria-expanded': 'false' });
  open.append(hiddenLabel(label));
  const form = el('form', '', {
    action: a ? a.href : '/search', method: 'get', role: 'search',
  });
  const lab = el('label', '', { for: 'az-search-input' });
  if (a) lab.append(...a.childNodes);
  else lab.textContent = label;
  const input = el('input', '', {
    type: 'text',
    id: 'az-search-input',
    'aria-label': label,
    name: 'q',
    placeholder: placeholderP ? placeholderP.textContent.trim() : '',
  });
  const submit = el('button', '', { type: 'submit' });
  const submitText = el('span');
  submitText.textContent = label;
  submit.append(submitText);
  form.append(lab, input, submit);
  const close = el('button', 'az-search-close', { type: 'button' });
  close.append(hiddenLabel('Close'));
  search.append(open, form, close);
  return search;
}

function wire(header) {
  const closeAll = (except) => {
    header.querySelectorAll('.az-nav-item.is-open').forEach((it) => {
      if (it === except) return;
      it.classList.remove('is-open');
      it.querySelector('.az-nav-top').setAttribute('aria-expanded', 'false');
      it.querySelectorAll('.az-nav-links > li.is-open').forEach((li) => {
        li.classList.remove('is-open');
        const link = li.querySelector(':scope > .az-nav-link-parent');
        if (link) link.setAttribute('aria-expanded', 'false');
      });
    });
  };

  // spotlight thumbnails sit in closed panels: fetch them once the visitor reaches for the nav
  const nav = header.querySelector('.az-nav');
  const warm = () => {
    nav.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      img.loading = 'eager';
    });
  };
  ['pointerenter', 'focusin', 'click'].forEach((ev) => nav.addEventListener(ev, warm, { once: true }));
  header.querySelector('.az-header-button-menu').addEventListener('click', warm, { once: true });

  header.querySelectorAll('.az-nav-item').forEach((item) => {
    const top = item.querySelector('.az-nav-top');
    top.addEventListener('click', (e) => {
      e.preventDefault();
      const open = !item.classList.contains('is-open');
      closeAll(item);
      item.classList.toggle('is-open', open);
      top.setAttribute('aria-expanded', String(open));
      if (open && desktop.matches) {
        const first = item.querySelector('.az-nav-parent');
        if (first) first.focus({ preventScroll: true });
      }
    });
    item.querySelectorAll('.az-nav-link-parent').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const li = link.parentElement;
        const open = !li.classList.contains('is-open');
        li.parentElement.querySelectorAll(':scope > li.is-open').forEach((o) => {
          o.classList.remove('is-open');
          const l = o.querySelector(':scope > .az-nav-link-parent');
          if (l) l.setAttribute('aria-expanded', 'false');
        });
        li.classList.toggle('is-open', open);
        link.setAttribute('aria-expanded', String(open));
      });
    });
    const close = item.querySelector('.az-nav-close button');
    if (close) {
      close.addEventListener('click', () => {
        closeAll();
        top.focus();
      });
    }
  });

  const menu = header.querySelector('.az-header-button-menu');
  let searchBtn = header.querySelector('.az-header-button-search');
  const search = header.querySelector('.az-search');
  // the closed mobile tray is a 1px rule: keep its controls out of the tab order
  const syncSearch = () => {
    search.inert = !desktop.matches && !header.classList.contains('is-search-open');
  };
  syncSearch();

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = header.querySelector('.az-nav-item.is-open');
    if (open) {
      closeAll();
      open.querySelector('.az-nav-top').focus();
    }
    if (header.classList.contains('is-search-open')) {
      header.classList.remove('is-search-open');
      syncSearch();
      searchBtn.setAttribute('aria-expanded', 'false');
      searchBtn.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) || e.target.closest('.az-nav-close')) closeAll();
  });

  menu.addEventListener('click', () => {
    const open = !header.classList.contains('is-menu-open');
    header.classList.toggle('is-menu-open', open);
    menu.setAttribute('aria-expanded', String(open));
    if (!open) closeAll();
  });

  [searchBtn, header.querySelector('.az-search-open')].forEach((btn) => {
    btn.addEventListener('click', () => {
      searchBtn = btn;
      const open = !header.classList.contains('is-search-open');
      header.classList.toggle('is-search-open', open);
      syncSearch();
      btn.setAttribute('aria-expanded', String(open));
      if (open) header.querySelector('.az-search input').focus();
    });
  });
  header.querySelector('.az-search-close').addEventListener('click', () => {
    header.classList.remove('is-search-open');
    syncSearch();
    searchBtn.setAttribute('aria-expanded', 'false');
    searchBtn.focus();
  });

  desktop.addEventListener('change', () => {
    closeAll();
    header.classList.remove('is-menu-open', 'is-search-open');
    syncSearch();
    menu.setAttribute('aria-expanded', 'false');
  });
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  if (block.querySelector('.az-header')) return; // re-entrant (EW9)
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;
  fragment.querySelectorAll('.metadata').forEach((m) => m.remove());
  const parts = classify(fragment);

  block.textContent = '';
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'main';

  if (parts.skip) {
    const skip = parts.skip.querySelector(':scope > ul');
    skip.className = 'az-skip';
    block.append(skip);
  }

  const header = el('div', 'az-header', { id: 'navigation' });
  const bar = el('div', 'az-header-bar');

  const logo = el('div', 'az-header-logo');
  const brandLink = parts.brand && parts.brand.querySelector('a[href]');
  if (brandLink) {
    brandLink.className = '';
    logo.append(brandLink);
  } else if (parts.brand) {
    logo.append(...parts.brand.childNodes);
  }
  bar.append(logo);

  let regionList = null;
  if (parts.region) {
    regionList = parts.region.querySelector(':scope > ul');
    regionList.className = 'az-header-region';
    const regionLinks = regionList.querySelectorAll('a');
    if (regionLinks.length) regionLinks[regionLinks.length - 1].classList.add('is-global');
    bar.append(regionList);
  }

  const toggles = el('div', 'az-header-toggles');
  const searchLabel = parts.search?.querySelector('a')?.textContent.trim() || 'Search';
  const searchBtn = el('button', 'az-header-button az-header-button-search', {
    type: 'button', 'aria-expanded': 'false',
  });
  searchBtn.append(hiddenLabel(searchLabel));
  const menuBtn = el('button', 'az-header-button az-header-button-menu', {
    type: 'button', 'aria-expanded': 'false',
  });
  menuBtn.append(hiddenLabel('Menu'));
  toggles.append(searchBtn, menuBtn);
  bar.append(toggles, buildSearch(parts.search));

  const spotlights = buildSpotlights(parts.spotlights);
  const nav = buildMenu(parts.menu, spotlights);
  if (regionList) {
    const drawerRegion = stripInstrumentation(regionList.cloneNode(true));
    drawerRegion.className = 'az-nav-region';
    nav.append(drawerRegion);
  }

  header.append(bar, nav);
  block.append(header);
  wire(header);
}
