/**
 * Nilai awal state aplikasi.
 * Bentuk state sengaja datar untuk data pengguna dan bersarang untuk
 * state per fitur (kuis, materi, AI Tutor).
 */
export function createDefaultUser() {
  return {
    fullName: 'Petualang Baru',
    firstName: 'Petualang',
    email: '',
    jenjang: 'SMA',
    jenjangDisplay: 'SMA/SMK',
    kelas: 'Kelas 10',
    education_level: 'SMA',
    level: 1,
    rank: 'Bronze',
    totalXp: 0,
    xp: 0,
    nextLevelXp: 100,
    ipsLives: 3,
    ipsLivesMax: 3
  };
}

export function createInitialState() {
  return {
    // Sesi & pengguna
    isLoggedIn: false,
    isNewUser: true,
    user: createDefaultUser(),
    selectedRegJenjang: '',

    // Navigasi
    route: '/',

    // Progres belajar
    completedMaterials: {},
    completedQuizzes: {},
    quizAttempts: [],

    // Profil & analitik
    profileStats: null,
    profileQuizHistory: null,
    profileRecommendation: null,
    isLoadingProfileData: false,

    // Quest
    activeSubject: 'IPS',

    // Kuis 3 Nyawa
    quiz: {
      step: 1,
      returnPath: '/beranda',
      q1Selected: null,
      lives: 3,
      reviewQuestionNum: 1,
      aiPrompt: ''
    },

    // Halaman belajar materi
    material: {
      babId: 'bab-01',
      matId: 'mat-1-1',
      step: 1
    },

    // AI Tutor
    aiTutor: {
      subject: 'IPS',
      draft: '',
      messages: [],
      isLoading: false
    }
  };
}
