/**
 * pipeline-cards — pipeline highlight tiles: a large figure (authored heading) over a
 * short caption, on grey rounded tiles that wrap 4-up → 1-up. Reconstructive: one row per
 * tile. The section's default content (question heading above; centred CTA, signature and
 * references below) is styled in place via .pipeline-cards-container.
 * Schema: stardust/eds-schema/media-centre-press-releases-2026-h1-and-q2-2026-results.json
 * (section az-results, .pipeline-grid — 4 × .pipeline-card).
 *
 * Authoring: one row per tile — cell 1 the figure as <h3>, cell 2 the caption.
 */
export default function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'pipeline-cards-grid';
  [...block.children].forEach((row) => {
    if (!row.textContent.trim()) return;
    const card = document.createElement('div');
    card.className = 'pipeline-cards-card';
    [...row.children].forEach((col) => {
      const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
      const w = document.createElement('div');
      w.className = heading ? 'pipeline-cards-figure' : 'pipeline-cards-caption';
      w.append(...col.childNodes);
      card.append(w);
    });
    grid.append(card);
  });
  block.replaceChildren(grid);
}
