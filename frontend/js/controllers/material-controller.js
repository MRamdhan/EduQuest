/**
 * MaterialController — halaman baca materi, langkah materi/contoh,
 * serta penandaan materi selesai.
 */
import { BaseController } from './base-controller.js';
import { MaterialView } from '../views/material-view.js';
import { ROUTES } from '../config/constants.js';

export class MaterialController extends BaseController {
  mount() {
    this.babId = this.params.babId;
    this.matId = this.params.matId;
    this.step = Number(this.query.step) >= 2 ? 2 : 1;

    this.app.store.state.material = {
      babId: this.babId,
      matId: this.matId,
      step: this.step
    };

    this.view = new MaterialView(this.root);
    this.subscribe();

    this.bind('click', '[data-action="close-material"]', () => {
      this.app.go(ROUTES.quest);
    });

    this.bind('click', '[data-action="set-step"]', (event, target) => {
      const nextStep = Number(target.dataset.step) >= 2 ? 2 : 1;
      this.app.go(ROUTES.material(this.babId, this.matId, nextStep));
    });

    this.bind('click', '[data-action="finish-next"]', async (event, target) => {
      const babId = target.dataset.bab || this.babId;
      const currentId = target.dataset.current || this.matId;
      const nextId = target.dataset.next || this.matId;

      const newlyDone = await this.app.models.quest.markMaterialDone(currentId);
      if (newlyDone) {
        this.app.toast.show('Materi Selesai! (+15 XP)', 'Lanjut mempelajari materi berikutnya.', '🎉');
      }
      this.app.go(ROUTES.material(babId, nextId, 1));
    });

    this.bind('click', '[data-action="finish-quiz"]', async (event, target) => {
      const materialId = target.dataset.mat || this.matId;
      const newlyDone = await this.app.models.quest.markMaterialDone(materialId);
      if (newlyDone) {
        this.app.toast.show('Materi Selesai! (+15 XP)', 'Siap mengerjakan tantangan Kuis 3 Nyawa!', '🎉');
      }
      this.app.startQuiz('/quest');
    });

    this.render();
  }

  render() {
    const state = this.app.store.state;
    const quest = this.app.models.quest;
    const chapter = quest.getChapter(this.babId);
    const material = quest.getMaterial(this.babId, this.matId);
    const index = chapter.materials.findIndex(item => item.id === material.id);
    const nextMaterial = chapter.materials[index + 1] || chapter.materials[0];

    const subject = quest.getSubjectByChapterId(this.babId);
    const subjectChapters = quest.chapters(subject);
    const totalMaterials = subjectChapters.reduce((total, item) => total + item.materials.length, 0);
    const totalCompleted = quest.subjectCompletedCount(subject);
    const totalPct = totalMaterials
      ? Math.min(100, Math.round((totalCompleted / totalMaterials) * 100))
      : 0;

    this.view.render({
      subject,
      chapter,
      material,
      nextMaterial,
      step: this.step,
      completed: state.completedMaterials,
      totalCompleted,
      totalPct,
      chapterCount: subjectChapters.length,
      totalMaterials
    });
  }
}
