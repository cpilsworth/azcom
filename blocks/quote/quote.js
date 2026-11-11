/**
 * quote — pull quote between two rules, with opening/closing marks and an attribution
 * (name, then role). Template-slotted. The section's default content (disclaimer line and
 * accent headline above the quote) is styled in place via .quote-container.
 * Schema: stardust/eds-schema/media-centre-press-releases-2026-h1-and-q2-2026-results.json
 * (section az-results, .az-quote-box).
 *
 * Authoring rows:
 *   1. the quote — one paragraph (Shift+Enter line breaks are kept)
 *   2. author name (optional)
 *   3. author role / title (optional)
 */
function slot(className, nodes, tag = 'div') {
  const w = document.createElement(tag);
  w.className = className;
  w.append(...nodes);
  return w;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const cellOf = (row) => row.firstElementChild || row;
  const [quoteRow, ...attribution] = rows;

  const body = document.createElement('blockquote');
  body.className = 'quote-body';
  body.append(slot('quote-text', [...cellOf(quoteRow).childNodes]));

  const named = attribution.filter((r) => r.textContent.trim());
  if (named.length) {
    const footer = document.createElement('footer');
    footer.className = 'quote-footer';
    named.forEach((row, i) => {
      const role = i === 0 ? 'quote-author' : 'quote-author-title';
      footer.append(slot(role, [...cellOf(row).childNodes]));
    });
    body.append(footer);
  }
  block.replaceChildren(body);
}
