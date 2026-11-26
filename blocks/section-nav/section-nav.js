/**
 * section-nav — the in-page section bar (dark strip of jump links) that sticks under the
 * header while the release scrolls. Template-slotted: the authored list moves into a <nav>.
 * Schema: stardust/eds-schema/media-centre-press-releases-2026-h1-and-q2-2026-results.json
 * (section az-results, #navbar).
 *
 * Authoring (one cell): a bulleted list of links whose hrefs are in-page anchors
 * (#<heading-id>). Paragraph links are accepted too.
 * Motion: the section sticks (top 0; 40px from 769px) — CSS only.
 */
export default function decorate(block) {
  const list = block.querySelector('ul, ol');
  const nav = document.createElement('nav');
  nav.className = 'section-nav-bar';
  if (list) {
    nav.append(list);
  } else {
    nav.append(...block.querySelectorAll('p'));
  }
  block.replaceChildren(nav);
}
