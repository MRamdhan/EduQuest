/**
 * QuestController — katalog mata pelajaran, bab, dan materi.
 */
import { BaseController } from './base-controller.js';
import { QuestView } from '../views/quest-view.js';
import { SUBJECTS } from '../config/constants.js';

export class QuestController extends BaseController {
  mount() {
    this.searchQuery = '';
    this.view = new QuestView(this.root);
    this.subscribe();

    this.bind('input', '[data-field="quest-search"]', (event, target) => {
      this.searchQuery = (target.value || '').trim().toLowerCase();
      this.render();
    });

    this.render();
  }

  viewData() {
    const state = this.app.store.state;
    const quest = this.app.models.quest;
    const activeSubject = state.activeSubject || 'IPS';
    const chapters = quest.chapters(activeSubject).map(chapter => ({
      ...chapter,
      materials: chapter.materials.map(material => ({
        ...material,
        __done: quest.isCompleted(material.id)
      }))
    }));

    let filteredChapters = chapters;
    if (this.searchQuery) {
      filteredChapters = chapters.map(chapter => {
        const matchesChapter = chapter.title.toLowerCase().includes(this.searchQuery) ||
          chapter.desc.toLowerCase().includes(this.searchQuery) ||
          chapter.code.toLowerCase().includes(this.searchQuery);
        const filteredMaterials = chapter.materials.filter(m =>
          matchesChapter || m.title.toLowerCase().includes(this.searchQuery)
        );
        return {
          ...chapter,
          materials: filteredMaterials
        };
      }).filter(ch => ch.materials.length > 0);
    }

    const counts = {};
    SUBJECTS.forEach(subject => {
      counts[subject] = {
        done: quest.subjectCompletedCount(subject),
        total: quest.subjectMaterialCount(subject)
      };
    });

    const totalMaterials = quest.subjectMaterialCount(activeSubject);
    const completedCount = counts[activeSubject]?.done || 0;
    const anyCompleted = Object.keys(state.completedMaterials).length > 0;

    return {
      user: state.user,
      jenjang: state.user.jenjangDisplay || state.user.jenjang,
      activeSubject,
      chapters: filteredChapters,
      counts,
      anyCompleted,
      totalMaterials,
      completedCount
    };
  }

  render() {
    this.view.render(this.viewData());
    const searchInput = this.root.querySelector('[data-field="quest-search"]');
    if (searchInput && this.searchQuery && searchInput.value !== this.searchQuery) {
      searchInput.value = this.searchQuery;
    }
  }
}
