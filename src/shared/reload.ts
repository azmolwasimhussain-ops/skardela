// This loads the page again. It is in its own file, so a test can replace it: jsdom cannot load a page again.
export function reloadPage(): void {
  window.location.reload();
}
