// Whack an Ape - Game Scene (Portrait Mobile)
import Phaser from 'phaser';
import { GAME, GRID, APE, COLORS } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { renderPixelArt } from '../core/PixelRenderer.js';
import { GRASS_TILE, GRASS_FLOWERS } from '../sprites/tiles.js';
import { ENVIRONMENT_PALETTE } from '../sprites/palette.js';
import { Hole } from '../entities/Hole.js';
import { Ape } from '../entities/Ape.js';
import { Hammer } from '../entities/Hammer.js';
import { PlayFunManager } from '../playfun/PlayFunManager.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    gameState.reset();
    
    // Reset Play.fun session for new game
    PlayFunManager.resetSession();
    
    // Background
    this.createBackground();
    
    // Create holes
    this.holes = [];
    this.occupiedHoles = new Set();
    this.activeApes = [];
    
    for (let i = 0; i < GRID.COLS * GRID.ROWS; i++) {
      this.holes.push(new Hole(this, i));
    }
    
    // Create hammer cursor
    this.hammer = new Hammer(this);
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Start spawning apes
    this.spawnTimer = this.time.addEvent({
      delay: Phaser.Math.Between(APE.SPAWN_INTERVAL_MIN, APE.SPAWN_INTERVAL_MAX),
      callback: this.spawnApe,
      callbackScope: this,
      loop: true,
    });
    
    // Game timer
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
    
    // Spawn first ape immediately
    this.spawnApe();
    
    gameState.started = true;
    eventBus.emit(Events.GAME_START);
  }

  createBackground() {
    // Generate grass tile textures
    renderPixelArt(this, GRASS_TILE, ENVIRONMENT_PALETTE, 'grass-tile', 3);
    renderPixelArt(this, GRASS_FLOWERS, ENVIRONMENT_PALETTE, 'grass-flowers', 3);
    
    // Sky gradient (top portion)
    const skyGradient = this.add.graphics();
    skyGradient.fillGradientStyle(0x87ceeb, 0x87ceeb, 0x4a9edb, 0x4a9edb);
    skyGradient.fillRect(0, 0, GAME.WIDTH, GAME.HEIGHT * 0.25);
    skyGradient.setDepth(-20);
    
    // Grass background with tiled pixel art
    const tileSize = 48;
    for (let y = GAME.HEIGHT * 0.25; y < GAME.HEIGHT; y += tileSize) {
      for (let x = 0; x < GAME.WIDTH; x += tileSize) {
        const variant = Math.random() < 0.7 ? 'grass-tile' : 'grass-flowers';
        const tile = this.add.sprite(x + tileSize / 2, y + tileSize / 2, variant);
        tile.setDepth(-15);
      }
    }
    
    // Title banner at top
    const bannerBg = this.add.rectangle(GAME.WIDTH / 2, 80, 400, 70, 0x8b4513);
    bannerBg.setStrokeStyle(4, 0x654321);
    bannerBg.setDepth(100);
    
    const bannerText = this.add.text(GAME.WIDTH / 2, 80, '🦧 WHACK AN APE 🔨', {
      fontSize: '32px',
      fontFamily: 'Impact, monospace',
      color: '#ffd700',
    }).setOrigin(0.5).setDepth(101);
    
    // Decorative clouds
    this.addClouds();
  }

  addClouds() {
    const cloudPositions = [
      { x: 80, y: 60, scale: 0.7 },
      { x: 640, y: 80, scale: 0.9 },
      { x: 360, y: 50, scale: 0.5 },
    ];
    
    cloudPositions.forEach(pos => {
      const cloud = this.add.container(pos.x, pos.y);
      
      const puff1 = this.add.circle(0, 0, 20, 0xffffff, 0.9);
      const puff2 = this.add.circle(-15, 4, 15, 0xffffff, 0.9);
      const puff3 = this.add.circle(15, 4, 15, 0xffffff, 0.9);
      const puff4 = this.add.circle(0, 8, 18, 0xffffff, 0.9);
      
      cloud.add([puff1, puff2, puff3, puff4]);
      cloud.setScale(pos.scale);
      cloud.setDepth(-18);
      
      this.tweens.add({
        targets: cloud,
        x: pos.x + 25,
        duration: 5000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });
  }

  setupEventListeners() {
    this.onApeWhacked = ({ holeIndex, isGolden, x, y }) => {
      const points = isGolden ? APE.POINTS_GOLDEN : APE.POINTS_NORMAL;
      const actualPoints = gameState.addScore(points);
      gameState.incrementCombo();
      gameState.recordWhack(isGolden);
      
      // Track points with Play.fun
      PlayFunManager.addPoints(actualPoints);
      
      eventBus.emit(Events.SCORE_CHANGED, { 
        score: gameState.score, 
        delta: actualPoints,
        x, y,
        isGolden,
      });
      eventBus.emit(Events.COMBO_CHANGED, { combo: gameState.combo });
      
      if (isGolden) {
        this.cameras.main.shake(150, 0.015);
      }
    };
    eventBus.on(Events.APE_WHACKED, this.onApeWhacked);
    
    this.onApeEscaped = ({ holeIndex }) => {
      gameState.recordEscape();
      eventBus.emit(Events.COMBO_CHANGED, { combo: 0 });
    };
    eventBus.on(Events.APE_ESCAPED, this.onApeEscaped);
    
    this.onApeHide = ({ holeIndex }) => {
      this.occupiedHoles.delete(holeIndex);
      this.activeApes = this.activeApes.filter(ape => ape.holeIndex !== holeIndex);
    };
    eventBus.on(Events.APE_HIDE, this.onApeHide);
    
    this.events.on('shutdown', () => {
      eventBus.off(Events.APE_WHACKED, this.onApeWhacked);
      eventBus.off(Events.APE_ESCAPED, this.onApeEscaped);
      eventBus.off(Events.APE_HIDE, this.onApeHide);
    });
  }

  spawnApe() {
    if (gameState.gameOver) return;
    if (this.activeApes.length >= APE.MAX_ACTIVE) return;
    
    const availableHoles = [];
    for (let i = 0; i < GRID.COLS * GRID.ROWS; i++) {
      if (!this.occupiedHoles.has(i)) {
        availableHoles.push(i);
      }
    }
    
    if (availableHoles.length === 0) return;
    
    const holeIndex = Phaser.Utils.Array.GetRandom(availableHoles);
    const isGolden = Math.random() < APE.GOLDEN_CHANCE;
    
    this.occupiedHoles.add(holeIndex);
    const ape = new Ape(this, holeIndex, isGolden);
    this.activeApes.push(ape);
    
    if (this.spawnTimer) {
      this.spawnTimer.delay = Phaser.Math.Between(APE.SPAWN_INTERVAL_MIN, APE.SPAWN_INTERVAL_MAX);
    }
  }

  updateTimer() {
    if (gameState.gameOver) return;
    
    gameState.timeRemaining--;
    eventBus.emit(Events.TIME_UPDATE, { time: gameState.timeRemaining });
    
    if (gameState.timeRemaining <= 5) {
      eventBus.emit(Events.TIME_WARNING);
    }
    
    if (gameState.timeRemaining <= 0) {
      this.endGame();
    }
  }

  endGame() {
    gameState.gameOver = true;
    
    if (this.spawnTimer) this.spawnTimer.remove();
    if (this.gameTimer) this.gameTimer.remove();
    
    this.cameras.main.flash(300, 255, 100, 100);
    this.cameras.main.shake(400, 0.02);
    
    this.time.timeScale = 0.3;
    this.time.delayedCall(200, () => {
      this.time.timeScale = 1;
    });
    
    this.activeApes.forEach(ape => ape.destroy());
    this.activeApes = [];
    
    if (this.hammer) this.hammer.destroy();
    
    eventBus.emit(Events.GAME_OVER, { 
      score: gameState.score,
      apesWhacked: gameState.apesWhacked,
      maxCombo: gameState.maxCombo,
    });
    
    this.time.delayedCall(800, () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop('UIScene');
        this.scene.start('GameOverScene');
      });
    });
  }

  update() {
  }
}
