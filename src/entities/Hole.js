// Whack an Ape - Hole Entity (Pixel Art Version)
import Phaser from 'phaser';
import { GRID } from '../core/Constants.js';
import { renderPixelArt } from '../core/PixelRenderer.js';
import { HOLE_SPRITE, MOUND_SPRITE, HOLE_RIM } from '../sprites/tiles.js';
import { ENVIRONMENT_PALETTE } from '../sprites/palette.js';

export class Hole {
  constructor(scene, index) {
    this.scene = scene;
    this.index = index;
    
    // Calculate position
    const col = index % GRID.COLS;
    const row = Math.floor(index / GRID.COLS);
    this.x = GRID.OFFSET_X + col * GRID.HOLE_SPACING_X;
    this.y = GRID.OFFSET_Y + row * GRID.HOLE_SPACING_Y;
    
    // Generate textures if not already done
    renderPixelArt(scene, MOUND_SPRITE, ENVIRONMENT_PALETTE, 'mound', 3);
    renderPixelArt(scene, HOLE_SPRITE, ENVIRONMENT_PALETTE, 'hole', 3);
    renderPixelArt(scene, HOLE_RIM, ENVIRONMENT_PALETTE, 'hole-rim', 3);
    
    this.createSprites();
  }

  createSprites() {
    // Grass mound behind hole (back layer)
    const mound = this.scene.add.sprite(this.x, this.y + 45, 'mound');
    mound.setDepth(0);
    
    // The dark hole
    const hole = this.scene.add.sprite(this.x, this.y + 40, 'hole');
    hole.setDepth(1);
    
    // Wooden rim on top
    const rim = this.scene.add.sprite(this.x, this.y + 18, 'hole-rim');
    rim.setDepth(15); // Above apes so it covers their bottom
    
    // Add some grass tufts around the hole for detail
    this.addGrassTufts();
  }

  addGrassTufts() {
    const positions = [
      { x: -60, y: 30 },
      { x: 60, y: 30 },
      { x: -45, y: 45 },
      { x: 45, y: 45 },
    ];
    
    positions.forEach(pos => {
      // Each tuft is a few triangles
      for (let i = -1; i <= 1; i++) {
        const blade = this.scene.add.triangle(
          this.x + pos.x + i * 6,
          this.y + pos.y,
          0, 0,
          4, -18,
          8, 0,
          0x228b22
        );
        blade.setDepth(16);
        
        // Gentle sway animation
        this.scene.tweens.add({
          targets: blade,
          angle: 5,
          duration: 1000 + Math.random() * 500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
          delay: Math.random() * 500,
        });
      }
    });
  }
}
