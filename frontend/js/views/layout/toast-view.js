/**
 * ToastView — notifikasi kecil di kanan atas.
 */
export class ToastView {
  constructor(root) {
    this.root = root;
    this.timer = null;
  }

  show(title, message, icon = '✓') {
    const toast = this.root?.querySelector('#toast');
    const iconEl = this.root?.querySelector('#toast-icon');
    const titleEl = this.root?.querySelector('#toast-title');
    const messageEl = this.root?.querySelector('#toast-message');
    if (!toast || !titleEl || !messageEl) return;

    if (iconEl) iconEl.textContent = icon;
    titleEl.textContent = title;
    messageEl.textContent = message;
    toast.classList.remove('hidden');

    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => toast.classList.add('hidden'), 3500);
  }
}
