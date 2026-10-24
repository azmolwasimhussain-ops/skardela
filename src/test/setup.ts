import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom has no "showModal" and no "close" for <dialog>. These small versions set "open",
// and "close" sends the "close" event as a browser does. They do not make the rest of the page inert.
function showModal(this: HTMLDialogElement) {
  this.open = true;
}

function close(this: HTMLDialogElement) {
  if (!this.open) return;
  this.open = false;
  this.dispatchEvent(new Event("close"));
}

if (typeof HTMLDialogElement.prototype.showModal !== "function") {
  HTMLDialogElement.prototype.showModal = showModal;
  HTMLDialogElement.prototype.close = close;
}

afterEach(() => {
  cleanup();
  // Each test starts as a new player, so each saved value from an earlier test is removed.
  localStorage.clear();
});
