import Phaser from 'phaser';
import { GameConfig } from './core/GameConfig.js';
import { eventBus, Events } from './core/EventBus.js';
import { gameState } from './core/GameState.js';
import { initAudioBridge } from './audio/AudioBridge.js';

// Initialize audio bridge (wires EventBus to audio)
initAudioBridge();

// Initialize audio on first click (browser autoplay policy)
const initAudioOnClick = () => {
  eventBus.emit(Events.AUDIO_INIT);
  document.removeEventListener('click', initAudioOnClick);
  document.removeEventListener('touchstart', initAudioOnClick);
};
document.addEventListener('click', initAudioOnClick);
document.addEventListener('touchstart', initAudioOnClick);

const game = new Phaser.Game(GameConfig);

// Expose for Playwright testing
window.__GAME__ = game;
window.__GAME_STATE__ = gameState;
window.__EVENT_BUS__ = eventBus;
window.__EVENTS__ = Events;
