// Whack an Ape - Hammer (Pixel Art Cursor)
import Phaser from 'phaser';
import { HAMMER } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { renderPixelArt } from '../core/PixelRenderer.js';
import { HAMMER_SPRITE, HAMMER_PALETTE } from '../sprites/tiles.js';

export class Hammer {
  constructor(scene) {
    this.scene = scene;
    this.isSwinging = false;
    
    // Generate hammer texture
    renderPixelArt(scene, HAMMER_SPRITE, HAMMER_PALETTE, 'hammer', 2);
    
    // Create hammer sprite
    this.sprite = scene.add.sprite(0, 0, 'hammer');
    this.sprite.setDepth(1000);
    this.sprite.setOrigin(0.5, 1); // Origin at bottom center for rotation
    
    // Follow pointer
    scene.input.on('pointermove', (pointer) => {
      this.sprite.setPosition(pointer.x + 15, pointer.y + 40);
    });
    
    // Swing on click
    scene.input.on('pointerdown', (pointer) => {
      this.swing(pointer.x, pointer.y);
    });
    
    // Hide default cursor
    scene.input.setDefaultCursor('none');
    
    // Listen for whacks to add impact effect
    this.onWhack = ({ x, y, isGolden }) => {
      this.impactEffect(x, y, isGolden);
    };
    eventBus.on(Events.APE_WHACKED, this.onWhack);
    
    // Cleanup on scene shutdown
    scene.events.on('shutdown', () => {
      eventBus.off(Events.APE_WHACKED, this.onWhack);
    });
  }

  swing(x, y) {
    if (this.isSwinging) return;
    this.isSwinging = true;
    
    eventBus.emit(Events.HAMMER_SWING, { x, y });
    
    // Quick swing animation
    this.scene.tweens.add({
      targets: this.sprite,
      angle: -HAMMER.SWING_ANGLE,
      duration: HAMMER.SWING_DURATION / 2,
      ease: 'Quad.easeOut',
      yoyo: true,
      onComplete: () => {
        this.isSwinging = false;
        this.sprite.setAngle(0);
      },
    });
  }

  impactEffect(x, y, isGolden) {
    // Create impact burst
    const color = isGolden ? 0xffd700 : 0xffff00;
    const count = isGolden ? 8 : 5;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const distance = isGolden ? 40 : 25;
      
      const particle = this.scene.add.circle(x, y, 6, color);
      particle.setDepth(999);
      
      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        scaleX: 0.3,
        scaleY: 0.3,
        duration: 300,
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
    
    // Screen flash for golden
    if (isGolden) {
      const flash = this.scene.add.rectangle(
        this.scene.cameras.main.centerX,
        this.scene.cameras.main.centerY,
        this.scene.cameras.main.width,
        this.scene.cameras.main.height,
        0xffd700,
        0.3
      );
      flash.setDepth(998);
      
      this.scene.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 200,
        onComplete: () => flash.destroy(),
      });
    }
  }

  destroy() {
    this.sprite.destroy();
    this.scene.input.setDefaultCursor('default');
  }
}
