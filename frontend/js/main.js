/**
 * Titik masuk aplikasi EduQuest.
 */
import { EduQuestApp } from './app.js';
import { escapeHtml } from './core/dom.js';

const app = new EduQuestApp();

app.init().catch(error => {
  console.error('Gagal menjalankan EduQuest:', error);
  const container = document.getElementById('app-view');
  if (container) {
    container.innerHTML = `
      <div class="mx-auto max-w-2xl rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
        <h1 class="font-display text-xl font-extrabold">Aplikasi gagal dimuat</h1>
        <p class="mt-2">Pastikan frontend dijalankan melalui server HTTP (bukan file://) dan backend Django aktif.</p>
        <p class="mt-2 text-xs">${escapeHtml(error?.message || error)}</p>
      </div>
    `;
  }
});
