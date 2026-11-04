/**
 * EduQuest Frontend Starter Controller
 * Mengatur interaksi UI halaman index.html dan memanggil EduQuestAPI.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const backendStatusEl = document.getElementById('backendStatus');
  const userStatsBar = document.getElementById('userStatsBar');
  const btnLogout = document.getElementById('btnLogout');
  const loginForm = document.getElementById('loginForm');
  const authMessage = document.getElementById('authMessage');
  
  const statLives = document.getElementById('statLives');
  const statXP = document.getElementById('statXP');
  const statLevel = document.getElementById('statLevel');
  const statRank = document.getElementById('statRank');
  const statUsername = document.getElementById('statUsername');

  const btnLoadMaterials = document.getElementById('btnLoadMaterials');
  const selectLevel = document.getElementById('selectLevel');
  const materialsList = document.getElementById('materialsList');

  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const tutorMaterialId = document.getElementById('tutorMaterialId');

  const btnStartQuiz = document.getElementById('btnStartQuiz');
  const quizMaterialId = document.getElementById('quizMaterialId');
  const quizArea = document.getElementById('quizArea');
  const quizQuestionText = document.getElementById('quizQuestionText');
  const quizOptions = document.getElementById('quizOptions');
  const quizResult = document.getElementById('quizResult');

  let currentQuizAttempt = null;
  let currentQuestionIndex = 0;

  // 1. Cek Koneksi Backend
  async function checkBackend() {
    try {
      await EduQuestAPI.getLevels();
      backendStatusEl.textContent = '● Backend Terhubung (OK)';
      backendStatusEl.className = 'badge badge-success';
    } catch (e) {
      backendStatusEl.textContent = '● Backend Offline (Gagal)';
      backendStatusEl.className = 'badge badge-danger';
    }
  }

  // 2. Refresh Status User & Nyawa
  async function refreshUserData() {
    if (!EduQuestAPI.isAuthenticated()) {
      userStatsBar.style.display = 'none';
      btnLogout.style.display = 'none';
      return;
    }

    try {
      const [profile, livesData] = await Promise.all([
        EduQuestAPI.getProfile().catch(() => null),
        EduQuestAPI.getUserLives().catch(() => null),
      ]);

      if (profile) {
        userStatsBar.style.display = 'flex';
        btnLogout.style.display = 'inline-flex';
        statUsername.textContent = profile.username;
        statXP.textContent = profile.progress ? profile.progress.total_xp : 0;
        statLevel.textContent = profile.progress ? profile.progress.level : 1;
        statRank.textContent = profile.progress ? profile.progress.rank : 'Bronze';
      }

      if (livesData) {
        statLives.textContent = `${livesData.current_lives}/${livesData.max_lives}`;
      }
    } catch (err) {
      console.warn('Gagal memuat data user:', err);
    }
  }

  // 3. Login Event
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authMessage.textContent = 'Sedang masuk...';
    authMessage.style.color = '#64748b';

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
      const res = await EduQuestAPI.login(username, password);
      authMessage.textContent = `Selamat datang, ${res.user.username}! Login berhasil.`;
      authMessage.style.color = '#10b981';
      await refreshUserData();
    } catch (err) {
      authMessage.textContent = err.data?.detail || err.message || 'Login gagal. Periksa username dan password.';
      authMessage.style.color = '#ef4444';
    }
  });

  // 4. Logout Event
  btnLogout.addEventListener('click', async () => {
    await EduQuestAPI.logout();
    authMessage.textContent = 'Anda telah logout.';
    authMessage.style.color = '#64748b';
    userStatsBar.style.display = 'none';
    btnLogout.style.display = 'none';
  });

  // 5. Muat Materi
  btnLoadMaterials.addEventListener('click', async () => {
    materialsList.innerHTML = '<p style="color: var(--text-muted);">Memuat materi...</p>';
    try {
      const level = selectLevel.value || null;
      const res = await EduQuestAPI.getMaterials({ level });
      const materials = res.results || res;

      if (!materials.length) {
        materialsList.innerHTML = '<p style="color: var(--text-muted);">Belum ada materi untuk filter ini.</p>';
        return;
      }

      materialsList.innerHTML = materials.map(m => `
        <div style="padding: 8px 0; border-bottom: 1px solid var(--border);">
          <strong>ID ${m.id} - ${m.title}</strong>
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            Jenjang: ${m.grade_level} | Kelas: ${m.kelas} | Mapel: ${m.subject_name || '-'}
          </div>
        </div>
      `).join('');
    } catch (err) {
      materialsList.innerHTML = `<p style="color: #ef4444;">Gagal memuat materi: ${err.message}</p>`;
    }
  });

  // 6. AI Tutor Chat
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    const materialId = parseInt(tutorMaterialId.value) || 1;

    // Append user bubble
    appendChatBubble(text, 'user');
    chatInput.value = '';

    // Typing bubble
    const typingBubble = appendChatBubble('Sedang berpikir...', 'ai');

    try {
      const res = await EduQuestAPI.askTutor(materialId, text);
      typingBubble.textContent = res.reply || res.message || 'Tidak ada balasan.';
    } catch (err) {
      typingBubble.textContent = `Tutor Error: ${err.data?.detail || err.message}`;
      typingBubble.style.color = '#ef4444';
    }
  });

  function appendChatBubble(text, role) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble chat-${role}`;
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return bubble;
  }

  // 7. Mulai Kuis
  btnStartQuiz.addEventListener('click', async () => {
    if (!EduQuestAPI.isAuthenticated()) {
      alert('Silakan login terlebih dahulu untuk memulai kuis!');
      return;
    }

    quizResult.textContent = 'Memulai sesi kuis...';
    try {
      const mId = parseInt(quizMaterialId.value) || 1;
      const attempt = await EduQuestAPI.startQuiz(mId, 1);
      currentQuizAttempt = attempt;
      currentQuestionIndex = 0;
      renderQuizQuestion();
    } catch (err) {
      quizResult.textContent = `Gagal memulai kuis: ${err.data?.detail || err.message}`;
      quizResult.style.color = '#ef4444';
    }
  });

  function renderQuizQuestion() {
    if (!currentQuizAttempt || !currentQuizAttempt.questions || currentQuestionIndex >= currentQuizAttempt.questions.length) {
      quizArea.style.display = 'none';
      quizResult.textContent = '🎉 Sesi kuis selesai!';
      refreshUserData();
      return;
    }

    const q = currentQuizAttempt.questions[currentQuestionIndex];
    quizArea.style.display = 'block';
    quizQuestionText.textContent = `Soal ${currentQuestionIndex + 1}/${currentQuizAttempt.questions.length}: ${q.question_text}`;
    quizOptions.innerHTML = '';

    ['A', 'B', 'C', 'D'].forEach(opt => {
      const text = q[`option_${opt.toLowerCase()}`];
      if (!text) return;
      const btn = document.createElement('button');
      btn.className = 'btn btn-outline btn-sm';
      btn.style.textAlign = 'left';
      btn.textContent = `${opt}. ${text}`;
      btn.onclick = () => submitAnswer(q.id, opt);
      quizOptions.appendChild(btn);
    });
  }

  async function submitAnswer(questionId, option) {
    try {
      const res = await EduQuestAPI.answerQuestion(currentQuizAttempt.id, questionId, option);
      alert(res.is_correct ? '✅ Jawaban Benar!' : `❌ Jawaban Salah! Nyawa tersisa: ${res.lives_remaining}`);
      currentQuestionIndex++;
      await refreshUserData();
      renderQuizQuestion();
    } catch (err) {
      alert(`Gagal mengirim jawaban: ${err.data?.detail || err.message}`);
    }
  }

  // Inisialisasi awal
  checkBackend();
  refreshUserData();
});

