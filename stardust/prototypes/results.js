/* results.js — the PDF triggers open their document directly; the embedded viewer
   the source loads into .cmp-pdfviewer__content waits on owner decision D3. */
document.querySelectorAll('.cmp-pdfviewer__button[data-document-path]').forEach((button) => {
  button.addEventListener('click', () => {
    window.open(button.dataset.documentPath, '_blank', 'noopener');
  });
});
