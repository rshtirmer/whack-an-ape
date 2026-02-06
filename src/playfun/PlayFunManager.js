// Play.fun SDK Integration
// Matching the React usePlayFun hook pattern

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
    // Check if PlayFunSDK is available
    if (typeof window.PlayFunSDK === 'undefined') {
      console.warn('[PlayFun] PlayFunSDK not loaded');
      return false;
    }

    try {
      // Create SDK with gameId and widget - matching React hook pattern
      this.sdk = new window.PlayFunSDK({
        gameId: GAME_ID,
        ui: {
          usePointsWidget: true,
        },
      });

      await this.sdk.init();
      this.ready = true;
      
      // Listen for points sync
      this.sdk.on('pointsSynced', (total) => {
        console.log('[PlayFun] Points synced, total:', total);
        this.points = total;
      });

      console.log('[PlayFun] SDK ready!');
      return true;
    } catch (error) {
      console.error('[PlayFun] Init failed:', error);
      return false;
    }
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
