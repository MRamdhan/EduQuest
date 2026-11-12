/**
 * DashboardController — memilih beranda baru atau lama berdasarkan progres.
 */
import { BaseController } from './base-controller.js';
import { DashboardNewView } from '../views/dashboard-new-view.js';
import { DashboardOldView } from '../views/dashboard-old-view.js';

export class DashboardController extends BaseController {
  mount() {
    this.newUserView = new DashboardNewView(this.root);
    this.oldUserView = new DashboardOldView(this.root);
    this.subscribe();
    this.render();
  }

  render() {
    const state = this.app.store.state;
    if (state.isNewUser) {
      this.newUserView.render(state);
    } else {
      this.oldUserView.render(state);
    }
  }
}
