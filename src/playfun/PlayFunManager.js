// Play.fun SDK Integration
// Manages points tracking and sync with Play.fun platform

// Configuration - UPDATE THIS after registering on https://app.play.fun
const PLAYFUN_CONFIG = {
  // TODO: Replace with your actual game ID from Play.fun dashboard
  gameId: 'YOUR_GAME_ID_HERE',
  
  // Widget settings
  ui: {
    usePointsWidget: true,
  },
};

class PlayFunManagerClass {
  constructor() {
    this.sdk = null;
    this.ready = false;
    this.pendingPoints = 0;
    this.totalPointsThisSession = 0;
  }

  /**
   * Initialize the Play.fun SDK
   * Call this once at game boot
   */
  async init() {
    // Skip if no valid game ID configured
    if (PLAYFUN_CONFIG.gameId === 'YOUR_GAME_ID_HERE') {
      console.warn('[PlayFun] No game ID configured. Set gameId in PlayFunManager.js');
      console.warn('[PlayFun] Register your game at https://app.play.fun to get a game ID');
      return false;
    }

    // Check if SDK is available (loaded via CDN)
    if (typeof window.PlayFunSDK === 'undefined') {
      console.warn('[PlayFun] SDK not loaded. Make sure the script tag is in index.html');
      return false;
    }

    try {
      this.sdk = new window.PlayFunSDK(PLAYFUN_CONFIG);
      await this.sdk.init();
      
      this.sdk.on('OnReady', () => {
        console.log('[PlayFun] SDK ready!');
        this.ready = true;
      });

      this.sdk.on('pointsSynced', (total) => {
        console.log('[PlayFun] Points synced! Total:', total);
      });

      this.sdk.on('error', (err) => {
        console.error('[PlayFun] SDK error:', err);
      });

      this.ready = true;
      console.log('[PlayFun] Initialized successfully');
      return true;
    } catch (error) {
      console.error('[PlayFun] Failed to initialize:', error);
      return false;
    }
  }

  /**
   * Add points (cached locally until savePoints is called)
   * @param {number} points - Points to add
   */
  addPoints(points) {
    this.pendingPoints += points;
    this.totalPointsThisSession += points;
    
    if (this.sdk && this.ready) {
      this.sdk.addPoints(points);
      console.log(`[PlayFun] Added ${points} points (session total: ${this.totalPointsThisSession})`);
    }
  }

  /**
   * Save all pending points to Play.fun server
   * Call this at game over or periodically
   */
  async savePoints() {
    if (!this.sdk || !this.ready) {
      console.log('[PlayFun] SDK not ready, points not saved');
      return false;
    }

    if (this.pendingPoints === 0) {
      console.log('[PlayFun] No pending points to save');
      return true;
    }

    try {
      await this.sdk.savePoints();
      console.log(`[PlayFun] Saved ${this.pendingPoints} points to server`);
      this.pendingPoints = 0;
      return true;
    } catch (error) {
      console.error('[PlayFun] Failed to save points:', error);
      return false;
    }
  }

  /**
   * Reset session tracking (call when starting new game)
   */
  resetSession() {
    this.pendingPoints = 0;
    this.totalPointsThisSession = 0;
  }

  /**
   * Get current session stats
   */
  getStats() {
    return {
      ready: this.ready,
      pendingPoints: this.pendingPoints,
      totalPointsThisSession: this.totalPointsThisSession,
    };
  }
}

// Singleton export
export const PlayFunManager = new PlayFunManagerClass();
