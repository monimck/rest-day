// ─── ZOOM LEVELS ───────────────────────────────────────────────────────────────
const ZOOM_LEVELS = [4, 3, 2, 1]; // guess 1 = 4x, guess 2 = 3x, guess 3 = 2x, guess 4 = 1x
const ATTEMPT_LABELS = ["ONSIGHT ATTEMPT", "2ND GO", "3RD GO", "LAST GO BEST GO"];
// ─── STATE ─────────────────────────────────────────────────────────────────────
let state = {
  currentGuess: 0,   // 0-indexed
  puzzle: null,
  finished: false,
  pastGuesses: []    // stores submitted guess strings in order
};

// ─── LOCALSTORAGE ──────────────────────────────────────────────────────────────
function loadStats() {
  try {
    return JSON.parse(localStorage.getItem('cadStats')) || {
      sends: 0,
      punts: 0,
      streak: 0,
      lastPlayedDate: null,
      lastResult: null, // 'win' or 'punt'
      distribution: [0, 0, 0, 0]
    };
  } catch { return { sends: 0, punts: 0, streak: 0, lastPlayedDate: null, lastResult: null, distribution: [0, 0, 0, 0] }; }
}

function saveStats(stats) {
  localStorage.setItem('cadStats', JSON.stringify(stats));
}

function loadGameState() {
  try {
    return JSON.parse(localStorage.getItem('cadGameState')) || null;
  } catch { return null; }
}

function saveGameState(gs) {
  localStorage.setItem('cadGameState', JSON.stringify(gs));
}

// ─── PUZZLE SELECTION ──────────────────────────────────────────────────────────
function getTodayString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getTodayPuzzle() {
  const today = getTodayString();
  return PUZZLES.find(p => p.date === today) || PUZZLES[0];
}

// ─── TIME UNTIL MIDNIGHT ───────────────────────────────────────────────────────
function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return { h, m };
}

// ─── STREAK LOGIC ──────────────────────────────────────────────────────────────
function updateStreak(stats, won) {
  const today = getTodayString();
  const yd = new Date(Date.now() - 86400000);
  const yesterday = `${yd.getFullYear()}-${String(yd.getMonth() + 1).padStart(2, '0')}-${String(yd.getDate()).padStart(2, '0')}`;

  if (won) {
    if (stats.lastPlayedDate === yesterday) {
      stats.streak += 1;
    } else if (stats.lastPlayedDate !== today) {
      stats.streak = 1;
    }
    stats.sends += 1;
  } else {
    stats.streak = 0;
    stats.punts += 1;
  }
  stats.lastPlayedDate = today;
  stats.lastResult = won ? 'win' : 'punt';
  return stats;
}

// ─── SCREEN SWITCHING ──────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ─── TOAST ─────────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ─── HOME SCREEN ───────────────────────────────────────────────────────────────
function renderHome() {
  const stats = loadStats();
  document.getElementById('stat-sends').textContent = stats.sends;
  document.getElementById('stat-punts').textContent = stats.punts;

  const dist = stats.distribution || [0, 0, 0, 0];
  const max = Math.max(...dist, 1);
  ['1','2','3','4'].forEach((n, i) => {
    const val = dist[i] || 0;
    const pct = val > 0 ? Math.max((val / max) * 100, 8) : 4;
    const bar = document.getElementById('dist-' + n);
    const num = document.getElementById('dist-' + n + '-num');
    bar.style.width = pct + '%';
    num.textContent = val;
    // highlight the most common
    bar.classList.toggle('highlight', val === max && max > 0 && val > 0);
    bar.classList.toggle('active', val > 0 && !(val === max && max > 0));
  });

  // Check if already played today
  const today = getTodayString();
  if (stats.lastPlayedDate === today) {
    document.getElementById('play-btn').textContent = "VIEW TODAY'S RESULT";
    document.getElementById('play-btn').onclick = viewTodayResult;
  } else {
    document.getElementById('play-btn').textContent = "PLAY TODAY'S CHALLENGE";
    document.getElementById('play-btn').textContent = "PLAY TODAY'S CHALLENGE";
    document.getElementById('play-btn').onclick = startGame;
  }
}

function viewTodayResult() {
  const stats = loadStats();
  state.puzzle = getTodayPuzzle();
  if (stats.lastResult === 'win') {
    showSuccessScreen(stats);
  } else {
    showFailureScreen(stats);
  }
}

// ─── GAME SCREEN ───────────────────────────────────────────────────────────────
function startGame() {
  state.puzzle = getTodayPuzzle();
  state.currentGuess = 0;
  state.finished = false;
  state.pastGuesses = [];

  // Restore mid-game state if same day
  const saved = loadGameState();
  const today = getTodayString();
  if (saved && saved.date === today && !saved.finished) {
    state.currentGuess = saved.currentGuess;
    state.pastGuesses = saved.pastGuesses || [];
  }

  renderGameScreen();
  showScreen('screen-game');
}

function renderGameScreen() {
  const g = state.currentGuess;
  const zoom = ZOOM_LEVELS[g];

  document.getElementById('attempt-label').textContent = ATTEMPT_LABELS[g];
  document.getElementById('zoom-label').textContent = 'ZOOM LEVEL ' + zoom + 'X';
  const photoEl = document.getElementById('game-photo');
  const containerEl = document.querySelector('.photo-container');
  photoEl.classList.remove('loaded');
  containerEl.classList.add('loading');
  photoEl.onload = () => {
    containerEl.classList.remove('loading');
    photoEl.classList.add('loaded');
  };
  if (photoEl.complete && photoEl.naturalWidth > 0) {
    containerEl.classList.remove('loading');
    photoEl.classList.add('loaded');
  }
  photoEl.src = state.puzzle.photo;
  photoEl.style.transform = 'scale(' + zoom + ')';

  // Hints
  const hintEl = document.getElementById('hint-text');
  if (g === 2) {
    hintEl.textContent = 'Hint: ' + state.puzzle.grade + ' in ' + state.puzzle.location;
    hintEl.style.display = 'block';
    hintEl.style.cursor = 'default';
    hintEl.onclick = null;
  } else if (g === 3) {
    const name = state.puzzle.name;
    const words = name.trim().split(/\s+/);
    const firstWord = words[0].toLowerCase() === 'the' ? words[1] : words[0];
    const firstLetter = firstWord ? firstWord[0].toUpperCase() : '?';
    hintEl.textContent = 'Tap to reveal first letter';
    hintEl.style.display = 'block';
    hintEl.style.cursor = 'pointer';
    hintEl.onclick = () => {
      hintEl.textContent = 'Name begins with ' + firstLetter;
      hintEl.style.cursor = 'default';
      hintEl.onclick = null;
    };
  } else {
    hintEl.style.display = 'none';
    hintEl.onclick = null;
  }

  // Dots
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById('dot-' + i);
    const tooltip = document.getElementById('tooltip-' + i);
    const wrap = document.getElementById('dot-wrap-' + i);
    dot.classList.remove('wrong');
    wrap.classList.remove('show-tooltip');
    if (i <= g) {
      dot.classList.add('wrong');
      if (tooltip && state.pastGuesses[i - 1]) {
        tooltip.textContent = state.pastGuesses[i - 1];
      }
    }
  }

  // Attempts counter
  const attEl = document.getElementById('attempts-count');
  if (g > 0) {
    attEl.textContent = g + ' / 4 ATTEMPTS';
    attEl.style.display = 'block';
  } else {
    attEl.style.display = 'none';
  }

  document.getElementById('guess-input').value = '';
}

function submitGuess() {
  const input = document.getElementById('guess-input').value.trim();
  if (!input) return;

  const input_lower = input.toLowerCase();
  const allAnswers = [state.puzzle.name, ...(state.puzzle.aliases || [])];
  const correct = allAnswers.some(a => a.toLowerCase() === input_lower);
  const g = state.currentGuess;

  if (correct) {
    let stats = loadStats();
    stats = updateStreak(stats, true);
    stats.distribution[g] = (stats.distribution[g] || 0) + 1;
    stats.lastGuessNum = g + 1;
    saveStats(stats);
    saveGameState({ date: getTodayString(), finished: true, currentGuess: g });
    showSuccessScreen(stats, g + 1);
  } else {
    if (g === 3) {
      // Used all 4 guesses
      state.pastGuesses.push(input);
      let stats = loadStats();
      stats = updateStreak(stats, false);
      saveStats(stats);
      saveGameState({ date: getTodayString(), finished: true, currentGuess: 4, pastGuesses: state.pastGuesses });
      showFailureScreen(stats);
    } else {
      state.pastGuesses.push(input);
      state.currentGuess += 1;
      saveGameState({ date: getTodayString(), finished: false, currentGuess: state.currentGuess, pastGuesses: state.pastGuesses });
      showToast('Incorrect — try again!');
      renderGameScreen();
    }
  }
}

// ─── SUCCESS SCREEN ────────────────────────────────────────────────────────────
function showSuccessScreen(stats, guessNum) {
  const p = state.puzzle;
  const gn = guessNum || stats.lastGuessNum || 1;
  const labels = ['1 ATTEMPT', '2 ATTEMPTS', '3 ATTEMPTS', '4 ATTEMPTS'];
  document.getElementById('success-subhead').textContent = 'PROBLEM IDENTIFIED IN ' + labels[gn - 1];
  document.getElementById('success-photo').src = p.photo;
  document.getElementById('success-name').textContent = p.name;
  document.getElementById('success-location').textContent = p.location;
  document.getElementById('success-grade').textContent = p.grade;
  document.getElementById('success-streak').textContent = stats.streak;
  document.getElementById('success-streak-unit').textContent = stats.streak === 1 ? 'Day' : 'Days';
  const t = getTimeUntilMidnight();
  document.getElementById('next-up-h').textContent = t.h + 'h';
  document.getElementById('next-up-m').textContent = ' ' + t.m + 'm';
  showScreen('screen-success');
}

// ─── FAILURE SCREEN ────────────────────────────────────────────────────────────
function showFailureScreen(stats) {
  const p = state.puzzle;
  document.getElementById('failure-photo').src = p.photo;
  document.getElementById('failure-name').textContent = p.name;
  document.getElementById('failure-location').textContent = p.location;
  document.getElementById('failure-grade').textContent = p.grade;
  document.getElementById('failure-streak').textContent = stats.streak;
  document.getElementById('failure-streak-unit').textContent = stats.streak === 1 ? 'Day' : 'Days';
  const t = getTimeUntilMidnight();
  document.getElementById('failure-next-up-h').textContent = t.h + 'h';
  document.getElementById('failure-next-up-m').textContent = ' ' + t.m + 'm';
  showScreen('screen-failure');
}

// ─── SHARE ─────────────────────────────────────────────────────────────────────
function buildShareText() {
  const stats = loadStats();
  const won = stats.lastResult === 'win';
  const guessNum = stats.lastGuessNum || 1;
  const maxGuesses = 4;

  const d = new Date();
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dateStr = `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  const labels = ['Onsight', 'Soft 2nd go', '3rd go', 'LGBG'];

  let row = '';
  for (let i = 0; i < maxGuesses; i++) {
    if (i < guessNum - 1)       row += '❌';
    else if (i === guessNum - 1) row += '🪨';
    else                         row += '◻️';
  }

  const resultLine = won
    ? `${labels[guessNum - 1]}: ${row}`
    : `Punt: ${'❌'.repeat(maxGuesses)}`;

  return `${dateStr}\n${resultLine}\non-sight.app`;
}

async function shareResult() {
  const text = buildShareText();

  if (navigator.share) {
    try {
      await navigator.share({ text });
      return;
    } catch (err) {
      if (err.name === 'AbortError') return; // user cancelled — don't fall through
    }
  }

  // Fallback: clipboard
  try {
    await navigator.clipboard.writeText(text);
    showToast('Result copied to clipboard!');
  } catch {
    showToast('Could not copy — try again');
  }
}

// ─── GO HOME ───────────────────────────────────────────────────────────────────
function goHome() {
  renderHome();
  showScreen('screen-home');
}

// ─── SUBMIT SCREEN ─────────────────────────────────────────────────────────────
function showSubmitScreen() {
  showScreen('screen-submit');
}

function openMailto() {
  const em = 'onsightbouldersubmissions' + '@' + 'gmail.com';
  const sub = 'On Sight Boulder Submission';
  const bod = '1. Problem Name: \r\n2. Alternate names or spellings: \r\n3. Grade: \r\n4. Location: \r\n5. Don\'t forget to attach your photo :)';
  window.location.href = 'mailto:' + em + '?subject=' + encodeURIComponent(sub) + '&body=' + encodeURIComponent(bod);
}

// ─── GUESS TOOLTIPS ────────────────────────────────────────────────────────────
function toggleGuessTooltip(num) {
  const wrap = document.getElementById('dot-wrap-' + num);
  const dot = document.getElementById('dot-' + num);
  if (!dot.classList.contains('wrong')) return;
  const isShowing = wrap.classList.contains('show-tooltip');
  // Hide all tooltips first
  for (let i = 1; i <= 4; i++) {
    document.getElementById('dot-wrap-' + i).classList.remove('show-tooltip');
  }
  if (!isShowing) wrap.classList.add('show-tooltip');
}

// Clicking elsewhere hides tooltips
document.addEventListener('click', e => {
  if (!e.target.closest('.guess-dot-wrap')) {
    for (let i = 1; i <= 4; i++) {
      const wrap = document.getElementById('dot-wrap-' + i);
      if (wrap) wrap.classList.remove('show-tooltip');
    }
  }
});

// ─── EVENT LISTENERS ───────────────────────────────────────────────────────────
document.getElementById('submit-btn').addEventListener('click', submitGuess);
document.getElementById('guess-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') submitGuess();
});

// ─── INIT ──────────────────────────────────────────────────────────────────────
renderHome();
document.getElementById('submit-email').textContent = 'onsightbouldersubmissions' + '@' + 'gmail.com';

// ─── SERVICE WORKER ──────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
