/**
 * RankShowcaseView — galeri pangkat Bronze/Silver/Gold.
 */
import { RANK_TIERS, getRankAssetKey } from '../../config/constants.js';
import { ASSETS } from '../../assets/mascot-assets.js';

export class RankShowcaseView {
  constructor(root) {
    this.root = root;
  }

  render(rank) {
    const containers = this.root.querySelectorAll('.rank-emblems-showcase');
    if (!containers.length) return;

    const activeKey = getRankAssetKey(rank);
    const html = RANK_TIERS.map(tier => {
      const source = ASSETS[tier.key] || '';
      const isCurrent = tier.key === activeKey;
      return `
        <div class="flex flex-col items-center justify-between rounded-2xl border p-4 text-center transition ${
          isCurrent
            ? 'border-2 border-brand-700 bg-brand-50/80 shadow-xs'
            : 'border-brand-100 bg-white opacity-85 hover:opacity-100'
        }">
          <div class="flex flex-col items-center">
            <img src="${source}" alt="${tier.title}" class="h-14 w-14 select-none object-contain drop-shadow-xs" />
            <h4 class="mt-2.5 font-display text-sm font-extrabold text-ink-900">${tier.title}</h4>
            <span class="text-[11px] font-extrabold text-brand-700">Rank ${tier.rank}</span>
            <p class="mt-1 text-[11px] leading-snug text-slate-500">${tier.desc}</p>
          </div>
          <span class="mt-3 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
            isCurrent ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600'
          }">
            ${isCurrent ? 'Pangkat Aktif' : tier.minXp}
          </span>
        </div>
      `;
    }).join('');

    containers.forEach(container => {
      container.innerHTML = html;
    });
  }
}
