import Phaser from 'phaser';
import { PlayFunManager } from '../playfun/PlayFunManager.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Load ape sprite assets (use base path for GitHub Pages compatibility)
    const base = import.meta.env.BASE_URL || '/';
    this.load.image('ape-normal-img', `${base}assets/ape-normal.jpg`);
    this.load.image('ape-golden-img', `${base}assets/ape-golden.jpg`);
  }

  create() {
    // Initialize Play.fun SDK (non-blocking)
    PlayFunManager.init().then((success) => {
      if (success) {
        console.log('[Boot] Play.fun SDK ready');
      } else {
        console.log('[Boot] Play.fun SDK not configured - game will work without monetization');
      }
    }).catch((err) => {
      console.warn('[Boot] Play.fun SDK init failed:', err);
    });

    // Continue to menu
    this.scene.start('MenuScene');
  }
}
