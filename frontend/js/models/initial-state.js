/**
 * Nilai awal state aplikasi.
 * Bentuk state sengaja datar untuk data pengguna dan bersarang untuk
 * state per fitur (kuis, materi, AI Tutor).
 */
export function createDefaultUser() {
  return {
    id: null,
    username: '',
    fullName: 'Petualang Baru',
    firstName: 'Petualang',
    email: '',
    jenjang: 'SMA',
    jenjangDisplay: 'SMA/SMK',
    kelas: 'Kelas 10',
    kelasNumber: 10,
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

export function createQuestState() {
  return {
    subjects: [],
    materials: [],
    loading: false,
    loaded: false,
    loadedLevel: null,
    loadedAt: 0,
    error: null,
    activeSubjectId: null,
    search: ''
  };
}

export function createQuizState() {
  return {
    phase: 'idle',
    returnPath: '/beranda',
    materialId: null,
    material: null,
    subject: null,
    difficulty: null,
    unlockedDifficulty: 1,
    levels: [],
    attempt: null,
    attemptId: null,
    question: null,
    questionNumber: 0,
    totalQuestions: 0,
    lives: 3,
    maxLives: 3,
    selectedOption: null,
    feedback: null,
    summary: null,
    error: null,
    loading: false
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

    // Data referensi backend
    levels: [],
    levelsLoading: false,
    levelsLoaded: false,
    levelsError: null,
    ranks: [],

    // Progres belajar
    completedMaterials: {},
    completedQuizzes: {},
    quizAttempts: [],
    progressSummary: null,

    // Profil & analitik
    profileStats: null,
    profileQuizHistory: null,
    profileRecommendation: null,
    isLoadingProfileData: false,

    // Quest (mata pelajaran + materi dari backend)
    quest: createQuestState(),

    // Kuis berbasis API
    quiz: createQuizState(),

    // Halaman belajar materi
    material: {
      subjectId: null,
      materialId: null,
      step: 1
    },

    // AI Tutor
    aiTutor: {
      subjectId: null,
      materialId: null,
      draft: '',
      messages: [],
      isLoading: false,
      error: null
    }
  };
}
