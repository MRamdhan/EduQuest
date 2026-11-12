/**
 * Pemuat template HTML.
 * Semua template berada di frontend/templates dan di-cache setelah dimuat.
 */
const cache = new Map();

function templateUrl(relativePath) {
  return new URL(`../../templates/${relativePath}`, import.meta.url);
}

export async function loadTemplate(relativePath) {
  if (cache.has(relativePath)) {
    return cache.get(relativePath);
  }

  const response = await fetch(templateUrl(relativePath), { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Gagal memuat template ${relativePath} (HTTP ${response.status}).`);
  }

  const html = await response.text();
  cache.set(relativePath, html);
  return html;
}

/** Mengisi elemen dengan template. */
export async function mountTemplate(element, relativePath) {
  const html = await loadTemplate(relativePath);
  element.innerHTML = html;
  return element;
}
