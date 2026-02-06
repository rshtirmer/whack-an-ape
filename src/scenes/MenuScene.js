// Whack an Ape - Menu Scene (Polished)
import Phaser from 'phaser';
import { GAME, COLORS, JUICE } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const cx = GAME.WIDTH / 2;
    const cy = GAME.HEIGHT / 2;

    this.createBackground();
    this.createTitle(cx, 180);
    this.createPreviewApe(cx, cy - 60);
    this.createBestScore(cx, cy + 140);
    this.createPlayButton(cx, cy + 260);
    this.createInstructions(cx, cy + 400);

    // Input handlers
    this.input.keyboard.once('keydown-SPACE', () => this.startGame());
    this.time.delayedCall(500, () => {
      this.input.once('pointerdown', () => this.startGame());
    });

    this.cameras.main.fadeIn(400, 0, 0, 0);
    eventBus.emit(Events.MUSIC_MENU);
  }

  createBackground() {
    // Dark gradient base
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a472a, 0x1a472a, 0x0d2818, 0x0d2818);
    bg.fillRect(0, 0, GAME.WIDTH, GAME.HEIGHT);

    // Radial glow behind ape
    const glow = this.add.graphics();
    glow.fillStyle(0x2d5a27, 0.4);
    glow.fillCircle(GAME.WIDTH / 2, GAME.HEIGHT / 2 - 60, 200);
    glow.fillStyle(0x3d7a37, 0.2);
    glow.fillCircle(GAME.WIDTH / 2, GAME.HEIGHT / 2 - 60, 280);

    // Floating particles
    for (let i = 0; i < 25; i++) {
      const x = Phaser.Math.Between(0, GAME.WIDTH);
      const y = Phaser.Math.Between(0, GAME.HEIGHT);
      const size = Phaser.Math.Between(2, 4);
      const particle = this.add.circle(x, y, size, 0xffd700, 0.2);
      
      this.tweens.add({
        targets: particle,
        y: y - 200,
        alpha: 0,
        duration: 5000 + Math.random() * 3000,
        repeat: -1,
        delay: Math.random() * 3000,
        onRepeat: () => {
          particle.y = GAME.HEIGHT + 20;
          particle.alpha = 0.2;
          particle.x = Phaser.Math.Between(0, GAME.WIDTH);
        }
      });
    }

    // Subtle vignette
    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 0.3);
    vignette.fillRect(0, 0, GAME.WIDTH, 80);
    vignette.fillRect(0, GAME.HEIGHT - 80, GAME.WIDTH, 80);
  }

  createTitle(x, y) {
    // Outer glow effect
    const glowText = this.add.text(x, y, 'WHACK AN APE', {
      fontSize: '54px',
      fontFamily: 'Impact, Arial Black, sans-serif',
      color: '#ff8c00',
    }).setOrigin(0.5).setAlpha(0.3).setScale(1.05);

    // Shadow
    const shadow = this.add.text(x + 3, y + 3, 'WHACK AN APE', {
      fontSize: '54px',
      fontFamily: 'Impact, Arial Black, sans-serif',
      color: '#000000',
    }).setOrigin(0.5);
    
    // Main title
    const title = this.add.text(x, y, 'WHACK AN APE', {
      fontSize: '54px',
      fontFamily: 'Impact, Arial Black, sans-serif',
      color: '#ffd700',
    }).setOrigin(0.5);

    // Hammer icons
    const hammer1 = this.add.text(x - 220, y, '🔨', { fontSize: '40px' }).setOrigin(0.5);
    const hammer2 = this.add.text(x + 220, y, '🔨', { fontSize: '40px' }).setOrigin(0.5).setFlipX(true);

    // Animate in
    [glowText, shadow, title, hammer1, hammer2].forEach(obj => obj.setScale(0));
    
    this.tweens.add({
      targets: [glowText, shadow, title],
      scaleX: 1,
      scaleY: 1,
      duration: 600,
      ease: 'Back.easeOut',
    });

    this.tweens.add({
      targets: [hammer1, hammer2],
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      ease: 'Back.easeOut',
      delay: 300,
    });

    // Subtle pulse
    this.tweens.add({
      targets: [title, glowText],
      scaleX: 1.03,
      scaleY: 1.03,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 800,
    });

    // Hammer wiggle
    this.tweens.add({
      targets: hammer1,
      angle: -15,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 1000,
    });
    this.tweens.add({
      targets: hammer2,
      angle: 15,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 1200,
    });
  }

  createPreviewApe(x, y) {
    // Platform/pedestal
    const platform = this.add.ellipse(x, y + 70, 160, 30, 0x1a3a17);
    platform.setAlpha(0.8);

    // Ape sprite
    const ape = this.add.sprite(x, y, 'ape-normal-img');
    ape.setScale(0);
    
    this.tweens.add({
      targets: ape,
      scaleX: 0.32,
      scaleY: 0.32,
      duration: 500,
      ease: 'Back.easeOut',
      delay: 200,
    });
    
    // Idle bob animation
    this.tweens.add({
      targets: ape,
      y: y - 15,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 700,
    });

    // Occasional blink/squish
    this.time.addEvent({
      delay: 2500,
      callback: () => {
        this.tweens.add({
          targets: ape,
          scaleY: 0.28,
          scaleX: 0.35,
          duration: 100,
          yoyo: true,
        });
      },
      loop: true,
    });
  }

  createBestScore(x, y) {
    if (gameState.bestScore > 0) {
      // Trophy container
      const container = this.add.container(x, y);
      
      const bg = this.add.rectangle(0, 0, 220, 50, 0x000000, 0.3);
      bg.setStrokeStyle(2, 0xffd700, 0.5);
      
      const text = this.add.text(0, 0, `🏆 BEST: ${gameState.bestScore}`, {
        fontSize: '24px',
        fontFamily: 'Impact, Arial Black, sans-serif',
        color: '#ffd700',
      }).setOrigin(0.5);
      
      container.add([bg, text]);
      container.setAlpha(0);
      container.setScale(0.8);
      
      this.tweens.add({
        targets: container,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 400,
        delay: 600,
        ease: 'Back.easeOut',
      });
    }
  }

  createPlayButton(x, y) {
    // Button glow
    const btnGlow = this.add.rectangle(x, y, 300, 75, 0xffa500, 0.3);
    btnGlow.setStrokeStyle(0);
    
    // Main button
    const btn = this.add.rectangle(x, y, 280, 65, 0xd35400);
    btn.setStrokeStyle(3, 0xffa500);
    btn.setInteractive({ useHandCursor: true });

    // Button highlight (top edge)
    const highlight = this.add.rectangle(x, y - 25, 270, 8, 0xffffff, 0.2);

    const btnText = this.add.text(x, y, 'PLAY', {
      fontSize: '36px',
      fontFamily: 'Impact, Arial Black, sans-serif',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Animate in
    [btnGlow, btn, highlight, btnText].forEach(obj => obj.setScale(0));
    
    this.tweens.add({
      targets: [btnGlow, btn, highlight, btnText],
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      ease: 'Back.easeOut',
      delay: 500,
    });

    // Pulse glow
    this.tweens.add({
      targets: btnGlow,
      scaleX: 1.1,
      scaleY: 1.2,
      alpha: 0.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      delay: 1000,
    });

    btn.on('pointerover', () => {
      this.tweens.add({
        targets: [btn, btnText, highlight],
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 100,
      });
      btn.setFillStyle(0xe67e22);
    });

    btn.on('pointerout', () => {
      this.tweens.add({
        targets: [btn, btnText, highlight],
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
      btn.setFillStyle(0xd35400);
    });

    btn.on('pointerdown', () => {
      this.tweens.add({
        targets: [btn, btnText, highlight],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
      });
    });

    btn.on('pointerup', () => this.startGame());
  }

  createInstructions(x, y) {
    const instruction = this.add.text(x, y, 'Tap the apes before they escape!', {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      color: '#88aa88',
    }).setOrigin(0.5);
    
    instruction.setAlpha(0);
    this.tweens.add({
      targets: instruction,
      alpha: 0.8,
      duration: 600,
      delay: 800,
    });

    const hint = this.add.text(x, y + 40, '— tap anywhere to start —', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#668866',
      fontStyle: 'italic',
    }).setOrigin(0.5);
    
    hint.setAlpha(0);
    this.tweens.add({
      targets: hint,
      alpha: 0.6,
      duration: 600,
      delay: 1000,
    });

    this.tweens.add({
      targets: hint,
      alpha: 0.3,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      delay: 1600,
    });
  }

  startGame() {
    this.input.enabled = false;
    eventBus.emit(Events.MUSIC_STOP);
    
    this.cameras.main.flash(200, 255, 255, 255);
    this.cameras.main.fadeOut(300, 0, 0, 0);
    
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene');
      this.scene.launch('UIScene');
    });
  }
}
