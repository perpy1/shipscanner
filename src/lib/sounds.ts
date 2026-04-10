// Obsidian haptic sounds — physical noise impulses, not tonal
// Sounds like mechanisms engaging/disengaging

let audioCtx: AudioContext | null = null;

function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

/** Card open/close — thock/tick noise impulse */
export function playClick(isOpen: boolean = true) {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    const len = ctx.sampleRate * (isOpen ? 0.018 : 0.012);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const env = Math.pow(1 - i / len, isOpen ? 8 : 12);
      d[i] = (Math.random() * 2 - 1) * env;
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = isOpen ? 2400 : 1800;
    lp.Q.value = 0.7;

    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 300;
    hp.Q.value = 0.5;

    const vol = ctx.createGain();
    vol.gain.value = isOpen ? 0.25 : 0.18;

    src.connect(hp).connect(lp).connect(vol).connect(ctx.destination);
    src.start(now);
  } catch {}
}

/** Lighter tap for nav/buttons */
export function playTap() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const len = ctx.sampleRate * 0.008;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 15);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 2000;
    const vol = ctx.createGain();
    vol.gain.value = 0.12;
    src.connect(lp).connect(vol).connect(ctx.destination);
    src.start(now);
  } catch {}
}

// Keep old exports as aliases for any remaining references
export const playCoinInsert = () => playClick(true);
export const playReelStop = () => playClick(false);
export const playJackpotBells = playTap;
export const playChipStack = playTap;
export const playLeverPull = () => playClick(true);
export const playClickSound = playTap;
export const playCardFlip = () => playClick(false);
