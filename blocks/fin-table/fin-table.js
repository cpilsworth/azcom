/**
 * fin-table — a financial results data table (mulberry two-tier header, right-aligned
 * figures, zebra rows) in a rounded, scrollable frame. Reconstructive: a genuine data table,
 * so the block is as wide as the table (D10 exception).
 * Schema: stardust/eds-schema/media-centre-press-releases-2026-h1-and-q2-2026-results.json
 * (section az-results, .fin-table).
 *
 * Authoring: one block row per table row.
 *   header rows — the first row, plus every following row whose FIRST cell is empty
 *                 (that empty cell continues the first header cell downwards).
 *   group headers — in a header row, a non-empty cell followed by empty cells spans them.
 *   body rows — everything after; bold totals with <strong>.
 */
function headerRowCount(rows) {
  let n = rows.length ? 1 : 0;
  while (n < rows.length) {
    const first = rows[n].firstElementChild;
    if (first && !first.textContent.trim()) n += 1;
    else break;
  }
  return n;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const nHead = rows.length > 1 ? headerRowCount(rows) : 0;

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  rows.forEach((row, r) => {
    const tr = document.createElement('tr');
    const cells = [...row.children];
    if (r < nHead) {
      let last = null;
      cells.forEach((cell, c) => {
        const empty = !cell.textContent.trim();
        if (empty && r > 0 && c === 0) {
          // continues the first header cell of the first row downwards
          const top = thead.querySelector('tr th');
          if (top) top.rowSpan = nHead;
          return;
        }
        if (empty && last && c > 0) {
          last.colSpan += 1;
          return;
        }
        const th = document.createElement('th');
        th.append(...cell.childNodes);
        tr.append(th);
        last = th;
      });
      thead.append(tr);
    } else {
      cells.forEach((cell) => {
        const td = document.createElement('td');
        td.append(...cell.childNodes);
        tr.append(td);
      });
      tbody.append(tr);
    }
  });

  if (thead.childNodes.length) table.append(thead);
  table.append(tbody);
  const frame = document.createElement('div');
  frame.className = 'fin-table-frame';
  frame.append(table);
  block.replaceChildren(frame);
}
