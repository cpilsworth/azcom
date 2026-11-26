/**
 * guidance — a tinted call-out pairing a stacked label (e.g. "FY2026 / GUIDANCE /
 * RECONFIRMED", divided by a vertical rule) with the guidance statement. Template-slotted.
 * Schema: stardust/eds-schema/media-centre-press-releases-2026-h1-and-q2-2026-results.json
 * (section az-results, .az-guidance).
 *
 * Authoring (one row, two cells): cell 1 the label (Shift+Enter line breaks, footnote
 * marker as <sup>), cell 2 the statement (key figures in <strong>).
 */
function slot(className, nodes) {
  const w = document.createElement('div');
  w.className = className;
  w.append(...nodes);
  return w;
}

export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  const cells = [...row.children];
  const panel = document.createElement('div');
  panel.className = 'guidance-panel';
  if (cells.length > 1) {
    panel.append(slot('guidance-label', [...cells[0].childNodes]));
    panel.append(slot('guidance-text', cells.slice(1).flatMap((c) => [...c.childNodes])));
  } else if (cells.length === 1) {
    panel.classList.add('no-label');
    panel.append(slot('guidance-text', [...cells[0].childNodes]));
  }
  block.replaceChildren(panel);
}
