// Whack an Ape - Game State
import { GAME } from './Constants.js';

class GameState {
  constructor() {
    this.bestScore = 0;
    this.reset();
  }

  reset() {
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.apesWhacked = 0;
    this.apesEscaped = 0;
    this.goldenWhacked = 0;
    this.timeRemaining = GAME.GAME_DURATION;
    this.started = false;
    this.gameOver = false;
  }

  addScore(points = 10) {
    // Apply combo multiplier
    const multiplier = 1 + Math.floor(this.combo / 3) * 0.5;
    const finalPoints = Math.floor(points * multiplier);
    this.score += finalPoints;
    
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
    }
    
    return finalPoints;
  }

  incrementCombo() {
    this.combo++;
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
    }
  }

  resetCombo() {
    this.combo = 0;
  }

  recordWhack(isGolden = false) {
    this.apesWhacked++;
    if (isGolden) {
      this.goldenWhacked++;
    }
  }

  recordEscape() {
    this.apesEscaped++;
    this.resetCombo();
  }
}

export const gameState = new GameState();
