/**
 * stat-grid — a 2-column grid of key figures (label, figure, optional change line) in a
 * rounded, hairline-divided panel. Reconstructive: one row per figure.
 * Schema: stardust/eds-schema/media-centre-press-releases-2026-h1-and-q2-2026-results.json
 * (section az-results, .statgrid — 4 × .statcell).
 *
 * Authoring: one row per figure — cell 1 label (footnote markers as <sup>), cell 2 the
 * figure, cell 3 the change line (optional; leave empty when there is none).
 */
const ROLES = ['stat-grid-label', 'stat-grid-figure', 'stat-grid-change'];

export default function decorate(block) {
  const cells = [];
  [...block.children].forEach((row) => {
    const cell = document.createElement('div');
    cell.className = 'stat-grid-cell';
    [...row.children].forEach((col, i) => {
      if (!col.textContent.trim() && !col.querySelector('img, picture')) return;
      const w = document.createElement('div');
      w.className = ROLES[Math.min(i, ROLES.length - 1)];
      w.append(...col.childNodes);
      cell.append(w);
    });
    if (cell.childNodes.length) cells.push(cell);
  });
  block.replaceChildren(...cells);
}
