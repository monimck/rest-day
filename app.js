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
  archiveDatePlaying = null;
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
    hintEl.style.color = 'var(--brown)';
    hintEl.style.textDecoration = 'underline';
    hintEl.style.textUnderlineOffset = '3px';
    hintEl.onclick = () => {
      hintEl.textContent = 'Name begins with ' + firstLetter;
      hintEl.style.cursor = 'default';
      hintEl.style.color = '';
      hintEl.style.textDecoration = '';
      hintEl.style.textUnderlineOffset = '';
      hintEl.onclick = null;
    };
  } else {
    hintEl.style.display = 'none';
    hintEl.style.color = '';
    hintEl.style.textDecoration = '';
    hintEl.style.textUnderlineOffset = '';
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

  // Are we playing an archive (past) puzzle?
  const isArchive = archiveDatePlaying && archiveDatePlaying !== getTodayString();

  if (correct) {
    if (isArchive) {
      recordArchiveResult(archiveDatePlaying, 'win');
      let stats = loadStats();
      stats.sends = (stats.sends || 0) + 1;
      saveStats(stats);
      archiveDatePlaying = null;
      showArchiveSuccessScreen(g + 1);
    } else {
      let stats = loadStats();
      stats = updateStreak(stats, true);
      stats.distribution[g] = (stats.distribution[g] || 0) + 1;
      stats.lastGuessNum = g + 1;
      saveStats(stats);
      recordArchiveResult(getTodayString(), 'win');
      saveGameState({ date: getTodayString(), finished: true, currentGuess: g });
      showSuccessScreen(stats, g + 1);
    }
  } else {
    if (g === 3) {
      state.pastGuesses.push(input);
      if (isArchive) {
        recordArchiveResult(archiveDatePlaying, 'punt');
        let stats = loadStats();
        stats.punts = (stats.punts || 0) + 1;
        saveStats(stats);
        archiveDatePlaying = null;
        showArchiveFailureScreen();
      } else {
        let stats = loadStats();
        stats = updateStreak(stats, false);
        saveStats(stats);
        recordArchiveResult(getTodayString(), 'punt');
        saveGameState({ date: getTodayString(), finished: true, currentGuess: 4, pastGuesses: state.pastGuesses });
        showFailureScreen(stats);
      }
    } else {
      state.pastGuesses.push(input);
      state.currentGuess += 1;
      if (!isArchive) {
        saveGameState({ date: getTodayString(), finished: false, currentGuess: state.currentGuess, pastGuesses: state.pastGuesses });
      }
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

// ─── ARCHIVE SUCCESS / FAILURE ─────────────────────────────────────────────────
// ─── NEXT UNPLAYED ARCHIVE PUZZLE ──────────────────────────────────────────────
function getNextUnplayedPuzzle(afterDateStr) {
  const todayStr = getTodayString();
  const history = loadArchiveHistory();
  // Find past puzzles after the given date, not yet played, sorted ascending
  return PUZZLES
    .filter(p => p.date > afterDateStr && p.date < todayStr && !history[p.date])
    .sort((a, b) => a.date.localeCompare(b.date))[0] || null;
}

function setArchiveNextBtn(screenId, currentDateStr) {
  const screen = document.getElementById(screenId);
  let nextBtn = screen.querySelector('.archive-next-puzzle-btn');

  const nextPuzzle = getNextUnplayedPuzzle(currentDateStr);

  if (nextPuzzle) {
    if (!nextBtn) {
      nextBtn = document.createElement('button');
      nextBtn.className = 'archive-next-puzzle-btn go-home-btn';
      nextBtn.style.cssText = 'margin-bottom:12px;background:transparent;color:var(--green);border:1.5px solid var(--green);';
      // Insert before the go-home-btn
      const homeBtn = screen.querySelector('.go-home-btn');
      screen.querySelector('.result-content').insertBefore(nextBtn, homeBtn);
    }
    nextBtn.textContent = 'NEXT PROJ';
    nextBtn.onclick = () => {
      // Remove the button before navigating so it doesn't persist
      nextBtn.remove();
      startArchiveGame(nextPuzzle.date);
    };
  } else if (nextBtn) {
    nextBtn.remove();
  }
}

function showArchiveSuccessScreen(guessNum) {
  const p = state.puzzle;
  const labels = ['1 ATTEMPT', '2 ATTEMPTS', '3 ATTEMPTS', '4 ATTEMPTS'];
  document.getElementById('success-subhead').textContent = 'PROBLEM IDENTIFIED IN ' + labels[guessNum - 1];
  document.getElementById('success-photo').src = p.photo;
  document.getElementById('success-name').textContent = p.name;
  document.getElementById('success-location').textContent = p.location;
  document.getElementById('success-grade').textContent = p.grade;
  // Hide streak / next-up for archive games
  document.getElementById('success-streak').textContent = '—';
  document.getElementById('success-streak-unit').textContent = '';
  document.getElementById('next-up-h').textContent = '';
  document.getElementById('next-up-m').textContent = 'Archive play';
  // Swap GO HOME to go back to archive
  const homeBtn = document.querySelector('#screen-success .go-home-btn');
  homeBtn.textContent = 'BACK TO ARCHIVE';
  homeBtn.onclick = () => { goHome(); showArchiveScreen(); };
  const playedDate = archiveDatePlaying || getTodayString();
  showScreen('screen-success');
  setArchiveNextBtn('screen-success', playedDate);
}

function showArchiveFailureScreen() {
  const p = state.puzzle;
  document.getElementById('failure-photo').src = p.photo;
  document.getElementById('failure-name').textContent = p.name;
  document.getElementById('failure-location').textContent = p.location;
  document.getElementById('failure-grade').textContent = p.grade;
  document.getElementById('failure-streak').textContent = '—';
  document.getElementById('failure-streak-unit').textContent = '';
  document.getElementById('failure-next-up-h').textContent = '';
  document.getElementById('failure-next-up-m').textContent = 'Archive play';
  const homeBtn = document.querySelector('#screen-failure .go-home-btn');
  homeBtn.textContent = 'BACK TO ARCHIVE';
  homeBtn.onclick = () => { goHome(); showArchiveScreen(); };
  const playedDate = archiveDatePlaying || getTodayString();
  showScreen('screen-failure');
  setArchiveNextBtn('screen-failure', playedDate);
}

// ─── GO HOME ───────────────────────────────────────────────────────────────────
function goHome() {
  archiveDatePlaying = null;
  // Reset result screen buttons back to default
  const successHomeBtn = document.querySelector('#screen-success .go-home-btn');
  if (successHomeBtn) { successHomeBtn.textContent = 'GO HOME'; successHomeBtn.onclick = goHome; }
  const failureHomeBtn = document.querySelector('#screen-failure .go-home-btn');
  if (failureHomeBtn) { failureHomeBtn.textContent = 'GO HOME'; failureHomeBtn.onclick = goHome; }
  // Remove any lingering next-puzzle buttons
  document.querySelectorAll('.archive-next-puzzle-btn').forEach(b => b.remove());
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

// ─── ARCHIVE ───────────────────────────────────────────────────────────────────
let archiveYear = null;
let archiveMonth = null; // 0-indexed

const MONTH_NAMES_SHORT = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const MONTH_NAMES_LONG  = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/** Load the per-date play history map {dateStr: 'win'|'punt'} */
function loadArchiveHistory() {
  try {
    return JSON.parse(localStorage.getItem('cadArchiveHistory')) || {};
  } catch { return {}; }
}

function saveArchiveHistory(h) {
  localStorage.setItem('cadArchiveHistory', JSON.stringify(h));
}

/**
 * Migrate existing stats into archive history on first load.
 * We know lastPlayedDate and lastResult from cadStats — seed that entry.
 */
function migrateStatsToArchive() {
  const stats = loadStats();
  if (!stats.lastPlayedDate || !stats.lastResult) return;
  const h = loadArchiveHistory();
  if (!h[stats.lastPlayedDate]) {
    h[stats.lastPlayedDate] = stats.lastResult === 'win' ? 'win' : 'punt';
    saveArchiveHistory(h);
  }
}

/** Call this whenever a game finishes to record it in the archive */
function recordArchiveResult(dateStr, result) {
  const h = loadArchiveHistory();
  h[dateStr] = result; // 'win' or 'punt'
  saveArchiveHistory(h);
}

function showArchiveScreen() {
  migrateStatsToArchive();
  const today = new Date();
  archiveYear  = today.getFullYear();
  archiveMonth = today.getMonth();
  renderArchiveCalendar();
  showScreen('screen-archive');
}

function archiveNavMonth(delta) {
  archiveMonth += delta;
  if (archiveMonth > 11) { archiveMonth = 0; archiveYear++; }
  if (archiveMonth < 0)  { archiveMonth = 11; archiveYear--; }
  renderArchiveCalendar();
}

function renderArchiveCalendar() {
  const today    = new Date();
  const todayStr = getTodayString();

  // Earliest puzzle date
  const firstPuzzleDate = PUZZLES.reduce((min, p) => p.date < min ? p.date : min, PUZZLES[0].date);

  document.getElementById('archive-month-name').textContent = MONTH_NAMES_SHORT[archiveMonth];
  document.getElementById('archive-month-year').textContent = archiveYear;

  // Disable next btn if already on current month
  const nextBtn = document.getElementById('archive-next-btn');
  nextBtn.disabled = (archiveYear === today.getFullYear() && archiveMonth === today.getMonth());

  const history = loadArchiveHistory();

  // Build a set of dates that have puzzles
  const puzzleDates = new Set(PUZZLES.map(p => p.date));

  // First day of month (0=Sun … 6=Sat); convert to Mon-based (0=Mon … 6=Sun)
  const firstDay = new Date(archiveYear, archiveMonth, 1);
  let startDow = firstDay.getDay(); // 0=Sun, already correct for Sun-start

  const daysInMonth = new Date(archiveYear, archiveMonth + 1, 0).getDate();

  const grid = document.getElementById('archive-cal-grid');
  grid.innerHTML = '';

  // Leading empty cells
  for (let i = 0; i < startDow; i++) {
    grid.appendChild(emptyCell());
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const mm   = String(archiveMonth + 1).padStart(2, '0');
    const dd   = String(d).padStart(2, '0');
    const dateStr = `${archiveYear}-${mm}-${dd}`;

    const isToday   = dateStr === todayStr;
    const isFuture  = dateStr > todayStr;
    const hasPuzzle = puzzleDates.has(dateStr);
    const result    = history[dateStr]; // 'win', 'punt', or undefined

    const cell = document.createElement('div');
    cell.className = 'archive-cal-cell';

    // Date number
    const dateEl = document.createElement('div');
    dateEl.className = 'archive-cal-date' + (isToday ? ' today' : '');
    dateEl.textContent = d;
    cell.appendChild(dateEl);

    // Circle
    const circle = document.createElement('div');
    circle.className = 'archive-cal-circle';

    if (!hasPuzzle || isFuture) {
      // Grey empty circle (no puzzle, or future)
      circle.classList.add('empty');
    } else if (result === 'win') {
      circle.classList.add('sent');
      circle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (result === 'punt') {
      circle.classList.add('punt');
      circle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    } else if (isToday) {
      // Today, not yet played — green play (today's game)
      circle.classList.add('playable', 'today-marker');
      circle.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`;
      circle.onclick = () => { startGame(); };
    } else {
      // Past date with puzzle, not played — playable archive entry
      circle.classList.add('playable');
      circle.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`;
      circle.onclick = () => { startArchiveGame(dateStr); };
    }

    cell.appendChild(circle);
    grid.appendChild(cell);
  }

  // Render stats strip
  const stats = loadStats();
  const total  = (stats.sends || 0) + (stats.punts || 0);
  const rate   = total > 0 ? Math.round((stats.sends / total) * 100) + '%' : '—';
  document.getElementById('archive-stat-sends').textContent = stats.sends || 0;
  document.getElementById('archive-stat-punts').textContent = stats.punts || 0;
  document.getElementById('archive-stat-rate').textContent  = rate;
}

function emptyCell() {
  const cell = document.createElement('div');
  cell.className = 'archive-cal-cell';
  const dateEl = document.createElement('div');
  dateEl.className = 'archive-cal-date';
  cell.appendChild(dateEl);
  const circle = document.createElement('div');
  circle.className = 'archive-cal-circle empty';
  cell.appendChild(circle);
  return cell;
}

// ─── ARCHIVE GAME ──────────────────────────────────────────────────────────────
let archiveDatePlaying = null; // date string of the archive puzzle being played

function startArchiveGame(dateStr) {
  const puzzle = PUZZLES.find(p => p.date === dateStr);
  if (!puzzle) { showToast('No puzzle for that date'); return; }

  archiveDatePlaying   = dateStr;
  state.puzzle         = puzzle;
  state.currentGuess   = 0;
  state.finished       = false;
  state.pastGuesses    = [];

  renderGameScreen();
  showScreen('screen-game');
}

// ─── INIT ──────────────────────────────────────────────────────────────────────
renderHome();
document.getElementById('submit-email').textContent = 'onsightbouldersubmissions' + '@' + 'gmail.com';

// ─── SERVICE WORKER ──────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
