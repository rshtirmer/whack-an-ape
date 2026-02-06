// Whack an Ape - Ape Entity (Image-based sprites)
import Phaser from 'phaser';
import { APE, GRID } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';

export class Ape {
  constructor(scene, holeIndex, isGolden = false) {
    this.scene = scene;
    this.holeIndex = holeIndex;
    this.isGolden = isGolden;
    this.isWhacked = false;
    this.isHiding = false;
    
    // Calculate position from hole index
    const col = holeIndex % GRID.COLS;
    const row = Math.floor(holeIndex / GRID.COLS);
    this.x = GRID.OFFSET_X + col * GRID.HOLE_SPACING_X;
    this.y = GRID.OFFSET_Y + row * GRID.HOLE_SPACING_Y;
    
    // Use loaded image textures
    const texKey = isGolden ? 'ape-golden-img' : 'ape-normal-img';
    
    // Create sprite - scale down from 500x500 to fit holes (~80px)
    this.sprite = scene.add.sprite(this.x, this.y + 60, texKey);
    this.sprite.setScale(0.16); // 500 * 0.16 = 80px
    this.sprite.setDepth(10);
    this.sprite.setInteractive({ useHandCursor: true });
    
    // Store texture key
    this.texKey = texKey;
    
    // Click/tap handler
    this.sprite.on('pointerdown', () => this.onWhack());
    
    // Add sparkles for golden apes
    if (isGolden) {
      this.addSparkles();
    }
    
    // Start hidden, then pop up
    this.sprite.setScale(0.16, 0);
    this.popUp();
  }

  addSparkles() {
    // Create sparkle particles around the golden ape
    this.sparkles = [];
    const sparklePositions = [
      { x: -35, y: -40 },
      { x: 35, y: -40 },
      { x: -40, y: 0 },
      { x: 40, y: 0 },
    ];
    
    sparklePositions.forEach((pos, i) => {
      const sparkle = this.scene.add.star(
        this.x + pos.x, 
        this.y + pos.y, 
        4, 4, 8, 
        0xffd700
      );
      sparkle.setDepth(11);
      this.sparkles.push(sparkle);
      
      // Twinkling animation
      this.scene.tweens.add({
        targets: sparkle,
        alpha: 0.3,
        scaleX: 0.5,
        scaleY: 0.5,
        duration: 300,
        yoyo: true,
        repeat: -1,
        delay: i * 100,
      });
    });
  }

  popUp() {
    this.scene.tweens.add({
      targets: this.sprite,
      scaleY: 0.16,
      y: this.y - 10,
      duration: APE.POP_UP_DURATION,
      ease: 'Back.easeOut',
      onComplete: () => {
        if (!this.isWhacked) {
          this.scheduleHide();
        }
      },
    });
    
    // Move sparkles with ape
    if (this.sparkles) {
      this.sparkles.forEach((sparkle, i) => {
        const baseY = this.y + [-40, -40, 0, 0][i];
        this.scene.tweens.add({
          targets: sparkle,
          y: baseY - 10,
          duration: APE.POP_UP_DURATION,
          ease: 'Back.easeOut',
        });
      });
    }
    
    eventBus.emit(Events.APE_SPAWN, { holeIndex: this.holeIndex, isGolden: this.isGolden });
  }

  scheduleHide() {
    const stayDuration = Phaser.Math.Between(APE.STAY_DURATION_MIN, APE.STAY_DURATION_MAX);
    
    this.hideTimer = this.scene.time.delayedCall(stayDuration, () => {
      if (!this.isWhacked) {
        this.hide(true); // escaped
      }
    });
  }

  hide(escaped = false) {
    if (this.isHiding) return;
    if (!this.sprite || !this.sprite.active) return;
    this.isHiding = true;
    
    if (this.hideTimer) {
      this.hideTimer.remove();
    }
    
    this.sprite.disableInteractive();
    
    this.scene.tweens.add({
      targets: this.sprite,
      scaleY: 0,
      y: this.y + 60,
      duration: APE.POP_DOWN_DURATION,
      ease: 'Quad.easeIn',
      onComplete: () => {
        if (escaped) {
          eventBus.emit(Events.APE_ESCAPED, { holeIndex: this.holeIndex });
        }
        eventBus.emit(Events.APE_HIDE, { holeIndex: this.holeIndex });
        this.destroy();
      },
    });
    
    // Hide sparkles
    if (this.sparkles) {
      this.sparkles.forEach(sparkle => {
        this.scene.tweens.add({
          targets: sparkle,
          alpha: 0,
          duration: APE.POP_DOWN_DURATION,
        });
      });
    }
  }

  onWhack() {
    if (this.isWhacked || this.isHiding) return;
    this.isWhacked = true;
    
    // Emit whacked event
    eventBus.emit(Events.APE_WHACKED, {
      holeIndex: this.holeIndex,
      isGolden: this.isGolden,
      x: this.x,
      y: this.y - 30,
    });
    
    // Visual feedback - squash and flash
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 0.2,
      scaleY: 0.1,
      duration: 80,
      yoyo: true,
      onComplete: () => {
        this.hide(false);
      },
    });
    
    // Flash/tint effect
    this.sprite.setTint(0xff6666);
    this.scene.time.delayedCall(80, () => {
      if (this.sprite && this.sprite.active) {
        this.sprite.clearTint();
      }
    });
    
    // Impact stars
    this.createImpactStars();
  }

  createImpactStars() {
    const starPositions = [
      { x: -30, y: -50, angle: -30 },
      { x: 30, y: -50, angle: 30 },
      { x: 0, y: -60, angle: 0 },
    ];
    
    starPositions.forEach(pos => {
      const star = this.scene.add.star(
        this.x + pos.x,
        this.y + pos.y,
        5, 5, 12,
        0xffff00
      );
      star.setDepth(20);
      star.setAngle(pos.angle);
      
      this.scene.tweens.add({
        targets: star,
        y: star.y - 30,
        alpha: 0,
        scaleX: 0.3,
        scaleY: 0.3,
        angle: pos.angle + 180,
        duration: 400,
        ease: 'Quad.easeOut',
        onComplete: () => star.destroy(),
      });
    });
  }

  destroy() {
    if (this.hideTimer) {
      this.hideTimer.remove();
      this.hideTimer = null;
    }
    if (this.sparkles) {
      this.sparkles.forEach(s => s.destroy());
      this.sparkles = null;
    }
    if (this.sprite) {
      this.sprite.destroy();
      this.sprite = null;
    }
  }
}
