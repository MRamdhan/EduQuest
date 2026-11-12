/**
 * BaseController — siklus hidup dan event delegation untuk controller halaman.
 * Router membuat controller lalu memanggil mount(); saat rute berganti destroy().
 */
import { delegate } from '../core/dom.js';

export class BaseController {
  constructor(app, params = {}, query = {}) {
    this.app = app;
    this.params = params;
    this.query = query;
    this.root = document.getElementById('app-view');
    this.disposers = [];
    this.unsubscribe = null;
  }

  /** Mendengarkan event pada root halaman memakai event delegation. */
  bind(eventName, selector, handler) {
    this.disposers.push(delegate(this.root, eventName, selector, handler));
  }

  onSubmit(selector, handler) {
    this.bind('submit', selector, async (event, target) => {
      event.preventDefault();
      await handler(event, target);
    });
  }

  /** Ikut memperbarui tampilan saat state berubah. */
  subscribe() {
    this.unsubscribe = this.app.store.subscribe(() => this.render());
  }

  mount() {
    this.render();
  }

  render() {}

  destroy() {
    this.disposers.forEach(dispose => dispose());
    this.disposers = [];
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}
