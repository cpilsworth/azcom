/**
 * results-downloads — the "Downloads" column of a results release: a heading, then one
 * item per document (sub-heading + call-to-action that opens the PDF), then optional
 * trailing calls-to-action. Reconstructive (authors add/remove documents). The section
 * sets the two-column layout: this block on the left, the section's following default
 * content (key performance elements) and any stat-grid on the right.
 * Schema: stardust/eds-schema/media-centre-press-releases-2026-h1-and-q2-2026-results.json
 * (section az-results, .l-two-block-c0).
 *
 * Authoring:
 *   section head — the "Downloads" <h2> as default content right before the block
 *                  (reabsorbed into the block head; an <h2> in the first row also works)
 *   one row per document — <h3> title + paragraph CTA (<strong><a href="…pdf">)
 *   rows without a heading — trailing CTAs
 * Motion: a PDF CTA opens the document in a new tab (the source's viewer slot stays empty,
 * owner decision D3).
 */
function slot(className, nodes) {
  const w = document.createElement('div');
  w.className = className;
  w.append(...nodes);
  return w;
}

export default function decorate(block) {
  const head = document.createElement('div');
  head.className = 'results-downloads-head';

  // reabsorb the section head authored as default content (EW8)
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  if (prev && prev.classList.contains('default-content-wrapper')) {
    head.append(...prev.childNodes);
    prev.remove();
  }

  const items = [];
  [...block.children].forEach((row) => {
    const els = [...row.querySelectorAll(':scope > div > *')];
    if (!els.length) return;
    const h2 = els.find((el) => el.tagName === 'H2');
    if (h2 && !items.length) {
      head.append(...els);
      return;
    }
    const title = els.find((el) => /^H[3-6]$/.test(el.tagName));
    const rest = els.filter((el) => el !== title);
    const item = document.createElement('div');
    item.className = title ? 'results-downloads-item' : 'results-downloads-cta';
    if (title) item.append(slot('results-downloads-title', [title]));
    if (rest.length) item.append(slot('results-downloads-action', rest));
    items.push(item);
  });

  const children = head.childNodes.length ? [head, ...items] : items;
  block.replaceChildren(...children);

  // PDF triggers — like the source's pdf-viewer button: the trigger opens its document
  // (new tab; the viewer slot stays empty, owner decision D3). The authored link's href is
  // read, the paragraph moves into the trigger and its inner anchor is unwrapped (EW6);
  // a role=button div, never a <button>, so the label stays editable (EW7).
  block.querySelectorAll('.results-downloads-action a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    const par = a.closest('p');
    if (!par || !/\.pdf($|[?#])/i.test(href)) return;
    const trigger = document.createElement('div');
    trigger.className = 'results-downloads-trigger';
    trigger.setAttribute('role', 'button');
    trigger.tabIndex = 0;
    trigger.dataset.documentPath = href;
    const open = () => window.open(href, '_blank', 'noopener');
    trigger.addEventListener('click', open);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
    par.before(trigger);
    trigger.append(par);
    a.replaceWith(...a.childNodes);
  });
}
