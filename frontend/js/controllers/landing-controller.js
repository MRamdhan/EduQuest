/**
 * LandingController — memuat jenjang publik dari backend.
 */
import { BaseController } from './base-controller.js';
import { LandingView } from '../views/landing-view.js';

export class LandingController extends BaseController {
  mount() {
    this.view = new LandingView(this.root);
    this.subscribe();

    this.bind('click', '[data-action="landing-retry-levels"]', () => {
      this.loadLevels({ force: true });
    });

    this.render();
    this.loadLevels();
  }

  async loadLevels({ force = false } = {}) {
    try {
      await this.app.models.quest.loadLevels({ force });
    } catch (error) {
      // Error disimpan di state dan ditampilkan oleh view.
    }
    this.render();
  }

  viewData() {
    const state = this.app.store.state;
    return {
      levels: state.levels || [],
      loading: Boolean(state.levelsLoading),
      error: state.levelsError
    };
  }

  render() {
    if (!this.view) return;
    this.view.render(this.viewData());
  }
}
