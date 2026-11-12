/**
 * LandingController — halaman publik yang hanya berisi konten statis.
 */
import { BaseController } from './base-controller.js';
import { LandingView } from '../views/landing-view.js';

export class LandingController extends BaseController {
  mount() {
    this.view = new LandingView(this.root);
    this.render();
  }

  render() {
    this.view.render();
  }
}
