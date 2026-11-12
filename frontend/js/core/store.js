/**
 * Store sederhana dengan pola observer.
 * Model menulis state, view/controller berlangganan perubahan.
 */
export class Store {
  constructor(initialState) {
    this.state = initialState;
    this.listeners = new Set();
  }

  get() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit() {
    this.listeners.forEach(listener => listener(this.state));
  }

  /** Mengganti sebagian state lalu memberi tahu pelanggan. */
  patch(partial) {
    Object.assign(this.state, partial);
    this.emit();
  }

  /** Memberi tahu pelanggan setelah model mengubah state bersarang. */
  touch() {
    this.emit();
  }

  /** Mengembalikan state ke kondisi awal (mis. setelah logout). */
  reset(freshState) {
    this.state = freshState;
    this.emit();
  }
}
