/**
 * hero-feature — full-bleed cover image with the page title (h1) over a dark scrim
 * (desktop) or below the image (mobile). Template-slotted.
 * Schema: stardust/eds-schema/media-centre-press-releases-2026-h1-and-q2-2026-results.json
 * (section hero-feature).
 *
 * Authoring rows:
 *   1. cover image (<img>/<picture>) — editorial, optional (CSS fallback colour)
 *   2. page title as <h1>
 */
function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

export default function decorate(block) {
  const media = block.querySelector('picture, img');
  const heading = block.querySelector('h1, h2');

  const cover = document.createElement('div');
  cover.className = 'hero-feature-cover';
  if (media) {
    const pictureHost = media.parentElement.tagName === 'PICTURE' ? media.parentElement : media;
    const host = media.closest('p') || pictureHost;
    cover.append(host);
  }

  const header = document.createElement('div');
  header.className = 'hero-feature-header';
  if (heading) header.append(wrapNode(heading, 'hero-feature-title'));

  block.replaceChildren(cover, header);
}
