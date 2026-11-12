/**
 * ProfileController — memuat riwayat/statistik lalu menggambar halaman profil.
 */
import { BaseController } from './base-controller.js';
import { ProfileView } from '../views/profile-view.js';

export class ProfileController extends BaseController {
  mount() {
    this.view = new ProfileView(this.root);
    this.dataRequested = false;
    this.subscribe();
    this.render();
    this.loadProfileData();
  }

  async loadProfileData() {
    const state = this.app.store.state;
    if (this.dataRequested || !state.isLoggedIn) return;
    this.dataRequested = true;
    await this.app.models.profile.load();
  }

  render() {
    const state = this.app.store.state;
    if (!this.dataRequested && !state.profileStats && state.isLoggedIn) {
      this.loadProfileData();
    }
    this.view.render(state);
  }
}
