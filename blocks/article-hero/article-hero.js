/**
 * article-hero — the press-release title band: the page title (h1) centred in a
 * constrained column, no cover image. Template-slotted.
 *
 * Authoring rows:
 *   1. page title as <h1>
 *
 * The block's stylesheet also carries the article template's body section
 * (section-metadata Style `article-body`: date, rich text, tags), which every
 * page using this block authors right below it.
 */
export default function decorate(block) {
  const heading = block.querySelector('h1, h2');
  if (!heading) return;
  const title = document.createElement('div');
  title.className = 'article-hero-title';
  title.append(heading);
  block.replaceChildren(title);
}
