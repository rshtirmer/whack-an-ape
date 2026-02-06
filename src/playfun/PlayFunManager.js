// Play.fun SDK Integration
// Uses global SDK initialized in index.html

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
   * Initialize - just wait for global SDK
   */
  async init() {
    // SDK is initialized in index.html
    if (this.sdk && this.ready) {
      console.log('[PlayFun] Using global SDK');
      return true;
    }
    
    // Wait a bit for SDK to init
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (this.sdk && this.ready) {
      console.log('[PlayFun] SDK ready');
      return true;
    }
    
    console.warn('[PlayFun] SDK not ready');
    return false;
  }

  /**
   * Add points
   */
  addPoints(amount) {
    if (this.sdk && this.ready) {
      this.sdk.addPoints(amount);
      this.points += amount;
      console.log(`[PlayFun] +${amount} points`);
    }
  }

  /**
   * Save points to server
   */
  async savePoints() {
    if (this.sdk && this.ready) {
      try {
        await this.sdk.savePoints();
        console.log('[PlayFun] Points saved!');
        return true;
      } catch (error) {
        console.error('[PlayFun] Save failed:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Reset for new game
   */
  resetSession() {
    this.points = 0;
  }
}

export const PlayFunManager = new PlayFunManagerClass();
