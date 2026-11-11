/*
 * Leaving-site confirmation — the source's #modal-link-confirmation.
 * Off-site links open a dialog (text authored in /fragments/link-confirmation);
 * Continue follows the link, Cancel / close / Escape / scrim stay on the page.
 */
import { loadCSS } from './aem.js';

const FRAGMENT = '/fragments/link-confirmation';
// hosts the source leaves unconfirmed (its own domains, the cookie policy) and this site's origins
const SITE_HOSTS = [
  /(^|\.)astrazeneca\.com$/, /(^|\.)azandme\.com$/, /(^|\.)azethics\.com$/,
  /(^|\.)astrazenecaclinicaltrials\.com$/, /(^|\.)cookiereports\.com$/,
  /\.aem\.(page|live)$/, /^localhost$/,
];

let modal;

function isOffSite(a) {
  if (!a.href || a.closest('.link-confirmation, #CookieReportsPanel')) return false;
  let url;
  try {
    url = new URL(a.href, window.location.href);
  } catch {
    return false;
  }
  if (!/^https?:$/.test(url.protocol) || url.host === window.location.host) return false;
  return !SITE_HOSTS.some((re) => re.test(url.hostname));
}

function close() {
  if (!modal?.open) return;
  modal.close();
  document.documentElement.classList.remove('has-overlay');
}

async function build() {
  loadCSS(`${window.hlx.codeBasePath}/styles/link-confirmation.css`);
  // eslint-disable-next-line import/no-cycle
  const { loadFragment } = await import('../blocks/fragment/fragment.js');
  const fragment = await loadFragment(FRAGMENT);
  if (!fragment) return null;

  const dialog = document.createElement('dialog');
  dialog.className = 'link-confirmation';
  const title = fragment.querySelector('p > strong:only-child')?.parentElement;
  if (title) {
    title.className = 'link-confirmation-heading';
    title.id = 'link-confirmation-heading';
    dialog.setAttribute('aria-labelledby', title.id);
  }
  const inner = document.createElement('div');
  inner.className = 'link-confirmation-inner';
  const content = document.createElement('div');
  content.className = 'link-confirmation-content';
  fragment.querySelectorAll('.default-content-wrapper').forEach((w) => content.append(...w.children));
  inner.append(content);

  const cancel = content.querySelector('a[href$="#cancel"]');
  const proceed = content.querySelector('a[href$="#continue"]');
  [cancel, proceed].forEach((b) => {
    if (!b) return;
    b.classList.add('button');
    b.closest('p')?.classList.add('link-confirmation-actions');
  });
  cancel?.addEventListener('click', (e) => { e.preventDefault(); close(); });
  proceed?.addEventListener('click', (e) => {
    e.preventDefault();
    const { href, target } = dialog.dataset;
    close();
    if (target && target !== '_self') window.open(href, target, 'noopener');
    else window.location.assign(href);
  });

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'link-confirmation-close';
  closeBtn.title = 'Close this modal';
  closeBtn.setAttribute('aria-label', 'Close this modal');
  closeBtn.addEventListener('click', close);

  dialog.append(inner, closeBtn);
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
  document.body.append(dialog);
  return dialog;
}

async function open(a) {
  modal = modal || await build();
  if (!modal) {
    window.location.assign(a.href);
    return;
  }
  modal.dataset.href = a.href;
  modal.dataset.target = a.target || '';
  document.documentElement.classList.add('has-overlay');
  modal.showModal();
}

document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest('a[href]');
  if (!a || !isOffSite(a)) return;
  e.preventDefault();
  open(a);
}, true);
