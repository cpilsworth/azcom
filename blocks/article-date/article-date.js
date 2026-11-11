/**
 * article-date — the press-release "PUBLISHED / <date>" stamp (label over date, a rule on
 * its right, a soft shadow below). Template-slotted; shared by the results and article
 * templates.
 * Schema: stardust/eds-schema/media-centre-press-releases-2026-h1-and-q2-2026-results.json
 * (section az-results, .date).
 *
 * Authoring (one row):
 *   two cells  — cell 1 the label ("PUBLISHED"), cell 2 the displayed date ("27 July 2026")
 *   one cell   — two paragraphs: label, then date (a lone paragraph is the date)
 * The date is authored in its displayed form; nothing is derived or reformatted.
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
  let labelNodes = [];
  let dateNodes = [];

  if (cells.length >= 2) {
    labelNodes = [...cells[0].childNodes];
    dateNodes = cells.slice(1).flatMap((c) => [...c.childNodes]);
  } else if (cells.length === 1) {
    const els = [...cells[0].children];
    if (els.length >= 2) {
      labelNodes = [els[0]];
      dateNodes = els.slice(1);
    } else {
      dateNodes = [...cells[0].childNodes];
    }
  }

  const region = document.createElement('div');
  region.className = 'article-date-region';
  if (labelNodes.length) region.append(slot('article-date-title', labelNodes));
  region.append(slot('article-date-date', dateNodes));

  const box = slot('article-date-box', [region]);
  block.replaceChildren(box);
}
