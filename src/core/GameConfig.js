// Whack an Ape - Game Config (Responsive)
import Phaser from 'phaser';
import { GAME, COLORS } from './Constants.js';
import { BootScene } from '../scenes/BootScene.js';
import { MenuScene } from '../scenes/MenuScene.js';
import { GameScene } from '../scenes/GameScene.js';
import { UIScene } from '../scenes/UIScene.js';
import { GameOverScene } from '../scenes/GameOverScene.js';

export const GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: COLORS.SKY,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME.WIDTH,
    height: GAME.HEIGHT,
  },
  scene: [BootScene, MenuScene, GameScene, UIScene, GameOverScene],
  input: {
    activePointers: 3,
  },
};
