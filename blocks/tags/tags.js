/**
 * tags — the release's topic tags as outlined pills, centred, under a visually hidden
 * heading. Template-slotted; shared by the results and article templates.
 * Schema: stardust/eds-schema/media-centre-press-releases-2026-h1-and-q2-2026-results.json
 * (section az-results, .tags).
 *
 * Authoring (one cell): an optional heading (kept for screen readers, visually hidden),
 * then a bulleted list — one tag per item (plain text or a link).
 */
export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const lists = [...block.querySelectorAll('ul, ol')];
  const parts = [];
  if (heading) {
    const h = document.createElement('div');
    h.className = 'tags-heading visuallyhidden';
    h.append(heading);
    parts.push(h);
  }
  const list = document.createElement('div');
  list.className = 'tags-list';
  if (lists.length) {
    list.append(...lists);
  } else {
    list.append(...block.querySelectorAll('p'));
  }
  parts.push(list);
  block.replaceChildren(...parts);
}
