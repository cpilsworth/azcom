// chrome.js — header and footer behaviour observed on astrazeneca.com (stardust/chrome/header-contract.json):
// desktop: click a primary item to open its tray (one at a time), second-level parents open a third column,
// Escape / Close / click outside close it; mobile (< 960px): the Menu button opens the drawer, items expand
// in place; the search button opens the search tray over the bar; footer columns are accordions below 960px.
(() => {
  const header = document.querySelector('.az-header');
  if (!header) return;
  const desktop = window.matchMedia('(min-width: 960px)');

  const closeAll = (except) => {
    header.querySelectorAll('.az-nav__item.is-open').forEach((it) => {
      if (it === except) return;
      it.classList.remove('is-open');
      it.querySelector('.az-nav__top').setAttribute('aria-expanded', 'false');
      it.querySelectorAll('.az-nav__links > li.is-open').forEach((li) => li.classList.remove('is-open'));
    });
  };

  header.querySelectorAll('.az-nav__item').forEach((item) => {
    const top = item.querySelector('.az-nav__top');
    top.addEventListener('click', (e) => {
      e.preventDefault();
      const open = !item.classList.contains('is-open');
      closeAll(item);
      item.classList.toggle('is-open', open);
      top.setAttribute('aria-expanded', String(open));
      if (open && desktop.matches) {
        const first = item.querySelector('.az-nav__parent');
        if (first) first.focus({ preventScroll: true });
      }
    });
    item.querySelectorAll('.az-nav__link--parent').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const li = link.parentElement;
        const open = !li.classList.contains('is-open');
        li.parentElement.querySelectorAll(':scope > li.is-open').forEach((o) => o.classList.remove('is-open'));
        li.classList.toggle('is-open', open);
        link.setAttribute('aria-expanded', String(open));
      });
    });
    const close = item.querySelector('.az-nav__close button');
    if (close) close.addEventListener('click', () => { closeAll(); top.focus(); });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = header.querySelector('.az-nav__item.is-open');
    if (open) { closeAll(); open.querySelector('.az-nav__top').focus(); }
    if (header.classList.contains('is-search-open')) {
      header.classList.remove('is-search-open');
      header.querySelector('.az-header__button--search').focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) || e.target.closest('.az-nav__close')) closeAll();
  });

  const menu = header.querySelector('.az-header__button--menu');
  menu.addEventListener('click', () => {
    const open = !header.classList.contains('is-menu-open');
    header.classList.toggle('is-menu-open', open);
    menu.setAttribute('aria-expanded', String(open));
    if (!open) closeAll();
  });

  let searchBtn = header.querySelector('.az-header__button--search');
  [searchBtn, header.querySelector('.az-search__open')].forEach((btn) => btn.addEventListener('click', () => {
    searchBtn = btn;
    const open = !header.classList.contains('is-search-open');
    header.classList.toggle('is-search-open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (open) header.querySelector('.az-search input').focus();
  }));
  header.querySelector('.az-search__close').addEventListener('click', () => {
    header.classList.remove('is-search-open');
    searchBtn.setAttribute('aria-expanded', 'false');
    searchBtn.focus();
  });

  document.querySelectorAll('.az-footer__panel .az-footer__title').forEach((title) => {
    title.addEventListener('click', () => {
      if (desktop.matches) return;
      const panel = title.parentElement;
      panel.classList.toggle('is-open');
      title.setAttribute('aria-expanded', String(panel.classList.contains('is-open')));
    });
  });
})();
