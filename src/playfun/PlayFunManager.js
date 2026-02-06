// Play.fun SDK Integration
// Uses global OpenGameSDK initialized in index.html

class PlayFunManagerClass {
  constructor() {
    this.points = 0;
  }

  get sdk() {
    return window.playFunSDK;
  }

  get ready() {
    return window.playFunReady;
  }

  /**
   * Initialize - wait for global SDK
   */
  async init() {
    // SDK initialized in index.html
    if (this.ready) {
      console.log('[PlayFun] SDK ready');
      return true;
    }
    
    // Wait for SDK to init
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 200));
      if (this.ready) {
        console.log('[PlayFun] SDK ready');
        return true;
      }
    }
    
    console.warn('[PlayFun] SDK timeout');
    return false;
  }

  /**
   * Add points
   */
  addPoints(amount) {
    if (this.sdk) {
      this.sdk.addPoints(amount);
      this.points += amount;
      console.log(`[PlayFun] +${amount} pts`);
    }
  }

  /**
   * Save points
   */
  async savePoints() {
    if (this.sdk) {
      try {
        await this.sdk.savePoints(this.points);
        console.log('[PlayFun] Saved:', this.points);
        return true;
      } catch (e) {
        console.error('[PlayFun] Save failed:', e);
        return false;
      }
    }
    return false;
  }

  resetSession() {
    this.points = 0;
  }
}

export const PlayFunManager = new PlayFunManagerClass();
