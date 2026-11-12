/**
 * Helper DOM kecil agar view/controller tidak berulang menulis query manual.
 */

export function qs(selector, root = document) {
  return root.querySelector(selector);
}

export function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

export function setHTML(root, html) {
  if (root) root.innerHTML = html;
}

/** Event delegation: satu listener untuk banyak elemen dinamis. */
export function delegate(root, eventName, selector, handler) {
  if (!root) return () => {};

  const listener = (event) => {
    const target = event.target.closest(selector);
    if (!target || !root.contains(target)) return;
    handler(event, target);
  };

  root.addEventListener(eventName, listener);
  return () => root.removeEventListener(eventName, listener);
}

export function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Menggabungkan beberapa fungsi pembersih listener. */
export function combineDisposers(...disposers) {
  return () => disposers.forEach(dispose => dispose());
}
