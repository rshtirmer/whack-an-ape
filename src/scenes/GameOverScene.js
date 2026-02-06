// Whack an Ape - Game Over Scene (Polished)
import Phaser from 'phaser';
import { GAME, COLORS, JUICE } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { PlayFunManager } from '../playfun/PlayFunManager.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    const cx = GAME.WIDTH / 2;
    const cy = GAME.HEIGHT / 2;

    this.createBackground();
    this.createHeader(cx, 140);
    this.createScoreCard(cx, cy - 80);
    this.createStatsPanel(cx, cy + 180);
    this.createButtons(cx, cy + 400);

    this.input.keyboard.once('keydown-SPACE', () => this.restartGame());
    this.cameras.main.fadeIn(400, 0, 0, 0);
    eventBus.emit(Events.MUSIC_GAMEOVER);
    
    // Save points to Play.fun
    PlayFunManager.savePoints().then((saved) => {
      if (saved) console.log('[GameOver] Points saved to Play.fun!');
    });
  }

  createBackground() {
    // Dark blue gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x0f0f23);
    bg.fillRect(0, 0, GAME.WIDTH, GAME.HEIGHT);

    // Ambient particles
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, GAME.WIDTH);
      const y = Phaser.Math.Between(0, GAME.HEIGHT);
      const size = Phaser.Math.Between(1, 3);
      const alpha = 0.1 + Math.random() * 0.2;
      const particle = this.add.circle(x, y, size, 0x4a69bd, alpha);
      
      this.tweens.add({
        targets: particle,
        y: y - 100,
        alpha: 0,
        duration: 4000 + Math.random() * 3000,
        repeat: -1,
        delay: Math.random() * 2000,
        onRepeat: () => {
          particle.y = GAME.HEIGHT + 10;
          particle.alpha = alpha;
          particle.x = Phaser.Math.Between(0, GAME.WIDTH);
        }
      });
    }
  }

  createHeader(x, y) {
    // "TIME'S UP" with impact
    const shadow = this.add.text(x + 3, y + 3, "TIME'S UP!", {
      fontSize: '52px',
      fontFamily: 'Impact, Arial Black, sans-serif',
      color: '#000000',
    }).setOrigin(0.5);
    
    const title = this.add.text(x, y, "TIME'S UP!", {
      fontSize: '52px',
      fontFamily: 'Impact, Arial Black, sans-serif',
      color: '#e74c3c',
    }).setOrigin(0.5);

    // Animate in with impact
    [shadow, title].forEach(t => {
      t.setScale(2.5);
      t.setAlpha(0);
    });

    this.tweens.add({
      targets: [shadow, title],
      scaleX: 1,
      scaleY: 1,
      alpha: 1,
      duration: 400,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.cameras.main.shake(150, 0.015);
      }
    });

    // Sad ape
    const ape = this.add.sprite(x, y + 90, 'ape-normal-img');
    ape.setScale(0);
    ape.setTint(0xaaaaaa); // Slightly desaturated
    
    this.tweens.add({
      targets: ape,
      scaleX: 0.18,
      scaleY: 0.18,
      duration: 400,
      delay: 300,
      ease: 'Back.easeOut',
    });

    // Gentle sway
    this.tweens.add({
      targets: ape,
      angle: 5,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 700,
    });
  }

  createScoreCard(x, y) {
    // Card background
    const card = this.add.rectangle(x, y, 340, 180, 0x0f0f1a, 0.9);
    card.setStrokeStyle(3, 0xffd700, 0.8);
    card.setScale(0);

    this.tweens.add({
      targets: card,
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      delay: 400,
      ease: 'Back.easeOut',
    });

    // "FINAL SCORE" label
    const label = this.add.text(x, y - 55, 'FINAL SCORE', {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      color: '#888888',
      letterSpacing: 4,
    }).setOrigin(0.5);
    label.setAlpha(0);

    // Score number
    const scoreText = this.add.text(x, y + 5, '0', {
      fontSize: '72px',
      fontFamily: 'Impact, Arial Black, sans-serif',
      color: '#ffd700',
    }).setOrigin(0.5);
    scoreText.setAlpha(0);

    // Animate label and score
    this.tweens.add({
      targets: label,
      alpha: 1,
      duration: 300,
      delay: 600,
    });

    this.tweens.add({
      targets: scoreText,
      alpha: 1,
      duration: 300,
      delay: 700,
    });

    // Count up animation
    this.time.delayedCall(800, () => {
      const targetScore = gameState.score;
      if (targetScore === 0) {
        scoreText.setText('0');
        return;
      }
      
      let current = 0;
      const steps = Math.min(40, targetScore);
      const increment = targetScore / steps;
      const stepTime = Math.min(40, 1200 / steps);
      
      this.time.addEvent({
        delay: stepTime,
        callback: () => {
          current = Math.min(current + increment, targetScore);
          scoreText.setText(Math.floor(current).toString());
        },
        repeat: steps - 1,
      });
    });

    // New best indicator
    const isNewBest = gameState.score >= gameState.bestScore && gameState.score > 0;
    if (isNewBest) {
      const newBest = this.add.text(x, y + 60, '⭐ NEW BEST! ⭐', {
        fontSize: '22px',
        fontFamily: 'Impact, Arial Black, sans-serif',
        color: '#2ecc71',
      }).setOrigin(0.5);
      newBest.setAlpha(0);
      newBest.setScale(0.5);

      this.tweens.add({
        targets: newBest,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 400,
        delay: 1400,
        ease: 'Back.easeOut',
      });

      this.tweens.add({
        targets: newBest,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 500,
        yoyo: true,
        repeat: -1,
        delay: 1800,
      });

      // Confetti burst
      this.time.delayedCall(1500, () => this.emitConfetti(x, y));
    } else if (gameState.bestScore > 0) {
      const best = this.add.text(x, y + 60, `Best: ${gameState.bestScore}`, {
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif',
        color: '#666666',
      }).setOrigin(0.5);
      best.setAlpha(0);

      this.tweens.add({
        targets: best,
        alpha: 0.8,
        duration: 400,
        delay: 1400,
      });
    }
  }

  createStatsPanel(x, y) {
    const stats = [
      { icon: '🦧', label: 'Apes Whacked', value: gameState.apesWhacked, color: '#ffffff' },
      { icon: '✨', label: 'Golden Apes', value: gameState.goldenWhacked, color: '#ffd700' },
      { icon: '🔥', label: 'Max Combo', value: `${gameState.maxCombo}x`, color: '#e74c3c' },
    ];

    stats.forEach((stat, i) => {
      const yPos = y + (i * 50);
      
      // Stat row background
      const rowBg = this.add.rectangle(x, yPos, 280, 40, 0x000000, 0.3);
      rowBg.setAlpha(0);

      // Icon
      const icon = this.add.text(x - 120, yPos, stat.icon, {
        fontSize: '22px',
      }).setOrigin(0.5);
      icon.setAlpha(0);

      // Label
      const label = this.add.text(x - 40, yPos, stat.label, {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        color: '#aaaaaa',
      }).setOrigin(0, 0.5);
      label.setAlpha(0);

      // Value
      const value = this.add.text(x + 120, yPos, stat.value.toString(), {
        fontSize: '22px',
        fontFamily: 'Impact, Arial Black, sans-serif',
        color: stat.color,
      }).setOrigin(1, 0.5);
      value.setAlpha(0);

      // Staggered animation
      const delay = 1000 + (i * 150);
      
      this.tweens.add({
        targets: [rowBg, icon, label, value],
        alpha: 1,
        duration: 300,
        delay: delay,
      });

      // Slide in from left
      [icon, label].forEach(obj => obj.setX(obj.x - 40));
      value.setX(value.x + 40);
      
      this.tweens.add({
        targets: [icon, label],
        x: '+=40',
        duration: 300,
        delay: delay,
        ease: 'Quad.easeOut',
      });
      
      this.tweens.add({
        targets: value,
        x: '-=40',
        duration: 300,
        delay: delay,
        ease: 'Quad.easeOut',
      });
    });
  }

  createButtons(x, y) {
    // Play Again button
    const btnGlow = this.add.rectangle(x, y, 260, 60, 0x27ae60, 0.3);
    const btn = this.add.rectangle(x, y, 240, 50, 0x27ae60);
    btn.setStrokeStyle(2, 0x2ecc71);
    btn.setInteractive({ useHandCursor: true });

    const btnText = this.add.text(x, y, 'PLAY AGAIN', {
      fontSize: '26px',
      fontFamily: 'Impact, Arial Black, sans-serif',
      color: '#ffffff',
    }).setOrigin(0.5);

    [btnGlow, btn, btnText].forEach(obj => obj.setScale(0));

    this.tweens.add({
      targets: [btnGlow, btn, btnText],
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      delay: 1600,
      ease: 'Back.easeOut',
    });

    // Pulse
    this.tweens.add({
      targets: btnGlow,
      scaleX: 1.15,
      scaleY: 1.3,
      alpha: 0,
      duration: 1200,
      repeat: -1,
      delay: 2000,
    });

    btn.on('pointerover', () => {
      this.tweens.add({
        targets: [btn, btnText],
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 100,
      });
      btn.setFillStyle(0x2ecc71);
    });

    btn.on('pointerout', () => {
      this.tweens.add({
        targets: [btn, btnText],
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
      btn.setFillStyle(0x27ae60);
    });

    btn.on('pointerdown', () => {
      this.tweens.add({
        targets: [btn, btnText],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
      });
    });

    btn.on('pointerup', () => this.restartGame());

    // Hint text
    const hint = this.add.text(x, y + 60, 'or press SPACE', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#555555',
      fontStyle: 'italic',
    }).setOrigin(0.5);
    hint.setAlpha(0);

    this.tweens.add({
      targets: hint,
      alpha: 0.6,
      duration: 400,
      delay: 1800,
    });
  }

  emitConfetti(x, y) {
    const colors = [0xffd700, 0x2ecc71, 0xe74c3c, 0x3498db, 0xf39c12];
    
    for (let i = 0; i < 50; i++) {
      const color = Phaser.Utils.Array.GetRandom(colors);
      const angle = (Math.PI * 2 * i) / 50 + Math.random() * 0.5;
      const speed = 150 + Math.random() * 150;
      const size = 4 + Math.random() * 6;
      
      const confetti = this.add.rectangle(x, y, size, size * 1.5, color);
      confetti.setAngle(Math.random() * 360);
      
      this.tweens.add({
        targets: confetti,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed + 200,
        angle: confetti.angle + 720,
        alpha: 0,
        duration: 2000,
        ease: 'Quad.easeOut',
        onComplete: () => confetti.destroy(),
      });
    }
  }

  restartGame() {
    this.input.enabled = false;
    eventBus.emit(Events.GAME_RESTART);
    eventBus.emit(Events.MUSIC_STOP);
    
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MenuScene');
    });
  }
}
