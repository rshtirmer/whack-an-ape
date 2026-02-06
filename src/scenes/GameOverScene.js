// Whack an Ape - Game Over Scene (Portrait Mobile)
import Phaser from 'phaser';
import { GAME, COLORS, JUICE } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    const cx = GAME.WIDTH / 2;
    const cy = GAME.HEIGHT / 2;

    this.createBackground();

    this.createTitle(cx, cy - 350);

    this.createScoreDisplay(cx, cy - 180);

    this.createStats(cx, cy - 20);

    const isNewBest = gameState.score >= gameState.bestScore && gameState.score > 0;
    if (isNewBest) {
      this.celebrateNewBest(cx, cy + 140);
    } else {
      this.showBestScore(cx, cy + 140);
    }

    this.createRestartButton(cx, cy + 260);

    const instruction = this.add.text(cx, cy + 380, 'Tap button or press SPACE', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#666666',
    }).setOrigin(0.5);
    instruction.setAlpha(0);
    this.tweens.add({
      targets: instruction,
      alpha: 1,
      duration: 500,
      delay: 1200,
    });

    this.input.keyboard.once('keydown-SPACE', () => this.restartGame());

    this.cameras.main.fadeIn(400, 0, 0, 0);

    eventBus.emit(Events.MUSIC_GAMEOVER);
  }

  createBackground() {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x0f0f1a, 0x0f0f1a);
    bg.fillRect(0, 0, GAME.WIDTH, GAME.HEIGHT);

    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 0.4);
    vignette.fillRect(0, 0, GAME.WIDTH, 120);
    vignette.fillRect(0, GAME.HEIGHT - 120, GAME.WIDTH, 120);

    for (let i = 0; i < 12; i++) {
      const x = Phaser.Math.Between(0, GAME.WIDTH);
      const delay = Math.random() * 3000;
      
      this.time.addEvent({
        delay: delay,
        callback: () => this.createFallingParticle(x),
        loop: true,
      });
    }
  }

  createFallingParticle(startX) {
    const particle = this.add.circle(startX, -10, 3, 0x666666, 0.5);
    
    this.tweens.add({
      targets: particle,
      y: GAME.HEIGHT + 10,
      x: startX + Phaser.Math.Between(-30, 30),
      duration: 3000 + Math.random() * 2000,
      onComplete: () => particle.destroy(),
    });
  }

  createTitle(x, y) {
    this.add.text(x + 3, y + 3, "TIME'S UP!", {
      fontSize: '56px',
      fontFamily: 'Impact, monospace',
      color: '#000000',
    }).setOrigin(0.5);
    
    const title = this.add.text(x, y, "TIME'S UP!", {
      fontSize: '56px',
      fontFamily: 'Impact, monospace',
      color: '#ff6b6b',
    }).setOrigin(0.5);

    title.setScale(3);
    title.setAlpha(0);
    this.tweens.add({
      targets: title,
      scaleX: 1,
      scaleY: 1,
      alpha: 1,
      duration: 300,
      ease: 'Back.easeOut',
    });

    this.time.delayedCall(300, () => {
      this.cameras.main.shake(200, 0.02);
    });
  }

  createScoreDisplay(x, y) {
    const label = this.add.text(x, y - 40, 'FINAL SCORE', {
      fontSize: '22px',
      fontFamily: 'monospace',
      color: '#888888',
    }).setOrigin(0.5);
    label.setAlpha(0);

    const scoreText = this.add.text(x, y + 20, '0', {
      fontSize: '64px',
      fontFamily: 'Impact, monospace',
      color: '#ffd700',
    }).setOrigin(0.5);
    scoreText.setAlpha(0);

    this.tweens.add({
      targets: [label, scoreText],
      alpha: 1,
      duration: 400,
      delay: 400,
    });

    this.time.delayedCall(500, () => {
      let currentScore = 0;
      const targetScore = gameState.score;
      const duration = Math.min(1500, targetScore * 20);
      const steps = Math.min(60, targetScore);
      const increment = targetScore / steps;
      
      this.time.addEvent({
        delay: duration / steps,
        callback: () => {
          currentScore = Math.min(currentScore + increment, targetScore);
          scoreText.setText(Math.floor(currentScore).toString());
          
          this.tweens.add({
            targets: scoreText,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 30,
            yoyo: true,
          });
        },
        repeat: steps - 1,
      });
    });
  }

  createStats(x, y) {
    const statsStyle = {
      fontSize: '22px',
      fontFamily: 'monospace',
      color: '#aaaaaa',
    };

    const stats = [
      { text: `🦧 Apes Whacked: ${gameState.apesWhacked}`, delay: 800 },
      { text: `✨ Golden Apes: ${gameState.goldenWhacked}`, delay: 950, color: '#ffd700' },
      { text: `🔥 Max Combo: ${gameState.maxCombo}x`, delay: 1100, color: '#ff8800' },
    ];

    stats.forEach((stat, i) => {
      const text = this.add.text(x, y + (i * 40), stat.text, {
        ...statsStyle,
        color: stat.color || statsStyle.color,
      }).setOrigin(0.5);
      
      text.setAlpha(0);
      text.setX(x - 60);
      
      this.tweens.add({
        targets: text,
        alpha: 1,
        x: x,
        duration: 300,
        delay: stat.delay,
        ease: 'Quad.easeOut',
      });
    });
  }

  celebrateNewBest(x, y) {
    const text = this.add.text(x, y, '🎉 NEW BEST! 🎉', {
      fontSize: '36px',
      fontFamily: 'Impact, monospace',
      color: '#00ff00',
    }).setOrigin(0.5);

    text.setAlpha(0);
    text.setScale(0);

    this.tweens.add({
      targets: text,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      delay: 1300,
      ease: 'Back.easeOut',
    });

    this.tweens.add({
      targets: text,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 400,
      yoyo: true,
      repeat: -1,
      delay: 1700,
    });

    this.time.delayedCall(1400, () => {
      this.emitConfetti(x, y);
    });
  }

  emitConfetti(x, y) {
    const colors = [0xff6b6b, 0xffd700, 0x00ff00, 0x00bfff, 0xff00ff];
    
    for (let i = 0; i < 40; i++) {
      const color = Phaser.Utils.Array.GetRandom(colors);
      const angle = (Math.PI * 2 * i) / 40 + Math.random() * 0.3;
      const speed = 120 + Math.random() * 120;
      
      const confetti = this.add.rectangle(x, y, 10, 10, color);
      confetti.setAngle(Math.random() * 360);
      
      this.tweens.add({
        targets: confetti,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed + 150,
        angle: confetti.angle + 360,
        alpha: 0,
        duration: 1800,
        ease: 'Quad.easeOut',
        onComplete: () => confetti.destroy(),
      });
    }
  }

  showBestScore(x, y) {
    const text = this.add.text(x, y, `Best: ${gameState.bestScore}`, {
      fontSize: '24px',
      fontFamily: 'monospace',
      color: '#666666',
    }).setOrigin(0.5);
    
    text.setAlpha(0);
    this.tweens.add({
      targets: text,
      alpha: 1,
      duration: 400,
      delay: 1300,
    });
  }

  createRestartButton(x, y) {
    const btn = this.add.rectangle(x, y, 280, 70, COLORS.BUTTON);
    btn.setStrokeStyle(3, 0x654321);
    btn.setInteractive({ useHandCursor: true });

    const btnText = this.add.text(x, y, '🔨 PLAY AGAIN', {
      fontSize: '28px',
      fontFamily: 'Impact, monospace',
      color: '#ffffff',
    }).setOrigin(0.5);

    btn.setScale(0);
    btnText.setScale(0);
    this.tweens.add({
      targets: [btn, btnText],
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      ease: 'Back.easeOut',
      delay: 1500,
    });

    btn.on('pointerover', () => {
      this.tweens.add({
        targets: [btn, btnText],
        scaleX: JUICE.BUTTON_HOVER_SCALE,
        scaleY: JUICE.BUTTON_HOVER_SCALE,
        duration: 100,
      });
      btn.setFillStyle(COLORS.BUTTON_HOVER);
    });

    btn.on('pointerout', () => {
      this.tweens.add({
        targets: [btn, btnText],
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
      btn.setFillStyle(COLORS.BUTTON);
    });

    btn.on('pointerdown', () => {
      this.tweens.add({
        targets: [btn, btnText],
        scaleX: JUICE.BUTTON_PRESS_SCALE,
        scaleY: JUICE.BUTTON_PRESS_SCALE,
        duration: 50,
      });
    });

    btn.on('pointerup', () => this.restartGame());
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
