// Whack an Ape - Menu Scene (Portrait Mobile)
import Phaser from 'phaser';
import { GAME, COLORS, JUICE } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
// Using loaded ape image assets

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const cx = GAME.WIDTH / 2;
    const cy = GAME.HEIGHT / 2;

    // Animated background
    this.createAnimatedBackground();

    // Title
    this.createTitle(cx, cy - 280);

    // Subtitle
    const subtitle = this.add.text(cx, cy - 180, '🦧 Bored Ape Yacht Club Edition 🦧', {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#aaaaaa',
      fontStyle: 'italic',
    }).setOrigin(0.5);
    
    subtitle.setAlpha(0);
    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      duration: 800,
      delay: 400,
    });

    // Preview ape
    this.createPreviewApe(cx, cy);

    // Best score
    if (gameState.bestScore > 0) {
      const bestScore = this.add.text(cx, cy + 180, `🏆 Best: ${gameState.bestScore}`, {
        fontSize: '28px',
        fontFamily: 'Impact, monospace',
        color: '#ffd700',
      }).setOrigin(0.5);
      
      bestScore.setAlpha(0);
      this.tweens.add({
        targets: bestScore,
        alpha: 1,
        duration: 600,
        delay: 600,
      });
    }

    // Play button
    this.createPlayButton(cx, cy + 280);

    // Instruction
    const prompt = this.add.text(cx, cy + 380, '🎯 Tap the apes before they escape!', {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#888888',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0.5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    // Touch instruction for mobile
    const touchHint = this.add.text(cx, cy + 420, '👆 Tap anywhere to start', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#666666',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: touchHint,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
      delay: 500,
    });

    // Keyboard start
    this.input.keyboard.once('keydown-SPACE', () => this.startGame());
    
    // Touch anywhere to start (after delay)
    this.time.delayedCall(500, () => {
      this.input.once('pointerdown', () => this.startGame());
    });

    // Fade in
    this.cameras.main.fadeIn(400, 0, 0, 0);

    eventBus.emit(Events.MUSIC_MENU);
  }

  createAnimatedBackground() {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x2d5a27, 0x2d5a27, 0x1a3a17, 0x1a3a17);
    bg.fillRect(0, 0, GAME.WIDTH, GAME.HEIGHT);

    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0, GAME.WIDTH);
      const y = Phaser.Math.Between(0, GAME.HEIGHT);
      const size = Phaser.Math.Between(2, 5);
      const particle = this.add.circle(x, y, size, 0xffd700, 0.3);
      
      this.tweens.add({
        targets: particle,
        y: y - 150,
        alpha: 0,
        duration: 4000 + Math.random() * 2000,
        repeat: -1,
        delay: Math.random() * 2000,
        onRepeat: () => {
          particle.y = GAME.HEIGHT + 20;
          particle.alpha = 0.3;
          particle.x = Phaser.Math.Between(0, GAME.WIDTH);
        }
      });
    }
  }

  createTitle(x, y) {
    const shadow = this.add.text(x + 4, y + 4, 'WHACK AN APE', {
      fontSize: '52px',
      fontFamily: 'Impact, monospace',
      color: '#000000',
    }).setOrigin(0.5);
    
    const title = this.add.text(x, y, 'WHACK AN APE', {
      fontSize: '52px',
      fontFamily: 'Impact, monospace',
      color: '#ffd700',
    }).setOrigin(0.5);

    title.setScale(0);
    shadow.setScale(0);
    
    this.tweens.add({
      targets: [title, shadow],
      scaleX: 1,
      scaleY: 1,
      duration: 500,
      ease: 'Back.easeOut',
    });

    this.tweens.add({
      targets: title,
      scaleX: 1.02,
      scaleY: 1.02,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 500,
    });
  }

  createPreviewApe(x, y) {
    // Use loaded BAYC ape image
    const ape = this.add.sprite(x, y, 'ape-normal-img');
    ape.setScale(0); // Start at 0 for pop-in animation
    
    this.tweens.add({
      targets: ape,
      scaleX: 0.28,
      scaleY: 0.28,
      duration: 400,
      ease: 'Back.easeOut',
      delay: 200,
    });
    
    this.tweens.add({
      targets: ape,
      y: y - 20,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 600,
    });

    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.tweens.add({
          targets: ape,
          scaleY: 0.9,
          duration: 80,
          yoyo: true,
        });
      },
      loop: true,
    });
  }

  createPlayButton(x, y) {
    const btn = this.add.rectangle(x, y, 320, 80, COLORS.BUTTON);
    btn.setStrokeStyle(4, 0x654321);
    btn.setInteractive({ useHandCursor: true });

    const btnText = this.add.text(x, y, '🔨 START WHACKING', {
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
      delay: 400,
    });

    btn.on('pointerover', () => {
      this.tweens.add({
        targets: [btn, btnText],
        scaleX: JUICE.BUTTON_HOVER_SCALE,
        scaleY: JUICE.BUTTON_HOVER_SCALE,
        duration: 100,
        ease: 'Quad.easeOut',
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

    btn.on('pointerup', () => {
      this.startGame();
    });

    this.tweens.add({
      targets: btn,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 1500,
    });
  }

  startGame() {
    this.input.enabled = false;
    
    eventBus.emit(Events.MUSIC_STOP);
    
    this.cameras.main.zoomTo(1.2, 300);
    this.cameras.main.fadeOut(300, 0, 0, 0);
    
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene');
      this.scene.launch('UIScene');
    });
  }
}
