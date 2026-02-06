// Whack an Ape - Audio Bridge
// Connects EventBus events to audio playback

import { eventBus, Events } from '../core/EventBus.js';
import { audioManager } from './AudioManager.js';
import { menuTheme, gameplayBGM, gameOverTheme } from './music.js';
import { 
  whackSfx, 
  goldenWhackSfx, 
  missSfx, 
  escapeSfx,
  timerBeepSfx,
  gameOverSfx,
  clickSfx,
  startSfx,
  comboSfx,
} from './sfx.js';

export function initAudioBridge() {
  // Initialize audio on first user interaction
  eventBus.on(Events.AUDIO_INIT, () => {
    audioManager.init();
  });

  // BGM transitions
  eventBus.on(Events.MUSIC_MENU, () => {
    audioManager.playMusic(menuTheme);
  });

  eventBus.on(Events.MUSIC_GAMEPLAY, () => {
    audioManager.playMusic(gameplayBGM);
  });

  eventBus.on(Events.MUSIC_GAMEOVER, () => {
    audioManager.playMusic(gameOverTheme);
  });

  eventBus.on(Events.MUSIC_STOP, () => {
    audioManager.stopMusic();
  });

  // SFX events
  eventBus.on(Events.APE_WHACKED, ({ isGolden }) => {
    if (isGolden) {
      goldenWhackSfx();
    } else {
      whackSfx();
    }
  });

  eventBus.on(Events.APE_ESCAPED, () => {
    escapeSfx();
  });

  eventBus.on(Events.HAMMER_SWING, () => {
    // Light whoosh on every swing
    missSfx();
  });

  eventBus.on(Events.TIME_WARNING, () => {
    timerBeepSfx();
  });

  eventBus.on(Events.GAME_OVER, () => {
    gameOverSfx();
  });

  eventBus.on(Events.GAME_START, () => {
    startSfx();
  });

  eventBus.on(Events.COMBO_CHANGED, ({ combo }) => {
    if (combo === 5 || combo === 10 || combo === 15) {
      comboSfx();
    }
  });

  console.log('[Audio] Bridge initialized');
}
