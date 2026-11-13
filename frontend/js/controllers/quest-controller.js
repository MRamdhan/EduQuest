/**
 * QuestController — memuat dan menampilkan katalog mapel/materi dari backend.
 */
import { BaseController } from './base-controller.js';
import { QuestView } from '../views/quest-view.js';

export class QuestController extends BaseController {
  mount() {
    this.view = new QuestView(this.root);
    this.subscribe();

    this.bind('input', '[data-field="quest-search"]', (event, target) => {
      this.app.models.quest.state.search = (target.value || '').trim();
      this.render();
    });

    this.bind('click', '[data-action="quest-refresh"]', async () => {
      await this.app.models.quest.loadCatalog({ force: true });
      this.render();
    });

    this.render();
    this.load();
  }

  async load() {
    const quest = this.app.models.quest;
    if (!quest.state.loaded || quest.state.loadedLevel !== quest.levelCode()) {
      await quest.loadCatalog();
      this.render();
    }
  }

  viewData() {
    const state = this.app.store.state;
    const quest = this.app.models.quest;
    const subjectCards = quest.subjectCards();
    const activeSubject = subjectCards.find(
      subject => Number(subject.id) === Number(quest.state.activeSubjectId)
    ) || subjectCards[0] || null;
    const activeMaterials = activeSubject ? quest.materialsForSubject(activeSubject.id) : [];
    const search = quest.state.search || '';
    const visibleMaterials = search
      ? quest.searchMaterials(search)
      : activeMaterials;

    return {
      user: state.user,
      subjects: subjectCards,
      activeSubject,
      activeMaterials,
      visibleMaterials,
      search,
      loading: quest.state.loading,
      error: quest.state.error,
      totalMaterials: quest.state.materials.length,
      completedCount: quest.completedCount()
    };
  }

  render() {
    if (!this.view) return;
    this.view.render(this.viewData());
  }
}
