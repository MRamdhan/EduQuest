/**
 * DashboardController — memuat progres, katalog, dan rekomendasi dari backend.
 */
import { BaseController } from './base-controller.js';
import { DashboardNewView } from '../views/dashboard-new-view.js';
import { DashboardOldView } from '../views/dashboard-old-view.js';

export class DashboardController extends BaseController {
  mount() {
    this.newUserView = new DashboardNewView(this.root);
    this.oldUserView = new DashboardOldView(this.root);
    this.dataRequested = false;
    this.subscribe();
    this.render();
    this.loadData();
  }

  async loadData() {
    const state = this.app.store.state;
    if (this.dataRequested || !state.isLoggedIn) return;
    this.dataRequested = true;

    const quest = this.app.models.quest;
    const profile = this.app.models.profile;
    const progress = this.app.models.progress;

    await Promise.allSettled([
      quest.loadCatalog(),
      profile.load(),
      progress.refresh(),
      progress.loadRanks()
    ]);

    // Template dipilih router berdasarkan isNewUser; muat ulang bila status berubah.
    const wantNew = state.isNewUser;
    const hasNewTemplate = Boolean(this.root.querySelector('#new-user-welcome-title'));
    if ((wantNew && !hasNewTemplate) || (!wantNew && hasNewTemplate)) {
      this.app.reloadCurrentRoute();
      return;
    }

    this.render();
  }

  render() {
    const state = this.app.store.state;
    if (state.isNewUser) {
      if (this.root.querySelector('#new-user-welcome-title')) {
        this.newUserView.render(state);
      }
    } else if (!this.root.querySelector('#new-user-welcome-title')) {
      this.oldUserView.render(state);
    }
  }
}
