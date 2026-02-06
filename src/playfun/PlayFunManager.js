// Play.fun SDK Integration
// Based on @playdotfun/game-sdk

const GAME_ID = '042863d6-9ca0-4f98-b1b2-fab4745bb698';

class PlayFunManagerClass {
  constructor() {
    this.sdk = null;
    this.ready = false;
    this.points = 0;
  }

  /**
   * Initialize the Play.fun SDK
   */
  async init() {
    // Check if SDK is available (OpenGameSDK from sdk.play.fun)
    if (typeof window.OpenGameSDK === 'undefined') {
      console.warn('[PlayFun] OpenGameSDK not loaded');
      return false;
    }

    try {
      // Create SDK instance with widget enabled
      this.sdk = new window.OpenGameSDK({
        ui: {
          usePointsWidget: true,
        },
      });

      // Set up ready event before init
      this.sdk.on('OnReady', () => {
        console.log('[PlayFun] SDK ready!');
        this.ready = true;
      });

      // Initialize with game ID
      await this.sdk.init({ gameId: GAME_ID });
      
      console.log('[PlayFun] SDK initialized');
      return true;
    } catch (error) {
      console.error('[PlayFun] Failed to initialize:', error);
      return false;
    }
  }

  /**
   * Add points
   */
  addPoints(amount) {
    this.points += amount;
    
    if (this.sdk) {
      this.sdk.addPoints(amount);
      console.log(`[PlayFun] +${amount} points (total: ${this.points})`);
    }
  }

  /**
   * Save points to Play.fun server
   */
  async savePoints() {
    if (!this.sdk) {
      console.log('[PlayFun] SDK not available');
      return false;
    }

    try {
      await this.sdk.savePoints(this.points);
      console.log(`[PlayFun] Saved ${this.points} points`);
      return true;
    } catch (error) {
      console.error('[PlayFun] Save failed:', error);
      return false;
    }
  }

  /**
   * Reset points for new game
   */
  resetSession() {
    this.points = 0;
  }
}

export const PlayFunManager = new PlayFunManagerClass();
