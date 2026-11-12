/**
 * FooterView — isi footer statis dan tahun berjalan.
 */
export class FooterView {
  constructor(root) {
    this.root = root;
  }

  render() {
    const yearEl = this.root.querySelector('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }
}
