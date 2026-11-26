/**
 * therapy-cards — revenue by therapy area: one bordered card per area with title, growth
 * (green up / red down), revenue figure and a description. Reconstructive: one row per card.
 * The section's default content (question heading + caption) is styled in place.
 * Schema: stardust/eds-schema/media-centre-press-releases-2026-h1-and-q2-2026-results.json
 * (section az-results, .therapy-grid — 3 × .therapy-card).
 *
 * Authoring: one row per card — cells: title | growth | figure | description.
 * The growth colour follows its authored arrow: "▼" (or a leading minus) reads as down,
 * anything else as up — read for a class only, the text is displayed as authored.
 */
const ROLES = [
  'therapy-cards-title',
  'therapy-cards-growth',
  'therapy-cards-value',
  'therapy-cards-description',
];

export default function decorate(block) {
  const cards = [];
  [...block.children].forEach((row) => {
    const cols = [...row.children];
    if (!cols.some((c) => c.textContent.trim())) return;
    const card = document.createElement('div');
    card.className = 'therapy-cards-card';
    const header = document.createElement('div');
    header.className = 'therapy-cards-header';
    card.append(header);
    cols.forEach((col, i) => {
      const role = ROLES[Math.min(i, ROLES.length - 1)];
      const w = document.createElement('div');
      w.className = role;
      if (role === 'therapy-cards-growth') {
        const t = col.textContent.trim();
        w.classList.add(/^(▼|-|−)/.test(t) ? 'is-down' : 'is-up');
      }
      w.append(...col.childNodes);
      (i < 2 ? header : card).append(w);
    });
    cards.push(card);
  });
  block.replaceChildren(...cards);
}
