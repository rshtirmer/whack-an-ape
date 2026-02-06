// Whack an Ape - Sound Effects (Web Audio API)
// One-shot sounds that play once and stop

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play a single tone
function playTone(freq, type, duration, gain = 0.3, filterFreq = 4000) {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(gain, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(filterFreq, now);

  osc.connect(filter).connect(gainNode).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);
}

// Play a sequence of notes
function playNotes(notes, type, noteDuration, gap, gain = 0.3, filterFreq = 4000) {
  const ctx = getCtx();
  const now = ctx.currentTime;

  notes.forEach((freq, i) => {
    const start = now + i * gap;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(gain, start);
    gainNode.gain.exponentialRampToValueAtTime(0.001, start + noteDuration);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, start);

    osc.connect(filter).connect(gainNode).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + noteDuration);
  });
}

// Play noise burst
function playNoise(duration, gain = 0.2, lpfFreq = 4000) {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(gain, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  const lpf = ctx.createBiquadFilter();
  lpf.type = 'lowpass';
  lpf.frequency.setValueAtTime(lpfFreq, now);

  source.connect(lpf).connect(gainNode).connect(ctx.destination);
  source.start(now);
  source.stop(now + duration);
}

// ============ GAME SFX ============

// Whack! — satisfying bonk sound
export function whackSfx() {
  // Low thump + high click
  playTone(80, 'square', 0.1, 0.35, 600);
  playTone(440, 'square', 0.05, 0.2, 3000);
}

// Golden ape whack — magical chime
export function goldenWhackSfx() {
  playNotes([523.25, 659.25, 783.99, 1046.5], 'square', 0.15, 0.08, 0.3, 5000);
}

// Miss / swing — whoosh
export function missSfx() {
  playNoise(0.15, 0.1, 3000);
}

// Ape escaped — sad descending tone
export function escapeSfx() {
  playNotes([392, 329.63, 261.63], 'triangle', 0.15, 0.1, 0.2, 2000);
}

// Timer warning beep
export function timerBeepSfx() {
  playTone(880, 'square', 0.08, 0.25, 4000);
}

// Game over — dramatic descending
export function gameOverSfx() {
  playNotes([523.25, 440, 349.23, 293.66, 261.63], 'square', 0.25, 0.12, 0.3, 2500);
}

// Button click
export function clickSfx() {
  playTone(660, 'sine', 0.06, 0.2, 5000);
}

// Game start fanfare
export function startSfx() {
  playNotes([261.63, 329.63, 392, 523.25], 'square', 0.12, 0.08, 0.25, 4000);
}

// Combo milestone (5+)
export function comboSfx() {
  playNotes([523.25, 659.25, 783.99], 'square', 0.1, 0.05, 0.25, 5000);
}
