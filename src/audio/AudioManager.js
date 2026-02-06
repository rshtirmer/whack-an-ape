// Whack an Ape - Audio Manager (Strudel BGM)
import { initStrudel, hush } from '@strudel/web';

class AudioManager {
  constructor() {
    this.initialized = false;
    this.currentMusic = null;
  }

  init() {
    if (this.initialized) return;
    try {
      initStrudel();
      this.initialized = true;
      console.log('[Audio] Strudel initialized');
    } catch (e) {
      console.warn('[Audio] Strudel init failed:', e);
    }
  }

  playMusic(patternFn) {
    if (!this.initialized) return;
    this.stopMusic();
    // Wait for hush() to process before starting new pattern
    setTimeout(() => {
      try {
        this.currentMusic = patternFn();
      } catch (e) {
        console.warn('[Audio] BGM error:', e);
      }
    }, 100);
  }

  stopMusic() {
    if (!this.initialized) return;
    try { 
      hush(); 
    } catch (e) { 
      /* noop */ 
    }
    this.currentMusic = null;
  }
}

export const audioManager = new AudioManager();
