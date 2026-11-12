/**
 * DashboardNewView — beranda untuk petualang baru (belum punya XP).
 */
import { ASSETS } from '../assets/mascot-assets.js';
import { getShortName, jenjangText, xpPercent } from '../core/format.js';
import { RankShowcaseView } from './components/rank-showcase-view.js';

export class DashboardNewView {
  constructor(root) {
    this.root = root;
    this.rankShowcase = new RankShowcaseView(root);
  }

  render(state) {
    const user = state.user;

    const mascot = this.root.querySelector('#new-user-hero-mascot');
    if (mascot) mascot.src = ASSETS.mascot;

    const jenjangTag = this.root.querySelector('#new-user-jenjang-tag');
    if (jenjangTag) jenjangTag.textContent = jenjangText(user);

    const welcomeTitle = this.root.querySelector('#new-user-welcome-title');
    if (welcomeTitle) welcomeTitle.textContent = `Halo, ${getShortName(user.fullName)}!`;

    const levelBadge = this.root.querySelector('#new-user-level-badge');
    if (levelBadge) levelBadge.textContent = `Level ${user.level} • ${user.rank}`;

    const xpDisplay = this.root.querySelector('#new-user-xp-display');
    if (xpDisplay) xpDisplay.textContent = `${user.xp} / ${user.nextLevelXp || 100} XP`;

    const xpBar = this.root.querySelector('#new-user-xp-bar');
    if (xpBar) xpBar.style.width = `${xpPercent(user)}%`;

    this.rankShowcase.render(user.rank);
  }
}
