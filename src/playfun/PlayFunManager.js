// Play.fun SDK Integration
// Manages points tracking and sync with Play.fun platform

const GAME_ID = '042863d6-9ca0-4f98-b1b2-fab4745bb698';

class PlayFunManagerClass {
  constructor() {
    this.sdk = null;
    this.ready = false;
    this.pendingPoints = 0;
    this.totalPointsThisSession = 0;
  }

  /**
   * Initialize the Play.fun SDK
   */
  async init() {
    // Check if SDK is available
    if (typeof window.PlayFunSDK === 'undefined') {
      console.warn('[PlayFun] SDK not loaded');
      return false;
    }

    try {
      this.sdk = new window.PlayFunSDK({
        gameId: GAME_ID,
        ui: {
          usePointsWidget: true,
        },
      });

      await this.sdk.init();
      this.ready = true;
      console.log('[PlayFun] SDK initialized!');
      return true;
    } catch (error) {
      console.error('[PlayFun] Failed to initialize:', error);
      return false;
    }
  }

  /**
   * Add points (cached locally until savePoints is called)
   */
  addPoints(points) {
    this.pendingPoints += points;
    this.totalPointsThisSession += points;
    
    if (this.sdk && this.ready) {
      this.sdk.addPoints(points);
      console.log(`[PlayFun] +${points} points`);
    }
  }

  /**
   * Save all pending points to Play.fun server
   */
  async savePoints() {
    if (!this.sdk || !this.ready) {
      console.log('[PlayFun] SDK not ready');
      return false;
    }

    try {
      await this.sdk.savePoints();
      console.log(`[PlayFun] Saved ${this.pendingPoints} points`);
      this.pendingPoints = 0;
      return true;
    } catch (error) {
      console.error('[PlayFun] Save failed:', error);
      return false;
    }
  }

  /**
   * Reset session tracking
   */
  resetSession() {
    this.pendingPoints = 0;
    this.totalPointsThisSession = 0;
  }
}

export const PlayFunManager = new PlayFunManagerClass();
